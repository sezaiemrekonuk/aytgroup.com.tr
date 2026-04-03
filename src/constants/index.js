/**
 * AYT Group – Design System & Application Constants
 *
 * This file is the single source of truth for all design tokens,
 * navigation structure, static company data, and configuration maps.
 * Change values here to update the whole site.
 */

// ─── Brand ────────────────────────────────────────────────────────────────────
export const BRAND = {
  name: 'AYT Group',
  tagline: {
    tr: 'Geleceği İnşa Ediyoruz',
    en: 'Building the Future',
    de: 'Die Zukunft bauen',
  },
  domain: 'aytgroup.com.tr',
  email: 'info@aytgroup.com.tr',
  phone: '+90 312 000 00 00',
  whatsapp: '+905000000000',
  address: {
    tr: 'Çankaya, Ankara, Türkiye',
    en: 'Çankaya, Ankara, Turkey',
    de: 'Çankaya, Ankara, Türkei',
  },
  addressFull: {
    tr: 'Kızılırmak Mah. Atatürk Bul. No:1, Çankaya / Ankara',
    en: 'Kızılırmak District, Atatürk Ave. No:1, Çankaya / Ankara',
    de: 'Kızılırmak Viertel, Atatürk Allee Nr.1, Çankaya / Ankara',
  },
  workingHours: {
    tr: 'Pazartesi – Cumartesi: 08:00 – 18:00',
    en: 'Monday – Saturday: 08:00 – 18:00',
    de: 'Montag – Samstag: 08:00 – 18:00',
  },
  // Google Maps embed URL — replace with your actual embed link
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d195754.22996019854!2d32.53537!3d39.91987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d347d520732db5%3A0xabbc3da3e2f8611d!2sAnkara!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str',
};

// ─── Social Media ─────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = [
  { platform: 'linkedin', url: 'https://linkedin.com/company/aytgroup', icon: 'linkedin' },
  { platform: 'instagram', url: 'https://instagram.com/aytgroup', icon: 'instagram' },
  { platform: 'twitter', url: 'https://twitter.com/aytgroup', icon: 'twitter' },
  { platform: 'facebook', url: 'https://facebook.com/aytgroup', icon: 'facebook' },
];

// ─── Navigation ───────────────────────────────────────────────────────────────
/**
 * Each nav item can have children (dropdown).
 * `key` is used for i18n: nav.<key>
 * `path` is the React Router path.
 */
export const NAV_ITEMS = [
  { key: 'home', path: '/' },
  {
    key: 'corporate',
    path: '/kurumsal',
    children: [
      { key: 'about', path: '/kurumsal/hakkimizda' },
      { key: 'mission', path: '/kurumsal/misyon-vizyon' },
      { key: 'certifications', path: '/kurumsal/belgelerimiz' },
    ],
  },
  {
    key: 'projects',
    path: '/projelerimiz',
    children: [
      { key: 'completed', path: '/projelerimiz?status=completed' },
      { key: 'ongoing', path: '/projelerimiz?status=ongoing' },
    ],
  },
  { key: 'services', path: '/hizmetler' },
  { key: 'contact', path: '/iletisim' },
];

// ─── Project Categories ───────────────────────────────────────────────────────
export const PROJECT_CATEGORIES = [
  { key: 'all', color: 'primary' },
  { key: 'residential', color: 'accent' },
  { key: 'commercial', color: 'primary' },
  { key: 'industrial', color: 'cta' },
];

// ─── Project Status Map ───────────────────────────────────────────────────────
export const PROJECT_STATUS = {
  completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  ongoing: { color: 'bg-cta/10 text-cta dark:bg-cta/20 dark:text-cta-light' },
};

// ─── Progress Stages (for ongoing projects) ───────────────────────────────────
export const PROGRESS_STAGES = ['foundation', 'structure', 'finishing'];

// ─── Company Stats ────────────────────────────────────────────────────────────
export const COMPANY_STATS = [
  { key: 'projects', value: 120, suffix: '+', icon: 'building' },
  { key: 'years', value: 25, suffix: '+', icon: 'calendar' },
  { key: 'sqm', value: 500, suffix: 'K+', icon: 'ruler' },
  { key: 'clients', value: 350, suffix: '+', icon: 'users' },
];

