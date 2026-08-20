import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, PlusCircle, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddReportModal: React.FC<AddReportModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentPage, isLoggedIn, showToast } = useApp();

  if (!isOpen) return null;

  const handleSelect = (page: 'report_lost' | 'report_found') => {
    if (!isLoggedIn) {
      showToast('info', 'تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لتتمكن من إضافة وتوثيق البلاغات.');
      setCurrentPage('login');
      onClose();
      return;
    }
    setCurrentPage(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-card border border-hairline rounded-3xl shadow-floating w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-hairline-soft">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-hairline flex items-center justify-center shadow-sm">
              <img src="/AedLogo.png" alt="عائد" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">إضافة بلاغ جديد في عائد</h3>
              <p className="text-xs text-mute">اختر نوع البلاغ للبدء في المطابقة الفورية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-soft text-mute hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Lost CTA */}
          <div
            onClick={() => handleSelect('report_lost')}
            className="p-5 rounded-2xl border-2 border-accent-red/20 bg-accent-red-soft/20 hover:border-accent-red hover:bg-accent-red-soft/40 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-accent-red text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-ink">فقدت شيئاً؟</h4>
              <p className="text-xs text-body leading-relaxed">
                سجل مواصفات مفقودك مع علامات فارقة سرية وسيقوم الذكاء الاصطناعي بالبحث فوراً.
              </p>
            </div>
            <button className="w-full bg-accent-red text-white font-bold text-xs py-2.5 rounded-xl shadow-sm group-hover:shadow transition-all">
              سجل بلاغ مفقود ←
            </button>
          </div>

          {/* Found CTA */}
          <div
            onClick={() => handleSelect('report_found')}
            className="p-5 rounded-2xl border-2 border-brand-mint/40 bg-brand-50/50 hover:border-brand-emerald hover:bg-brand-50 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-ink">عثرت على شيء؟</h4>
              <p className="text-xs text-body leading-relaxed">
                سجل الغرض الذي عثرت عليه وساعد في إعادته لمالكه الحقيقي بكل أمان وسرعة.
              </p>
            </div>
            <button className="w-full bg-brand-emerald text-white font-bold text-xs py-2.5 rounded-xl shadow-sm group-hover:shadow transition-all">
              سجل غرض موجود ←
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-hairline-soft flex items-center justify-center gap-2 text-[11px] text-mute font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-forest" />
          <span>بياناتك محمية وتخضع للتحقق الأمني المشدد وفق معايير الأمانات الوطنية</span>
        </div>
      </div>
    </div>
  );
};
