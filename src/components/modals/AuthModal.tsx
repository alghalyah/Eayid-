import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ORGANIZATIONS } from '../../services/mockDatabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState(ORGANIZATIONS[0].id);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const org = ORGANIZATIONS.find(o => o.id === selectedOrgId) || ORGANIZATIONS[0];

    if (mode === 'login') {
      login({
        id: `usr_${Date.now()}`,
        name: email.includes('@') ? email.split('@')[0] : 'المستخدم',
        email: email || 'user@aed.sa',
        phone: '0501234567',
        role: 'user',
        organizationId: org.id,
        organizationName: org.name
      });
      showToast('success', 'تم تسجيل الدخول بنجاح', `مرحباً بك مجدداً في منصة عائد (${org.name}).`);
      onClose();
    } else if (mode === 'register') {
      login({
        id: `usr_${Date.now()}`,
        name: name || 'عضو جديد',
        email: email || 'member@aed.sa',
        phone: phone || '0500000000',
        role: 'user',
        organizationId: org.id,
        organizationName: org.name
      });
      showToast('success', 'تم إنشاء الحساب بنجاح', `أهلاً بك ${name} في منظومة عائد الموحدة.`);
      onClose();
    } else {
      showToast('info', 'تم إرسال رابط الاستعادة', 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
      setMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-card border border-hairline rounded-xl shadow-lift w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Close Button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-mute hover:text-ink p-1 rounded-md hover:bg-surface-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Header with Prominent Logo */}
        <div className="px-8 pb-4 text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white p-1.5 border border-hairline shadow-md flex items-center justify-center">
            <img src="/AedLogo.png" alt="عائد Logo" className="w-full h-full object-contain" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-brand-emerald tracking-tight font-sans">
              {mode === 'login' && 'تسجيل الدخول إلى عائد'}
              {mode === 'register' && 'إنشاء حساب مؤسسي جديد'}
              {mode === 'forgot' && 'استعادة كلمة المرور'}
            </h2>
            <p className="text-xs text-mute mt-1">
              منصة ذكية لاستعادة ممتلكاتك
            </p>
          </div>

          {/* Mode Switcher */}
          {mode !== 'forgot' && (
            <div className="flex p-1 bg-surface-soft rounded-lg border border-hairline-soft mt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-surface-card text-brand-emerald shadow-flat font-extrabold'
                    : 'text-body hover:text-ink'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-surface-card text-brand-emerald shadow-flat font-extrabold'
                    : 'text-body hover:text-ink'
                }`}
              >
                حساب جديد
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-bold text-ink mb-1">الاسم الكامل *</label>
                <div className="relative flex items-center bg-surface-subtle border border-hairline rounded-md px-3 py-2">
                  <User className="w-4 h-4 text-mute mr-2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="مثال: سارة بنت فهد السالم"
                    className="w-full bg-transparent border-none text-xs text-ink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">رقم الجوال *</label>
                <div className="relative flex items-center bg-surface-subtle border border-hairline rounded-md px-3 py-2">
                  <Phone className="w-4 h-4 text-mute mr-2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full bg-transparent border-none text-xs text-ink focus:outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-ink mb-1">البريد الإلكتروني المؤسسي *</label>
            <div className="relative flex items-center bg-surface-subtle border border-hairline rounded-md px-3 py-2">
              <Mail className="w-4 h-4 text-mute mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@university.edu.sa"
                className="w-full bg-transparent border-none text-xs text-ink focus:outline-none font-mono"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-ink">كلمة المرور *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-brand-forest hover:text-brand-emerald font-semibold"
                  >
                    نسيت كلمة المرور؟
                  </button>
                )}
              </div>
              <div className="relative flex items-center bg-surface-subtle border border-hairline rounded-md px-3 py-2">
                <Lock className="w-4 h-4 text-mute mr-2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none text-xs text-ink focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary text-xs sm:text-sm h-10 mt-2 shadow-lift"
          >
            {mode === 'login' && 'تسجيل الدخول'}
            {mode === 'register' && 'إنشاء الحساب وبدء الاستخدام'}
            {mode === 'forgot' && 'إرسال رابط الاستعادة'}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-brand-forest hover:text-brand-emerald font-bold pt-2 block"
            >
              ← العودة لصفحة تسجيل الدخول
            </button>
          )}

          <div className="pt-3 border-t border-hairline-soft flex items-center justify-center gap-1.5 text-[11px] text-mute">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-forest" />
            <span>تسجيل دخول محمي بنظام التشفير المؤسسي</span>
          </div>
        </form>
      </div>
    </div>
  );
};
