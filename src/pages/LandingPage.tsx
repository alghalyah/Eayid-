import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';
import {
  Search,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  PackageCheck,
  Zap,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building2,
  MapPin,
  Calendar,
  Layers,
  FileCheck2,
  SlidersHorizontal,
  Info,
  Lock,
  HeartHandshake,
  Award,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { CATEGORIES, ORGANIZATIONS } from '../services/mockDatabase';
import { calculateTextSemanticScore } from '../services/aiMatchingEngine';
import { Item, ItemType } from '../types';

interface LandingPageProps {
  onSelectItem: (id: string) => void;
}

const SAUDI_CITIES = [
  'كافة المدن والمناطق',
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام والمنطقة الشرقية',
  'أبها وعسير'
];

const DATE_FILTERS = [
  { id: 'all', label: 'كافة الفترات' },
  { id: 'today', label: 'اليوم' },
  { id: 'week', label: 'آخر أسبوع' },
  { id: 'month', label: 'آخر شهر' }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectItem }) => {
  const {
    items,
    claims,
    isLoggedIn,
    showToast,
    setCurrentPage,
    setSelectedItemId,
    setActiveScanItem
  } = useApp();

  // Floating Filter Bar State
  const [searchTab, setSearchTab] = useState<'lost' | 'found'>('lost');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('كافة المدن والمناطق');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Grid filter chip
  const [gridCategory, setGridCategory] = useState<string>('all');
  const [gridTypeTab, setGridTypeTab] = useState<'all' | 'lost' | 'found'>('all');

  // Interactive Live AI Simulator State
  const [simLostTitle, setSimLostTitle] = useState('سماعة ايربودز ابل برو كفر كحلي');
  const [simFoundTitle, setSimFoundTitle] = useState('علبة سماعات Apple AirPods برو');

  // Calculate live dynamic score for simulator
  const simScore = Math.min(
    98,
    Math.max(
      20,
      calculateTextSemanticScore(
        { title: simLostTitle, description: simLostTitle, brand: 'Apple', color: 'أبيض', category: 'إلكترونيات وأجهزة ذكية' } as any,
        { title: simFoundTitle, description: simFoundTitle, brand: 'Apple', color: 'أبيض', category: 'إلكترونيات وأجهزة ذكية' } as any
      ).score
    )
  );

  // Filter items safely
  const filteredItems = useMemo(() => {
    return (items || []).filter((item: Item) => {
      if (!item) return false;

      // Type from grid or search tab
      if (gridTypeTab !== 'all' && item.type !== gridTypeTab) return false;

      // Category filter (chip takes priority if set, else dropdown)
      const targetCat = gridCategory !== 'all' ? gridCategory : filterCategory;
      if (targetCat !== 'all' && item.category !== targetCat) return false;

      // City filter
      if (filterCity !== 'كافة المدن والمناطق') {
        const matchCity = item.organizationName?.includes(filterCity) || 
                          item.location?.campus?.includes(filterCity);
        if (!matchCity) return false;
      }

      // Keyword query
      const query = searchKeyword.trim().toLowerCase();
      if (query) {
        const matchTitle = item.title ? item.title.toLowerCase().includes(query) : false;
        const matchDesc = item.description ? item.description.toLowerCase().includes(query) : false;
        const matchCode = item.trackingCode ? item.trackingCode.toLowerCase().includes(query) : false;
        const matchBuilding = item.location?.building ? item.location.building.toLowerCase().includes(query) : false;
        const matchOrg = item.organizationName ? item.organizationName.toLowerCase().includes(query) : false;
        if (!matchTitle && !matchDesc && !matchCode && !matchBuilding && !matchOrg) {
          return false;
        }
      }

      return true;
    });
  }, [items, gridTypeTab, gridCategory, filterCategory, filterCity, searchKeyword]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setGridTypeTab(searchTab);
    const gridEl = document.getElementById('recent-items-grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handedOverCount = (items || []).filter((i: Item) => i?.status === 'handed_over').length + 42;
  const lostCount = (items || []).filter((i: Item) => i?.type === 'lost' && i?.status === 'active').length + 18;
  const foundCount = (items || []).filter((i: Item) => i?.type === 'found' && i?.status === 'active').length + 25;

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero & Quick Filter Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-16 sm:py-20 px-4 text-white overflow-hidden"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      >
        {/* طبقة تظليل داكنة أو خضراء فوق الصورة لتوضيح الكلام الأبيض */}
        <div className="absolute inset-0 bg-emerald-950/75 backdrop-blur-[1px]"></div>

        {/* محتوى النصوص والبحث (relative z-10 ليكون فوق التظليل) */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            {/* Top Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-brand-mint shadow-md">
              <ShieldCheck className="w-4 h-4 text-brand-mint" />
              <span>منظومة عائد الذكية الموحدة</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              المنصة الوطنية للمفقودات والموجودات
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-white/85 leading-relaxed max-w-2xl mx-auto font-light">
              منظومة إلكترونية ذكية لربط وتوثيق بلاغات المفقودات وسجلات الأمانات المعتمدة في كافة الجامعات، المطارات، والمرافق العامة بالمملكة.
            </p>
          </div>

          {/* Floating Search/Filter Bar Card */}
          <div className="w-full pt-2">
            <div className="bg-white/95 backdrop-blur-md border border-white/40 rounded-3xl p-5 sm:p-6 shadow-floating text-right text-ink">
              {/* Toggle Tabs: [البحث في المفقودات] | [البحث في الموجودات] */}
              <div className="flex items-center gap-2 pb-4 border-b border-hairline-soft mb-4">
                <button
                  type="button"
                  onClick={() => setSearchTab('lost')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                    searchTab === 'lost'
                      ? 'bg-accent-red text-white shadow-md'
                      : 'bg-surface-soft text-body hover:text-ink'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>البحث في المفقودات</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchTab('found')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                    searchTab === 'found'
                      ? 'bg-brand-emerald text-white shadow-md'
                      : 'bg-surface-soft text-body hover:text-ink'
                  }`}
                >
                  <PackageCheck className="w-4 h-4 text-brand-mint" />
                  <span>البحث في الموجودات</span>
                </button>
              </div>

              {/* Input Fields Grid */}
              <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Field 1: التصنيف (Category) */}
                <div>
                  <label className="block text-[11px] font-bold text-mute mb-1">التصنيف</label>
                  <div className="relative">
                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      className="w-full bg-surface-subtle border border-hairline rounded-xl px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-brand-emerald font-medium appearance-none"
                    >
                      <option value="all">كافة التصنيفات</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-mute absolute left-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Field 2: المنطقة/المدينة (Region/City) */}
                <div>
                  <label className="block text-[11px] font-bold text-mute mb-1">المنطقة / المدينة</label>
                  <div className="relative">
                    <select
                      value={filterCity}
                      onChange={e => setFilterCity(e.target.value)}
                      className="w-full bg-surface-subtle border border-hairline rounded-xl px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-brand-emerald font-medium appearance-none"
                    >
                      {SAUDI_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <MapPin className="w-4 h-4 text-mute absolute left-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Field 3: التاريخ (Date) */}
                <div>
                  <label className="block text-[11px] font-bold text-mute mb-1">الفترة الزمنية</label>
                  <div className="relative">
                    <select
                      value={filterDate}
                      onChange={e => setFilterDate(e.target.value)}
                      className="w-full bg-surface-subtle border border-hairline rounded-xl px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-brand-emerald font-medium appearance-none"
                    >
                      {DATE_FILTERS.map(d => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </select>
                    <Calendar className="w-4 h-4 text-mute absolute left-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Field 4: كلمة مفتاحية (Keyword) & Submit */}
                <div className="flex flex-col justify-end">
                  <label className="block text-[11px] font-bold text-mute mb-1">كلمة مفتاحية</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={e => setSearchKeyword(e.target.value)}
                      placeholder="مثال: ايفون، محفظة..."
                      className="w-full bg-surface-subtle border border-hairline rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
                    />
                    <button
                      type="submit"
                      className="btn-gradient h-10 px-5 flex-shrink-0 text-xs font-bold rounded-xl"
                    >
                      <Search className="w-4 h-4" />
                      <span>بحث</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Two Quick Action CTAs (هل فقدت شيئاً؟ / هل عثرت على شيء؟) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: هل فقدت شيئاً؟ */}
          <div className="bg-surface-card border border-accent-red/20 rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-lift transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white p-1 border border-hairline shadow-sm flex items-center justify-center flex-shrink-0">
                    <img src="/AedLogo.png" alt="عائد" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-accent-red bg-accent-red-soft/50 px-2.5 py-0.5 rounded-full">
                    خدمة الإبلاغ عن مفقود
                  </span>
                </div>
                <span className="text-xs text-mute font-bold">
                  {lostCount} بلاغ نشط
                </span>
              </div>

              <h3 className="text-2xl font-bold text-ink">هل فقدت شيئاً؟</h3>
              <p className="text-sm text-body leading-relaxed">
                سجل مواصفات غرضك المفقود مع علاماتك الفارقة، وسيقوم النظام بمطابقتها مع سجلات الأمانات المعتمدة فور تسجيلها.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    showToast('info', 'تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لتتمكن من تسجيل بلاغ مفقود.');
                    setCurrentPage('login');
                    return;
                  }
                  setCurrentPage('report_lost');
                }}
                className="w-full sm:w-auto bg-accent-red hover:bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 group-hover:gap-3 transition-all"
              >
                <span>سجل بلاغ مفقود</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: هل عثرت على شيء؟ */}
          <div className="bg-surface-card border border-brand-mint/30 rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-lift transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white p-1 border border-hairline shadow-sm flex items-center justify-center flex-shrink-0">
                    <img src="/AedLogo.png" alt="عائد" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-brand-forest bg-accent-green-soft px-2.5 py-0.5 rounded-full">
                    خدمة تسجيل الموجودات
                  </span>
                </div>
                <span className="text-xs text-mute font-bold">
                  {foundCount} موجود بالأمانات
                </span>
              </div>

              <h3 className="text-2xl font-bold text-ink">هل عثرت على شيء؟</h3>
              <p className="text-sm text-body leading-relaxed">
                ساهم في حفظ الأمانات وإعادة المفقودات لأصحابها؛ سجل الغرض الذي وجدته في المجمع أو المنشأة لتسريع عملية استلامه.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    showToast('info', 'تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لتتمكن من تسجيل غرض موجود.');
                    setCurrentPage('login');
                    return;
                  }
                  setCurrentPage('report_found');
                }}
                className="w-full sm:w-auto btn-gradient font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 group-hover:gap-3 transition-all"
              >
                <span>سجل غرض موجود</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Unified Institutional Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-card border border-hairline rounded-3xl p-6 sm:p-10 shadow-card space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline-soft pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald bg-surface-soft px-3 py-1 rounded-full border border-brand-mint/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-forest" />
                <span>دورة الإجراءات الرسمية الموحدة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">
                كيف تعمل منظومة استرجاع المفقودات والأمانات؟
              </h2>
              <p className="text-xs sm:text-sm text-mute mt-1">
                إجراءات إلكترونية وميدانية موحدة ومعتمدة لضمان وصول كل مقتنى لصاحبه الشرعي بأمان وسرعة.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-mute font-bold block">متوسط زمن الاسترجاع</span>
                <span className="text-lg font-black text-brand-forest font-mono">أقل من 48 ساعة</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="bg-surface-subtle p-5 rounded-2xl border border-hairline space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald text-white font-black text-sm flex items-center justify-center shadow-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-ink">تسجيل وتوثيق البلاغ</h3>
              <p className="text-xs text-body leading-relaxed">
                إدخال مواصفات الغرض الدقيقة، العلامات السرية الفارقة، والموقع التقريبي لتوليد كود التتبع المعتمد.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-subtle p-5 rounded-2xl border border-hairline space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-forest text-white font-black text-sm flex items-center justify-center shadow-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-ink">المطابقة وفحص السجلات</h3>
              <p className="text-xs text-body leading-relaxed">
                مقارنة آلية فورية للأوصاف والعلامات المسجلة مع مئات المحفوظات في مكاتب الأمانات الشريكة.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-subtle p-5 rounded-2xl border border-hairline space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-accent-amber text-white font-black text-sm flex items-center justify-center shadow-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-ink">التحقق الأمني السري</h3>
              <p className="text-xs text-body leading-relaxed">
                مراجعة الإثباتات السرية من المشرف وتوليد رمز التحقق الرقمي الموحد (OTP) للمالك الشرعي.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-surface-subtle p-5 rounded-2xl border border-hairline space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-accent-green text-brand-forest font-black text-sm flex items-center justify-center shadow-sm">
                4
              </div>
              <h3 className="font-bold text-sm text-ink">الاستلام بسند رسمي</h3>
              <p className="text-xs text-body leading-relaxed">
                التوجه لنقطة الأمانات المحددة واستلام الغرض وتوقيع إيصال الاستلام الرقمي المعتمد قانونياً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Grid of Recent Items (بطاقات المفقودات والموجودات) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="recent-items-grid">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">أحدث المفقودات والموجودات</h2>
            <p className="text-xs sm:text-sm text-mute mt-0.5">تحديث مستمر من الأمانات وبلاغات الطلاب والمواطنين</p>
          </div>

          {/* Type Toggle Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-soft p-1 rounded-2xl border border-hairline-soft">
            <button
              onClick={() => setGridTypeTab('all')}
              className={`pill-tab ${gridTypeTab === 'all' ? 'pill-tab-active' : 'pill-tab-inactive'}`}
            >
              الكل ({(items || []).length})
            </button>
            <button
              onClick={() => setGridTypeTab('lost')}
              className={`pill-tab ${gridTypeTab === 'lost' ? 'bg-accent-red text-white shadow-sm' : 'pill-tab-inactive'}`}
            >
              المفقودات ({(items || []).filter((i: Item) => i?.type === 'lost').length})
            </button>
            <button
              onClick={() => setGridTypeTab('found')}
              className={`pill-tab ${gridTypeTab === 'found' ? 'pill-tab-active' : 'pill-tab-inactive'}`}
            >
              الموجودات ({(items || []).filter((i: Item) => i?.type === 'found').length})
            </button>
          </div>
        </div>

        {/* Filter Chips above Grid: (الكل، إلكترونيات، وثائق ومحافظ، حقائب، مفاتيح، أخرى) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setGridCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              gridCategory === 'all'
                ? 'bg-brand-emerald text-white border-brand-emerald shadow-sm'
                : 'bg-surface-card text-body hover:text-ink border-hairline hover:bg-surface-soft'
            }`}
          >
            كافة الفئات
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setGridCategory(cat.name)}
              className={`px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all border ${
                gridCategory === cat.name
                  ? 'bg-brand-emerald text-white border-brand-emerald font-bold shadow-sm'
                  : 'bg-surface-card text-body hover:text-ink border-hairline hover:bg-surface-soft'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-surface-card border border-hairline rounded-3xl text-center py-16 space-y-3 shadow-card">
            <p className="text-base font-bold text-ink">لا توجد عناصر مطابقة لخيارات البحث الحالية</p>
            <p className="text-xs text-mute max-w-md mx-auto">
              جرّب تغيير كلمات البحث أو اختيار فئة أخرى لاستعراض الأغراض المتاحة.
            </p>
            <button
              onClick={() => {
                setGridCategory('all');
                setGridTypeTab('all');
                setFilterCategory('all');
                setFilterCity('كافة المدن والمناطق');
                setSearchKeyword('');
              }}
              className="btn-secondary text-xs rounded-xl"
            >
              إلغاء كافة الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.slice(0, 8).map((item: Item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={() => setSelectedItemId(item.id)}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentPage('browse')}
            className="btn-secondary text-xs h-11 px-8 rounded-2xl shadow-card"
          >
            <span>استعراض كافة السجلات والفلترة المتقدمة</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. Interactive Saudi Map & Hotspots Explorer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="map-section">
        <div className="bg-surface-card border border-hairline rounded-3xl p-6 sm:p-10 shadow-card space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald bg-surface-soft px-3 py-1 rounded-full border border-brand-mint/30 mb-2">
                <MapPin className="w-3.5 h-3.5 text-brand-forest" />
                <span>الخريطة التفاعلية للمفقودات بالمملكة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">
                خريطة التغطية ونقاط الاستلام المعتمدة
              </h2>
              <p className="text-xs sm:text-sm text-mute mt-1">
                تغطية شاملة لأكثر من 40 موقعاً وصرحاً مؤسسياً في كبرى مدن المملكة العربية السعودية
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand-forest bg-accent-green-soft px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-brand-mint animate-ping" />
                شبكة أمانات موحدة ونشطة
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* City Hotspots Cards with Google Maps Links */}
            <div className="space-y-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=King+Saud+University+Riyadh"
                target="_blank"
                rel="noopener noreferrer"
                title="فتح موقع جامعة الملك سعود ومجمع سدايا على خرائط Google"
                className="block p-4 rounded-2xl bg-surface-subtle border border-hairline hover:border-brand-mint hover:bg-surface-soft/60 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-ink group-hover:text-brand-forest flex items-center gap-2 transition-colors">
                    <Building2 className="w-4 h-4 text-brand-emerald" />
                    <span>منطقة الرياض (جامعة الملك سعود ومجمع سدايا)</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-brand-forest">42 غرض</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone group-hover:text-brand-emerald transition-colors" />
                  </div>
                </div>
                <p className="text-xs text-mute group-hover:text-body transition-colors">
                  المكتبة المركزية، كلية الحاسب، بهو المرافق الرئيسية
                </p>
                <span className="text-[11px] text-brand-forest font-bold mt-1.5 inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-mint" />
                  <span>عرض الموقع في خرائط Google ↗</span>
                </span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=King+Khalid+International+Airport+Riyadh"
                target="_blank"
                rel="noopener noreferrer"
                title="فتح موقع مطار الملك خالد الدولي على خرائط Google"
                className="block p-4 rounded-2xl bg-surface-subtle border border-hairline hover:border-brand-mint hover:bg-surface-soft/60 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-ink group-hover:text-brand-forest flex items-center gap-2 transition-colors">
                    <Building2 className="w-4 h-4 text-brand-emerald" />
                    <span>مطار الملك خالد الدولي (الصالات الدولية 1-3)</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-brand-forest">28 غرض</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone group-hover:text-brand-emerald transition-colors" />
                  </div>
                </div>
                <p className="text-xs text-mute group-hover:text-body transition-colors">
                  صالة المغادرة، صالة الفرسان، مكاتب الجوازات والأمتعة
                </p>
                <span className="text-[11px] text-brand-forest font-bold mt-1.5 inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-mint" />
                  <span>عرض الموقع في خرائط Google ↗</span>
                </span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=King+Faisal+Specialist+Hospital+and+Research+Centre+Riyadh"
                target="_blank"
                rel="noopener noreferrer"
                title="فتح موقع مستشفى الملك فيصل التخصصي على خرائط Google"
                className="block p-4 rounded-2xl bg-surface-subtle border border-hairline hover:border-brand-mint hover:bg-surface-soft/60 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-ink group-hover:text-brand-forest flex items-center gap-2 transition-colors">
                    <Building2 className="w-4 h-4 text-brand-emerald" />
                    <span>مستشفى الملك فيصل التخصصي ومركز الأبحاث</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-brand-forest">16 غرض</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone group-hover:text-brand-emerald transition-colors" />
                  </div>
                </div>
                <p className="text-xs text-mute group-hover:text-body transition-colors">
                  العيادات الخارجية، مركز الأورام، بهو الاستقبال الرئيسي
                </p>
                <span className="text-[11px] text-brand-forest font-bold mt-1.5 inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-mint" />
                  <span>عرض الموقع في خرائط Google ↗</span>
                </span>
              </a>
            </div>

            {/* Map Visual Showcase Banner */}
            <div className="lg:col-span-2 bg-gradient-to-br from-brand-emerald via-brand-forest to-surface-dark text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden shadow-lift">
              <div className="space-y-4 relative z-10">
                <span className="text-xs font-bold text-brand-mint uppercase tracking-wider">
                  التكامل الجغرافي والربط السحابي
                </span>
                <h3 className="text-2xl font-black text-white">
                  استلم مفقوداتك من أقرب نقطة أمانات معتمدة
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg">
                  يحدد النظام تلقائياً أقرب مكتب أمانات يتبع لمنشأتك ويصدر لك تذكرة توجيهية مع كود التحقق الرقمي OTP لاستلام الغرض دون تأخير.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. "من نحن" About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about-section">
        <div className="bg-surface-subtle border border-hairline-soft rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-brand-forest uppercase tracking-wider">عن منظومة عائد</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              المنظومة الوطنية الموحدة للأمانات والمفقودات
            </h2>
            <p className="text-xs sm:text-sm text-mute">
              تم تطوير "عائد" لتكون المنظومة الرسمية الموحدة لتنظيم وتوثيق مكاتب الأمانات واسترجاع المفقودات في كبرى المنشآت والصروح بالمملكة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-card p-6 rounded-2xl border border-hairline space-y-3 shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-emerald flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-ink">توثيق وتسليم معتمد</h3>
              <p className="text-xs text-body leading-relaxed">
                سجل إلكتروني رسمي يوثق بيانات الأمانات وحالتها ويسرّع إجراءات العثور على أصحابها وتسليمها لهم وفق الأنظمة.
              </p>
            </div>

            <div className="bg-surface-card p-6 rounded-2xl border border-hairline space-y-3 shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-accent-green-soft text-brand-forest flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-ink">حماية تامة للخصوصية</h3>
              <p className="text-xs text-body leading-relaxed">
                العلامات الفارقة والوثائق الشخصية تبقى مشفرة ومحمية ولا تظهر للعامة لضمان التحقق السري العادل من الملكية.
              </p>
            </div>

            <div className="bg-surface-card p-6 rounded-2xl border border-hairline space-y-3 shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-accent-blue-soft text-accent-blue flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-ink">سندات استلام رسمية</h3>
              <p className="text-xs text-body leading-relaxed">
                إصدار سندات إلكترونية رسمية معتمدة مع باركود QR ورمز تحقق OTP لتوثيق دورة الاستلام قانونياً.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
