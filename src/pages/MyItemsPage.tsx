import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';
import {
  Package,
  FileCheck2,
  Clock,
  CheckCircle2,
  PlusCircle,
  QrCode,
  Printer,
  ChevronLeft,
  Trash2
} from 'lucide-react';
import { HandoverReceiptModal } from '../components/modals/HandoverReceiptModal';
import { ClaimRequest, Item } from '../types';

export const MyItemsPage: React.FC = () => {
  const {
    items,
    claims,
    currentUser,
    setSelectedItemId,
    setCurrentPage,
    deleteItem
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'claims'>('reports');
  const [selectedReceiptClaim, setSelectedReceiptClaim] = useState<ClaimRequest | null>(null);

  // User's own items
  const myItems = items.filter(
    (i: Item) => i.reporter.id === currentUser.id || i.reporter.email === currentUser.email
  );

  // User's own claims
  const myClaims = claims.filter(
    (c: ClaimRequest) => c.claimantId === currentUser.id || c.claimantEmail === currentUser.email
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">سجل بلاغاتي ومطالباتي</h1>
          <p className="text-xs sm:text-sm text-mute mt-1">
            متابعة حالة بلاغاتك المسجلة ورموز استلام الأمانات (OTP)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('report_lost')}
            className="btn-primary text-xs h-9 px-4"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل بلاغ مفقود جديد</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-hairline pb-3">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-brand-emerald text-white shadow-flat'
              : 'bg-surface-soft text-body hover:text-ink'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>البلاغات التي سجلتها ({myItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
            activeTab === 'claims'
              ? 'bg-brand-emerald text-white shadow-flat'
              : 'bg-surface-soft text-body hover:text-ink'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>طلبات إثبات الملكية والاستلام ({myClaims.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'reports' ? (
        myItems.length === 0 ? (
          <div className="card-flat bg-surface-card text-center py-16 space-y-3">
            <Package className="w-12 h-12 text-stone mx-auto" />
            <h3 className="font-bold text-base text-ink">لم تقم بتسجيل أي بلاغات مفقودات بعد</h3>
            <p className="text-xs text-mute max-w-sm mx-auto">
              إذا فقدت غرضاً في الجامعة أو المطار، يمكنك تسجيل بلاغ فوري لربطه بنظام الذكاء الاصطناعي.
            </p>
            <button
              onClick={() => setCurrentPage('report_lost')}
              className="btn-primary text-xs mt-2"
            >
              سجل مفقود الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {myItems.map((item: Item) => (
              <div key={item.id} className="flex flex-col space-y-2">
                <ItemCard
                  item={item}
                  onSelect={() => setSelectedItemId(item.id)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`هل أنت متأكد من رغبتك في حذف هذا البلاغ (${item.trackingCode})؟`)) {
                      deleteItem(item.id);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-accent-red hover:bg-accent-red-soft/40 border border-accent-red/30 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف هذا البلاغ</span>
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        myClaims.length === 0 ? (
          <div className="card-flat bg-surface-card text-center py-16 space-y-3">
            <FileCheck2 className="w-12 h-12 text-stone mx-auto" />
            <h3 className="font-bold text-base text-ink">لا توجد طلبات استلام مرفوعة</h3>
            <p className="text-xs text-mute max-w-sm mx-auto">
              عند العثور على غرضك في سجل الموجودات، يمكنك رفع طلب إثبات ملكية من صفحة تفاصيل الغرض.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myClaims.map((claim: ClaimRequest) => (
              <div
                key={claim.id}
                className="card-flat bg-surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-mute font-bold">{claim.trackingNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      claim.status === 'handed_over'
                        ? 'bg-accent-green-soft text-brand-forest'
                        : claim.status === 'approved'
                        ? 'bg-brand-100 text-brand-forest'
                        : 'bg-accent-amber-soft text-accent-amber'
                    }`}>
                      {claim.status === 'handed_over' ? 'تم الاستلام بنجاح' : claim.status === 'approved' ? 'تم الاعتماد جاهز للاستلام' : 'قيد المراجعة والتدقيق'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-ink">{claim.itemTitle}</h3>
                  <p className="text-xs text-mute">
                    تاريخ الطلب: {new Date(claim.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {claim.status === 'approved' && (
                    <div className="p-2.5 rounded-md bg-brand-50 border border-brand-mint text-center">
                      <span className="text-[10px] text-mute block font-semibold">رمز توثيق الاستلام (OTP)</span>
                      <span className="text-base font-black font-mono text-brand-emerald">{claim.handoverOtp}</span>
                    </div>
                  )}

                  {claim.status === 'handed_over' && (
                    <button
                      onClick={() => setSelectedReceiptClaim(claim)}
                      className="btn-secondary text-xs h-9"
                    >
                      <Printer className="w-4 h-4" />
                      <span>عرض السند الرقمي</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {selectedReceiptClaim && (
        <HandoverReceiptModal
          claim={selectedReceiptClaim}
          onClose={() => setSelectedReceiptClaim(null)}
        />
      )}
    </div>
  );
};
