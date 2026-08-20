import React from 'react';
import { ShieldCheck, PhoneCall, Mail, Building2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-card border-t border-hairline mt-auto text-right">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Purpose */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-hairline flex items-center justify-center shadow-sm flex-shrink-0">
              <img src="/AedLogo.png" alt="عائد" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xl font-black text-brand-emerald font-sans">عائـِـد | Eayid</span>
                <span className="text-[10px] font-bold bg-brand-mint/15 text-brand-forest px-2.5 py-0.5 rounded-full border border-brand-mint/30">
                  المنظومة الوطنية الموحدة
                </span>
              </div>
              <p className="text-xs text-body leading-relaxed">
                المنصة الموحدة لربط وتوثيق بلاغات المفقودات وسجلات الأمانات في كبرى الجامعات والمطارات والمرافق العامة بالمملكة العربية السعودية.
              </p>
            </div>
          </div>

          {/* Institutional Contact & Compliance */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-subtle p-4 rounded-2xl border border-hairline text-xs w-full md:w-auto">
            <div className="space-y-1 text-center sm:text-right">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-brand-forest font-bold">
                <Building2 className="w-4 h-4 text-brand-emerald" />
                <span>المركز الموحد لخدمة المستفيدين</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-mute pt-0.5">
                <p className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-brand-forest" />
                  <span className="font-mono font-bold text-ink">199099</span>
                </p>
                <span className="text-hairline hidden sm:inline">•</span>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-forest" />
                  <span className="font-mono text-ink">support@eayid.sa</span>
                </p>
              </div>
            </div>

            <div className="sm:border-r sm:border-hairline-soft sm:pr-4 pt-2 sm:pt-0 flex items-center gap-1.5 text-[11px] text-brand-forest font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-emerald flex-shrink-0" />
              <span>ضوابط هيئة الحكومة الرقمية (DGA)</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-hairline-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-mute text-center sm:text-right">
          <p>© 2026 المنصة الوطنية للمفقودات والموجودات (عائد | Eayid) - المملكة العربية السعودية. كافة الحقوق محفوظة.</p>
          <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-body">
            <span>النسخة المؤسسية 2.4</span>
            <span className="text-hairline">•</span>
            <span>بوابة الأمانات الموحدة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
