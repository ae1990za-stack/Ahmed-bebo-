import { DEFAULT_PROJECTS, DEFAULT_SERVICES, DEFAULT_SITE_CONFIG } from '../data/defaultSeed';
import {
  ContactMessage,
  PortfolioProject,
  ServiceItem,
  SiteConfig,
} from '../types/portfolio';
import { kvGet, kvSet, mediaGetAll, mediaPut, StoredMediaRecord, subscribeDbChanges } from './localDb';

const KEY_LIVE_CONFIG = 'liveConfig';
const KEY_DRAFT_CONFIG = 'draftConfig';
const KEY_PROJECTS = 'projects';
const KEY_SERVICES = 'services';
const KEY_MESSAGES = 'messages';
const KEY_ADMIN_CREDS = 'adminCreds';
const SESSION_ADMIN_KEY = 'ae_admin_session_active';

interface LocalAdminCredentials {
  username: string;
  passwordHash: string;
  updatedAt: number;
}

function makeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

async function sha256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoded = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Deterministic fallback if crypto.subtle unavailable
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fallback_${(h >>> 0).toString(16)}`;
}

let seeded = false;
async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  seeded = true;

  const existingLive = await kvGet<SiteConfig>(KEY_LIVE_CONFIG);
  if (!existingLive) {
    await kvSet(KEY_LIVE_CONFIG, { ...DEFAULT_SITE_CONFIG, updatedAt: Date.now() });
  }

  const existingDraft = await kvGet<SiteConfig>(KEY_DRAFT_CONFIG);
  if (!existingDraft) {
    await kvSet(KEY_DRAFT_CONFIG, existingLive || { ...DEFAULT_SITE_CONFIG, updatedAt: Date.now() });
  }

  const existingProjects = await kvGet<PortfolioProject[]>(KEY_PROJECTS);
  if (!existingProjects || existingProjects.length === 0) {
    await kvSet(
      KEY_PROJECTS,
      DEFAULT_PROJECTS.map((p) => ({
        ...p,
        ownerUid: 'local-owner',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }))
    );
  }

  const existingServices = await kvGet<ServiceItem[]>(KEY_SERVICES);
  if (!existingServices || existingServices.length === 0) {
    await kvSet(
      KEY_SERVICES,
      DEFAULT_SERVICES.map((s) => ({
        ...s,
        ownerUid: 'local-owner',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }))
    );
  }

  const existingMessages = await kvGet<ContactMessage[]>(KEY_MESSAGES);
  if (!existingMessages) {
    await kvSet(KEY_MESSAGES, []);
  }

  const existingCreds = await kvGet<LocalAdminCredentials>(KEY_ADMIN_CREDS);
  if (!existingCreds) {
    await kvSet<LocalAdminCredentials>(KEY_ADMIN_CREDS, {
      username: 'ahmed',
      passwordHash: await sha256('ahmed2026'),
      updatedAt: Date.now(),
    });
  }
}

export function isAdminSessionActive(): boolean {
  return localStorage.getItem(SESSION_ADMIN_KEY) === 'true';
}

export async function getAdminUsername(): Promise<string> {
  await ensureSeeded();
  const creds = await kvGet<LocalAdminCredentials>(KEY_ADMIN_CREDS);
  return creds?.username || 'ahmed';
}

export async function verifyAdminLogin(username: string, password: string): Promise<boolean> {
  await ensureSeeded();
  const creds = await kvGet<LocalAdminCredentials>(KEY_ADMIN_CREDS);
  if (!creds) return false;

  const cleanUser = username.trim().toLowerCase();
  const targetUser = creds.username.trim().toLowerCase();
  const inputHash = await sha256(password);

  if (cleanUser === targetUser && inputHash === creds.passwordHash) {
    localStorage.setItem(SESSION_ADMIN_KEY, 'true');
    return true;
  }
  return false;
}

export async function updateAdminCredentials(
  currentPassword: string,
  newUsername: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  await ensureSeeded();
  const creds = await kvGet<LocalAdminCredentials>(KEY_ADMIN_CREDS);
  if (!creds) return { ok: false, error: 'Credentials store not initialized' };

  const currentHash = await sha256(currentPassword);
  if (currentHash !== creds.passwordHash) {
    return { ok: false, error: 'INVALID_CURRENT_PASSWORD' };
  }

  const cleanUsername = newUsername.trim();
  if (cleanUsername.length < 3 || newPassword.length < 6) {
    return { ok: false, error: 'INVALID_NEW_CREDENTIALS' };
  }

  await kvSet<LocalAdminCredentials>(KEY_ADMIN_CREDS, {
    username: cleanUsername,
    passwordHash: await sha256(newPassword),
    updatedAt: Date.now(),
  });
  return { ok: true };
}

export function logoutAdminSession(): void {
  localStorage.removeItem(SESSION_ADMIN_KEY);
}

export async function saveSiteConfig(
  target: 'draft' | 'live',
  config: SiteConfig
): Promise<void> {
  await ensureSeeded();
  const key = target === 'live' ? KEY_LIVE_CONFIG : KEY_DRAFT_CONFIG;
  await kvSet(key, {
    ...config,
    updatedAt: Date.now(),
    updatedBy: 'local-owner',
  });
}

export async function publishDraftToLive(draftConfig: SiteConfig): Promise<void> {
  await ensureSeeded();
  const payload: SiteConfig = {
    ...draftConfig,
    updatedAt: Date.now(),
    updatedBy: 'local-owner',
  };
  await kvSet(KEY_DRAFT_CONFIG, payload);
  await kvSet(KEY_LIVE_CONFIG, payload);
}

export async function discardDraftToLive(): Promise<SiteConfig> {
  await ensureSeeded();
  const live = (await kvGet<SiteConfig>(KEY_LIVE_CONFIG)) || DEFAULT_SITE_CONFIG;
  await kvSet(KEY_DRAFT_CONFIG, { ...live, updatedAt: Date.now() });
  return live;
}

export async function saveProject(
  project: Omit<PortfolioProject, 'id' | 'ownerUid' | 'createdAt' | 'updatedAt'>,
  existingId?: string
): Promise<string> {
  await ensureSeeded();
  const list = (await kvGet<PortfolioProject[]>(KEY_PROJECTS)) || [];
  const id = existingId || makeId('proj');
  const now = Date.now();

  if (existingId) {
    const next = list.map((item) =>
      item.id === existingId ? { ...item, ...project, id: existingId, updatedAt: now } : item
    );
    await kvSet(KEY_PROJECTS, next);
  } else {
    const newItem: PortfolioProject = {
      ...project,
      id,
      ownerUid: 'local-owner',
      createdAt: now,
      updatedAt: now,
    };
    await kvSet(KEY_PROJECTS, [...list, newItem]);
  }
  return id;
}

export async function deleteProject(projectId: string): Promise<void> {
  await ensureSeeded();
  const list = (await kvGet<PortfolioProject[]>(KEY_PROJECTS)) || [];
  await kvSet(
    KEY_PROJECTS,
    list.filter((p) => p.id !== projectId)
  );
}

export async function saveService(
  service: Omit<ServiceItem, 'id' | 'ownerUid' | 'createdAt' | 'updatedAt'>,
  existingId?: string
): Promise<string> {
  await ensureSeeded();
  const list = (await kvGet<ServiceItem[]>(KEY_SERVICES)) || [];
  const id = existingId || makeId('srv');
  const now = Date.now();

  if (existingId) {
    const next = list.map((item) =>
      item.id === existingId ? { ...item, ...service, id: existingId, updatedAt: now } : item
    );
    await kvSet(KEY_SERVICES, next);
  } else {
    const newItem: ServiceItem = {
      ...service,
      id,
      ownerUid: 'local-owner',
      createdAt: now,
      updatedAt: now,
    };
    await kvSet(KEY_SERVICES, [...list, newItem]);
  }
  return id;
}

export async function deleteService(serviceId: string): Promise<void> {
  await ensureSeeded();
  const list = (await kvGet<ServiceItem[]>(KEY_SERVICES)) || [];
  await kvSet(
    KEY_SERVICES,
    list.filter((s) => s.id !== serviceId)
  );
}

export async function submitContactMessage(input: {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  serviceType: string;
  budget: string;
  message: string;
}): Promise<void> {
  await ensureSeeded();
  const list = (await kvGet<ContactMessage[]>(KEY_MESSAGES)) || [];
  const liveCfg = await kvGet<SiteConfig>(KEY_LIVE_CONFIG);
  const newMsg: ContactMessage = {
    id: makeId('msg'),
    senderName: input.senderName.trim().slice(0, 120),
    senderEmail: input.senderEmail.trim().slice(0, 160),
    senderPhone: input.senderPhone.trim().slice(0, 40),
    serviceType: input.serviceType.trim().slice(0, 120),
    budget: input.budget.trim().slice(0, 80),
    message: input.message.trim().slice(0, 4000),
    status: 'unread',
    recipientEmail: liveCfg?.email || DEFAULT_SITE_CONFIG.email,
    createdAt: Date.now(),
  };
  await kvSet(KEY_MESSAGES, [newMsg, ...list]);
}

export async function updateMessageStatus(
  messageId: string,
  status: 'unread' | 'read' | 'replied'
): Promise<void> {
  await ensureSeeded();
  const list = (await kvGet<ContactMessage[]>(KEY_MESSAGES)) || [];
  await kvSet(
    KEY_MESSAGES,
    list.map((m) => (m.id === messageId ? { ...m, status } : m))
  );
}

export async function deleteContactMessage(messageId: string): Promise<void> {
  await ensureSeeded();
  const list = (await kvGet<ContactMessage[]>(KEY_MESSAGES)) || [];
  await kvSet(
    KEY_MESSAGES,
    list.filter((m) => m.id !== messageId)
  );
}

export function subscribePublicPortfolio(
  onConfig: (config: SiteConfig) => void,
  onProjects: (projects: PortfolioProject[]) => void,
  onServices: (services: ServiceItem[]) => void
): () => void {
  let active = true;

  const loadAll = async () => {
    await ensureSeeded();
    if (!active) return;

    const cfg = (await kvGet<SiteConfig>(KEY_LIVE_CONFIG)) || DEFAULT_SITE_CONFIG;
    const projs = ((await kvGet<PortfolioProject[]>(KEY_PROJECTS)) || DEFAULT_PROJECTS)
      .filter((p) => p.published)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const srvs = ((await kvGet<ServiceItem[]>(KEY_SERVICES)) || DEFAULT_SERVICES)
      .filter((s) => s.published)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (!active) return;
    onConfig({ ...DEFAULT_SITE_CONFIG, ...cfg });
    onProjects(projs);
    onServices(srvs);
  };

  loadAll();

  const unsub = subscribeDbChanges((key) => {
    if (key === KEY_LIVE_CONFIG || key === KEY_PROJECTS || key === KEY_SERVICES) {
      loadAll();
    }
  });

  return () => {
    active = false;
    unsub();
  };
}

export function subscribeAdminWorkspace(
  onDraftConfig: (config: SiteConfig) => void,
  onAllProjects: (projects: PortfolioProject[]) => void,
  onAllServices: (services: ServiceItem[]) => void,
  onMessages: (messages: ContactMessage[]) => void
): () => void {
  let active = true;

  const loadWorkspace = async () => {
    await ensureSeeded();
    if (!active) return;

    const draft = (await kvGet<SiteConfig>(KEY_DRAFT_CONFIG)) || DEFAULT_SITE_CONFIG;
    const projs = ((await kvGet<PortfolioProject[]>(KEY_PROJECTS)) || []).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    const srvs = ((await kvGet<ServiceItem[]>(KEY_SERVICES)) || []).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    const msgs = ((await kvGet<ContactMessage[]>(KEY_MESSAGES)) || []).sort(
      (a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)
    );

    if (!active) return;
    onDraftConfig({ ...DEFAULT_SITE_CONFIG, ...draft });
    onAllProjects(projs);
    onAllServices(srvs);
    onMessages(msgs);
  };

  loadWorkspace();

  const unsub = subscribeDbChanges((key) => {
    if (
      key === KEY_DRAFT_CONFIG ||
      key === KEY_PROJECTS ||
      key === KEY_SERVICES ||
      key === KEY_MESSAGES
    ) {
      loadWorkspace();
    }
  });

  return () => {
    active = false;
    unsub();
  };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to serialize blob'));
    reader.readAsDataURL(blob);
  });
}

export async function exportLocalDatabase(): Promise<string> {
  await ensureSeeded();
  const liveConfig = await kvGet<SiteConfig>(KEY_LIVE_CONFIG);
  const draftConfig = await kvGet<SiteConfig>(KEY_DRAFT_CONFIG);
  const projects = await kvGet<PortfolioProject[]>(KEY_PROJECTS);
  const services = await kvGet<ServiceItem[]>(KEY_SERVICES);
  const messages = await kvGet<ContactMessage[]>(KEY_MESSAGES);
  const mediaList = await mediaGetAll();

  const serializedMedia = await Promise.all(
    mediaList.map(async (m) => ({
      id: m.id,
      kind: m.kind,
      mimeType: m.mimeType,
      fileName: m.fileName,
      createdAt: m.createdAt,
      dataUrl: await blobToDataUrl(m.blob),
    }))
  );

  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      liveConfig,
      draftConfig,
      projects,
      services,
      messages,
      media: serializedMedia,
    },
    null,
    2
  );
}

export async function importLocalDatabase(jsonText: string): Promise<void> {
  const parsed = JSON.parse(jsonText);
  if (parsed.media && Array.isArray(parsed.media)) {
    for (const item of parsed.media) {
      if (item.id && item.dataUrl) {
        const res = await fetch(item.dataUrl);
        const blob = await res.blob();
        const record: StoredMediaRecord = {
          id: item.id,
          kind: item.kind || 'image',
          mimeType: item.mimeType || blob.type,
          fileName: item.fileName || 'restored',
          blob,
          createdAt: item.createdAt || Date.now(),
        };
        await mediaPut(record);
      }
    }
  }
  if (parsed.liveConfig) await kvSet(KEY_LIVE_CONFIG, parsed.liveConfig);
  if (parsed.draftConfig) await kvSet(KEY_DRAFT_CONFIG, parsed.draftConfig);
  if (parsed.projects) await kvSet(KEY_PROJECTS, parsed.projects);
  if (parsed.services) await kvSet(KEY_SERVICES, parsed.services);
  if (parsed.messages) await kvSet(KEY_MESSAGES, parsed.messages);
}
