import { Item } from '../types';

export const mockItems: Item[] = [
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
    images: ['/images/examples/car_key.png'],
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
    images: ['/images/examples/wallet.png'],
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
    images: ['/images/examples/iphone.png'],
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
    images: ['/images/examples/airpods.png'],
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
  }
];

export default mockItems;
