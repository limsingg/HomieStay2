const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const multer = require('multer');
const QRCode = require('qrcode');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'homestay-booking-secret',
  resave: false,
  saveUninitialized: true
}));

// Cookie parser middleware (MOVED UP before the language middleware)
app.use(cookieParser());

// Language middleware
app.use((req, res, next) => {
  // Get language preference from cookie or default to 'ms' (Malay)
  const lang = req.cookies?.siteLanguage || 'ms';

  console.log(`Current language from cookie: ${lang}`);

  // Add language to res.locals to make it available in templates
  res.locals.lang = lang;
  res.locals.translations = getTranslations(lang);

  // Debug the translations
  console.log(`Translations loaded: ${!!res.locals.translations}`);
  console.log(`homeTitle: ${res.locals.translations?.homeTitle}`);

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

      // New category section translations
      ruralArea: 'Rumah Luar Bandar',
      urbanArea: 'Rumah Bandar',
      price: 'Harga',
      allPrices: 'Semua Harga',
      budgetFriendly: 'RM500 ke bawah',
      premiumDesc: 'Dengan kemudahan yang lebih baik',
      contactHost: 'Hubungi Hos',
      whatsapp: 'WhatsApp',
      noRuralRooms: 'Tiada homestay luar bandar buat masa ini',
      noUrbanRooms: 'Tiada homestay bandar buat masa ini',
      noBudgetRooms: 'Tiada homestay bajet buat masa ini',
      noPremiumRooms: 'Tiada homestay premium buat masa ini',

      // Contact information
      address: '96700 Kanowit, Sarawak, Malaysia',
      city: 'Sarawak, Malaysia',
      phoneNumber: '+60 11-1057 8899',
      email: 'info@homiestay.example',

      // Footer elements
      footerTagline: 'Rumah sempurna anda jauh dari rumah. Tempah homiestay yang selesa dan berpatutan untuk perjalanan anda seterusnya.',
      links: 'Pautan',
      followUs: 'Ikuti Kami',
      copyright: '© 2025 Tempahan Homiestay. Semua hak cipta terpelihara.',
      privacyTerms: 'Dasar Privasi | Terma Perkhidmatan',

      // Room details page
      roomDetails: 'Butiran Bilik',
      aboutSpace: 'Tentang ruang ini',
      availability: 'Ketersediaan',
      location: 'Lokasi',
      share: 'Kongsi',
      save: 'Simpan',
      entireHomestay: 'Keseluruhan homiestay dihos oleh',
      guests: 'tetamu',
      beds: 'katil',
      bath: 'bilik mandi',
      superhost: 'Superhos',
      guestChoice: 'Pilihan Tetamu',
      greatLocation: 'Lokasi hebat',
      locationRating: '95% tetamu memberi penilaian 5 bintang',
      selfCheckin: 'Daftar masuk sendiri',
      selfCheckinDesc: 'Daftar masuk sendiri dengan pad kekunci',
      freeCancellation: 'Pembatalan percuma',
      beforeCheckin: 'Sebelum daftar masuk',
      reviews: 'ulasan',

      // Image placeholders
      noMainImage: 'Tiada imej utama tersedia',
      noImage: 'Tiada imej',
      roomPreview: 'Pratonton Bilik',

      // Map
      mapLoading: 'Peta sedang dimuat...',

      // Amenities
      noAmenities: 'Tiada maklumat kemudahan tersedia',
      contactForAvailability: 'Sila hubungi hos untuk ketersediaan',

      // Booking form
      bookingPrice: '/ malam',
      checkIn: 'Tarikh Masuk',
      checkOut: 'Tarikh Keluar',
      guestCount: 'Tetamu',
      guest: 'tetamu',
      guests: 'tetamu',
      nights: 'malam',
      night: 'malam',
      cleaningFee: 'Yuran pembersihan',
      serviceFee: 'Yuran perkhidmatan',
      total: 'Jumlah',
      bookViaWhatsApp: 'Tempah melalui WhatsApp',
      noCharge: 'Anda tidak akan dikenakan bayaran lagi. Pengesahan dengan hos melalui WhatsApp.',
      selectLanguage: 'Pilih bahasa mesej:',
      needHelp: 'Perlukan bantuan?',
      callHost: 'Hubungi Hos',
      selectDatesAlert: 'Sila pilih tarikh masuk dan keluar',

      // Discount and special offer
      discount: 'diskaun',
      specialOffer: 'Tawaran Diskaun Istimewa!',
      savings: 'Penjimatan Anda',

      // Similar rooms section
      morePlaces: 'Lebih banyak tempat yang anda mungkin suka',
      viewDetails: 'Lihat Butiran',
      comingSoon: 'Akan Datang',

      // Room not found/error
      roomNotFound: 'Bilik tidak dijumpai',
      errorLoadingRoom: 'Ralat memuatkan bilik',
      errorTitle: 'Maaf! Sesuatu telah berlaku',
      backToHome: 'Kembali ke Laman Utama',
      invalidPassword: 'Kata laluan tidak sah',

      // Admin section
      adminDashboard: 'Papan Pemuka Admin',
      addRoom: 'Tambah Bilik Baru',
      editRoom: 'Sunting Bilik',
      deleteRoom: 'Padam Bilik',
      confirmDelete: 'Adakah anda pasti mahu memadamkan bilik ini?',
      cancel: 'Batal',
      saveChanges: 'Simpan Perubahan',

      // Admin login
      password: 'Kata Laluan',
      login: 'Log Masuk',

      // Why Choose Us section
      whyChooseUs: 'Why Choose Our Homiestays',
      whyChooseUsSubtitle: 'Discover the unique benefits of booking with us',
      highQuality: 'High-Quality Properties',
      highQualityDesc: 'All our homiestays undergo rigorous quality checks to ensure the best experience',
      directComm: 'Direct Communication',
      directCommDesc: 'Connect directly with hosts via WhatsApp for a smoother booking experience',
      noHiddenFees: 'No Hidden Fees',
      noHiddenFeesDesc: 'Transparent pricing with no additional service or booking fees',

      // CTA Section
      becomeHost: 'Memiliki hartanah? Jadilah hos!',
      becomeHostDesc: 'Kongsi ruang anda dan mula menjana pendapatan dengan menjadi hos kepada tetamu di hartanah anda',
      getStarted: 'Mulakan',

      // Special offer
      specialOfferTitle: 'Tawaran Diskaun Istimewa!',
      specialOfferDesc: 'Nikmati diskaun sehingga 15% untuk semua tempahan penginapan - Tawaran terhad!',
      tryDifferentFilters: 'Cuba penapis berbeza untuk mencari bilik dengan diskaun 10-15%!',

      // New key locations translation
      // keyLocations: 'Lokasi Utama',
      // keyLocation: 'Lokasi Utama',
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

      // New category section translations
      ruralArea: 'Rural Homestays',
      urbanArea: 'Urban Homestays',
      price: 'Price',
      allPrices: 'All Prices',
      budgetFriendly: 'Below RM500',
      premiumDesc: 'With better facilities and amenities',
      contactHost: 'Contact Host',
      whatsapp: 'WhatsApp',
      noRuralRooms: 'No rural homestays available at the moment',
      noUrbanRooms: 'No urban homestays available at the moment',
      noBudgetRooms: 'No budget-friendly homestays available at the moment',
      noPremiumRooms: 'No premium homestays available at the moment',

      // Contact information
      address: '123 Main Street, Kuala Lumpur',
      city: 'Kuala Lumpur, Malaysia',
      phoneNumber: '+60 11-1057 8899',
      email: 'info@homiestay.example',

      // Footer elements
      footerTagline: 'Your perfect home away from home. Book comfortable and affordable homiestays for your next trip.',
      links: 'Links',
      followUs: 'Follow Us',
      copyright: '© 2025 Homiestay Booking. All rights reserved.',
      privacyTerms: 'Privacy Policy | Terms of Service',

      // Room details page
      roomDetails: 'Room Details',
      aboutSpace: 'About this space',
      availability: 'Availability',
      location: 'Location',
      share: 'Share',
      save: 'Save',
      entireHomestay: 'Entire homiestay hosted by',
      guests: 'guests',
      beds: 'beds',
      bath: 'bath',
      superhost: 'Superhost',
      guestChoice: 'Guest Choice',
      greatLocation: 'Great location',
      locationRating: '95% of guests gave a 5-star rating',
      selfCheckin: 'Self check-in',
      selfCheckinDesc: 'Check yourself in with keypad',
      freeCancellation: 'Free cancellation',
      beforeCheckin: 'Before check-in',
      reviews: 'reviews',

      // Image placeholders
      noMainImage: 'No main image available',
      noImage: 'No image',
      roomPreview: 'Room Preview',

      // Map
      mapLoading: 'Map loading...',

      // Amenities
      noAmenities: 'No amenities information available',
      contactForAvailability: 'Please contact host for availability',

      // Booking form
      bookingPrice: '/ night',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guestCount: 'Guests',
      guest: 'guest',
      guests: 'guests',
      nights: 'nights',
      night: 'night',
      cleaningFee: 'Cleaning fee',
      serviceFee: 'Service fee',
      total: 'Total',
      bookViaWhatsApp: 'Book via WhatsApp',
      noCharge: 'You won\'t be charged yet. Confirmation with host via WhatsApp.',
      selectLanguage: 'Select message language:',
      needHelp: 'Need help?',
      callHost: 'Call Host',
      selectDatesAlert: 'Please select check-in and check-out dates',

      // Discount and special offer
      discount: 'discount',
      specialOffer: 'Special Offer!',
      savings: 'Your Savings',

      // Similar rooms section
      morePlaces: 'More places you might like',
      viewDetails: 'View Details',
      comingSoon: 'Coming Soon',

      // Room not found/error
      roomNotFound: 'Room not found',
      errorLoadingRoom: 'Error loading room',
      errorTitle: 'Oops! Something went wrong',
      backToHome: 'Back to Home',
      invalidPassword: 'Invalid password',

      // Admin section
      adminDashboard: 'Admin Dashboard',
      addRoom: 'Add Room',
      editRoom: 'Edit Room',
      deleteRoom: 'Delete Room',
      confirmDelete: 'Are you sure you want to delete this room?',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',

      // Admin login
      password: 'Password',
      login: 'Login',

      // Why Choose Us section
      whyChooseUs: 'Why Choose Our Homiestays',
      whyChooseUsSubtitle: 'Discover the unique benefits of booking with us',
      highQuality: 'High-Quality Properties',
      highQualityDesc: 'All our homiestays undergo rigorous quality checks to ensure the best experience',
      directComm: 'Direct Communication',
      directCommDesc: 'Connect directly with hosts via WhatsApp for a smoother booking experience',
      noHiddenFees: 'No Hidden Fees',
      noHiddenFeesDesc: 'Transparent pricing with no additional service or booking fees',

      // CTA Section
      becomeHost: 'Own a property? Become a host!',
      becomeHostDesc: 'Share your space and start earning by hosting guests in your property',
      getStarted: 'Get Started',

      // Special offer
      specialOfferTitle: 'Special Discount Offer!',
      specialOfferDesc: 'Enjoy up to 15% off all accommodation bookings - Limited time offer!',
      tryDifferentFilters: 'Try different filters to find rooms with 10-15% discounts!',

      // New key locations translation
      // keyLocations: 'Key Locations',
      // keyLocation: 'Key Locations',
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

      // New category section translations
      ruralArea: '乡村房',
      urbanArea: '城市房',
      price: '价格',
      allPrices: '所有价格',
      budgetFriendly: 'RM500以下',
      premiumDesc: '有更好设施',
      contactHost: '联系房东',
      whatsapp: '微信',
      noRuralRooms: '暂无乡村房源',
      noUrbanRooms: '暂无城市房源',
      noBudgetRooms: '暂无经济型房源',
      noPremiumRooms: '暂无高端房源',

      // Contact information
      address: '加拿逸，砂捞越',
      city: '砂捞越，马来西亚',
      phoneNumber: '+60 11-1057 8899',
      email: 'info@homiestay.example',

      // Footer elements
      footerTagline: '您远离家的完美之家。为您的下一次旅行预订舒适实惠的 Homiestay。',
      links: '链接',
      followUs: '关注我们',
      copyright: '© 2025 民宿预订。保留所有权利。',
      privacyTerms: '隐私政策 | 服务条款',

      // Room details page
      roomDetails: '房间详情',
      aboutSpace: '关于此空间',
      availability: '可用日期',
      location: '位置',
      share: '分享',
      save: '保存',
      entireHomestay: '整套民宿由以下房东提供',
      guests: '客人',
      beds: '床',
      bath: '浴室',
      superhost: '超赞房东',
      guestChoice: '客户之选',
      greatLocation: '绝佳位置',
      locationRating: '95%的客人给予5星评价',
      selfCheckin: '自助入住',
      selfCheckinDesc: '使用密码键盘自行入住',
      freeCancellation: '免费取消',
      beforeCheckin: '入住前',
      reviews: '评价',

      // Image placeholders
      noMainImage: '无主要图片',
      noImage: '无图片',
      roomPreview: '房间预览',

      // Map
      mapLoading: '地图加载中...',

      // Amenities
      noAmenities: '无设施信息',
      contactForAvailability: '请联系房东了解可用性',

      // Booking form
      bookingPrice: '/ 晚',
      checkIn: '入住日期',
      checkOut: '退房日期',
      guestCount: '客人数量',
      guest: '位客人',
      guests: '位客人',
      nights: '晚',
      night: '晚',
      cleaningFee: '清洁费',
      serviceFee: '服务费',
      total: '总计',
      bookViaWhatsApp: '通过WhatsApp预订',
      noCharge: '您暂时不会被收费。通过WhatsApp与房东确认。',
      selectLanguage: '选择消息语言:',
      needHelp: '需要帮助?',
      callHost: '致电房东',
      selectDatesAlert: '请选择入住和退房日期',

      // Discount and special offer
      discount: '折扣',
      specialOffer: '特别优惠！',
      savings: '您的节省',

      // Similar rooms section
      morePlaces: '您可能会喜欢的其他地方',
      viewDetails: '查看详情',
      comingSoon: '即将推出',

      // Room not found/error
      roomNotFound: '找不到房间',
      errorLoadingRoom: '加载房间时出错',
      errorTitle: '糟糕！出了些问题',
      backToHome: '返回首页',
      invalidPassword: '密码无效',

      // Admin section
      adminDashboard: '管理员仪表板',
      addRoom: '添加新房间',
      editRoom: '编辑房间',
      deleteRoom: '删除房间',
      confirmDelete: '您确定要删除此房间吗？',
      cancel: '取消',
      saveChanges: '保存更改',

      // Admin login
      password: '密码',
      login: '登录',

      // Why Choose Us section
      whyChooseUs: '为什么选择我们的民宿',
      whyChooseUsSubtitle: '发现预订民宿的独特好处',
      highQuality: '高品质房源',
      highQualityDesc: '所有民宿都经过严格的质量检查，以确保最佳体验',
      directComm: '直接沟通',
      directCommDesc: '通过WhatsApp直接与房东沟通，以获得更顺畅的预订体验',
      noHiddenFees: '无隐藏费用',
      noHiddenFeesDesc: '透明定价，无额外服务或预订费用',

      // CTA Section
      becomeHost: '拥有房产？成为房东！',
      becomeHostDesc: '分享您的空间并开始通过在您的房产中接待客人来赚钱',
      getStarted: '开始',

      // Special offer
      specialOfferTitle: '特别优惠！',
      specialOfferDesc: '所有住宿享受高达15%的折扣 - 限时优惠！',
      tryDifferentFilters: '尝试不同的筛选条件，寻找10-15%折扣的房间！',

      // New key locations translation
      // keyLocations: '重要位置',
      // keyLocation: '重要位置',
    }
  };

  return translations[lang] || translations.ms;
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const roomId = req.body.roomId || 'temp';
    const dir = `uploads/rooms/${roomId}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Initialize data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);

  // Create initial rooms data file
  const initialRoomsData = { rooms: [] };
  fs.writeFileSync(
    path.join(dataDir, 'rooms.json'),
    JSON.stringify(initialRoomsData, null, 2)
  );
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'rooms');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create QR codes directory if it doesn't exist
const qrCodeDir = path.join(__dirname, 'public', 'qrcodes');
if (!fs.existsSync(qrCodeDir)) {
  fs.mkdirSync(qrCodeDir, { recursive: true });
}

// Helper functions for data operations
function getRooms() {
  const filePath = path.join(__dirname, 'data', 'rooms.json');
  if (!fs.existsSync(filePath)) {
    return { rooms: [] };
  }

  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function saveRooms(roomsData) {
  const filePath = path.join(__dirname, 'data', 'rooms.json');
  fs.writeFileSync(filePath, JSON.stringify(roomsData, null, 2));
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

    // Check if each room has the language-specific fields and create a safe room version if needed
    const safeRooms = roomsData.rooms.map(room => {
      // For legacy rooms that don't have language-specific fields,
      // create a processed version with default language fields
      if (room.name && (!room.name_en && !room.name_ms && !room.name_zh)) {
        return {
          ...room,
          name_en: room.name,
          name_ms: room.name,
          name_zh: room.name,
          description_en: room.description || '',
          description_ms: room.description || '',
          description_zh: room.description || ''
        };
      }
      return room;
    });

    res.render('index', {
      rooms: safeRooms,
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

    // Process facilities/amenities with language support
    const processFacilities = (room, lang) => {
      const facilities = getLocalizedContent(room, 'facilities', lang, '');

      // If it's a string, split by comma and trim
      if (typeof facilities === 'string') {
        return facilities.split(',').map(item => item.trim()).filter(item => item);
      }

      return [];
    };

    // Convert facilities to amenities array
    safeRoom.amenities = processFacilities(room, lang);

    // Keep original facilities string
    safeRoom.facilities = getLocalizedContent(room, 'facilities', lang, '');

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

    // Add placeholder rooms if we don't have enough similar rooms
    while (similarRooms.length < 3) {
      similarRooms.push({
        id: `placeholder-${similarRooms.length}`,
        name: res.locals.translations.siteName,
        pricePerNight: Math.round(safeRoom.pricePerNight * 0.9),
        description: res.locals.translations.footerTagline,
        images: [],
        isPlaceholder: true
      });
    }

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

// Generate WhatsApp message
app.post('/generate-whatsapp', (req, res) => {
  const { roomName, checkIn, checkOut, guests } = req.body;

  const message = encodeURIComponent(
    `你好，我想预订房间：\n- 房间名称：${roomName}\n- 入住日期：${checkIn}\n- 退房日期：${checkOut}\n- 人数：${guests}\n请问是否有空房？`
  );

  const whatsappNumber = process.env.WHATSAPP_NUMBER || '60123456789';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  res.json({ url: whatsappUrl });
});

// Admin routes
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

// Add room page
app.get('/admin/room/add', isAdmin, (req, res) => {
  res.render('admin/room-form', { room: null, isNew: true });
});

// Edit room page
app.get('/admin/room/edit/:id', isAdmin, (req, res) => {
  const roomsData = getRooms();
  const room = roomsData.rooms.find(r => r.id === req.params.id);

  if (!room) {
    return res.status(404).render('error', { message: 'Room not found' });
  }

  res.render('admin/room-form', { room, isNew: false });
});

// Add/Edit room process
app.post('/admin/room/save', isAdmin, upload.array('images', 5), (req, res) => {
  const roomsData = getRooms();
  const {
    id,
    name_ms, name_en, name_zh,
    pricePerNight, pricePerHour,
    description_ms, description_en, description_zh,
    facilities_ms, facilities_en, facilities_zh,
    availableDates_ms, availableDates_en, availableDates_zh,
    location, roomType
  } = req.body;

  // Handle location as an array
  let locationArray = [];
  if (location) {
    locationArray = Array.isArray(location) ? location : [location];
  }

  let roomId = id;
  let room;

  if (roomId) {
    // Edit existing room
    room = roomsData.rooms.find(r => r.id === roomId);
    if (!room) {
      return res.status(404).render('error', { message: 'Room not found' });
    }

    // Update room with multilingual content
    if (name_ms) room.name_ms = name_ms;
    if (name_en) room.name_en = name_en;
    if (name_zh) room.name_zh = name_zh;

    if (description_ms) room.description_ms = description_ms;
    if (description_en) room.description_en = description_en;
    if (description_zh) room.description_zh = description_zh;

    if (facilities_ms) room.facilities_ms = facilities_ms;
    if (facilities_en) room.facilities_en = facilities_en;
    if (facilities_zh) room.facilities_zh = facilities_zh;

    if (availableDates_ms) room.availableDates_ms = availableDates_ms;
    if (availableDates_en) room.availableDates_en = availableDates_en;
    if (availableDates_zh) room.availableDates_zh = availableDates_zh;

    // Update location and room type
    room.location = locationArray.length > 0 ? locationArray : ['city-center'];
    room.roomType = roomType || 'single';

    // Update pricing
    room.pricePerNight = pricePerNight ? parseFloat(pricePerNight) : room.pricePerNight;
    room.pricePerHour = pricePerHour ? parseFloat(pricePerHour) : null;

    // Legacy support - preserve original fields if they exist
    if (!room.name_ms && !room.name_en && !room.name_zh && room.name) {
      // Migrate legacy name to new format
      const defaultName = room.name || 'New Room';
      room.name_en = defaultName;
      delete room.name;
    }

    if (!room.description_ms && !room.description_en && !room.description_zh && room.description) {
      // Migrate legacy description to new format
      const defaultDesc = room.description || '';
      room.description_en = defaultDesc;
      delete room.description;
    }

    if (!room.facilities_ms && !room.facilities_en && !room.facilities_zh && room.facilities) {
      // Migrate legacy facilities to new format
      const defaultFacilities = room.facilities || '';
      room.facilities_en = defaultFacilities;
      delete room.facilities;
    }

    if (!room.availableDates_ms && !room.availableDates_en && !room.availableDates_zh && room.availableDates) {
      // Migrate legacy availableDates to new format
      const defaultDates = room.availableDates || '';
      room.availableDates_en = defaultDates;
      delete room.availableDates;
    }
  } else {
    // Add new room
    roomId = Date.now().toString();
    room = {
      id: roomId,
      name_ms: name_ms || '',
      name_en: name_en || 'New Room',
      name_zh: name_zh || '',
      pricePerNight: pricePerNight ? parseFloat(pricePerNight) : 0,
      pricePerHour: pricePerHour ? parseFloat(pricePerHour) : null,
      description_ms: description_ms || '',
      description_en: description_en || '',
      description_zh: description_zh || '',
      facilities_ms: facilities_ms || '',
      facilities_en: facilities_en || '',
      facilities_zh: facilities_zh || '',
      availableDates_ms: availableDates_ms || '',
      availableDates_en: availableDates_en || '',
      availableDates_zh: availableDates_zh || '',
      location: locationArray.length > 0 ? locationArray : ['city-center'],
      roomType: roomType || 'single',
      images: []
    };
    roomsData.rooms.push(room);
  }

  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    // Move images from temp directory if needed
    const roomDir = path.join(__dirname, 'uploads', 'rooms', roomId);
    if (!fs.existsSync(roomDir)) {
      fs.mkdirSync(roomDir, { recursive: true });
    }

    const newImages = req.files.map(file => {
      return `/uploads/rooms/${roomId}/${path.basename(file.path)}`;
    });

    room.images = room.images ? [...room.images, ...newImages] : newImages;
  }

  saveRooms(roomsData);

  // Generate QR code for the room
  const roomUrl = `${req.protocol}://${req.get('host')}/room/${roomId}`;
  const qrCodeDir = path.join(__dirname, 'public', 'qrcodes');

  if (!fs.existsSync(qrCodeDir)) {
    fs.mkdirSync(qrCodeDir, { recursive: true });
  }

  const qrCodePath = path.join(qrCodeDir, `${roomId}.png`);
  QRCode.toFile(qrCodePath, roomUrl, {
    errorCorrectionLevel: 'H'
  }, (err) => {
    if (err) console.error('QR Code generation error:', err);

    res.redirect('/admin/dashboard');
  });
});

