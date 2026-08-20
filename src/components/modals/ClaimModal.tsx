import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  FileCheck2,
  Lock,
  Upload,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { CATEGORIES, getItemVerificationQuestions } from '../../services/mockDatabase';

interface ClaimModalProps {
  itemId: string | null;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ itemId, onClose }) => {
  const { items, currentUser, submitClaim } = useApp();

  const item = items.find(i => i.id === itemId);

  const [claimantName, setClaimantName] = useState(currentUser.name);
  const [claimantPhone, setClaimantPhone] = useState(currentUser.phone || '');
  const [claimantEmail, setClaimantEmail] = useState(currentUser.email);
  const [secretProofNotes, setSecretProofNotes] = useState('');
  
  // Custom, item-tailored secret questionnaire answers
  const questions = getItemVerificationQuestions(item);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretProofNotes && Object.values(answers).every(a => !a)) {
      alert('يرجى تقديم تفاصيل أو إجابات دقيقة لإثبات الملكية.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const formattedAnswers = questions.map(q => ({
        question: q,
        userAnswer: answers[q] || 'لم يتم التحديد'
      }));

      submitClaim({
        itemId: item.id,
        itemTitle: item.title,
        itemType: item.type,
        claimantId: currentUser.id,
        claimantName,
        claimantPhone,
        claimantEmail,
        organizationId: item.organizationId,
        secretProofNotes,
        answers: formattedAnswers
      });

      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-card border border-hairline rounded-lg shadow-lift w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-surface-subtle border-b border-hairline px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-brand-emerald text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-brand-mint" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">طلب إثبات ملكية واستلام غرض</h3>
              <p className="text-xs text-mute">تحقق أمني سري لضمان تسليم المقتنيات لصاحبها الشرعي</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-surface-soft text-mute hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Target Item summary */}
          <div className="bg-surface-soft/60 border border-hairline-soft rounded-md p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-mute">{item.trackingCode}</span>
              <h4 className="font-bold text-sm text-ink">{item.title}</h4>
              <p className="text-xs text-mute mt-0.5">{item.organizationName} - {item.location.building}</p>
            </div>
            <span className="bg-brand-emerald text-white text-xs font-bold px-2.5 py-1 rounded">
              {item.category}
            </span>
          </div>

          {/* Claimant Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-mute tracking-wider flex items-center gap-1.5">
              <span>بيانات مقدم الطلب</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={e => setClaimantName(e.target.value)}
                  className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  value={claimantPhone}
                  onChange={e => setClaimantPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  value={claimantEmail}
                  onChange={e => setClaimantEmail(e.target.value)}
                  className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald font-mono"
                />
              </div>
            </div>
          </div>

          {/* Secret Questions Section */}
          <div className="space-y-4 pt-2 border-t border-hairline-soft">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-forest" />
              <div>
                <h4 className="font-bold text-sm text-ink">أسئلة التحقق من العلامات السرية</h4>
                <p className="text-[11px] text-mute">أجب عن أكبر قدر ممكن من التفاصيل التي لا تظهر في الصورة العامة</p>
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={idx} className="bg-surface-subtle p-3 rounded-md border border-hairline-soft">
                  <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-surface-soft text-brand-forest text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{q}</span>
                  </label>
                  <input
                    type="text"
                    value={answers[q] || ''}
                    onChange={e => setAnswers({ ...answers, [q]: e.target.value })}
                    placeholder="اكتب إجابتك الدقيقة هنا..."
                    className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                تفاصيل إضافية أو ملاحظات سرية أخرى
              </label>
              <textarea
                rows={3}
                value={secretProofNotes}
                onChange={e => setSecretProofNotes(e.target.value)}
                placeholder="مثال: الرقم التسلسلي، كلمات مرور، محتويات سرية، أو تاريخ الشراء..."
                className="w-full bg-surface-card border border-hairline rounded-md p-3 text-xs text-ink focus:outline-none focus:border-brand-emerald resize-none"
              />
            </div>
          </div>

          {/* Assurance Notice */}
          <div className="banner-tip-green text-xs">
            <CheckCircle2 className="w-4 h-4 text-brand-forest flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              ستتم مراجعة إجاباتك فوراً من قِبل مسؤول المفقودات. عند مطابقة الإثباتات، سيصلك رمز توثيق الاستلام (OTP) وموقع الاستلام المعتمد.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs"
            >
              {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب إثبات الملكية'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
