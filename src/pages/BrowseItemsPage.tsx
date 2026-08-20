import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Building2,
  Calendar,
  Tag,
  CheckCircle2,
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ORGANIZATIONS, CATEGORIES } from '../services/mockDatabase';
import { Item, ItemType, ItemStatus } from '../types';

export const BrowseItemsPage: React.FC = () => {
  const { items, setSelectedItemId, setCurrentPage, browseFilterType, setBrowseFilterType } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const selectedType = browseFilterType;
  const setSelectedType = (type: 'all' | ItemType) => {
    setBrowseFilterType(type);
  };

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return (items || [])
      .filter((item: Item) => {
        if (!item) return false;
        // Type filter
        if (selectedType !== 'all' && item.type !== selectedType) return false;
        // Org filter
        if (selectedOrgId !== 'all' && item.organizationId !== selectedOrgId) return false;
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        // Status filter
        if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
        // Search query
        const query = searchQuery.trim().toLowerCase();
        if (query !== '') {
          const matchTitle = item.title ? item.title.toLowerCase().includes(query) : false;
          const matchDesc = item.description ? item.description.toLowerCase().includes(query) : false;
          const matchCode = item.trackingCode ? item.trackingCode.toLowerCase().includes(query) : false;
          const matchBuilding = item.location?.building ? item.location.building.toLowerCase().includes(query) : false;
          const matchOrg = item.organizationName ? item.organizationName.toLowerCase().includes(query) : false;
          const matchBrand = item.brand ? item.brand.toLowerCase().includes(query) : false;
          if (!matchTitle && !matchDesc && !matchCode && !matchBuilding && !matchOrg && !matchBrand) {
            return false;
          }
        }
        return true;
      })
      .sort((a: Item, b: Item) => {
        const timeA = new Date(a.dateTime || '').getTime() || 0;
        const timeB = new Date(b.dateTime || '').getTime() || 0;
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [items, selectedType, selectedOrgId, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedOrgId('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'all' ||
    selectedOrgId !== 'all' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all';

  const pageTitle =
    selectedType === 'lost'
      ? 'سجل بلاغات المفقودات'
      : selectedType === 'found'
      ? 'سجل الموجودات والأمانات'
      : 'سجل المفقودات والموجودات الشامل';

  const pageSubtitle =
    selectedType === 'lost'
      ? 'استعراض وبحث في كافة البلاغات المسجلة عن مفقودات مفقودة في المنشآت'
      : selectedType === 'found'
      ? 'استعراض وبحث في كافة الأمانات والمقتنيات المحفوظة لدى مكاتب الأمانات'
      : 'تصفح وفلترة كافة البلاغات وموجودات الأمانات عبر المنشآت الشريكة';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                selectedType === 'lost'
                  ? 'bg-accent-red-soft text-accent-red border border-accent-red/30'
                  : selectedType === 'found'
                  ? 'bg-accent-green-soft text-brand-forest border border-brand-mint/30'
                  : 'bg-surface-soft text-mute border border-hairline'
              }`}
            >
              {selectedType === 'lost' ? 'المفقودات فقط' : selectedType === 'found' ? 'الموجودات فقط' : 'الكل'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">{pageTitle}</h1>
          <p className="text-xs sm:text-sm text-mute mt-1">{pageSubtitle}</p>
        </div>

        {/* Quick Report Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('report_lost')}
            className="btn-primary text-xs h-9 px-4"
          >
            + تسجيل مفقود
          </button>
          <button
            onClick={() => setCurrentPage('report_found')}
            className="btn-secondary text-xs h-9 px-4"
          >
            + تسجيل موجود
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="card-flat bg-surface-card space-y-4">
        {/* Search input and type toggle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative flex items-center bg-surface-subtle border border-hairline rounded-md px-3 py-1.5 focus-within:border-brand-emerald">
            <Search className="w-4 h-4 text-mute mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، الكود (AED-L-xxxx)، الماركة، أو المبنى..."
              className="w-full bg-transparent border-none text-xs sm:text-sm text-ink focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-mute hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-surface-soft p-1 rounded-md border border-hairline-soft">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                selectedType === 'all' ? 'bg-surface-card text-brand-emerald shadow-flat font-extrabold' : 'text-body hover:text-ink'
              }`}
            >
              الكل ({(items || []).length})
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                selectedType === 'lost' ? 'bg-accent-red text-white shadow-flat' : 'text-body hover:text-ink'
              }`}
            >
              المفقودات ({(items || []).filter((i: Item) => i?.type === 'lost').length})
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                selectedType === 'found' ? 'bg-brand-emerald text-white shadow-flat' : 'text-body hover:text-ink'
              }`}
            >
              الموجودات ({(items || []).filter((i: Item) => i?.type === 'found').length})
            </button>
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-hairline-soft text-xs">
          {/* Org Filter */}
          <div>
            <label className="block text-[11px] font-bold text-mute mb-1">المنشأة</label>
            <select
              value={selectedOrgId}
              onChange={e => setSelectedOrgId(e.target.value)}
              className="w-full bg-surface-subtle border border-hairline rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-brand-emerald"
            >
              <option value="all">كافة المنشآت والجامعات</option>
              {ORGANIZATIONS.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-mute mb-1">الفئة</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-surface-subtle border border-hairline rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-brand-emerald"
            >
              <option value="all">كافة الفئات</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-mute mb-1">الحالة</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-surface-subtle border border-hairline rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-brand-emerald"
            >
              <option value="all">كافة الحالات</option>
              <option value="active">نشط ومتاح</option>
              <option value="in_verification">قيد التحقق الأمني</option>
              <option value="claimed">تمت المطابقة</option>
              <option value="handed_over">تم التسليم بنجاح</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-mute mb-1">الترتيب</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-surface-subtle border border-hairline rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-brand-emerald"
            >
              <option value="newest">الأحدث تسجيلاً</option>
              <option value="oldest">الأقدم</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 text-xs text-mute border-t border-hairline-soft">
            <span className="font-semibold">
              تم العثور على <strong className="text-ink">{filteredItems.length}</strong> نتيجة
            </span>
            <button
              onClick={resetFilters}
              className="text-brand-forest hover:text-brand-emerald flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          </div>
        )}
      </div>

      {/* Items Results Section */}
      {filteredItems.length === 0 ? (
        <div className="card-flat bg-surface-card text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-soft mx-auto flex items-center justify-center text-mute">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-ink">لم يتم العثور على أي نتائج مطابقة</h3>
          <p className="text-xs text-mute max-w-sm mx-auto">
            جرّب توسيع نطاق البحث أو تصفير الفلاتر للعثور على ما تبحث عنه.
          </p>
          <button onClick={resetFilters} className="btn-secondary text-xs mt-2">
            إلغاء كافة الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item: Item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={() => setSelectedItemId(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
