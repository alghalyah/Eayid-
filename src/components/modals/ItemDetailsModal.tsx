import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Tag,
  ShieldCheck,
  EyeOff,
  Eye,
  Sparkles,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Share2,
  Printer,
  Trash2
} from 'lucide-react';
import { scanAndRankMatches } from '../../services/aiMatchingEngine';

interface ItemDetailsModalProps {
  onOpenClaim: (itemId: string) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ onOpenClaim }) => {
  const {
    selectedItemId,
    setSelectedItemId,
    items,
    currentUser,
    deleteItem,
    showToast
  } = useApp();

  const [showSecretStaffView, setShowSecretStaffView] = useState(false);

  if (!selectedItemId) return null;

  const item = items.find(i => i.id === selectedItemId);
  if (!item) return null;

  const isStaffOrAdmin = currentUser.role === 'staff' || currentUser.role === 'admin';
  const matches = scanAndRankMatches(item, items);
  const topMatches = matches.slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('info', 'تم نسخ الرابط', 'تم نسخ رابط الغرض للمشاركة.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-card border border-hairline rounded-lg shadow-lift w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-surface-subtle border-b border-hairline px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              item.type === 'lost' ? 'bg-accent-red text-white' : 'bg-brand-emerald text-white'
            }`}>
              {item.type === 'lost' ? 'بلاغ مفقـود' : 'غرض موجـود بالأمانات'}
            </span>
            <div>
              <span className="font-mono text-xs font-bold text-mute">{item.trackingCode}</span>
              <h2 className="text-base sm:text-lg font-bold text-ink truncate max-w-md">{item.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-md hover:bg-surface-soft text-mute hover:text-ink transition-colors"
              title="مشاركة"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedItemId(null)}
              className="p-2 rounded-md hover:bg-surface-soft text-mute hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Grid: Image Gallery & Key Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview Area */}
            <div className="space-y-2">
              <div className="w-full h-64 rounded-md overflow-hidden bg-surface-soft border border-hairline relative">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className={`w-full h-full ${item.images[0].startsWith('/images/examples') ? 'object-contain p-4 bg-white' : 'object-cover'}`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-mute bg-surface-subtle">
                    <Tag className="w-12 h-12 text-stone mb-2" />
                    <span className="text-xs font-mono">صورة غير متوفرة</span>
                  </div>
                )}
              </div>

              {item.images && item.images.length > 1 && (
                <div className="flex gap-2">
                  {item.images.map((img, idx) => (
                    <div key={idx} className="w-16 h-16 rounded border border-hairline overflow-hidden">
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Core Info Details */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-mute tracking-wider">التصنيف والعلامة التجارية</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-surface-soft text-brand-emerald font-bold text-xs px-2.5 py-1 rounded">
                    {item.category}
                  </span>
                  {item.subcategory && (
                    <span className="bg-surface-soft text-body text-xs px-2.5 py-1 rounded">
                      {item.subcategory}
                    </span>
                  )}
                  {item.brand && (
                    <span className="border border-hairline text-ink font-bold text-xs px-2.5 py-1 rounded">
                      {item.brand}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-mute tracking-wider">الموقع والمنشأة</span>
                <div className="mt-1.5 p-3 rounded-md bg-surface-soft/60 border border-hairline-soft space-y-1.5 text-xs text-body">
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <Building2 className="w-4 h-4 text-brand-forest" />
                    <span>{item.organizationName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone" />
                    <span>{item.location.building} - {item.location.floor || ''} {item.location.roomOrZone ? `(${item.location.roomOrZone})` : ''}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-surface-subtle border border-hairline-soft">
                  <span className="text-[10px] text-mute block">تاريخ التسجيل</span>
                  <span className="font-bold text-ink mt-0.5 block">{new Date(item.dateTime).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="p-2.5 rounded bg-surface-subtle border border-hairline-soft">
                  <span className="text-[10px] text-mute block">حالة الغرض</span>
                  <span className="font-bold text-brand-forest mt-0.5 block">
                    {item.status === 'active' ? 'نشط ومتاح للمطابقة' : item.status === 'in_verification' ? 'قيد التحقق الأمني' : 'تم الاستلام والتسليم'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-mute tracking-wider">الوصف العام</span>
                <p className="mt-1 text-xs text-body leading-relaxed bg-surface-card p-3 rounded border border-hairline-soft">
                  {item.description}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Security Notice Banner */}
          <div className="banner-tip-blue">
            <ShieldCheck className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-ink block mb-0.5">حماية الخصوصية وموثوقية الملكية:</span>
              <p className="text-body leading-relaxed">
                يتم إخفاء التفاصيل السرية الدقيقة ومعلومات التواصل لحماية مقتنياتك. عند تقديم طلب استلام، سيُطلب منك الإجابة عن العلامات الفارقة التي لا يعرفها إلا المالك الحقيقي.
              </p>
            </div>
          </div>

          {/* Staff-Only Secret Inspection View */}
          {isStaffOrAdmin && item.secretDetails && (
            <div className="border border-brand-mint/40 bg-surface-subtle rounded-md p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald">
                  <ShieldCheck className="w-4 h-4" />
                  <span>بيانات التحقق السرية (متاحة لمسؤولي المفقودات والأمانات فقط)</span>
                </div>
                <button
                  onClick={() => setShowSecretStaffView(!showSecretStaffView)}
                  className="text-xs text-brand-forest hover:text-brand-emerald font-semibold flex items-center gap-1"
                >
                  {showSecretStaffView ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSecretStaffView ? 'إخفاء' : 'إظهار السر'}</span>
                </button>
              </div>

              {showSecretStaffView ? (
                <p className="text-xs font-mono bg-surface-card p-3 rounded border border-hairline text-ink">
                  {item.secretDetails}
                </p>
              ) : (
                <p className="text-xs text-mute italic">•••••••••• (انقر على إظهار السر للمطابقة الميدانية)</p>
              )}
            </div>
          )}

          {/* Related Matches Section */}
          {topMatches.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-forest" />
                  <h4 className="font-bold text-sm text-ink">أبرز الأغراض المشابهة في السجلات</h4>
                </div>
                <span className="text-xs text-mute font-mono">{topMatches.length} عناصر مرشحة</span>
              </div>

              <div className="space-y-2">
                {topMatches.map((m) => {
                  const targetCandidate = item.type === 'lost' ? m.foundItem : m.lostItem;
                  if (!targetCandidate) return null;

                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-md bg-surface-soft/40 border border-hairline hover:border-brand-mint flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {targetCandidate.images?.[0] ? (
                          <img
                            src={targetCandidate.images[0]}
                            alt={targetCandidate.title}
                            className="w-12 h-12 rounded object-cover border border-hairline flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-surface-card border border-hairline flex items-center justify-center font-bold text-brand-forest text-xs">
                            {m.totalScore}%
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              m.totalScore >= 80 ? 'bg-accent-green-soft text-brand-forest' : 'bg-accent-amber-soft text-accent-amber'
                            }`}>
                              تطابق: {m.totalScore}%
                            </span>
                            <span className="text-xs font-mono text-mute">{targetCandidate.trackingCode}</span>
                          </div>
                          <p className="font-bold text-xs text-ink mt-0.5">{targetCandidate.title}</p>
                          <p className="text-[11px] text-mute">{targetCandidate.location.building}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedItemId(targetCandidate.id)}
                        className="btn-secondary text-xs h-8 px-3"
                      >
                        معاينة
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-surface-subtle border-t border-hairline px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-mute font-mono">
              رقم المرجع: {item.trackingCode}
            </span>

            {/* Delete Report Option for authorized user or reporter */}
            {(isStaffOrAdmin || currentUser?.id === item.reporter?.id) && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`هل أنت متأكد من رغبتك في حذف البلاغ (${item.trackingCode}) نهائياً؟`)) {
                    deleteItem(item.id);
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-accent-red hover:bg-accent-red-soft/40 border border-accent-red/30 flex items-center gap-1 transition-colors"
                title="حذف هذا البلاغ"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف البلاغ</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedItemId(null)}
              className="btn-secondary text-xs"
            >
              إغلاق
            </button>
            {item.status !== 'handed_over' && (
              <button
                onClick={() => {
                  setSelectedItemId(null);
                  onOpenClaim(item.id);
                }}
                className="btn-primary text-xs"
              >
                <FileCheck className="w-4 h-4" />
                <span>تقديم إثبات ملكية واستلام</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
