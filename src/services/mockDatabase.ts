import { Item, Organization, CategoryDef, ClaimRequest, NotificationItem, User } from '../types';

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org_ksu',
    name: 'جامعة الملك سعود',
    nameEn: 'King Saud University',
    type: 'university',
    city: 'الرياض',
    logo: '',
    buildings: [
      { id: 'b_ksu_lib', name: 'المكتبة المركزية (مبنى 27)', floors: ['الدور الأرضي', 'الدور الأول', 'الدور الثاني', 'القبو'], zones: ['قاعة القراءة', 'مكتب الاستعارة', 'الكافتيريا', 'المصلى'] },
      { id: 'b_ksu_ccis', name: 'كلية علوم الحاسب والمعلومات (مبنى 31)', floors: ['الدور الأرضي', 'الدور الأول', 'الدور الثاني'], zones: ['معامل الحاسب', 'المدرج الرئيسي', 'بهو الكلية', 'المواقف الغربية'] },
      { id: 'b_ksu_sci', name: 'كلية العلوم (مبنى 4)', floors: ['الدور الأول', 'الدور الثاني', 'المختبرات'], zones: ['مختبر الكيمياء', 'المسرح', 'المدخل الشمالي'] },
      { id: 'b_ksu_admin', name: 'مبنى إدارة الجامعة والعمادات', floors: ['الدور الأول', 'الدور الثاني'], zones: ['صالة القبول والتسجيل', 'خدمات الطلاب'] },
      { id: 'b_ksu_park', name: 'المواقف الطلابية P4 و P7', floors: ['السطح', 'المواقف المظللة'], zones: ['بوابة 2', 'بوابة 5'] },
    ]
  },
  {
    id: 'org_kfsh',
    name: 'مستشفى الملك فيصل التخصصي ومركز الأبحاث',
    nameEn: 'KFSH&RC',
    type: 'hospital',
    city: 'الرياض',
    logo: '',
    buildings: [
      { id: 'b_kfsh_main', name: 'المبنى الرئيسي - العيادات الخارجية', floors: ['الدور الأرضي', 'الدور الأول', 'الدور الثاني'], zones: ['استقبال العيادات', 'الصيدلية الرئيسية', 'صالة الانتظار 3'] },
      { id: 'b_kfsh_emer', name: 'مبنى الطوارئ والحوادث', floors: ['الدور الأرضي'], zones: ['الفرز', 'استقبال الطوارئ', 'المدخل الإسعافي'] },
      { id: 'b_kfsh_res', name: 'مركز الأبحاث والابتكار', floors: ['الدور الأول', 'الدور الثالث'], zones: ['المدرج الطبي', 'المختبرات'] },
    ]
  },
  {
    id: 'org_kkia',
    name: 'مطار الملك خالد الدولي',
    nameEn: 'King Khalid International Airport',
    type: 'airport',
    city: 'الرياض',
    logo: '',
    buildings: [
      { id: 'b_kkia_t1', name: 'الصالة الدولية (Term 1 & 2)', floors: ['المغادرة', 'الوصول', 'منطقة التفتيش الجمركي'], zones: ['بوابة 14', 'السوق الحرة', 'استلام الأمتعة 3', 'صالة الفرسان'] },
      { id: 'b_kkia_t3', name: 'الصالة الداخلية (Term 3 & 4)', floors: ['المغادرة', 'الوصول'], zones: ['بوابات 30-38', 'كافيهات الصالة', 'منطقة الأمن', 'سير الأمتعة 6'] },
      { id: 'b_kkia_park', name: 'مواقف السيارات متعددة الأدوار', floors: ['مستوى 1', 'مستوى 2', 'مستوى 3'], zones: ['قطاع A', 'قطاع C', 'مكاتب تأجير السيارات'] },
    ]
  },
  {
    id: 'org_sdaia',
    name: 'مجمع الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)',
    nameEn: 'SDAIA Headquarters',
    type: 'government',
    city: 'الرياض',
    logo: '',
    buildings: [
      { id: 'b_sdaia_hq', name: 'المبنى الرئيسي والقيادة', floors: ['الدور الأرضي', 'الدور 1', 'الدور 2', 'الدور 3'], zones: ['قاعة المؤتمرات', 'بهو الاستقبال الذكي', 'واحة الابتكار'] },
      { id: 'b_sdaia_datacenter', name: 'مبنى مركز البيانات والحوسبة', floors: ['الدور 1', 'الدور 2'], zones: ['غرفة التحكم', 'المعامل التقنية'] },
    ]
  }
];

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'cat_electronics',
    name: 'إلكترونيات وأجهزة ذكية',
    iconName: 'Laptop',
    subcategories: ['سماعات لاسلكية', 'هواتف ذكية', 'حواسيب محمولة', 'أجهزة لوحية (iPad)', 'ساعات ذكية', 'شواحن وبنوك طاقة'],
    commonSecretClues: ['صورة خلفية الشاشة', 'نوع ولون الغطاء (الكفر)', 'خدوش أو علامات مميزة', 'الرقم التسلسلي أو الاسم المقترن بالبلوتوث']
  },
  {
    id: 'cat_cards_docs',
    name: 'بطاقات وهويات ومستندات',
    iconName: 'CreditCard',
    subcategories: ['هوية وطنية', 'رخصة قيادة', 'بطاقة جامعية / موظف', 'جواز سفر', 'بطاقة بنكية', 'ملفات ومستندات رسمية'],
    commonSecretClues: ['الاسم الكامل المدون', 'آخر 4 أرقام من الهوية/البطاقة', 'تاريخ الانتهاء أو الرقم الجامعي', 'اسم البنك المصدر']
  },
  {
    id: 'cat_bags_wallets',
    name: 'حقائب ومحافظ',
    iconName: 'Briefcase',
    subcategories: ['محفظة جلدية رجالية', 'حقيبة يد نسائية', 'حقيبة ظهر للظهر', 'حقيبة حاسوب محمول', 'حقيبة سفر صغيرة'],
    commonSecretClues: ['المحتويات الداخلية غير المرئية', 'مبلغ نقدي تقريبي أو عملات محددة', 'لون البطانة الداخلية', 'ماركة المحفظة أو نقش خاص']
  },
  {
    id: 'cat_keys',
    name: 'مفاتيح وأجهزة تحكم',
    iconName: 'Key',
    subcategories: ['مفتاح سيارة ذكي', 'حلقة مفاتيح منزل/مكتب', 'ميدالية مفاتيح', 'بطاقة دخول إلكترونية (Access Card)'],
    commonSecretClues: ['نوع ونموذج السيارة', 'شكل الميدالية ولونها', 'عدد المفاتيح في الحلقة', 'علامات أو شريط لاصق على المفتاح']
  },
  {
    id: 'cat_jewelry_watches',
    name: 'ساعات ومجوهرات وإكسسوارات',
    iconName: 'Watch',
    subcategories: ['ساعات يد فاخرة', 'نظارات شمسية', 'نظارات طبية', 'خواتم ودبل', 'سلاسل وأساور'],
    commonSecretClues: ['ماركة الإطار أو الساعة', 'درجة العدسة أو العلبة', 'حفر الاسم أو التاريخ داخل الخاتم', 'لون القرص ونوع الحزام']
  },
  {
    id: 'cat_clothing',
    name: 'ملابس ومقتنيات شخصية',
    iconName: 'Shirt',
    subcategories: ['معاطف وجاكيتات', 'شالات وعبايات', 'قبعات', 'مظلات مطر', 'أحذية رياضية'],
    commonSecretClues: ['المقاس والماركة', 'محتويات الجيوب الداخلية', 'تفاصيل التطريز أو الأزرار']
  },
  {
    id: 'cat_study_books',
    name: 'كتب ومذكرات وأدوات',
    iconName: 'BookOpen',
    subcategories: ['كتب دراسية ومناهج', 'دفاتر ملاحظات خاصة', 'أقلام فاخرة', 'أدوات هندسية ورسم'],
    commonSecretClues: ['اسم المالك المكتوب في الصفحة الأولى', 'الملاحظات المكتوبة بخط اليد', 'لون الغلاف ورقم المادة']
  }
];

