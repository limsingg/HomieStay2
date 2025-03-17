const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base64 image handling middleware
app.use((req, res, next) => {
  // This middleware exposes a function to convert base64 to URL for templates
  res.locals.getImageUrl = (base64OrUrl) => {
    // If it's already a URL (starts with http or /), return as is
    if (typeof base64OrUrl === 'string' && (base64OrUrl.startsWith('http') || base64OrUrl.startsWith('/'))) {
      return base64OrUrl;
    }

    // If it's base64 data, return a data URL
    if (typeof base64OrUrl === 'string' && base64OrUrl.includes('base64')) {
      return base64OrUrl; // Already in data URL format
    }

    // If it's base64 without prefix, add the prefix
    if (typeof base64OrUrl === 'string' && base64OrUrl.length > 100) {
      return `data:image/jpeg;base64,${base64OrUrl}`;
    }

    // Default placeholder
    return '/images/room-placeholder.jpg';
  };
  next();
});

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration - simplified for serverless
app.use(session({
  secret: process.env.SESSION_SECRET || 'homestay-booking-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Cookie parser middleware
app.use(cookieParser());

// Language middleware
app.use((req, res, next) => {
  // Get language preference from cookie or default to 'ms' (Malay)
  const lang = req.cookies?.siteLanguage || 'ms';

  // Add language to res.locals to make it available in templates
  res.locals.lang = lang;
  res.locals.translations = getTranslations(lang);

  // Translation settings for client-side
  res.locals.translationSettings = {
    enabled: true,
    currentLanguage: lang,
    supportedLanguages: ['ms', 'en', 'zh']
  };

  next();
});

// Helper function to get translations
function getTranslations(lang) {
  // In a real app, this would come from a database or JSON files
  const translations = {
    ms: {
      // General site elements
      siteName: 'Tempahan Homiestay',
      home: 'Laman Utama',
      about: 'Tentang Kami',
      contact: 'Hubungi Kami',
      hostLogin: 'Log Masuk Hos',
      search: 'Cari homiestay...',
      brandName: 'Homiestay',
      language: 'Bahasa',

      // New Kanowit HomieStay translations
      homeTitle: '🏡 Kanowit HomieStay – Penyewaan Mudah, Penginapan Selesa!',
      homeSubtitle: 'Mencari tempat di Kanowit? Kami menawarkan bilik yang selamat, bersih, dan berpatutan untuk penginapan jangka panjang dan pendek!',
      location: '📍 Lokasi',
      allLocations: 'Semua Lokasi',
      cityCenter: 'Pusat Bandar Kanowit',
      nearBalaiPolis: 'Berhampiran Balai Polis',
      nearHospital: 'Berhampiran Hospital',
      nearSMKKanowit: 'Berhampiran SMK Kanowit',
      roomType: '🛏 Jenis Bilik',
      allTypes: 'Semua Jenis',
      singleRoom: 'Bilik',
      wholeHouse: 'Rumah Penuh',
      doubleRoom: 'Bilik Berkembar',
      familyRoom: 'Bilik Keluarga',
      monthlyRent: '💰 Sewa Bulanan',
      below300: 'Bawah RM300',
      between300And500: 'RM300-RM500',
      above500: 'Melebihi RM500',
      amenities: '✅ Kemudahan',
      allAmenities: 'Semua Kemudahan',
      wifi: 'WiFi',
      ac: 'Penghawa Dingin',
      utilities: 'Termasuk Utiliti',
      fan: 'Kipas',
      filter: 'Tapis',
      allAvailableRooms: 'Semua Bilik Tersedia',
      roomSelectionDesc: 'Kami menawarkan pelbagai jenis penginapan berkualiti',
      premium: 'Premium',
      popular: 'Popular',
      perMonth: '/ bulan',
      perDay: '/ hari',
      basicFacilities: 'Kemudahan Asas',
      comfortableStay: 'Penginapan selesa dan selamat',
      noRoomsAvailable: 'Tiada bilik tersedia',
      checkBackLater: 'Kami sedang menambah senarai baru. Sila semak kemudian.',
      addYourProperty: 'Tambah Hartanah Anda',
      noFilterResults: 'Tiada bilik yang memenuhi kriteria tapisan anda',
      viewDetails: 'Lihat Butiran',
      roomNotFound: 'Bilik tidak dijumpai',
      errorLoadingRoom: 'Ralat memuatkan bilik'
    },
    en: {
      // General site elements
      siteName: 'Homiestay Booking',
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      hostLogin: 'Host Login',
      search: 'Search homiestays...',
      brandName: 'Homiestay',
      language: 'Language',

      // New Kanowit HomieStay translations
      homeTitle: '🏡 Kanowit HomieStay – Easy Rental, Comfortable Stay!',
      homeSubtitle: 'Looking for a place in Kanowit? We offer safe, clean, and affordable rooms for both long-term and short-term stays!',
      location: '📍 Location',
      allLocations: 'All Locations',
      cityCenter: 'Kanowit City Center',
      nearBalaiPolis: 'Near Balai Polis',
      nearHospital: 'Near Hospital',
      nearSMKKanowit: 'Near SMK Kanowit',
      roomType: '🛏 Room Type',
      allTypes: 'All Types',
      singleRoom: 'Room',
      wholeHouse: 'Whole House',
      doubleRoom: 'Double Room',
      familyRoom: 'Family Room',
      monthlyRent: '💰 Monthly Rent',
      below300: 'Below RM300',
      between300And500: 'RM300-RM500',
      above500: 'Above RM500',
      amenities: '✅ Amenities',
      allAmenities: 'All Amenities',
      wifi: 'WiFi',
      ac: 'Air Conditioning',
      utilities: 'Utilities Included',
      fan: 'Fan',
      filter: 'Filter',
      allAvailableRooms: 'All Available Rooms',
      roomSelectionDesc: 'We offer various types of quality accommodations',
      premium: 'Premium',
      popular: 'Popular',
      perMonth: '/ month',
      perDay: '/ day',
      basicFacilities: 'Basic Facilities',
      comfortableStay: 'Comfortable and safe accommodation',
      noRoomsAvailable: 'No rooms available',
      checkBackLater: 'We are adding new listings. Please check back later.',
      addYourProperty: 'Add Your Property',
      noFilterResults: 'No rooms match your filter criteria',
      viewDetails: 'View Details',
      roomNotFound: 'Room not found',
      errorLoadingRoom: 'Error loading room'
    },
    zh: {
      // General site elements
      siteName: 'Homiestay 预订',
      home: '首页',
      about: '关于我们',
      contact: '联系我们',
      hostLogin: '房东登录',
      search: '搜索 Homiestay...',
      brandName: 'Homiestay',
      language: '语言',

      // New Kanowit HomieStay translations
      homeTitle: '🏡 Kanowit HomieStay – 轻松租房，舒适入住！',
      homeSubtitle: '在Kanowit找房？我们提供安全、干净、经济实惠的房间，适合长期或短期租住！',
      location: '📍 位置',
      allLocations: '所有位置',
      cityCenter: 'Kanowit市中心',
      nearBalaiPolis: '靠近警察局',
      nearHospital: '靠近医院',
      nearSMKKanowit: '靠近SMK Kanowit学校',
      roomType: '🛏 房间类型',
      allTypes: '所有类型',
      singleRoom: '房间',
      wholeHouse: '整间房子',
      doubleRoom: '双人房',
      familyRoom: '家庭房',
      monthlyRent: '💰 月租金',
      below300: 'RM300以下',
      between300And500: 'RM300-RM500',
      above500: 'RM500以上',
      amenities: '✅ 设施',
      allAmenities: '所有设施',
      wifi: 'WiFi',
      ac: '冷气',
      utilities: '包水电',
      fan: '风扇',
      filter: '筛选',
      allAvailableRooms: '所有可用房间',
      roomSelectionDesc: '为您提供各种类型的优质住宿选择',
      premium: '精品',
      popular: '热门',
      perMonth: '/ 月',
      perDay: '/ 天',
      basicFacilities: '基本设施',
      comfortableStay: '舒适安全的住宿选择',
      noRoomsAvailable: '暂无可用房间',
      checkBackLater: '我们正在添加新的房源，请稍后再来查看。',
      addYourProperty: '添加您的房源',
      noFilterResults: '没有符合筛选条件的房间',
      viewDetails: '查看详情',
      roomNotFound: '找不到房间',
      errorLoadingRoom: '加载房间时出错'
    }
  };

  return translations[lang] || translations.ms;
}

// Sample placeholder image (a small base64 placeholder)
const placeholderImage = 'data:image/jpeg;base64,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';

// Mock data for Vercel deployment using base64 images
const sampleRooms = [
  {
    id: "1701234567890",
    name_zh: "豪华双人房",
    name_en: "Deluxe Double Room",
    name_ms: "Bilik Double Mewah",
    description_en: "This is a spacious and comfortable deluxe double room with a king-size bed and private balcony.",
    description_ms: "Ini adalah bilik double mewah yang luas dan selesa dengan katil king-size dan balkoni peribadi.",
    description_zh: "这是一间宽敞舒适的豪华双人房，配有一张特大号床和私人阳台。",
    location: ["city-center", "near-smk-kanowit"],
    pricePerNight: 150,
    roomType: "room",
    images: [placeholderImage] // Using base64 image placeholder
  },
  {
    id: "1701234567891",
    name_zh: "家庭套房",
    name_en: "Family Suite",
    name_ms: "Suite Keluarga",
    description_en: "Spacious family suite with one king-size bed and two single beds, perfect for family trips.",
    description_ms: "Suite keluarga yang luas dengan satu katil king-size dan dua katil single, sesuai untuk perjalanan keluarga.",
    description_zh: "宽敞的家庭套房，配有一张特大号床和两张单人床，非常适合家庭旅行。",
    location: ["near-balai-polis", "near-hospital"],
    pricePerNight: 250,
    roomType: "whole-house",
    images: [placeholderImage] // Using base64 image placeholder
  }
];

// Helper function to get rooms - returns mock data for Vercel
function getRooms() {
  return { rooms: sampleRooms };
}

// Helper function to get content in current language or fallback
const getLocalizedContent = (room, field, lang, defaultValue = '') => {
  // First try direct language suffix (e.g., name_zh)
  const langField = `${field}_${lang}`;

  if (room[langField]) {
    return room[langField];
  }

  // Fallbacks in order: current language, English, Malay
  if (lang !== 'en' && room[`${field}_en`]) {
    return room[`${field}_en`];
  }

  if (lang !== 'ms' && room[`${field}_ms`]) {
    return room[`${field}_ms`];
  }

  // Legacy support - if the field exists without language suffix
  if (room[field]) {
    return room[field];
  }

  return defaultValue;
};

// Routes
// Home page
app.get('/', (req, res) => {
  try {
    const roomsData = getRooms();
    const lang = req.cookies?.siteLanguage || 'ms';

    res.render('index', {
      rooms: roomsData.rooms,
      lang: lang
    });
  } catch (error) {
    console.error('Error loading rooms:', error);
    res.status(500).render('error', { message: 'Error loading rooms' });
  }
});

// Room detail page
app.get('/room/:id', async (req, res) => {
  try {
    const roomsData = getRooms();
    const room = roomsData.rooms.find(r => r.id === req.params.id);

    // Get current language from cookie or default to Malay
    const lang = req.cookies?.siteLanguage || 'ms';

    if (!room) {
      return res.status(404).render('error', { message: res.locals.translations.roomNotFound });
    }

    // Safe conversion of room data with language support
    const safeRoom = {
      id: room.id || '',
      name: getLocalizedContent(room, 'name', lang, 'Room'),
      pricePerNight: typeof room.pricePerNight === 'number' ? room.pricePerNight : 0,
      pricePerHour: typeof room.pricePerHour === 'number' ? room.pricePerHour : null,
      description: getLocalizedContent(room, 'description', lang, 'No description available'),
      images: Array.isArray(room.images) ? room.images : [],
      availableDates: getLocalizedContent(room, 'availableDates', lang, '')
    };

    // Get similar rooms (other rooms excluding current one)
    const similarRooms = roomsData.rooms
      .filter(r => r.id !== room.id)
      .map(r => ({
        id: r.id,
        name: getLocalizedContent(r, 'name', lang, 'Homiestay'),
        pricePerNight: typeof r.pricePerNight === 'number' ? r.pricePerNight : 0,
        description: getLocalizedContent(r, 'description', lang, 'Another beautiful property you might enjoy...'),
        images: Array.isArray(r.images) ? r.images : []
      }))
      .slice(0, 3); // Limit to 3 similar rooms

    // Get WhatsApp number from environment variable
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '60123456789';

    res.render('room', {
      room: safeRoom,
      similarRooms: similarRooms,
      whatsappNumber: whatsappNumber
    });
  } catch (error) {
    console.error('Error loading room:', error);
    res.status(500).render('error', { message: res.locals.translations.errorLoadingRoom });
  }
});

// API to generate WhatsApp message
app.post('/generate-whatsapp', (req, res) => {
  try {
    const { roomName, checkIn, checkOut, guests } = req.body;

    const message = encodeURIComponent(
      `Hello, I'd like to book a room: \n- Room: ${roomName}\n- Check-in: ${checkIn}\n- Check-out: ${checkOut}\n- Guests: ${guests}\nIs it available?`
    );

    const whatsappNumber = process.env.WHATSAPP_NUMBER || '60123456789';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    res.json({ url: whatsappUrl });
  } catch (error) {
    console.error('Error generating WhatsApp link:', error);
    res.status(500).json({ error: 'Failed to generate WhatsApp link' });
  }
});

// Admin routes (simplified for Vercel demo)
// Admin login page
app.get('/admin/login', (req, res) => {
  res.render('admin/login');
});

// Admin login process
app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === adminPassword) {
    req.session.isAdmin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: 'Invalid password' });
  }
});

