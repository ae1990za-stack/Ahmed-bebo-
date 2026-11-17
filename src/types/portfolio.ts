export type Language = 'ar' | 'en';
export type ThemeMode = 'light' | 'dark';

export type ProjectCategory =
  | 'graphic'
  | 'logo'
  | 'ecommerce'
  | 'website'
  | 'cv'
  | 'app_ui';

export interface SkillItem {
  nameAr: string;
  nameEn: string;
  level: number; // 1-100
  group: 'design' | 'dev' | 'tools';
}

export interface ExperienceItem {
  roleAr: string;
  roleEn: string;
  companyAr: string;
  companyEn: string;
  periodAr: string;
  periodEn: string;
  summaryAr: string;
  summaryEn: string;
}

export interface SocialLinks {
  behance?: string;
  dribbble?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  x?: string;
}

export interface ThemeSettings {
  presetId: 'sky_white' | 'ice_azure' | 'cerulean_studio' | 'cobalt_mist' | 'custom';
  accentHex: string;
  accentSoftHex: string;
  surfaceTintHex: string;
  radiusStyle: 'sharp' | 'balanced' | 'soft';
  defaultMode: ThemeMode;
}

export interface SiteConfig {
  nameAr: string;
  nameEn: string;
  titlesAr: string[];
  titlesEn: string[];
  taglineAr: string;
  taglineEn: string;
  bioAr: string;
  bioEn: string;
  portraitUrl: string;
  aboutTitleAr: string;
  aboutTitleEn: string;
  aboutDescAr: string;
  aboutDescEn: string;
  yearsExperience: number;
  projectsCompleted: number;
  clientsServed: number;
  skills: SkillItem[];
  experiences: ExperienceItem[];
  phone: string;
  whatsapp: string;
  email: string;
  locationAr: string;
  locationEn: string;
  socials: SocialLinks;
  theme: ThemeSettings;
  updatedAt?: unknown;
  updatedBy?: string;
}

export interface PortfolioProject {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: ProjectCategory;
  client: string;
  year: string;
  mediaType: 'image' | 'video';
  coverUrl: string;
  videoUrl?: string;
  galleryUrls: string[];
  tools: string[];
  liveUrl?: string;
  featured: boolean;
  published: boolean;
  order: number;
  ownerUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ServiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  deliverablesAr: string[];
  deliverablesEn: string[];
  iconName: string;
  priceRange: string;
  deliveryTimeAr: string;
  deliveryTimeEn: string;
  published: boolean;
  order: number;
  ownerUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  serviceType: string;
  budget: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  recipientEmail: string;
  createdAt?: unknown;
}

export interface CategoryMeta {
  id: ProjectCategory;
  labelAr: string;
  labelEn: string;
}

export const PROJECT_CATEGORIES: CategoryMeta[] = [
  { id: 'logo', labelAr: 'تصميم الشعارات', labelEn: 'Logo & Identity' },
  { id: 'graphic', labelAr: 'تصميم الجرافيك', labelEn: 'Graphic Design' },
  { id: 'ecommerce', labelAr: 'المتاجر الإلكترونية', labelEn: 'E-Commerce' },
  { id: 'website', labelAr: 'المواقع الإلكترونية', labelEn: 'Websites' },
  { id: 'cv', labelAr: 'السير الذاتية', labelEn: 'CV Design' },
  { id: 'app_ui', labelAr: 'واجهات التطبيقات', labelEn: 'App UI/UX' },
];