/**
 * Generates item-specific Secret Verification Questions based strictly on the
 * individual item's details (Title, Brand, Model, Material, SecretDetails, Description, Tags),
 * and NEVER on its generic category.
 *
 * Core Principle:
 * Item -> Item Details -> Verification Questions
 * (What would the real owner know about this specific item that a random person looking at the listing would not know?)
 */
export function getItemVerificationQuestions(item: Partial<Item> | null | undefined): string[] {
  if (!item) {
    return [
      'صف أي علامة مميزة أو خدش فريد على الغرض لا يظهر في الصورة العامة',
      'ما هي المحتويات الداخلية أو الأرقام الخاصة التي تثبت ملكيتك؟'
    ];
  }

  const title = (item.title || '').trim();
  const subcategory = (item.subcategory || '').trim();
  const brand = (item.brand || '').trim();
  const description = (item.description || '').trim();
  const secretDetails = (item.secretDetails || '').trim();
  const tags = (item.tags || []).join(' ');

  // Physical item text analysis (strictly excluding generic category to prevent cross-pollution)
  const itemText = `${title} ${subcategory} ${brand} ${tags} ${description} ${secretDetails}`.toLowerCase();

  const questions: string[] = [];

  // Check if specific private clues are noted
  const hasScratch = /خدش|كسر|شطب|أثر|عيب|scratch|crack|dent/i.test(itemText);
  const hasEngraving = /نقش|حفر|كتابة|تاريخ|اسم|engrav|stamp|inscri/i.test(itemText);
  const hasSticker = /ستيكر|ملصق|لاصق|شعار|sticker|decal/i.test(itemText);
  const hasKeychain = /ميدالي|حمال|تعليق|سلسلة مفاتيح|keychain|fob|holder/i.test(itemText);
  const hasCardsOrMoney = /بطاق|هوي|نقد|مبلغ|ريال|فلوس|card|cash|money|id/i.test(itemText);

  // 1. EYEWEAR & SUNGLASSES (نظارات شمسية أو طبية)
  // Evaluated before general accessories/watches so "ساعات وإكسسوارات" category never misidentifies glasses!
  if (/نظار|شمسية|طبية|عدسات|glasses|sunglasses|eyewear|ray-ban|rayban|oakley|persol|gucci|tom ford/i.test(itemText)) {
    questions.push('هل يوجد أي خدش أو علامة مميزة على إحدى العدسات أو الإطار، وما موقعه الدقيق (الجهة اليمنى/اليسرى)؟');
    questions.push('ما هي الأرقام، المقاس، أو الرموز المحفورة داخل الذراع الجانبي للنظارة؟');
    questions.push('صف شكل ولون العلبة الحافظة للنظارة أو قماش المسح المرفق إن وجد.');
    return questions;
  }

  // 2. CAR KEYS & KEY FOBS (مفاتيح سيارات وريموتات)
  if (
    /مفتاح سيار|مفاتيح سيار|ريموت سيار|ريموت|key fob|car key|smart key/i.test(itemText) ||
    ((/مفتاح|مفاتيح|key/i.test(itemText)) && /تويوتا|لكزس|هيونداي|نيسان|فورد|مرسيدس|بي ام|شفروليه|كيا|هوندا|مازدا|جيلي|شانجان|toyota|lexus|hyundai|nissan|ford|mercedes|bmw|chevrolet|kia|honda|mazda/i.test(itemText))
  ) {
    questions.push('صف بالتفصيل شكل ولون الميدالية أو الحمالة المرفقة بالمفتاح (إن وجدت).');
    questions.push('هل توجد أي مفاتيح إضافية (منزل/مكتب) أو شريط لاصق أو علامات فارقة في حلقة المفتاح؟');
    questions.push('ما هي سنة صنع السيارة أو عدد أزرار الريموت التابع لهذا المفتاح؟');
    return questions;
  }

  // 3. AIRPODS & WIRELESS EARPHONES (سماعات لاسلكية وإيربودز)
  if (/airpod|airpods|سماع|earbuds|earphones|buds|headphone|headphones|galaxy buds|freebuds|beats/i.test(itemText)) {
    questions.push('ما هو اسم الجهاز عند الاقتران بالبلوتوث (Bluetooth Device Name)؟');
    questions.push('هل يوجد أي ملصق (ستيكر)، حفر اسم، أو خدش مميز على علبة الشحن أو السماعات؟');
    questions.push('صف لون ونوع غطاء الحماية (الكفر) الخارجي للعلبة أو نوع منفذ الشحن.');
    return questions;
  }

  // 4. SMARTPHONES & MOBILES (هواتف ذكية وجوالات)
  if (/iphone|ايفون|آيفون|جوال|هاتف|smartphone|galaxy s|galaxy z|redmi|xiaomi|huawei|pixel|mobile/i.test(itemText)) {
    questions.push('صف بالتفصيل صورة خلفية شاشة القفل (Lock Screen Wallpaper) الخاصة بالجهاز.');
    questions.push('هل توجد بطاقة أو ورقة أو ملصق (ستيكر) موضوع بين الجهاز وغطاء الحماية (الكفر)؟');
    questions.push('ما هي سعة التخزين للجهاز أو آخر 4 أرقام من الرقم التسلسلي (IMEI) أو شريحة الاتصال؟');
    return questions;
  }

  // 5. WALLETS & CARDHOLDERS (محافظ وحافظات بطاقات)
  if (/محفظ|محفظة|بوك|wallet|cardholder|purse/i.test(itemText)) {
    questions.push('ما هي الوثائق والبطاقات البنكية الموجودة داخل المحفظة والأسماء المكتوبة عليها؟');
    questions.push('ما هي المبالغ النقدية التقريبية أو العملات أو الأوراق الخاصة المحفوظة في الجيوب الداخلية؟');
    questions.push('صف لون البطانة الداخلية للمحفظة أو أي نقش أو علامة مميزة بالداخل.');
    return questions;
  }

  // 6. LAPTOPS & TABLETS & IPADS (أجهزة لابتوب وحواسب وأجهزة لوحية)
  if (/laptop|لابتوب|حاسوب|كمبيوتر|ipad|ايباد|آيباد|تابلت|لوحي|macbook|ماك بوك|thinkpad|dell|hp|lenovo/i.test(itemText)) {
    questions.push('ما هو اسم المستخدم (User Account) الظاهر على شاشة تسجيل الدخول للجهاز؟');
    questions.push('صف أي ملصقات (ستيكرات) أو خدوش أو علامات مميزة على الهيكل الخارجي أو حقيبة الحمل.');
    questions.push('ما هي المنافذ الخاصة أو المواصفات الدقيقة للمحول والشاحن المرفق؟');
    return questions;
  }

  // 7. WATCHES & SMARTWATCHES (ساعات يد وساعات ذكية)
  if (/ساع|watch|rolex|omega|casio|tissot|apple watch|smartwatch/i.test(itemText)) {
    questions.push('هل يوجد أي نقش، اسم، تاريخ، أو رمز محفور على الغطاء المعدني الخلفي للساعة؟');
    questions.push('ما هو نوع وخامة حزام الساعة الدقيق (جلد/معدن/سيليكون/قماش) ونوع الإبزيم؟');
    questions.push('ما هو لون الميناء الداخلي (القرص) وشكل العقارب أو العلامات المميزة؟');
    return questions;
  }

  // 8. RINGS & JEWELRY (خواتم ومجوهرات وأساور)
  if (/خاتم|دبلة|مجوهر|ذهب|فضة|ألماس|الماس|سوار|اسورة|سلسال|قلادة|عقد|حلق|ring|necklace|bracelet|jewelry|gold|silver/i.test(itemText)) {
    questions.push('هل يوجد أي نقش (اسم، تاريخ، عبارة، أو عيار المعدن) محفور داخل حلقة الخاتم أو القفل؟');
    questions.push('صف تفاصيل الفصوص أو الأحجار الكريمة أو العلامات الدقيقة في الصياغة.');
    questions.push('ما هو المقاس التقريبي للقطعة أو شكل ولون علبة الحفظ المرفقة؟');
    return questions;
  }

  // 9. BAGS, BACKPACKS & LUGGAGE (حقائب وشنط وأمتعة)
  if (/حقيب|حقيبة|شنط|شنطة|backpack|bag|suitcase|luggage/i.test(itemText)) {
    questions.push('ما هي الأغراض والمحتويات الخاصة المحفوظة في الجيوب الداخلية غير المرئية من الخارج؟');
    questions.push('ما هو لون ونقش البطانة الداخلية للحقيبة ونوع السحابات؟');
    questions.push('هل توجد بطاقة تعريفية (Tag) باسم صاحب الحقيبة أو ميدالية/شريط مميز مثبت عليها؟');
    return questions;
  }

  // 10. OFFICIAL DOCUMENTS & IDS (وثائق رسمية وهوية وبطاقات)
  if (/هوي|بطاق|جواز|رخص|وثيق|استمار|شهادة|id|passport|license|document/i.test(itemText)) {
    questions.push('ما هو الاسم الكامل أو رقم الهوية / الرقم الجامعي / السجل المدني المدون على الوثيقة؟');
    questions.push('ما هو تاريخ انتهاء الصلاحية أو تاريخ الميلاد المدون على الوثيقة؟');
    questions.push('صف شكل ولون الحافظة أو الحامل البلاستيكي المرفق بالوثيقة إن وجد.');
    return questions;
  }

  // 11. CLOTHING & JACKETS (ملابس ومعاطف)
  if (/ملابس|جاكيت|معطف|ثوب|عباية|قميص|فستان|jacket|coat|shirt|dress/i.test(itemText)) {
    questions.push('ما هو المقاس الدقيق للقطعة (Size) والعلامة التجارية المدونة على الملصق الداخلي؟');
    questions.push('ما هي المحتويات الخاصة المحفوظة داخل الجيوب إن وجدت؟');
    questions.push('هل يوجد أي تعديل في الخياطة، نقش، أو تطريز مميز على القماش؟');
    return questions;
  }

  // 12. BOOKS & NOTEBOOKS (كتب ودفاتر ومذكرات)
  if (/كتاب|دفتر|مذكر|ملف|ملازم|book|notebook|folder/i.test(itemText)) {
    questions.push('ما هو الاسم أو الإهداء أو الملاحظات المكتوبة على الصفحة الأولى من الداخل؟');
    questions.push('ما هي الأوراق أو الفواصل أو البطاقات المحفوظة بين الصفحات؟');
    questions.push('صف أي علامات أو خطوط بالقلم أو ملصقات على الهامش الداخلي.');
    return questions;
  }

  // 13. DYNAMIC ITEM-SPECIFIC ADAPTATION (Any other specific item)
  if (hasScratch) {
    questions.push('صف موقع ونوع الخدش أو الأثر الفارغ على هذا الغرض بالتفصيل.');
  }
  if (hasEngraving) {
    questions.push('ما هو النص أو التاريخ أو الرمز المحفور على هذا الغرض وما موقعه الدقيق؟');
  }
  if (hasSticker) {
    questions.push('صف شكل ولون ومحتوى الملصق (الستيكر) الموجود على الغرض.');
  }
  if (hasKeychain) {
    questions.push('صف شكل ولون الميدالية أو الملحق المرفق بالغرض بالتفصيل.');
  }
  if (hasCardsOrMoney) {
    questions.push('ما هي الوثائق أو المحتويات الداخلية المحفوظة داخل هذا الغرض؟');
  }

  // Fallback defaults tailored to the item's title
  if (questions.length === 0) {
    questions.push(`صف أي علامة فارقة، خدش، أو علامة مميزة في "${title || 'هذا الغرض'}" لا تظهر في الصورة العامة.`);
    questions.push('ما هي المحتويات الداخلية أو الأرقام التسلسلية الخاصة بهذا الغرض؟');
    questions.push('صف أي ملحقات أو علبة حفظ خاصة ترافق هذا الغرض.');
  } else if (questions.length === 1) {
    questions.push(`صف أي تفاصيل أو أرقام تسلسلية خاصة بـ "${title || 'هذا الغرض'}" تثبت ملكيتك.`);
    questions.push('صف شكل ولون علبة الحفظ أو الملحقات الإضافية المرفقة.');
  } else if (questions.length === 2) {
    questions.push(`صف أي تفاصيل دقيقة أو ملحقات إضافية خاصة بـ "${title || 'هذا الغرض'}".`);
  }

  return questions.slice(0, 3);
}

