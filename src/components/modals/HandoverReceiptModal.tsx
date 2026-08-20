import React from 'react';
import { ClaimRequest } from '../../types';
import {
  X,
  Printer,
  CheckCircle2,
  Building2,
  QrCode,
  ShieldCheck,
  Download,
  Share2
} from 'lucide-react';

interface HandoverReceiptModalProps {
  claim: ClaimRequest | null;
  onClose: () => void;
}

export const HandoverReceiptModal: React.FC<HandoverReceiptModalProps> = ({ claim, onClose }) => {
  if (!claim || !claim.handoverReceipt) return null;

  const receipt = claim.handoverReceipt;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-card border border-hairline rounded-lg shadow-lift w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-surface-subtle border-b border-hairline px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-forest" />
            <h3 className="font-bold text-base text-ink">سند استلام وتسليم رسمي معتمد</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-surface-soft text-mute hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-right font-sans" id="printable-receipt">
          {/* Top Receipt Seal Header */}
          <div className="border-b-2 border-brand-emerald pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-hairline flex items-center justify-center shadow-sm">
                <img src="/AedLogo.png" alt="عائد" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-brand-emerald">منصة عائد | Eayid</h2>
                <p className="text-xs text-mute">المنظومة الوطنية الموحدة للمفقودات والأمانات</p>
              </div>
            </div>

            <div className="text-left font-mono">
              <span className="text-[10px] text-mute block">رقم السند الإلكتروني</span>
              <span className="text-xs font-bold text-ink">{receipt.receiptNumber}</span>
            </div>
          </div>

          {/* Success Stamp */}
          <div className="bg-brand-50 border border-brand-mint/40 rounded-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-brand-forest" />
              <div>
                <h4 className="font-bold text-sm text-brand-emerald">تم إتمام التسليم وإغلاق البلاغ بنجاح</h4>
                <p className="text-xs text-mute">تم التحقق من مطابقة الهوية والإثباتات السرية المعتمدة</p>
              </div>
            </div>
            <span className="bg-brand-emerald text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
              VERIFIED
            </span>
          </div>

          {/* Key Receipt Fields Table */}
          <div className="border border-hairline rounded-md overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-surface-subtle p-3 border-b border-hairline font-bold text-ink">
              <span>البيان</span>
              <span className="col-span-2">التفاصيل المعتمدة</span>
            </div>

            <div className="divide-y divide-hairline-soft">
              <div className="grid grid-cols-3 p-3 text-body">
                <span className="text-mute">الغرض المستلم</span>
                <span className="col-span-2 font-bold text-ink">{claim.itemTitle}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-body">
                <span className="text-mute">اسم المستلم (صاحب الغرض)</span>
                <span className="col-span-2 font-bold text-ink">{claim.claimantName}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-body">
                <span className="text-mute">رقم الهوية / الإقامة المتحقق منه</span>
                <span className="col-span-2 font-mono font-bold text-ink">{receipt.idNumberVerified}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-body">
                <span className="text-mute">موقع ونقطة التسليم</span>
                <span className="col-span-2 text-ink">{receipt.pickupLocation}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-body">
                <span className="text-mute">تاريخ وساعة التسليم</span>
                <span className="col-span-2 font-mono text-ink">
                  {new Date(receipt.handedOverAt).toLocaleString('ar-SA')}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3 text-body">
                <span className="text-mute">جهة توثيق التسليم</span>
                <span className="col-span-2 font-bold text-brand-forest">مكتب الأمانات المعتمد</span>
              </div>
            </div>
          </div>

          {/* QR Verification Code Mockup & Digital Signature */}
          <div className="p-4 bg-surface-soft/60 rounded-md border border-hairline flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-surface-card border border-hairline p-1 rounded flex items-center justify-center">
                <QrCode className="w-14 h-14 text-ink" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-ink block">رمز التحقق الرقمي المشفر</span>
                <span className="text-[10px] text-mute font-mono block">OTP: {claim.handoverOtp || '849201'}</span>
                <span className="text-[10px] text-stone font-mono block">SHA-256: 7f8a9...b32c</span>
              </div>
            </div>

            <div className="text-left border-r border-hairline-soft pr-4">
              <span className="text-[10px] text-mute block">الختم الرقمي للمنشأة</span>
              <div className="w-20 h-10 border border-dashed border-brand-mint/60 rounded flex items-center justify-center text-[10px] text-brand-forest font-bold font-mono">
                [SEALED]
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-surface-subtle border-t border-hairline px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="btn-secondary text-xs"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة السند الرسمي</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
