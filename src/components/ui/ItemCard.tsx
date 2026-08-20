import React from 'react';
import { Item } from '../../types';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  PackageCheck,
  ChevronLeft,
  Building2,
  Tag,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  matchScore?: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect, matchScore }) => {
  if (!item) return null;

  const isLost = item.type === 'lost';

  const getStatusBadge = () => {
    switch (item.status) {
      case 'handed_over':
        return (
          <span className="bg-accent-green-soft text-brand-forest border border-accent-green/30 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-flat">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تم الاستلام
          </span>
        );
      case 'claimed':
        return (
          <span className="bg-brand-100 text-brand-forest border border-brand-mint/40 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-flat">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تمت المطابقة
          </span>
        );
      case 'in_verification':
        return (
          <span className="bg-accent-amber-soft text-accent-amber border border-accent-amber/40 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-flat">
            <Clock className="w-3.5 h-3.5" />
            قيد التحقق
          </span>
        );
      default:
        return (
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-flat flex items-center gap-1.5 ${
            isLost
              ? 'bg-accent-red-soft text-accent-red border border-accent-red/20'
              : 'bg-surface-soft text-brand-forest border border-brand-mint/30'
          }`}>
            {isLost ? <HelpCircle className="w-3 h-3" /> : <PackageCheck className="w-3 h-3 text-brand-forest" />}
            <span>{isLost ? 'مفقود' : 'تم العثور عليه'}</span>
          </span>
        );
    }
  };

  const formattedDate = item.dateTime ? new Date(item.dateTime).toLocaleDateString('ar-SA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'اليوم';

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-surface-card border border-hairline hover:border-brand-mint/60 rounded-2xl p-4 shadow-card hover:shadow-lift transition-all duration-200 cursor-pointer flex flex-col justify-between group h-full relative"
    >
      <div>
        {/* Top Image / Media Area */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface-soft border border-hairline-soft mb-3.5">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title || 'غرض'}
              className={`w-full h-full ${item.images[0].startsWith('/images/examples') ? 'object-contain p-3 bg-white' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-mute bg-surface-subtle">
              <Tag className="w-8 h-8 text-stone mb-1.5" />
              <span className="text-xs font-semibold">{item.category || 'عام'}</span>
            </div>
          )}

          {/* Type Badge on image */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-xl text-xs font-black shadow-md ${
              isLost
                ? 'bg-accent-red text-white'
                : 'bg-brand-emerald text-white'
            }`}>
              {isLost ? 'مفقـود' : 'موجـود'}
            </span>
          </div>

          {/* Verification Score Badge if applicable */}
          {matchScore !== undefined && matchScore > 0 && (
            <div className="absolute bottom-3 left-3 bg-surface-card/95 backdrop-blur border border-hairline rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-forest" />
              <span className="text-xs font-extrabold text-brand-emerald">{matchScore}% تطابق</span>
            </div>
          )}
        </div>

        {/* Tracking Code & Category */}
        <div className="flex items-center justify-between text-xs text-mute mb-2">
          <span className="font-mono text-[11px] bg-surface-soft px-2 py-0.5 rounded-md text-body">
            {item.trackingCode || ''}
          </span>
          <span className="text-[11px] font-semibold text-brand-forest">
            {item.category || ''}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-ink line-clamp-1 group-hover:text-brand-emerald transition-colors">
          {item.title || 'بدون عنوان'}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-body line-clamp-2 mt-1.5 leading-relaxed">
          {item.description || ''}
        </p>
      </div>

      {/* Location, Date & Status Row */}
      <div className="mt-4 pt-3 border-t border-hairline-soft space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs text-mute font-medium truncate">
          <MapPin className="w-3.5 h-3.5 text-brand-forest flex-shrink-0" />
          <span className="truncate">{item.organizationName || ''} • {item.location?.building || 'المبنى الرئيسي'}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-stone">
          <div className="flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-stone" />
            <span>{formattedDate}</span>
          </div>

          <div>{getStatusBadge()}</div>
        </div>
      </div>
    </div>
  );
};