export const MOCK_USERS: User[] = [
  {
    id: 'usr_default',
    name: 'المستخدم',
    email: 'user@aed.sa',
    phone: '0501234567',
    role: 'user',
    organizationId: 'org_ksu',
    organizationName: 'المنظومة الموحدة للمفقودات'
  }
];

export const INITIAL_ITEMS: Item[] = [
  // Example 1: Toyota Fortuner Car Key (Found)
  {
    id: 'item_found_toyota_1',
    trackingCode: 'AED-F-5011',
    type: 'found',
    title: 'مفتاح سيارة تويوتا فورتشنر',
    description: 'مفتاح ريموت أسود عُثر عليه بالقرب من مواقف بوابة 5 بجامعة الملك سعود.',
    category: 'مفاتيح وأجهزة تحكم',
    subcategory: 'مفتاح سيارة ذكي',
    brand: 'Toyota',
    color: 'أسود',
    secretDetails: 'المفتاح به حلقة فضية وشعار تويوتا واضح من الخلف.',
    images: [
      '/images/examples/car_key.png'
    ],
    organizationId: 'org_ksu',
    organizationName: 'جامعة الملك سعود - الرياض',
    location: {
      campus: 'جامعة الملك سعود - الرياض',
      building: 'مواقف بوابة 5 الطلابية',
      floor: 'الدور الأرضي',
      roomOrZone: 'المدخل الخارجي'
    },
    dateTime: '2026-08-19T09:30:00Z',
    reporter: {
      id: 'usr_staff_ksu',
      name: 'إدارة الأمن والسلامة (جامعة الملك سعود)',
      phone: '0501112233'
    },
    status: 'active',
    createdAt: '2026-08-19T09:45:00Z',
    updatedAt: '2026-08-19T09:45:00Z',
    tags: ['تويوتا', 'فورتشنر', 'مفتاح', 'سيارة', 'الرياض']
  },

  // Example 2: Brown Leather Wallet (Lost)
  {
    id: 'item_lost_wallet_1',
    trackingCode: 'AED-L-2012',
    type: 'lost',
    title: 'محفظة جلدية بنية',
    description: 'محفظة رجالية مفقودة تحتوي على بطاقة أحوال ورخصة قيادة باسم خالد.',
    category: 'حقائب ومحافظ',
    subcategory: 'محفظة جلدية رجالية',
    brand: 'جلد طبيعي',
    color: 'بني',
    secretDetails: 'تحتوي على بطاقة مدى وبطاقة أحوال باسم خالد ورخصة قيادة ومبلغ نقدي.',
    images: [
      '/images/examples/wallet.png'
    ],
    organizationId: 'org_kf',
    organizationName: 'طريق الملك فهد - الرياض',
    location: {
      campus: 'طريق الملك فهد - الرياض',
      building: 'المبنى التجاري',
      floor: 'الدور الأرضي',
      roomOrZone: 'المواقف الشمالية'
    },
    dateTime: '2026-08-19T08:15:00Z',
    reporter: {
      id: 'usr_normal_khaled',
      name: 'خالد إبراهيم',
      phone: '0505554433'
    },
    status: 'active',
    createdAt: '2026-08-19T08:30:00Z',
    updatedAt: '2026-08-19T08:30:00Z',
    tags: ['محفظة', 'جلد', 'خالد', 'رخصة', 'أحوال']
  },

  // Example 3: Black iPhone 13 (Lost)
  {
    id: 'item_lost_iphone_1',
    trackingCode: 'AED-L-2013',
    type: 'lost',
    title: 'آيفون 13 أسود',
    description: 'جوال مفقود بشاشة مكسورة قليلاً وغلاف حماية أسود.',
    category: 'إلكترونيات وأجهزة ذكية',
    subcategory: 'هواتف ذكية',
    brand: 'Apple',
    color: 'أسود',
    secretDetails: 'يوجد كسر خفيف في الزاوية العلوية اليمنى للشاشة، وكود القفل مكون من 6 أرقام.',
    images: [
      '/images/examples/iphone.png'
    ],
    organizationId: 'org_rpark',
    organizationName: 'مول الرياض بارك',
    location: {
      campus: 'مول الرياض بارك',
      building: 'بوابة 2',
      floor: 'الدور الأول',
      roomOrZone: 'صالة المطاعم'
    },
    dateTime: '2026-08-18T19:00:00Z',
    reporter: {
      id: 'usr_normal_sara',
      name: 'سارة بنت عبدالعزيز',
      phone: '0554433221'
    },
    status: 'active',
    createdAt: '2026-08-18T19:30:00Z',
    updatedAt: '2026-08-18T19:30:00Z',
    tags: ['ايفون', 'ايفون 13', 'ابل', 'جوال', 'الرياض بارك']
  },

  // Example 4: White AirPods Pro in case (Found)
  {
    id: 'item_found_airpods_1',
    trackingCode: 'AED-F-5014',
    type: 'found',
    title: 'سماعات إيربودز (AirPods Pro)',
    description: 'سماعات داخل علبتها البيضاء عُثر عليها في منطقة المطاعم.',
    category: 'إلكترونيات وأجهزة ذكية',
    subcategory: 'سماعات لاسلكية',
    brand: 'Apple',
    color: 'أبيض',
    secretDetails: 'علبة السماعة بيضاء وبداخلها كلا السماعتين وتعمل بصورة ممتازة.',
    images: [
      '/images/examples/airpods.png'
    ],
    organizationId: 'org_bg',
    organizationName: 'بوم الغبار - الرياض',
    location: {
      campus: 'بوم الغبار - الرياض',
      building: 'منطقة المطاعم',
      floor: 'الدور الأول',
      roomOrZone: 'جلسات العوائل'
    },
    dateTime: '2026-08-18T20:30:00Z',
    reporter: {
      id: 'usr_staff_bg2',
      name: 'مشرف الصالة - بوم الغبار',
      phone: '0509988776'
    },
    status: 'active',
    createdAt: '2026-08-18T21:00:00Z',
    updatedAt: '2026-08-18T21:00:00Z',
    tags: ['ايربودز', 'سماعات', 'ابل', 'AirPods', 'بوم الغبار']
  },

  // Pair 2: MacBook Pro Space Grey (Matching Score ~94%)
  {
    id: 'item_lost_02',
    trackingCode: 'AED-L-2402',
    type: 'lost',
    title: 'لابتوب MacBook Pro M3 رمادي فلكي 14 إنش',
    category: 'إلكترونيات وأجهزة ذكية',
    subcategory: 'حواسيب محمولة',
    brand: 'Apple',
    color: 'رمادي فلكي (Space Grey)',
    description: 'نسيت جهازي الماك بوك برو 14 بوصة في معمل الذكاء الاصطناعي بكلية الحاسب بعد انتهاء المحاضرة.',
    secretDetails: 'يوجد ملصق صغير بشعار Python و Linux على يسار التراك باد، وخلفية الشاشة صورة جبال العلا.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
    ],
    organizationId: 'org_ksu',
    organizationName: 'جامعة الملك سعود',
    location: {
      campus: 'الدرعية - المقر الرئيسي',
      building: 'كلية علوم الحاسب والمعلومات (مبنى 31)',
      floor: 'الدور الأول',
      roomOrZone: 'معمل الذكاء الاصطناعي (Lab 104)'
    },
    dateTime: '2026-08-17T14:00:00Z',
    reporter: {
      id: 'usr_normal_2',
      name: 'فيصل المنصور',
      phone: '0562345678',
      email: 'faisal.almansour@ksu.edu.sa'
    },
    status: 'active',
    createdAt: '2026-08-17T15:00:00Z',
    updatedAt: '2026-08-17T15:00:00Z'
  },
  {
    id: 'item_found_02',
    trackingCode: 'AED-F-3903',
    type: 'found',
    title: 'جهاز حاسب محمول Apple MacBook Pro في معمل الحاسب',
    category: 'إلكترونيات وأجهزة ذكية',
    subcategory: 'حواسيب محمولة',
    brand: 'Apple',
    color: 'رمادي',
    description: 'تم تسليم لابتوب ماك بوك رمادي اللون وجد في معمل حاسب 104 بعد خروج الطلاب وتم حفظه بالأمانات.',
    secretDetails: 'الجهاز مقفل بكلمة مرور، ويوجد ستيكرات برمجية على الهيكل.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
    ],
    organizationId: 'org_ksu',
    organizationName: 'جامعة الملك سعود',
    location: {
      campus: 'الدرعية - المقر الرئيسي',
      building: 'كلية علوم الحاسب والمعلومات (مبنى 31)',
      floor: 'الدور الأول',
      roomOrZone: 'معمل 104'
    },
    dateTime: '2026-08-17T14:45:00Z',
    reporter: {
      id: 'usr_staff_1',
      name: 'مشرف معامل كلية الحاسب',
      phone: '0114675555'
    },
    status: 'active',
    createdAt: '2026-08-17T15:30:00Z',
    updatedAt: '2026-08-17T15:30:00Z'
  },

  // Pair 3: National ID & Wallet in KKIA Airport (Matching Score ~92%)
  {
    id: 'item_lost_03',
    trackingCode: 'AED-L-2403',
    type: 'lost',
    title: 'محفظة جلدية بنية تحتوي على هوية وطنية وبطاقات بنكية',
    category: 'حقائب ومحافظ',
    subcategory: 'محفظة جلدية رجالية',
    brand: 'Montblanc',
    color: 'بني داكن',
    description: 'فقدت محفظتي الجلدية ماركة مون بلان أثناء إجراءات التفتيش الأمني قبل ركوب الطائرة في صالة 3.',
    secretDetails: 'تحتوي على بطاقة هوية باسم "خالد إبراهيم الدوسري"، وبطاقة مدى بنك الراجحي، ومبلغ 450 ريال.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80'
    ],
    organizationId: 'org_kkia',
    organizationName: 'مطار الملك خالد الدولي',
    location: {
      campus: 'مطار الملك خالد الدولي',
      building: 'الصالة الداخلية (Term 3 & 4)',
      floor: 'المغادرة',
      roomOrZone: 'منطقة التفتيش الأمني - مسار 4'
    },
    dateTime: '2026-08-19T06:00:00Z',
    reporter: {
      id: 'usr_normal_3',
      name: 'خالد إبراهيم الدوسري',
      phone: '0533344556',
      email: 'khaled.dossari@gmail.com'
    },
    status: 'active',
    createdAt: '2026-08-19T07:00:00Z',
    updatedAt: '2026-08-19T07:00:00Z'
  },
  {
    id: 'item_found_03',
    trackingCode: 'AED-F-3904',
    type: 'found',
    title: 'عثر على محفظة رجالية فاخرة بها وثائق شخصية في نقطة التفتيش',
    category: 'حقائب ومحافظ',
    subcategory: 'محفظة جلدية رجالية',
    brand: 'Montblanc',
    color: 'بني',
    description: 'تم العثور على محفظة جلدية ماركة معروفة عند أجهزة فحص الأمتعة اليدوية بصالة المغادرة الداخلية.',
    secretDetails: 'الهوية الوطنية بالداخل تنتهي برقم 7721، مع بطاقات بنكية ونقد.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80'
    ],
    organizationId: 'org_kkia',
    organizationName: 'مطار الملك خالد الدولي',
    location: {
      campus: 'مطار الملك خالد الدولي',
      building: 'الصالة الداخلية (Term 3 & 4)',
      floor: 'المغادرة',
      roomOrZone: 'منطقة الأمن والتفتيش'
    },
    dateTime: '2026-08-19T06:30:00Z',
    reporter: {
      id: 'usr_staff_kkia',
      name: 'مكتب مفقودات الصالة الداخلية KKIA',
      phone: '920020090'
    },
    status: 'active',
    createdAt: '2026-08-19T07:15:00Z',
    updatedAt: '2026-08-19T07:15:00Z'
  },

  // Other Diverse Items
  {
    id: 'item_lost_05',
    trackingCode: 'AED-L-2405',
    type: 'lost',
    title: 'نظارة شمسية Ray-Ban إطار ذهبي وعدسات خضراء',
    category: 'ساعات ومجوهرات وإكسسوارات',
    subcategory: 'نظارات شمسية',
    brand: 'Ray-Ban',
    color: 'ذهبي / أخضر',
    description: 'فقدت نظارتي الشمسية ريبان كلاسيك في كافتيريا كلية العلوم أثناء وقت الغداء.',
    secretDetails: 'العدسة اليسرى بها خدش خفيف جدا في الزاوية العلوية، والعلبة جلدية بنية بأزرار ذهبية.',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
    ],
    organizationId: 'org_ksu',
    organizationName: 'جامعة الملك سعود',
    location: {
      campus: 'الدرعية - المقر الرئيسي',
      building: 'كلية العلوم (مبنى 4)',
      floor: 'الدور الأول',
      roomOrZone: 'كافتيريا الكلية'
    },
    dateTime: '2026-08-16T12:30:00Z',
    reporter: {
      id: 'usr_normal_5',
      name: 'طارق الزهراني',
      phone: '0598877665'
    },
    status: 'active',
    createdAt: '2026-08-16T13:00:00Z',
    updatedAt: '2026-08-16T13:00:00Z'
  },
  {
    id: 'item_found_05',
    trackingCode: 'AED-F-3906',
    type: 'found',
    title: 'نظارة شمسية ماركة أصلية بإطار معدني داخل علبتها',
    category: 'ساعات ومجوهرات وإكسسوارات',
    subcategory: 'نظارات شمسية',
    brand: 'Ray-Ban',
    color: 'ذهبي',
    description: 'تم تسليم نظارة شمسية تركت على إحدى طاولات مطعم كلية العلوم.',
    secretDetails: 'العلبة البنية تحتوي على منديل تنظيف أصلي مطبوع عليه شعار الماركة.',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
    ],
    organizationId: 'org_ksu',
    organizationName: 'جامعة الملك سعود',
    location: {
      campus: 'الدرعية - المقر الرئيسي',
      building: 'كلية العلوم (مبنى 4)',
      floor: 'الدور الأول',
      roomOrZone: 'مطعم الكلية'
    },
    dateTime: '2026-08-16T13:10:00Z',
    reporter: {
      id: 'usr_staff_1',
      name: 'قسم النظافة والأمانات'
    },
    status: 'active',
    createdAt: '2026-08-16T14:00:00Z',
    updatedAt: '2026-08-16T14:00:00Z'
  },
  {
    id: 'item_lost_06',
    trackingCode: 'AED-L-2406',
    type: 'lost',
    title: 'ساعة يد Apple Watch Ultra 2 بحزام برتقالي',
    category: 'إلكترونيات وأجهزة ذكية',
    subcategory: 'ساعات ذكية',
    brand: 'Apple',
    color: 'تيتانيوم طبيعي / برتقالي',
    description: 'فقدت ساعة أبل الترا في صالة الألعاب الرياضية والمسابح بمركز سدايا.',
    secretDetails: 'الحزام قماشي برتقالي (Alpine Loop)، وقفل الشاشة يتطلب رمز مرور 6 أرقام.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    ],
    organizationId: 'org_sdaia',
    organizationName: 'الهيئة السعودية للبيانات والذكاء الاصطناعي',
    location: {
      campus: 'مجمع سدايا',
      building: 'المبنى الرئيسي والقيادة',
      floor: 'القبو B1',
      roomOrZone: 'النادي الرياضي - خزائن الملابس'
    },
    dateTime: '2026-08-19T08:00:00Z',
    reporter: {
      id: 'usr_reporter_6',
      name: 'صاحب البلاغ'
    },
    status: 'active',
    createdAt: '2026-08-19T08:30:00Z',
    updatedAt: '2026-08-19T08:30:00Z'
  },
  {
    id: 'item_found_06',
    trackingCode: 'AED-F-3907',
    type: 'found',
    title: 'ساعة ذكية رياضية تيتانيوم بحزام ملون',
    category: 'إلكترونيات وأجهزة ذكية',
    subcategory: 'ساعات ذكية',
    brand: 'Apple',
    color: 'فضي / برتقالي',
    description: 'تم العثور على ساعة ذكية حديثة بالقرب من دواليب النادي الرياضي في مقر الهيئة.',
    secretDetails: 'الساعة مغلقة بنمط حماية والرقم التسلسلي مدون في سجل الأمانات.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    ],
    organizationId: 'org_sdaia',
    organizationName: 'الهيئة السعودية للبيانات والذكاء الاصطناعي',
    location: {
      campus: 'مجمع سدايا',
      building: 'المبنى الرئيسي والقيادة',
      floor: 'القبو B1',
      roomOrZone: 'صالة اللياقة البدنية'
    },
    dateTime: '2026-08-19T08:45:00Z',
    reporter: {
      id: 'usr_staff_sdaia',
      name: 'إدارة الأمن والسلامة'
    },
    status: 'active',
    createdAt: '2026-08-19T09:10:00Z',
    updatedAt: '2026-08-19T09:10:00Z'
  },
  {
    id: 'item_claimed_01',
    trackingCode: 'AED-F-3110',
    type: 'found',
    title: 'محفظة رسمية مسترجعة تم تسليمها لمالكها',
    category: 'حقائب ومحافظ',
    subcategory: 'محفظة جلدية رجالية',
    color: 'بني داكن',
    description: 'تم استرجاعها وتسليمها لصاحبها بعد التحقق الكامل من الهوية والإثباتات الرسمية.',
    images: [
      '/images/examples/wallet.png'
    ],
    organizationId: 'org_kkia',
    organizationName: 'مطار الملك خالد الدولي',
    location: {
      campus: 'مطار الملك خالد الدولي',
      building: 'الصالة الداخلية (Term 3 & 4)',
      floor: 'المغادرة',
      roomOrZone: 'مكتب الأمانات الرئيسي'
    },
    dateTime: '2026-08-15T18:00:00Z',
    reporter: {
      id: 'usr_staff_kkia',
      name: 'مكتب أمانات الصالة الداخلية'
    },
    status: 'handed_over',
    createdAt: '2026-08-15T18:30:00Z',
    updatedAt: '2026-08-16T10:00:00Z'
  }
];