// Admin middleware
function isAdmin(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
}

// Admin dashboard
app.get('/admin/dashboard', isAdmin, (req, res) => {
  const roomsData = getRooms();
  res.render('admin/dashboard', { rooms: roomsData.rooms });
});

// Simplified admin endpoints - no actual editing in Vercel
app.get('/admin/room/add', isAdmin, (req, res) => {
  res.render('admin/room-form', { room: null, isNew: true });
});

app.get('/admin/room/edit/:id', isAdmin, (req, res) => {
  const roomsData = getRooms();
  const room = roomsData.rooms.find(r => r.id === req.params.id);

  if (!room) {
    return res.status(404).render('error', { message: 'Room not found' });
  }

  res.render('admin/room-form', { room, isNew: false });
});

// Add language switch route
app.get('/switch-language/:lang', (req, res) => {
  const lang = req.params.lang;

  // Validate language
  const validLanguages = ['ms', 'en', 'zh'];
  if (validLanguages.includes(lang)) {
    // Set the cookie with a longer expiration (30 days)
    res.cookie('siteLanguage', lang, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      path: '/'
    });
  }

  // Redirect back to previous page or home
  const referer = req.headers.referer || '/';
  res.redirect(referer);
});

// Handle errors
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('error', {
    message: 'Server error occurred',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// For Vercel, we need to export the Express app as a module
module.exports = app;