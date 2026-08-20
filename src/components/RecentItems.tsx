import React, { useState, useMemo } from 'react';
import { Item } from '../types';
import { ItemCard } from './ui/ItemCard';
import { CATEGORIES } from '../services/mockDatabase';
import { ChevronLeft } from 'lucide-react';

interface RecentItemsProps {
  items: Item[];
  onSelectItem: (id: string) => void;
  onViewAll?: () => void;
}

export const RecentItems: React.FC<RecentItemsProps> = ({ items = [], onSelectItem, onViewAll }) => {
  const [typeTab, setTypeTab] = useState<'all' | 'lost' | 'found'>('all');
  const [category, setCategory] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return (items || []).filter((item: Item) => {
      if (!item) return false;
      if (typeTab !== 'all' && item.type !== typeTab) return false;
      if (category !== 'all' && item.category !== category) return false;
      return true;
    });
  }, [items, typeTab, category]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="recent-items-grid">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink">أحدث المفقودات والموجودات</h2>
          <p className="text-xs sm:text-sm text-mute mt-0.5">تحديث مستمر من الأمانات وبلاغات الطلاب والمواطنين</p>
        </div>

        {/* Type Toggle Tabs */}
        <div className="flex items-center gap-1.5 bg-surface-soft p-1 rounded-2xl border border-hairline-soft">
          <button
            onClick={() => setTypeTab('all')}
            className={`pill-tab ${typeTab === 'all' ? 'pill-tab-active' : 'pill-tab-inactive'}`}
          >
            الكل ({(items || []).length})
          </button>
          <button
            onClick={() => setTypeTab('lost')}
            className={`pill-tab ${typeTab === 'lost' ? 'bg-accent-red text-white shadow-sm' : 'pill-tab-inactive'}`}
          >
            المفقودات ({(items || []).filter((i: Item) => i?.type === 'lost').length})
          </button>
          <button
            onClick={() => setTypeTab('found')}
            className={`pill-tab ${typeTab === 'found' ? 'pill-tab-active' : 'pill-tab-inactive'}`}
          >
            الموجودات ({(items || []).filter((i: Item) => i?.type === 'found').length})
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
            category === 'all'
              ? 'bg-brand-emerald text-white border-brand-emerald shadow-sm'
              : 'bg-surface-card text-body hover:text-ink border-hairline hover:bg-surface-soft'
          }`}
        >
          كافة الفئات
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.name)}
            className={`px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all border ${
              category === cat.name
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
            جرّب تغيير خيارات البحث أو استعراض فئة أخرى.
          </p>
          <button
            onClick={() => {
              setCategory('all');
              setTypeTab('all');
            }}
            className="btn-secondary text-xs rounded-xl"
          >
            إلغاء التصفية
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.slice(0, 8).map((item: Item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={() => onSelectItem(item.id)}
            />
          ))}
        </div>
      )}

      {/* View All Button */}
      {onViewAll && (
        <div className="text-center pt-4">
          <button
            onClick={onViewAll}
            className="btn-secondary text-xs h-11 px-8 rounded-2xl shadow-card"
          >
            <span>استعراض كافة السجلات والفلترة المتقدمة</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default RecentItems;