// Delete room
app.post('/admin/room/delete/:id', isAdmin, (req, res) => {
  const roomsData = getRooms();
  const roomIndex = roomsData.rooms.findIndex(r => r.id === req.params.id);

  if (roomIndex === -1) {
    return res.status(404).render('error', { message: 'Room not found' });
  }

  // Remove room images
  const roomDir = path.join(__dirname, 'uploads', 'rooms', req.params.id);
  if (fs.existsSync(roomDir)) {
    fs.rmSync(roomDir, { recursive: true, force: true });
  }

  // Remove QR code
  const qrCodePath = path.join(__dirname, 'public', 'qrcodes', `${req.params.id}.png`);
  if (fs.existsSync(qrCodePath)) {
    fs.unlinkSync(qrCodePath);
  }

  // Remove room from data
  roomsData.rooms.splice(roomIndex, 1);
  saveRooms(roomsData);

  res.redirect('/admin/dashboard');
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

    console.log(`Language switched to: ${lang}`);
  } else {
    console.log(`Invalid language: ${lang}`);
  }

  // Redirect back to previous page or home
  const referer = req.headers.referer || '/';
  res.redirect(referer);
});

// Start the server
app.listen(port, () => {
  console.log(`Homestay booking system running on http://localhost:${port}`);
});