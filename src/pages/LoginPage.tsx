import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ORGANIZATIONS } from '../services/mockDatabase';
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  LogIn,
  CheckCircle2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState(ORGANIZATIONS[0].id);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isAdmin = email.trim().toLowerCase() === 'admin@aed.sa';
    const org = ORGANIZATIONS.find(o => o.id === selectedOrgId) || ORGANIZATIONS[0];

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'login') {
        if (isAdmin) {
          login({
            id: 'usr_admin_sdaia',
            name: 'أ. عبدالعزيز (مدير النظام)',
            email: 'admin@aed.sa',
            phone: '0505554321',
            role: 'admin',
            organizationId: 'org_sdaia',
            organizationName: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
          });
          showToast('success', 'تم الدخول بصلاحيات مدير النظام', 'مرحباً بك أ. عبدالعزيز في لوحة القيادة والتحكم الشاملة لمنصة عائد.');
          setCurrentPage('dashboard');
          return;
        }

        login({
          id: `usr_${Date.now()}`,
          name: email.includes('@') ? email.split('@')[0] : (name || 'مستخدم عائد'),
          email: email || 'user@aed.sa',
          phone: '0501234567',
          role: 'user',
          organizationId: org.id,
          organizationName: org.name
        });

        showToast('success', 'تم تسجيل الدخول بنجاح', `مرحباً بك مجدداً في منصة عائد (${org.name}). جاري نقلك للوحة المؤشرات...`);
        setCurrentPage('dashboard');
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

        showToast('success', 'تم إنشاء الحساب بنجاح', `أهلاً بك ${name} في منظومة عائد الموحدة. جاري نقلك للوحة المؤشرات...`);
        setCurrentPage('dashboard');
      } else {
        showToast('info', 'تم إرسال الرابط', 'تم إرسال تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني.');
        setMode('login');
      }
    }, 600);
  };

  const handleAdminQuickLogin = () => {
    setEmail('admin@aed.sa');
    setPassword('admin123');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login({
        id: 'usr_admin_sdaia',
        name: 'أ. عبدالعزيز (مدير النظام)',
        email: 'admin@aed.sa',
        phone: '0505554321',
        role: 'admin',
        organizationId: 'org_sdaia',
        organizationName: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      });
      showToast('success', 'تم الدخول بصلاحيات مدير النظام', 'مرحباً بك أ. عبدالعزيز في لوحة القيادة والتحكم الشاملة لمنصة عائد.');
      setCurrentPage('dashboard');
    }, 500);
  };

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat overflow-x-hidden readex-font select-none"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px] z-0" />

      {/* Subtle glowing ambient lights */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-forest/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-mint/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-8 text-white transition-all duration-300">
        {/* Top Bar: Return to Home Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCurrentPage('landing')}
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full transition-all duration-150"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </button>

          <span className="text-[11px] font-semibold text-brand-mint/90 bg-brand-mint/20 border border-brand-mint/30 px-2.5 py-0.5 rounded-full">
            نظام موحد وآمن
          </span>
        </div>

        {/* Official Brand Logo & Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white p-2 border border-white/30 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
            <img src="/AedLogo.png" alt="شعار منصة عائد" className="w-full h-full object-contain" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              {mode === 'login' && 'تسجيل الدخول إلى عائد'}
              {mode === 'register' && 'إنشاء حساب جديد في عائد'}
              {mode === 'forgot' && 'استعادة كلمة المرور'}
            </h1>
            <p className="text-xs text-white/75 mt-1 font-light">
              المنظومة السحابية الموحدة للمفقودات والموجودات بالمملكة
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="flex p-1 bg-black/25 backdrop-blur-md rounded-xl border border-white/15 mt-3">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-md font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-md font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                حساب جديد
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Register-only fields */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  الاسم الكامل *
                </label>
                <div className="relative flex items-center bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:border-brand-mint focus-within:bg-white/15 transition-all">
                  <User className="w-4 h-4 text-white/60 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="مثال: سارة بنت فهد السالم"
                    className="w-full bg-transparent border-none text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  رقم الجوال *
                </label>
                <div className="relative flex items-center bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:border-brand-mint focus-within:bg-white/15 transition-all">
                  <Phone className="w-4 h-4 text-white/60 mr-2 flex-shrink-0" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full bg-transparent border-none text-xs text-white placeholder-white/40 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email / Username field */}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">
              البريد الإلكتروني أو رقم الهوية *
            </label>
            <div className="relative flex items-center bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:border-brand-mint focus-within:bg-white/15 transition-all">
              <Mail className="w-4 h-4 text-white/60 mr-2 flex-shrink-0" />
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com أو 10xxxxxxxx"
                className="w-full bg-transparent border-none text-xs text-white placeholder-white/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Password field */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white/90">
                  كلمة المرور *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-brand-mint hover:underline font-medium"
                  >
                    نسيت كلمة المرور؟
                  </button>
                )}
              </div>

              <div className="relative flex items-center bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:border-brand-mint focus-within:bg-white/15 transition-all">
                <Lock className="w-4 h-4 text-white/60 mr-2 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none text-xs text-white placeholder-white/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember me checkbox for login */}
          {mode === 'login' && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-white/10 border-white/30 text-brand-mint focus:ring-brand-mint"
                />
                <span>تذكر بيانات دخولي على هذا الجهاز</span>
              </label>
            </div>
          )}

          {/* Submit Button with Modern Emerald Gradient */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#52B788] hover:from-[#14532D] hover:to-[#4ADE80] text-white shadow-lg shadow-black/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري التحقق والتحويل...</span>
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>
                  {mode === 'login' && 'تسجيل الدخول والتحويل للوحة التحكم'}
                  {mode === 'register' && 'إنشاء الحساب وبدء الاستخدام'}
                  {mode === 'forgot' && 'إرسال رابط استعادة كلمة المرور'}
                </span>
              </>
            )}
          </button>

          {/* Quick Admin Demo Login Button */}
          {mode === 'login' && (
            <div className="pt-3 border-t border-white/15 space-y-2">
              <button
                type="button"
                onClick={handleAdminQuickLogin}
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-950/70 hover:bg-emerald-900/90 border border-brand-mint/40 text-brand-mint shadow-md flex items-center justify-center gap-2 transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-brand-mint group-hover:scale-110 transition-transform" />
                <span>دخول سريع كمسؤول النظام (أ. عبدالعزيز - Admin Demo)</span>
              </button>
              <p className="text-[10px] text-center text-white/60">
                حساب المسؤول المعتمد: <span className="font-mono text-brand-mint/90 font-bold">admin@aed.sa</span> | كلمة المرور: <span className="font-mono text-white/90">admin123</span>
              </p>
            </div>
          )}

          {/* Back to Login link in forgot mode */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-brand-mint hover:underline font-bold pt-2 block"
            >
              ← العودة لصفحة تسجيل الدخول
            </button>
          )}

          {/* Trust Footnote */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-center gap-1.5 text-[11px] text-white/70">
            <ShieldCheck className="w-4 h-4 text-brand-mint flex-shrink-0" />
            <span>نظام تسجيل دخول مشفر وخاضع لمعايير الأمانات الوطنية</span>
          </div>
        </form>
      </div>
    </div>
  );
};
