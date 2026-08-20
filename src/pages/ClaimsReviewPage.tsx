import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Eye,
  User,
  Phone,
  Mail,
  Building2,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  QrCode,
  Tag,
  Lock
} from 'lucide-react';
import { ClaimRequest, Item } from '../types';
import { HandoverReceiptModal } from '../components/modals/HandoverReceiptModal';

export const ClaimsReviewPage: React.FC = () => {
  const {
    claims,
    items,
    currentUser,
    reviewClaim,
    completeHandover,
    setSelectedItemId
  } = useApp();

  const isAuthorized = currentUser?.role === 'admin' || currentUser?.role === 'staff';

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'reviewing' | 'approved' | 'handed_over'>('pending');
  const [selectedClaimForHandover, setSelectedClaimForHandover] = useState<ClaimRequest | null>(null);
  const [selectedClaimForReceipt, setSelectedClaimForReceipt] = useState<ClaimRequest | null>(null);

  // Handover form state
  const [officerName, setOfficerName] = useState(currentUser?.name || '');
  const [verifiedIdNumber, setVerifiedIdNumber] = useState('');
  const [pickupLocation, setPickupLocation] = useState('مكتب أمانات ومفقودات الإدارة الرئيسية');
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredClaims = claims.filter((c: ClaimRequest) => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  const handleApprove = (claim: ClaimRequest) => {
    reviewClaim(claim.id, 'approved', reviewNotes || 'تم التحقق من تطابق الإثباتات السرية المذكورة');
  };

  const handleReject = (claim: ClaimRequest) => {
    const reason = prompt('يرجى كتابة سبب رفض الطلب للمستخدم:') || 'عدم تطابق الإثباتات السرية المقدمة مع بيانات الغرض';
    reviewClaim(claim.id, 'rejected', reason);
  };

  const handleExecuteHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaimForHandover) return;
    if (!verifiedIdNumber) {
      alert('يرجى إدخال رقم الهوية / الإقامة للتحقق.');
      return;
    }

    completeHandover(
      selectedClaimForHandover.id,
      officerName,
      verifiedIdNumber,
      pickupLocation
    );

    const updated = claims.find((c: ClaimRequest) => c.id === selectedClaimForHandover.id);
    setSelectedClaimForHandover(null);
    if (updated) {
      setSelectedClaimForReceipt(updated);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-accent-amber-soft border border-accent-amber/30 text-accent-amber mx-auto flex items-center justify-center shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-ink">صلاحية الوصول مقيدة</h2>
          <p className="text-xs text-mute">
            عذراً، هذا القسم مقيد ويتطلب صلاحيات خاصة للوصول إليه.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-emerald text-white text-xs font-bold px-2 py-0.5 rounded">
              مسؤول المفقودات والأمانات
            </span>
            <span className="text-xs text-mute font-mono">{currentUser.organizationName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            إدارة طلبات الاستلام والتحقق الأمني
          </h1>
          <p className="text-xs sm:text-sm text-mute mt-0.5">
            مراجعة الإثباتات السرية المقدمة من أصحاب المفقودات وتأكيد مطابقتها قبل التسليم الرسمي
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-surface-soft p-1 rounded-md border border-hairline-soft overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'pending' ? 'bg-surface-card text-brand-emerald shadow-flat' : 'text-body hover:text-ink'
            }`}
          >
            طلبات جديدة ({claims.filter((c: ClaimRequest) => c.status === 'pending' || c.status === 'reviewing').length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'approved' ? 'bg-surface-card text-brand-emerald shadow-flat' : 'text-body hover:text-ink'
            }`}
          >
            بانتظار الحضور ({claims.filter((c: ClaimRequest) => c.status === 'approved').length})
          </button>
          <button
            onClick={() => setActiveTab('handed_over')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'handed_over' ? 'bg-surface-card text-brand-emerald shadow-flat' : 'text-body hover:text-ink'
            }`}
          >
            مسلّمة بنجاح ({claims.filter((c: ClaimRequest) => c.status === 'handed_over').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'all' ? 'bg-surface-card text-brand-emerald shadow-flat' : 'text-body hover:text-ink'
            }`}
          >
            الكل ({claims.length})
          </button>
        </div>
      </div>

      {/* Claims Queue List */}
      {filteredClaims.length === 0 ? (
        <div className="card-flat bg-surface-card text-center py-16">
          <FileCheck2 className="w-12 h-12 text-stone mx-auto mb-3" />
          <h3 className="font-bold text-base text-ink">لا توجد طلبات في هذا التصنيف حالياً</h3>
          <p className="text-xs text-mute mt-1">كافة الطلبات تمت مراجعتها ومطابقتها.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredClaims.map((claim: ClaimRequest) => {
            const item = items.find((i: Item) => i.id === claim.itemId);

            return (
              <div
                key={claim.id}
                className="card-flat bg-surface-card border-2 border-hairline hover:border-brand-mint/60 transition-all shadow-sm space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-subtle p-4 -m-5 mb-0 border-b border-hairline-soft">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-mute bg-surface-card px-2.5 py-1 rounded border border-hairline">
                      {claim.trackingNumber}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-ink">{claim.itemTitle}</h3>
                      <p className="text-[11px] text-mute flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone" />
                        <span>تاريخ تقديم الطلب: {new Date(claim.createdAt).toLocaleString('ar-SA')}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {claim.status === 'handed_over' ? (
                      <span className="bg-accent-green-soft text-brand-forest border border-accent-green/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        تم التسليم ومطابقة الهوية
                      </span>
                    ) : claim.status === 'approved' ? (
                      <span className="bg-brand-100 text-brand-forest border border-brand-mint text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        معتمد - رمز OTP: {claim.handoverOtp}
                      </span>
                    ) : claim.status === 'rejected' ? (
                      <span className="bg-accent-red-soft text-accent-red text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        مرفوض
                      </span>
                    ) : (
                      <span className="bg-accent-amber-soft text-accent-amber text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        بانتظار قرار المشرف
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Left Column: Claimant Profile */}
                  <div className="p-4 rounded-md bg-surface-soft/40 border border-hairline-soft space-y-3 text-xs">
                    <span className="font-bold text-ink uppercase text-[10px] tracking-wider block">
                      بيانات مقدم الإثبات
                    </span>
                    <div className="space-y-2 text-body">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-forest flex-shrink-0" />
                        <span className="font-bold text-ink">{claim.claimantName}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <Phone className="w-4 h-4 text-stone flex-shrink-0" />
                        <span>{claim.claimantPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono truncate">
                        <Mail className="w-4 h-4 text-stone flex-shrink-0" />
                        <span className="truncate">{claim.claimantEmail}</span>
                      </div>
                    </div>

                    {item && (
                      <div className="pt-2 border-t border-hairline-soft">
                        <button
                          onClick={() => setSelectedItemId(item.id)}
                          className="text-brand-forest hover:text-brand-emerald text-[11px] font-bold underline"
                        >
                          معاينة سجل الغرض الأصلي في الأمانات →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Middle & Right Column: Secret Verification Comparison */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Comparison Box */}
                    <div className="border border-brand-mint/40 rounded-md overflow-hidden text-xs">
                      <div className="bg-surface-subtle p-3 border-b border-hairline-soft font-bold text-brand-emerald flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>مقارنة الإثباتات السرية المقدمة vs المسجلة بالأمانات</span>
                      </div>

                      {/* Secret details recorded by staff/finder */}
                      {item?.secretDetails && (
                        <div className="p-3 bg-brand-50/40 border-b border-hairline-soft">
                          <span className="text-[10px] font-bold text-brand-forest block mb-1">
                            السر المسجل عند العثور على الغرض:
                          </span>
                          <p className="font-mono text-ink bg-surface-card p-2 rounded border border-hairline-soft">
                            {item.secretDetails}
                          </p>
                        </div>
                      )}

                      {/* User's Answers */}
                      <div className="p-3 space-y-2.5">
                        <span className="text-[10px] font-bold text-mute block">
                          إجابات مقدم الطلب على أسئلة التحقق:
                        </span>
                        {claim.answers.map((ans: any, idx: number) => (
                          <div key={idx} className="bg-surface-card p-2.5 rounded border border-hairline">
                            <div className="text-mute text-[11px] mb-1 font-semibold">{ans.question}</div>
                            <div className="text-ink font-bold text-xs">{ans.userAnswer}</div>
                          </div>
                        ))}

                        {claim.secretProofNotes && (
                          <div className="bg-surface-card p-2.5 rounded border border-hairline mt-2">
                            <span className="text-[10px] text-mute block font-semibold">ملاحظات إضافية من المالك:</span>
                            <p className="text-ink text-xs mt-0.5">{claim.secretProofNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Officer Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-mute font-mono">
                        المشرف المناوب: <strong>{currentUser.name}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {claim.status === 'pending' || claim.status === 'reviewing' ? (
                          <>
                            <button
                              onClick={() => handleReject(claim)}
                              className="btn-secondary text-xs text-accent-red hover:bg-accent-red-soft/30 h-9"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>رفض الطلب</span>
                            </button>
                            <button
                              onClick={() => handleApprove(claim)}
                              className="btn-primary text-xs h-9 bg-brand-emerald hover:bg-brand-forest"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>اعتماد وتوليد رمز OTP</span>
                            </button>
                          </>
                        ) : claim.status === 'approved' ? (
                          <button
                            onClick={() => setSelectedClaimForHandover(claim)}
                            className="btn-gold text-xs h-9"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>تأكيد التسليم الميداني وإصدار السند</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedClaimForReceipt(claim)}
                            className="btn-secondary text-xs h-9"
                          >
                            <Printer className="w-4 h-4" />
                            <span>عرض وطباعة سند التسليم</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Handover Verification Modal */}
      {selectedClaimForHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/70 backdrop-blur-sm">
          <div className="bg-surface-card border border-hairline rounded-lg shadow-lift w-full max-w-lg p-6 space-y-4">
            <h3 className="font-bold text-base text-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-forest" />
              <span>إتمام محضر التسليم الرسمي</span>
            </h3>

            <form onSubmit={handleExecuteHandover} className="space-y-4 text-xs">
              <div className="p-3 bg-surface-soft/60 rounded border border-hairline space-y-1">
                <div>الغرض: <strong className="text-ink">{selectedClaimForHandover.itemTitle}</strong></div>
                <div>المستلم: <strong className="text-ink">{selectedClaimForHandover.claimantName}</strong></div>
                <div>رمز التحقق المعتمد: <strong className="font-mono text-brand-emerald">{selectedClaimForHandover.handoverOtp}</strong></div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  رقم الهوية الوطنية / الإقامة للمستلم (تم التحقق منها شخصياً) *
                </label>
                <input
                  type="text"
                  required
                  value={verifiedIdNumber}
                  onChange={e => setVerifiedIdNumber(e.target.value)}
                  placeholder="10xxxxxxxx أو 2xxxxxxxx"
                  className="w-full bg-surface-card border border-hairline rounded px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">نقطة ومكتب التسليم *</label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value)}
                  className="w-full bg-surface-card border border-hairline rounded px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-hairline-soft">
                <button
                  type="button"
                  onClick={() => setSelectedClaimForHandover(null)}
                  className="btn-secondary text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  تأكيد التسليم وطباعة السند
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedClaimForReceipt && (
        <HandoverReceiptModal
          claim={selectedClaimForReceipt}
          onClose={() => setSelectedClaimForReceipt(null)}
        />
      )}
    </div>
  );
};
