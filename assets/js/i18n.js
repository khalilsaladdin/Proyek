// ============================================================
// (مشكاة) — Sistem Multi-Bahasa Internasional (i18n)
// Mendukung: Bahasa Indonesia (ID), العربية (AR), English (EN)
// ============================================================

const MISYKAH_I18N = {
  currentLang: 'id',

  translations: {
    id: {
      brand_title: 'MISYKAH',
      brand_tagline: 'PLATFORM RESMI SANTRI',
      nav_faidah: '💡 Kolom Faidah',
      nav_kelas: '👥 Kelas Bersama',
      nav_murojaah: '📖 Murojaah',
      nav_muhadharah: '🎧 Audio Muhadharah',
      nav_books: '📚 Perpustakaan',
      nav_fitur: 'Pilar Fitur',
      nav_keunggulan: 'Keunggulan',
      nav_privacy: 'Piagam & Privasi',
      nav_login: '🔐 Masuk Akun',
      nav_dashboard: '🏠 Dashboard',
      menu_title: 'Menu Misykah',
      menu_faidah: '💡 Kolom Faidah (Buka Bebas)',
      menu_kelas: '👥 Kelas & Halaqah Belajar',
      menu_fitur: '✨ Pilar Fitur Utama',
      menu_keunggulan: '🛡️ Keunggulan Standar',
      menu_privacy: '📜 Piagam & Kebijakan Privasi',
      menu_login: '🔐 Masuk / Daftar Santri',

      hero_badge: '✦ PLATFORM DIGITAL RESMI SANTRI & THALABUL ILMI ✦',
      hero_title: 'Menjaga Hafalan, Menuntut Ilmu, dan Menggapai Keberkahan',
      hero_subtitle: 'Ekosistem pembelajaran islami terpadu: jadwal murojaah terstruktur dengan target bulanan, grup kelas belajar privat berbasis kode akses unik, audio muhadharah tanpa batas memori via IndexedDB, perpustakaan kitab digital, dan kolom faidah ilmiah.',
      hero_verse_trans: '"Perumpamaan cahaya Allah adalah seperti sebuah lubang yang tak tembus (misykah), yang di dalamnya ada pelita besar..." — Q.S. An-Nur: 35',
      hero_btn_portal: '🚀 Buka Portal Santri',
      hero_btn_explore: '📖 Pelajari Fitur',
      hero_btn_dashboard: '🏠 Buka Dashboard Anda →',
      welcome_title: 'Ahlan wa Sahlan,',
      welcome_sub: 'Sesi login Anda sedang aktif. Silakan langsung menuju dashboard untuk melanjutkan murojaah.',

      pillars_badge: 'EKOSISTEM PEMBELAJARAN',
      pillars_heading: '5 Pilar Utama Platform Misykah',
      pillars_lead: 'Semua kebutuhan penuntut ilmu dirancang secara rapi dalam satu aplikasi yang ringan, elegan, dan siap digunakan kapan saja.',
      p1_title: 'Jadwal Murojaah & Target',
      p1_desc: 'Kalender hafalan 7 hari, monitoring target bulanan otomatis, checklist harian, dan ekspor laporan berkala berformat terstruktur.',
      p1_btn: '📖 Buka Murojaah →',
      p2_title: 'Grup Kelas & Kode Akses',
      p2_desc: 'Buka majelis ilmu atau gabung ke grup kelas privat menggunakan kode akses unik. Dilengkapi ruang halaqah murojaah dan partner tasmi\'.',
      p2_btn: '👥 Masuk Kelas Bersama →',
      p3_title: 'Studio Audio Muhadharah',
      p3_desc: 'Didukung IndexedDB Blob Storage untuk menyimpan file audio rekaman besar (50MB–100MB+) serta tautan video YouTube dengan pemutaran lancar tanpa jeda.',
      p3_btn: '🎧 Buka Studio Audio →',
      p4_title: 'Perpustakaan Kitab Digital',
      p4_desc: 'Koleksi dan baca kitab PDF tebal langsung di peramban tanpa batas kuota localStorage. Dilengkapi Starter Pack Kitab Penuntut Ilmu yang siap dibaca.',
      p4_btn: '📚 Buka Perpustakaan →',
      p5_title: 'Kolom Faidah (فائدة)',
      p5_desc: 'Ikat mutiara ilmu dengan teks kutipan Arab (font Amiri), rujukan sanad/kitab, filter kategori, penandaan bintang ⭐, dan tombol salin kutipan instan.',
      p5_btn: '💡 Buka Kolom Faidah →',

      tech_badge: 'STANDAR TEKNOLOGI MODERN',
      tech_heading: 'Keunggulan Resmi untuk Kenyamanan Belajar',
      tech_sec_title: 'Kedaulatan & Keamanan Data',
      tech_sec_desc: 'Password santri dienkripsi SHA-256 dan akun tersinkronisasi aman ke Cloud Database Supabase dengan mode multi-perangkat.',
      tech_pwa_title: 'Progressive Web App (PWA)',
      tech_pwa_desc: 'Bisa di-install sebagai aplikasi resmi di Android, iOS, Windows, dan MacOS. Langsung muncul di layar beranda tanpa toko aplikasi pihak ketiga.',
      tech_dark_title: 'Mode Malam (Dark Mode)',
      tech_dark_desc: 'Dukungan tema malam islami yang sejuk di mata, sangat nyaman saat murojaah hafalan pada waktu sahur atau qiyamul lail.',

      auth_badge: 'AKSES PENGGUNA',
      auth_heading: 'Portal Masuk & Pendaftaran Santri',
      auth_lead: 'Masuk ke akun Anda atau daftarkan akun baru untuk mulai memantau murojaah hari ini.',
      tab_login: '🔐 Masuk Akun',
      tab_register: '✨ Daftar Santri Baru',
      login_title: 'Selamat Datang Kembali',
      login_subtitle: 'Silakan masukkan username dan sandi santri',
      demo_account: '💡 Akun Uji Coba (Demo):',
      demo_quick_btn: '⚡ Masuk Cepat',
      lbl_username: 'Username',
      ph_username: 'Username Anda',
      lbl_password: 'Kata Sandi',
      ph_password: '••••••••',
      remember_me: 'Simpan akun & kata sandi di perangkat ini (Ingat Saya)',
      btn_login: 'Masuk Portal',
      btn_logging_in: 'Memverifikasi...',
      no_account: 'Belum punya akun?',
      link_register: 'Daftar akun sekarang',
      saved_acc_title: 'AKUN TERSIMPAN DI PERANGKAT INI',
      saved_acc_login: '⚡ Masuk Langsung',
      saved_acc_forget: 'Hapus Akun Tersimpan',

      reg_title: 'Buat Akun Santri Baru',
      reg_subtitle: 'Bergabunglah dengan majelis murojaah digital',
      lbl_fullname: 'Nama Lengkap',
      ph_fullname: 'Contoh: Ahmad Fadhil',
      lbl_reg_user: 'Username Unik',
      ph_reg_user: 'Username tanpa spasi',
      lbl_confirm_pwd: 'Konfirmasi Kata Sandi',
      ph_confirm_pwd: 'Ulangi kata sandi',
      ph_reg_pwd: 'Minimal 6 karakter',
      btn_register: 'Daftar Sekarang',
      btn_registering: 'Mendaftarkan...',
      have_account: 'Sudah punya akun?',
      link_login: 'Masuk di sini',

      footer_desc: 'Platform resmi murojaah, halaqah kelas berbasis kode akses, dan thalabul ilmi santri berbasis web modern. Didedikasikan bagi para penghafal Al-Qur\'an dan penuntut ilmu syar\'i.',
      footer_nav_title: 'Navigasi Utama',
      footer_help_title: 'Bantuan & Dokumen',
      footer_privacy_link: 'Kebijakan Privasi',
      footer_rights: 'Hak Cipta Dilindungi Undang-Undang.',
      footer_tagline: 'Platform Resmi Pembelajaran Santri Digital Modern',

      // Common app terms
      search_placeholder: 'Cari...',
      btn_save: 'Simpan',
      btn_cancel: 'Batal',
      btn_close: 'Tutup',
      btn_delete: 'Hapus',
      btn_edit: 'Edit',
      btn_download: 'Unduh Kitab',
      btn_back: 'Kembali',
      status_active: 'Aktif',
      loading: 'Memuat...'
    },

    ar: {
      brand_title: 'مِشْكَاة',
      brand_tagline: 'المنصة الرسمية لطلاب العلم الشرعي',
      nav_faidah: '💡 فوائد علمية',
      nav_kelas: '👥 حلقات التعلم',
      nav_murojaah: '📖 المراجعة والتكرار',
      nav_muhadharah: '🎧 المحاضرات الصوتية',
      nav_books: '📚 المكتبة الرقمية',
      nav_fitur: 'ركائز المنصة',
      nav_keunggulan: 'المميزات',
      nav_privacy: 'الميثاق والخصوصية',
      nav_login: '🔐 تسجيل الدخول',
      nav_dashboard: '🏠 لوحة التحكم',
      menu_title: 'قائمة مشكاة',
      menu_faidah: '💡 فوائد علمية (مفتوح للجميع)',
      menu_kelas: '👥 حلقات ودروس المراجعة',
      menu_fitur: '✨ الركائز الأساسية',
      menu_keunggulan: '🛡️ معايير التقنية',
      menu_privacy: '📜 سياسة الخصوصية والميثاق',
      menu_login: '🔐 دخول / تسجيل طالب جديد',

      hero_badge: '✦ المنصة الرقمية الرسمية لحفاظ القرآن وطلاب العلم ✦',
      hero_title: 'صون المحفوظ، وطلب العلم، ونيل البركة والرضوان',
      hero_subtitle: 'منظومة تعليمية إسلامية شاملة: جدول مراجعة أسبوعي وشهري، حلقات دراسية خاصة برمز وصول، مستودع المحاضرات الصوتية بلا قيود عبر المتصفح، مكتبة الكتب الرقمية، ومدونة الفوائد العلمية.',
      hero_verse_trans: '«مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ الْمِصْبَاحُ فِي زُجَاجَةٍ» — سورة النور: ٣٥',
      hero_btn_portal: '🚀 دخول بوابة الطلاب',
      hero_btn_explore: '📖 استكشف المميزات',
      hero_btn_dashboard: '🏠 الانتقال للوحة التحكم ←',
      welcome_title: 'أهلاً وسهلاً،',
      welcome_sub: 'جلستك نشطة حالياً. تفضل بالدخول إلى لوحة التحكم لمتابعة وِردك ومراجعتك.',

      pillars_badge: 'المنظومة التعليمية',
      pillars_heading: 'الركائز الخمس الأساسية لمنصة مشكاة',
      pillars_lead: 'كل ما يحتاجه طالب العلم والقرآن مجمّع بعناية في تطبيق خفيف، أنيق، ومتاح على سائر الأجهزة.',
      p1_title: 'جدول المراجعة والأهداف',
      p1_desc: 'تقويم الحفظ لـ ٧ أيام، متابعة الأهداف الشهرية تلقائياً، قائمة المهام اليومية، وتصدير التقارير المنظمة.',
      p1_btn: '📖 فتح المراجعة ←',
      p2_title: 'الحلقات الخاصة ورمز الدخول',
      p2_desc: 'أنشئ مجلساً علمياً أو انضم لحلقة دراسية خاصة عبر رمز وصول فريد، مع غرف التسميع والمراجعة الثنائية.',
      p2_btn: '👥 دخول الحلقات ←',
      p3_title: 'استوديو الصوتيات والمحاضرات',
      p3_desc: 'مستودع صوتيات متطور يخزن الملفات الكبيرة (حتى ١٠٠ ميجابايت+) في متصفحك محلياً مع دعم روابط يوتيوب ومكرر التكرار.',
      p3_btn: '🎧 فتح الصوتيات ←',
      p4_title: 'المكتبة الرقمية للكتب',
      p4_desc: 'قراءة وحفظ كتب ومخطوطات PDF مباشرة بدون قيود الحجم، مع باقة الكتب التأسيسية لطالب العلم للتحميل والقراءة الفورية.',
      p4_btn: '📚 تصفح المكتبة ←',
      p5_title: 'مدونة الفوائد والفرائد',
      p5_desc: 'قيّد شوارد العلم والآثار بأجمل الخطوط العربية، مع ذكر الإسناد والفرز والتمييز بالنجوم وسهولة النسخ والمشاركة.',
      p5_btn: '💡 تصفح الفوائد ←',

      tech_badge: 'أحدث المعايير التقنية',
      tech_heading: 'مميزات صُممت لخدمة الطالب والباحث',
      tech_sec_title: 'أمان وسيادة البيانات',
      tech_sec_desc: 'تشفير كلمات المرور عبر SHA-256 ومزامنة سحابية آمنة لحسابك تتيح لك الدخول من الهاتف والحاسوب في أي وقت.',
      tech_pwa_title: 'تطبيق ويب تقدمي (PWA)',
      tech_pwa_desc: 'تثبيت فوري على أجهزة أندرويد وآيفون وويندوز وظهوره على الشاشة الرئيسية بدون الحاجة لمتاجر التطبيقات.',
      tech_dark_title: 'الوضع الليلي المريح',
      tech_dark_desc: 'مظهر داكن مهدئ للعينين مصمم خصيصاً للمراجعة والتلاوة في أوقات السحر وقيام الليل.',

      auth_badge: 'بوابة الحسابات',
      auth_heading: 'تسجيل الدخول وإنشاء حساب طالب',
      auth_lead: 'سجل دخولك أو أنشئ حساباً جديداً للبدء في تتبع حفظك ومراجعتك من اليوم.',
      tab_login: '🔐 تسجيل الدخول',
      tab_register: '✨ إنشاء حساب جديد',
      login_title: 'مرحباً بك مجدداً',
      login_subtitle: 'الرجاء إدخال اسم المستخدم وكلمة المرور',
      demo_account: '💡 حساب تجريبي للتجربة:',
      demo_quick_btn: '⚡ دخول سريع',
      lbl_username: 'اسم المستخدم',
      ph_username: 'اسم المستخدم الخاص بك',
      lbl_password: 'كلمة المرور',
      ph_password: '••••••••',
      remember_me: 'حفظ الحساب وكلمة المرور على هذا الجهاز (تذكرني)',
      btn_login: 'دخول المنصة',
      btn_logging_in: 'جارٍ التحقق...',
      no_account: 'ليس لديك حساب؟',
      link_register: 'سجل حسابك الآن',
      saved_acc_title: 'الحساب المحفوظ على هذا الجهاز',
      saved_acc_login: '⚡ دخول مباشر',
      saved_acc_forget: 'إزالة الحساب المحفوظ',

      reg_title: 'إنشاء حساب طالب علم جديد',
      reg_subtitle: 'انضم إلى مجالس الحفظ والتعلم الرقمية الميسرة',
      lbl_fullname: 'الاسم الكامل',
      ph_fullname: 'مثال: أحمد فاضل',
      lbl_reg_user: 'اسم مستخدم فريد',
      ph_reg_user: 'اسم مستخدم بدون مسافات',
      lbl_confirm_pwd: 'تأكيد كلمة المرور',
      ph_confirm_pwd: 'أعد كتابة كلمة المرور',
      ph_reg_pwd: '٦ أحرف على الأقل',
      btn_register: 'إنشاء الحساب الآن',
      btn_registering: 'جارٍ التسجيل...',
      have_account: 'هل لديك حساب بالفعل؟',
      link_login: 'سجل دخولك هنا',

      footer_desc: 'المنصة الرقمية المتطورة للمراجعة والحلقات القرآنية ومجالس العلم. مكرسة لخدمة كتاب الله وسنة نبيه ﷺ وحفظة القرآن الكريم وطلبة العلم الشرعي.',
      footer_nav_title: 'الروابط الرئيسية',
      footer_help_title: 'المساعدة والوثائق',
      footer_privacy_link: 'سياسة الخصوصية',
      footer_rights: 'جميع الحقوق محفوظة.',
      footer_tagline: 'المنصة الرسمية الحديثة لتعليم ومراجعة طلاب العلم',

      search_placeholder: 'بحث...',
      btn_save: 'حفظ',
      btn_cancel: 'إلغاء',
      btn_close: 'إغلاق',
      btn_delete: 'حذف',
      btn_edit: 'تعديل',
      btn_download: 'تحميل الكتاب',
      btn_back: 'رجوع',
      status_active: 'نشط',
      loading: 'جارٍ التحميل...'
    },

    en: {
      brand_title: 'MISYKAH',
      brand_tagline: 'OFFICIAL SANTRI PLATFORM',
      nav_faidah: '💡 Benefits Column',
      nav_kelas: '👥 Study Circles',
      nav_murojaah: '📖 Revision',
      nav_muhadharah: '🎧 Audio Lectures',
      nav_books: '📚 Library',
      nav_fitur: 'Core Pillars',
      nav_keunggulan: 'Features',
      nav_privacy: 'Privacy Charter',
      nav_login: '🔐 Sign In',
      nav_dashboard: '🏠 Dashboard',
      menu_title: 'Misykah Menu',
      menu_faidah: '💡 Benefits Column (Open Access)',
      menu_kelas: '👥 Classes & Study Circles',
      menu_fitur: '✨ Core Pillars',
      menu_keunggulan: '🛡️ Quality Standards',
      menu_privacy: '📜 Privacy Charter & Terms',
      menu_login: '🔐 Sign In / Register',

      hero_badge: '✦ OFFICIAL DIGITAL PLATFORM FOR SANTRI & STUDENTS OF KNOWLEDGE ✦',
      hero_title: 'Preserving Memorization, Seeking Sacred Knowledge, Attaining Barakah',
      hero_subtitle: 'An integrated Islamic learning ecosystem: structured revision schedules with monthly goals, private classes via unique access codes, unlimited audio storage via IndexedDB, digital library, and scholarly benefits.',
      hero_verse_trans: '"The example of His light is like a niche (misykah) within which is a lamp..." — Surah An-Nur: 35',
      hero_btn_portal: '🚀 Open Santri Portal',
      hero_btn_explore: '📖 Explore Features',
      hero_btn_dashboard: '🏠 Open Your Dashboard →',
      welcome_title: 'Ahlan wa Sahlan,',
      welcome_sub: 'Your login session is active. Please proceed directly to your dashboard to continue your murojaah.',

      pillars_badge: 'LEARNING ECOSYSTEM',
      pillars_heading: '5 Core Pillars of Misykah Platform',
      pillars_lead: 'All seeker of knowledge essentials thoughtfully gathered into a lightweight, elegant app available anytime.',
      p1_title: 'Revision Schedule & Goals',
      p1_desc: '7-day memorization calendar, automated monthly target tracking, daily checklist, and formatted progress exports.',
      p1_btn: '📖 Open Revision →',
      p2_title: 'Study Circles & Access Code',
      p2_desc: 'Host gatherings or join private classes with unique passcodes. Complete with halaqah rooms and tasmi\' recitation partners.',
      p2_btn: '👥 Join Study Circles →',
      p3_title: 'Audio Lecture Studio',
      p3_desc: 'Powered by browser IndexedDB for large audio recordings (50MB–100MB+) and YouTube video links with continuous playback.',
      p3_btn: '🎧 Open Audio Studio →',
      p4_title: 'Digital Book Library',
      p4_desc: 'Read and collect comprehensive PDF volumes directly in-browser. Featuring the Seeker of Knowledge Starter Pack ready for reading.',
      p4_btn: '📚 Open Library →',
      p5_title: 'Benefits Column (فائدة)',
      p5_desc: 'Bind pearls of knowledge with authentic Arabic texts, references, category filtering, starring ⭐, and instant 1-click citation copy.',
      p5_btn: '💡 Open Benefits Column →',

      tech_badge: 'MODERN TECHNOLOGY STANDARDS',
      tech_heading: 'Engineered for Study Comfort & Longevity',
      tech_sec_title: 'Data Sovereignty & Security',
      tech_sec_desc: 'Passwords protected with SHA-256 encryption and synchronized securely to Supabase Cloud for cross-device access.',
      tech_pwa_title: 'Progressive Web App (PWA)',
      tech_pwa_desc: 'Install directly as a standalone app on Android, iOS, Windows, and macOS without needing third-party app stores.',
      tech_dark_title: 'Islamic Dark Mode',
      tech_dark_desc: 'Eye-soothing dark palette, perfect for late-night revision and pre-dawn recitation during sahur and qiyamul lail.',

      auth_badge: 'USER ACCESS',
      auth_heading: 'Santri Portal Login & Registration',
      auth_lead: 'Sign in to your account or register a new one to begin tracking your murojaah today.',
      tab_login: '🔐 Sign In',
      tab_register: '✨ New Registration',
      login_title: 'Welcome Back',
      login_subtitle: 'Please enter your username and password',
      demo_account: '💡 Quick Demo Account:',
      demo_quick_btn: '⚡ Quick Login',
      lbl_username: 'Username',
      ph_username: 'Your username',
      lbl_password: 'Password',
      ph_password: '••••••••',
      remember_me: 'Save account & password on this device (Remember Me)',
      btn_login: 'Sign In to Portal',
      btn_logging_in: 'Verifying...',
      no_account: 'Don\'t have an account?',
      link_register: 'Register an account now',
      saved_acc_title: 'SAVED ACCOUNT ON THIS DEVICE',
      saved_acc_login: '⚡ Instant Sign In',
      saved_acc_forget: 'Remove Saved Account',

      reg_title: 'Create New Santri Account',
      reg_subtitle: 'Join our digital knowledge and revision halaqah',
      lbl_fullname: 'Full Name',
      ph_fullname: 'e.g. Ahmad Fadhil',
      lbl_reg_user: 'Unique Username',
      ph_reg_user: 'Username without spaces',
      lbl_confirm_pwd: 'Confirm Password',
      ph_confirm_pwd: 'Repeat password',
      ph_reg_pwd: 'At least 6 characters',
      btn_register: 'Register Now',
      btn_registering: 'Registering...',
      have_account: 'Already have an account?',
      link_login: 'Sign in here',

      footer_desc: 'The official digital learning platform for Quran revision, study circles, and Islamic scholarship. Dedicated to Quran memorizers and seekers of knowledge worldwide.',
      footer_nav_title: 'Main Navigation',
      footer_help_title: 'Help & Documents',
      footer_privacy_link: 'Privacy Policy',
      footer_rights: 'All Rights Reserved.',
      footer_tagline: 'Modern Digital Learning Platform for Santri',

      search_placeholder: 'Search...',
      btn_save: 'Save',
      btn_cancel: 'Cancel',
      btn_close: 'Close',
      btn_delete: 'Delete',
      btn_edit: 'Edit',
      btn_download: 'Download Book',
      btn_back: 'Back',
      status_active: 'Active',
      loading: 'Loading...'
    }
  },

  getLanguage() {
    try {
      const stored = localStorage.getItem('misykah_lang');
      if (stored && ['id', 'ar', 'en'].includes(stored)) {
        return stored;
      }
    } catch (e) {}
    return 'id';
  },

  setLanguage(lang) {
    if (!['id', 'ar', 'en'].includes(lang)) lang = 'id';
    this.currentLang = lang;
    try {
      localStorage.setItem('misykah_lang', lang);
    } catch (e) {}

    // HTML lang and dir attributes
    const htmlEl = document.documentElement;
    htmlEl.lang = lang;
    if (lang === 'ar') {
      htmlEl.dir = 'rtl';
      document.body.classList.add('lang-ar');
    } else {
      htmlEl.dir = 'ltr';
      document.body.classList.remove('lang-ar');
    }

    // Apply translations across DOM
    this.applyTranslations();

    // Update switcher buttons UI
    this.updateSwitcherButtons();

    // Dispatch global event for other listeners
    try {
      window.dispatchEvent(new CustomEvent('misykah:lang_changed', { detail: { lang } }));
    } catch(e) {}
  },

  t(key, fallback = '') {
    const dict = this.translations[this.currentLang] || this.translations['id'];
    return (dict && dict[key] !== undefined) ? dict[key] : (fallback || key);
  },

  applyTranslations(root = document) {
    const dict = this.translations[this.currentLang] || this.translations['id'];
    if (!dict) return;

    // Elements with data-i18n
    const elements = root.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Elements with data-i18n-html (for formatted rich text or icons)
    const htmlElements = root.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Elements with data-i18n-placeholder
    const inputs = root.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Elements with data-i18n-title
    const titled = root.querySelectorAll('[data-i18n-title]');
    titled.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) {
        el.setAttribute('title', dict[key]);
      }
    });
  },

  updateSwitcherButtons() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(b => {
      const lang = b.getAttribute('data-lang');
      if (lang === this.currentLang) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      }
    });
  },

  renderSwitcher() {
    return `
      <div class="lang-switcher" role="group" aria-label="Pilihan Bahasa">
        <button type="button" class="lang-btn ${this.currentLang === 'id' ? 'active' : ''}" data-lang="id" onclick="MISYKAH_I18N.setLanguage('id')" title="Bahasa Indonesia">
          <span class="lang-flag">🇮🇩</span> <span class="lang-code">ID</span>
        </button>
        <button type="button" class="lang-btn ${this.currentLang === 'ar' ? 'active' : ''}" data-lang="ar" onclick="MISYKAH_I18N.setLanguage('ar')" title="العربية">
          <span class="lang-flag">🇸🇦</span> <span class="lang-code">عربي</span>
        </button>
        <button type="button" class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="MISYKAH_I18N.setLanguage('en')" title="English">
          <span class="lang-flag">🇬🇧</span> <span class="lang-code">EN</span>
        </button>
      </div>
    `;
  },

  init() {
    this.currentLang = this.getLanguage();
    this.setLanguage(this.currentLang);
  }
};

// Export to global scope
if (typeof window !== 'undefined') window.MISYKAH_I18N = MISYKAH_I18N;
if (typeof globalThis !== 'undefined') globalThis.MISYKAH_I18N = MISYKAH_I18N;

// Global helper for quick inline usage
function changeLanguage(lang) {
  MISYKAH_I18N.setLanguage(lang);
}

// Auto-initialize when document is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MISYKAH_I18N.init());
  } else {
    MISYKAH_I18N.init();
  }
}
