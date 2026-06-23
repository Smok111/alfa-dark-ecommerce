import { create } from 'zustand';

export type LanguageCode = 'es' | 'en' | 'qu';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'Inglés', flag: '🇬🇧' },
  { code: 'qu', name: 'Quechua', flag: '🇵🇪' }
];

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  es: {
    // Navbar
    'nav.home': 'Inicio',
    'nav.vault': 'La Bóveda',
    'nav.vip_advisory': 'Asesoría VIP',
    'nav.vip_access': 'Acceso VIP',
    'nav.admin_panel': 'Panel de Administración',
    'nav.logout': 'Cerrar sesión',
    
    // Hero
    'hero.forged_in_darkness': 'Forjado en la Oscuridad',
    'hero.dominate': 'Domina tu',
    'hero.presence': 'Presencia',
    'hero.desc': 'Cada pieza es única, diseñada para quienes buscan lo extraordinario. Joyería de alta gama para hombres que no piden permiso.',
    'hero.view_collection': 'Ver Colección',
    
    // Products Section
    'home.exclusive_pieces': 'Piezas Exclusivas',
    'home.whatsapp_sales': 'Venta Directa por WhatsApp',
    'home.loading': 'Cargando colección...',
    'home.empty_title': 'La Bóveda está esperando',
    'home.empty_desc': 'Aún no se han añadido piezas maestras a esta colección.',
    'home.explore_all': 'Explorar todas las piezas',
    
    // Catalog Page
    'catalog.exclusive_collection': 'Colección exclusiva',
    'catalog.our_jewelry': 'Nuestras Joyas',
    'catalog.desc': 'Cada pieza es única, diseñada para quienes buscan lo extraordinario.',
    'catalog.all': 'Todos',
    'catalog.loading': 'Cargando colección...',
    'catalog.prep_title': 'Colección en Preparación',
    'catalog.prep_desc': 'Pronto revelaremos nuestras piezas exclusivas. Estamos preparando algo extraordinario para ti.',
    'catalog.buy': 'Comprar',
    
    // Footer
    'footer.desc': 'Exclusividad, elegancia y oscuridad. Joyería fina diseñada para deslumbrar y perdurar en el tiempo.',
    'footer.links': 'Enlaces',
    'footer.catalog': 'Catálogo',
    'footer.my_account': 'Mi Cuenta',
    'footer.exclusive_sales': 'Ventas Exclusivas',
    'footer.advisory_desc': 'Atención personalizada vía WhatsApp para clientes VIP.',
    'footer.rights': '© 2026 ALFA DARK JOYERÍA. TODOS LOS DERECHOS RESERVADOS.',
    
    // Accessibility Widget
    'acc.title': 'Menú de accesibilidad',
    'acc.language': 'Idioma',
    'acc.profile': 'Perfil',
    'acc.profile_active': 'activo',
    'acc.none': 'Ninguno',
    'acc.text_size': 'Tamaño de texto',
    'acc.contrast': 'Contrastes',
    'acc.cursor': 'Cursor',
    'acc.reading_mask': 'Máscara de lectura',
    'acc.dyslexia': 'Dislexia amigable',
    'acc.line_height': 'Interlineado',
    'acc.reset': 'Restablecer'
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.vault': 'The Vault',
    'nav.vip_advisory': 'VIP Advisory',
    'nav.vip_access': 'VIP Access',
    'nav.admin_panel': 'Admin Panel',
    'nav.logout': 'Logout',
    
    // Hero
    'hero.forged_in_darkness': 'Forged in Darkness',
    'hero.dominate': 'Dominate Your',
    'hero.presence': 'Presence',
    'hero.desc': 'Each piece is unique, designed for those who seek the extraordinary. High-end jewelry for men who do not ask for permission.',
    'hero.view_collection': 'View Collection',
    
    // Products Section
    'home.exclusive_pieces': 'Exclusive Pieces',
    'home.whatsapp_sales': 'Direct Sale via WhatsApp',
    'home.loading': 'Loading collection...',
    'home.empty_title': 'The Vault is waiting',
    'home.empty_desc': 'No master pieces have been added to this collection yet.',
    'home.explore_all': 'Explore all pieces',
    
    // Catalog Page
    'catalog.exclusive_collection': 'Exclusive Collection',
    'catalog.our_jewelry': 'Our Jewelry',
    'catalog.desc': 'Each piece is unique, designed for those who seek the extraordinary.',
    'catalog.all': 'All',
    'catalog.loading': 'Loading collection...',
    'catalog.prep_title': 'Collection in Preparation',
    'catalog.prep_desc': 'Soon we will reveal our exclusive pieces. We are preparing something extraordinary for you.',
    'catalog.buy': 'Buy Now',
    
    // Footer
    'footer.desc': 'Exclusivity, elegance and darkness. Fine jewelry designed to dazzle and endure in time.',
    'footer.links': 'Links',
    'footer.catalog': 'Catalog',
    'footer.my_account': 'My Account',
    'footer.exclusive_sales': 'Exclusive Sales',
    'footer.advisory_desc': 'Personalized attention via WhatsApp for VIP clients.',
    'footer.rights': '© 2026 ALFA DARK JEWELRY. ALL RIGHTS RESERVED.',
    
    // Accessibility Widget
    'acc.title': 'Accessibility Menu',
    'acc.language': 'Language',
    'acc.profile': 'Profile',
    'acc.profile_active': 'active',
    'acc.none': 'None',
    'acc.text_size': 'Text size',
    'acc.contrast': 'Contrasts',
    'acc.cursor': 'Cursor',
    'acc.reading_mask': 'Reading mask',
    'acc.dyslexia': 'Dyslexia friendly',
    'acc.line_height': 'Line spacing',
    'acc.reset': 'Reset'
  },
  qu: {
    // Navbar
    'nav.home': 'Qallariy',
    'nav.vault': 'Waqaychana',
    'nav.vip_advisory': 'VIP Rimay',
    'nav.vip_access': 'VIP Yaykuna',
    'nav.admin_panel': 'Kamachiy Patapata',
    'nav.logout': 'Lluqsiy',
    
    // Hero
    'hero.forged_in_darkness': 'Laqhaypi Rurasqa',
    'hero.dominate': 'Kayniykiwan',
    'hero.presence': 'Kamachiy',
    'hero.desc': 'Sapa t’aqa huklla, mana p’itana maskaqkunapaq rurasqa. Sumaq qori-qolqi rurasqa qharikunapaq.',
    'hero.view_collection': 'T’aqakunata Rikuy',
    
    // Products Section
    'home.exclusive_pieces': 'Sapaqchana T’aqakuna',
    'home.whatsapp_sales': 'WhatsApp-wan Chiqa Rantiy',
    'home.loading': 'T’aqa chayamuchkan...',
    'home.empty_title': 'Qollqa suyachkan',
    'home.empty_desc': 'Manaraq kay t’aqaman sumaq p’itakuna churakunchu.',
    'home.explore_all': 'Lliw p’itakunata maskay',
    
    // Catalog Page
    'catalog.exclusive_collection': 'Sapaq T’aqa',
    'catalog.our_jewelry': 'Qori-Qolqinchikkuna',
    'catalog.desc': 'Sapa t’aqa huklla, mana p’itana maskaqkunapaq rurasqa.',
    'catalog.all': 'Lliw',
    'catalog.loading': 'T’aqa chayamuchkan...',
    'catalog.prep_title': 'T’aqa Ruraypi kachkan',
    'catalog.prep_desc': 'Pisi tiempomanta sapaq p’itanchikkunata rikuchisqayku. Qampaq sumaq rurayta rurachkayku.',
    'catalog.buy': 'Rantiy',
    
    // Footer
    'footer.desc': 'Sapaq kay, sumaq kay, laqha kay. Qori-qolqi k’ancharichiyta churanapaq wiñaypaq.',
    'footer.links': 'T’inkikuna',
    'footer.catalog': 'T’aqakuna',
    'footer.my_account': 'Yupayniy',
    'footer.exclusive_sales': 'Sapaq Rantiykuna',
    'footer.advisory_desc': 'Tusuy rimay WhatsApp-wan VIP maskaqkunapaq.',
    'footer.rights': '© 2026 ALFA DARK QORI-QOLQI. LLIW DERECHOKUNA WAQAYCHASQA.',
    
    // Accessibility Widget
    'acc.title': 'Yaykuna Kamachiy',
    'acc.language': 'Simi',
    'acc.profile': 'Kikin',
    'acc.profile_active': 'llamk’achkan',
    'acc.none': 'Mana kanchu',
    'acc.text_size': 'Sanampa Hatun Kay',
    'acc.contrast': 'Llimpi Rikuchiy',
    'acc.cursor': 'Cursor',
    'acc.reading_mask': 'Ñawinchana Hawa',
    'acc.dyslexia': 'Dislexia Yanapay',
    'acc.line_height': 'Sanampaq Karu Kay',
    'acc.reset': 'Allinchay'
  }
};

const initialLang = (localStorage.getItem('alfa_dark_lang') as LanguageCode) || 'es';

interface LanguageState {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: initialLang,
  setLanguage: (lang: LanguageCode) => {
    localStorage.setItem('alfa_dark_lang', lang);
    set({ 
      language: lang,
      t: (key: string) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['es']?.[key] || key
    });
  },
  t: (key: string) => TRANSLATIONS[initialLang]?.[key] || TRANSLATIONS['es']?.[key] || key
}));