export const INITIAL_CLAIMS: ClaimRequest[] = [
  {
    id: 'claim_001',
    trackingNumber: 'CLM-2026-882',
    itemId: 'item_found_01',
    itemTitle: 'علبة سماعات Apple AirPods داخل غطاء كحلي',
    itemType: 'found',
    claimantId: 'usr_normal_1',
    claimantName: 'عبدالرحمن السالم',
    claimantPhone: '0501234567',
    claimantEmail: 'abdulrahman.salem@student.ksu.edu.sa',
    organizationId: 'org_ksu',
    secretProofNotes: 'السماعة بها استيكر صغير لشعار الهلال من الخلف، واسم البلوتوث الخاص بها هو Rahman\'s AirPods، والعلبة شحنتها 65% تقريبا.',
    answers: [
      { question: 'ما هو لون ونوع كفر الحماية للسماعة؟', userAnswer: 'سيليكون كحلي غامق', isCorrect: true },
      { question: 'هل يوجد أي ملصق أو علامة فارقة على العلبة؟', userAnswer: 'نعم ستيكر شعار نادي الهلال صغير بالخلف', isCorrect: true },
      { question: 'ما هو اسم الجهاز عند الاقتران بالبلوتوث؟', userAnswer: 'Rahman\'s AirPods', isCorrect: true }
    ],
    status: 'reviewing',
    createdAt: '2026-08-18T12:00:00Z'
  },
  {
    id: 'claim_002',
    trackingNumber: 'CLM-2026-791',
    itemId: 'item_claimed_01',
    itemTitle: 'محفظة رسمية مسترجعة تم تسليمها لمالكها',
    itemType: 'found',
    claimantId: 'usr_vip_9',
    claimantName: 'خالد إبراهيم الدوسري',
    claimantPhone: '0533344556',
    claimantEmail: 'khaled.dossari@gmail.com',
    organizationId: 'org_kkia',
    secretProofNotes: 'المحفظة بها بطاقة أحوال ورخصة قيادة وبطاقة مدى بنك الراجحي.',
    answers: [
      { question: 'ما هو نوع ولون المحفظة؟', userAnswer: 'جلد طبيعي بني داكن', isCorrect: true },
      { question: 'ما هي الوثائق المرفقة داخل المحفظة؟', userAnswer: 'بطاقة هوية ورخصة وبطاقة مدى باسم خالد', isCorrect: true }
    ],
    status: 'handed_over',
    reviewNotes: 'تمت مطابقة الهوية ومطابقة الوجه وتوقيع إيصال الاستلام الرسمي.',
    reviewedBy: 'مكتب الأمانات المركزي',
    reviewedAt: '2026-08-16T10:00:00Z',
    handoverOtp: '849201',
    handoverReceipt: {
      receiptNumber: 'RCP-2026-00492',
      handedOverAt: '2026-08-16T10:00:00Z',
      officerName: 'مكتب الأمانات المعتمد',
      idNumberVerified: '1088992233',
      pickupLocation: 'مكتب الأمانات الرئيسي - مطار الملك خالد صالة 1'
    },
    createdAt: '2026-08-15T19:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

/**
 * Storage Helpers for Persistence across sessions
 */
export const STORAGE_KEYS = {
  ITEMS: 'aed_db_items_v9',
  CLAIMS: 'aed_db_claims_v9',
  NOTIFS: 'aed_db_notifs_v9',
  CURRENT_USER: 'aed_current_user_v9',
  LOGGED_IN: 'aed_logged_in_v9'
};

export function loadItemsFromStorage(): Item[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load items from storage:', e);
  }
  return INITIAL_ITEMS;
}

export function saveItemsToStorage(items: Item[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to storage:', e);
  }
}

export function loadClaimsFromStorage(): ClaimRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load claims:', e);
  }
  return INITIAL_CLAIMS;
}

export function saveClaimsToStorage(claims: ClaimRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  } catch (e) {
    console.error('Failed to save claims:', e);
  }
}

export function loadNotificationsFromStorage(): NotificationItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load notifications:', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveNotificationsToStorage(notifs: NotificationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}