// ─── Services ─────────────────────────────────────────────────────────────────
/**
 * Static service definitions. Extend `icon` with any Heroicon or custom SVG name.
 * The `key` maps to services.<key> in translations.
 */
export const SERVICES = [
  {
    key: 'contracting',
    icon: 'HardHat',
    color: 'accent',
    featured: true,
  },
  {
    key: 'urbanTransformation',
    icon: 'City',
    color: 'primary',
    featured: true,
  },
  {
    key: 'residential',
    icon: 'Home',
    color: 'cta',
    featured: true,
  },
  {
    key: 'commercial',
    icon: 'Office',
    color: 'accent',
    featured: false,
  },
  {
    key: 'industrial',
    icon: 'Factory',
    color: 'primary',
    featured: false,
  },
  {
    key: 'renovation',
    icon: 'Wrench',
    color: 'cta',
    featured: false,
  },
];

// ─── Certifications ───────────────────────────────────────────────────────────
export const CERTIFICATIONS = [
  { key: 'iso9001', year: 2018, issuer: 'TÜV Rheinland' },
  { key: 'iso14001', year: 2019, issuer: 'TÜV Rheinland' },
  { key: 'ohsas18001', year: 2020, issuer: 'Bureau Veritas' },
  { key: 'tse', year: 2015, issuer: 'TSE' },
];

// ─── Sample / Seed Projects ───────────────────────────────────────────────────
/**
 * These are seed projects for initial Firebase population or for fallback
 * when Firestore is unavailable. In production the data comes from Firestore.
 *
 * Images use placeholder URLs — replace with real WebP images in Firebase Storage.
 */
export const SEED_PROJECTS = [
  {
    id: 'ankara-kizilirmak-konut',
    slug: 'ankara-kizilirmak-konut',
    title: {
      tr: 'Ankara Kızılırmak Konut Projesi',
      en: 'Ankara Kızılırmak Residential Project',
      de: 'Ankara Kızılırmak Wohnprojekt',
    },
    description: {
      tr: 'Çankaya ilçesinde 180 daireden oluşan modern yaşam kompleksi. A+ enerji sınıfı, akıllı ev sistemleri ve sosyal alanlar ile tamamlanmıştır.',
      en: 'A modern living complex of 180 units in the Çankaya district. Completed with A+ energy class, smart home systems, and social spaces.',
      de: 'Ein modernes Wohnkomplex mit 180 Einheiten im Stadtteil Çankaya. Fertiggestellt mit A+ Energieklasse, Smart-Home-Systemen und Gemeinschaftsbereichen.',
    },
    location: {
      tr: 'Çankaya, Ankara',
      en: 'Çankaya, Ankara',
      de: 'Çankaya, Ankara',
    },
    category: 'residential',
    status: 'completed',
    sqm: 32000,
    units: 180,
    completionDate: '2023-06',
    startDate: '2020-03',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
      'https://images.unsplash.com/photo-1481026469463-66327c86e544?w=1200&q=80',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    ],
    progress: { foundation: 100, structure: 100, finishing: 100 },
    featured: true,
    order: 1,
  },
  {
    id: 'ankara-sogutozu-plaza',
    slug: 'ankara-sogutozu-plaza',
    title: {
      tr: 'Söğütözü İş ve Ticaret Merkezi',
      en: 'Söğütözü Business & Trade Center',
      de: 'Söğütözü Geschäfts- und Handelszentrum',
    },
    description: {
      tr: 'Söğütözü finans bölgesinde 40.000 m² kapalı alana sahip ofis ve ticaret merkezi. LEED Gold sertifikalı yeşil bina.',
      en: '40,000 m² office and trade center in the Söğütözü financial district. LEED Gold certified green building.',
      de: '40.000 m² großes Büro- und Handelszentrum im Finanzdistrikt Söğütözü. LEED-Gold-zertifiziertes Grüngebäude.',
    },
    location: {
      tr: 'Söğütözü, Ankara',
      en: 'Söğütözü, Ankara',
      de: 'Söğütözü, Ankara',
    },
    category: 'commercial',
    status: 'completed',
    sqm: 40000,
    completionDate: '2022-11',
    startDate: '2019-06',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    ],
    progress: { foundation: 100, structure: 100, finishing: 100 },
    featured: true,
    order: 2,
  },
  {
    id: 'sincan-lojistik-merkezi',
    slug: 'sincan-lojistik-merkezi',
    title: {
      tr: 'Sincan Organize Sanayi Lojistik Merkezi',
      en: 'Sincan Organized Industrial Logistics Center',
      de: 'Sincan Organisiertes Industrie-Logistikzentrum',
    },
    description: {
      tr: 'Sincan OSB\'de inşaat halinde olan 75.000 m² kapalı alanlı entegre lojistik ve depolama merkezi. 2025 yılında teslim planlanmaktadır.',
      en: '75,000 m² integrated logistics and storage center under construction in Sincan OSB. Scheduled for delivery in 2025.',
      de: '75.000 m² integriertes Logistik- und Lagerzentrum im Bau in Sincan OSB. Lieferung geplant für 2025.',
    },
    location: {
      tr: 'Sincan OSB, Ankara',
      en: 'Sincan OSB, Ankara',
      de: 'Sincan OSB, Ankara',
    },
    category: 'industrial',
    status: 'ongoing',
    sqm: 75000,
    completionDate: '2025-09',
    startDate: '2023-01',
    heroImage: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    ],
    progress: { foundation: 100, structure: 75, finishing: 20 },
    featured: true,
    order: 3,
  },
  {
    id: 'etimesgut-koru-evleri',
    slug: 'etimesgut-koru-evleri',
    title: {
      tr: 'Etimesgut Koru Evleri',
      en: 'Etimesgut Forest Residences',
      de: 'Etimesgut Waldhäuser',
    },
    description: {
      tr: 'Doğayla iç içe, 95 villadan oluşan lüks konut projesi. Orman manzaralı bağımsız bahçeli villalar ile doğanın kalbinde yaşam.',
      en: 'Luxury residential project of 95 villas surrounded by nature. Independent garden villas with forest views.',
      de: 'Luxuriöses Wohnprojekt mit 95 Villen inmitten der Natur. Unabhängige Gartenvillen mit Waldblick.',
    },
    location: {
      tr: 'Etimesgut, Ankara',
      en: 'Etimesgut, Ankara',
      de: 'Etimesgut, Ankara',
    },
    category: 'residential',
    status: 'ongoing',
    sqm: 28000,
    units: 95,
    completionDate: '2026-03',
    startDate: '2024-01',
    heroImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
    ],
    progress: { foundation: 100, structure: 40, finishing: 0 },
    featured: false,
    order: 4,
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: 1,
    nameKey: 'testimonial1Name',
    roleKey: 'testimonial1Role',
    contentKey: 'testimonial1',
    rating: 5,
    avatar: null,
  },
  {
    id: 2,
    nameKey: 'testimonial2Name',
    roleKey: 'testimonial2Role',
    contentKey: 'testimonial2',
    rating: 5,
    avatar: null,
  },
  {
    id: 3,
    nameKey: 'testimonial3Name',
    roleKey: 'testimonial3Role',
    contentKey: 'testimonial3',
    rating: 5,
    avatar: null,
  },
];

// ─── Language Configuration ───────────────────────────────────────────────────
export const LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', shortLabel: 'TR' },
  { code: 'en', label: 'English', flag: '🇬🇧', shortLabel: 'EN' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', shortLabel: 'DE' },
];

export const DEFAULT_LANGUAGE = 'tr';

// ─── SEO Defaults ─────────────────────────────────────────────────────────────
export const SEO_DEFAULTS = {
  siteName: 'AYT Group',
  separator: ' | ',
  twitterHandle: '@aytgroup',
  ogImageUrl: '/og-image.jpg', // place a 1200x630 image in /public
};

// ─── Theme ────────────────────────────────────────────────────────────────────
export const THEME_STORAGE_KEY = 'aytgroup-theme';
export const LANG_STORAGE_KEY = 'aytgroup-lang';

// ─── Firestore Collection Names ───────────────────────────────────────────────
export const COLLECTIONS = {
  PROJECTS: 'projects',
  SERVICES: 'services',
  CONTACTS: 'contacts',
  SETTINGS: 'settings',
  REVIEWS:  'reviews',
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PROJECTS_PER_PAGE = 9;

// ─── Contact Form ─────────────────────────────────────────────────────────────
export const CONTACT_SUBJECTS = ['general', 'quote', 'project', 'career', 'other'];
