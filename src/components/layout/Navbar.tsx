import React, { useState, useRef, useEffect } from 'react';
import { useApp, PageView } from '../../context/AppContext';
import {
  Bell,
  Search,
  Plus,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  LayoutDashboard,
  FileCheck2,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  ChevronDown,
  Building2,
  MapPin,
  Info,
  RotateCcw,
  LogIn,
  LogOut,
  FileText
} from 'lucide-react';
import { AuthModal } from '../modals/AuthModal';
import { AddReportModal } from '../modals/AddReportModal';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isLoggedIn,
    logout,
    showToast,
    switchRole,
    currentPage,
    setCurrentPage,
    browseFilterType,
    setBrowseFilterType,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedItemId,
    setSelectedClaimId,
    resetToDefaults
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRole = currentUser?.role || 'user';

  const handleNavClick = (target: string) => {
    if (target === 'landing') {
      setCurrentPage('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'browse_lost') {
      setBrowseFilterType('lost');
      setCurrentPage('browse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'browse_found') {
      setBrowseFilterType('found');
      setCurrentPage('browse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'map') {
      setCurrentPage('landing');
      setTimeout(() => {
        const el = document.getElementById('map-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (target === 'about') {
      setCurrentPage('landing');
      setTimeout(() => {
        const el = document.getElementById('about-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const userNameFirst = currentUser?.name ? currentUser.name.split(' ')[0] : 'المستخدم';

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md border-b border-hairline transition-all">
        {/* Top Mini Bar */}
        <div className="bg-surface-subtle border-b border-hairline-soft px-4 sm:px-8 py-1.5 text-xs text-mute flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-emerald">
              <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
              المنصة السعودية الذكية الموحدة للمفقودات والموجودات
            </span>
            <span className="hidden md:inline text-stone">•</span>
            <span className="hidden md:inline font-medium text-[11px] text-body">{currentUser?.organizationName || 'المملكة العربية السعودية'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="text-[11px] font-bold text-brand-forest hover:text-brand-emerald flex items-center gap-1"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>لوحة الإحصائيات والمؤشرات</span>
            </button>

            <button
              onClick={resetToDefaults}
              title="إعادة ضبط البيانات"
              className="hover:text-ink transition-colors flex items-center gap-1 text-[11px] text-stone hover:text-mute"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط النموذج</span>
            </button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Brand Identity */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick('landing')}
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-1 border border-hairline shadow-flat group-hover:border-brand-mint/60 transition-all flex items-center justify-center flex-shrink-0">
                <img src="/AedLogo.png" alt="عائد Logo" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-brand-emerald tracking-tight font-sans">عائـِـد</span>
                </div>
                <p className="text-[11px] text-mute font-medium -mt-0.5 hidden sm:block">منصة ذكية لاستعادة ممتلكاتك</p>
              </div>
            </div>

            {/* Navigation Links: (الرئيسية، المفقودات، الموجودات، الخريطة، من نحن) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => handleNavClick('landing')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentPage === 'landing'
                    ? 'text-brand-emerald bg-surface-soft/80'
                    : 'text-body hover:text-ink hover:bg-surface-soft/40'
                }`}
              >
                الرئيسية
              </button>

              <button
                onClick={() => handleNavClick('browse_lost')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentPage === 'browse' && browseFilterType === 'lost'
                    ? 'text-accent-red bg-accent-red-soft/50 shadow-sm'
                    : 'text-body hover:text-accent-red hover:bg-surface-soft/40'
                }`}
              >
                المفقودات
              </button>

              <button
                onClick={() => handleNavClick('browse_found')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentPage === 'browse' && browseFilterType === 'found'
                    ? 'text-brand-emerald bg-surface-soft/80 shadow-sm'
                    : 'text-body hover:text-brand-emerald hover:bg-surface-soft/40'
                }`}
              >
                الموجودات
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    currentPage === 'dashboard'
                      ? 'text-white bg-brand-emerald shadow-sm'
                      : 'text-brand-forest bg-brand-mint/15 hover:bg-brand-mint/25 border border-brand-mint/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-brand-mint" />
                  <span>لوحة الإدارة</span>
                </button>
              )}

              <button
                onClick={() => handleNavClick('map')}
                className="px-3.5 py-2 rounded-xl text-sm font-bold text-body hover:text-ink hover:bg-surface-soft/40 transition-all flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-mint" />
                <span>الخريطة</span>
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className="px-3.5 py-2 rounded-xl text-sm font-bold text-body hover:text-ink hover:bg-surface-soft/40 transition-all flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5 text-stone" />
                <span>من نحن</span>
              </button>
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-3">
              {/* Admin Mode Badge for Admin Users */}
              {currentUser?.role === 'admin' && (
                <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950 text-brand-mint px-2.5 py-1 rounded-md border border-brand-mint/40 text-[11px] font-bold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-sm bg-brand-mint animate-pulse" />
                  <span>وضع مدير النظام | Admin Mode</span>
                </div>
              )}

              {/* Prominent Action Button with modern green gradient */}
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    showToast('info', 'تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لتتمكن من إضافة وتوثيق البلاغات.');
                    setCurrentPage('login');
                    return;
                  }
                  setIsAddReportModalOpen(true);
                }}
                className="btn-gradient px-4 sm:px-6 h-11 text-xs sm:text-sm font-extrabold flex items-center gap-2 rounded-2xl"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                <span>إضافة بلاغ</span>
              </button>

              {/* Notification Center Popover */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setCurrentPage('login');
                      return;
                    }
                    setIsNotifOpen(!isNotifOpen);
                  }}
                  className="relative p-2.5 rounded-2xl hover:bg-surface-soft text-body hover:text-ink transition-colors border border-hairline hover:border-brand-mint/40"
                  aria-label="الإشعارات"
                >
                  <Bell className="w-5 h-5" />
                  {isLoggedIn && unreadNotifsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown (Only when logged in and open) */}
                {isLoggedIn && isNotifOpen && (
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-card border border-hairline shadow-floating py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-hairline-soft">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink">مركز الإشعارات</span>
                        <span className="text-[11px] bg-surface-soft px-2 py-0.5 rounded-full text-brand-forest font-semibold">
                          {unreadNotifsCount} جديد
                        </span>
                      </div>
                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-brand-forest hover:text-brand-emerald font-medium"
                        >
                          تحديد الكل كمقروء
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-hairline-soft">
                      {(!notifications || notifications.length === 0) ? (
                        <div className="p-6 text-center text-mute text-xs">لا توجد إشعارات حالياً</div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.linkItemId) {
                                setSelectedItemId(n.linkItemId);
                              }
                              if (n.linkClaimId) {
                                setSelectedClaimId(n.linkClaimId);
                                setCurrentPage('claims_queue');
                              }
                              setIsNotifOpen(false);
                            }}
                            className={`p-3.5 text-right hover:bg-surface-subtle transition-colors cursor-pointer ${
                              !n.read ? 'bg-brand-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-xs text-ink">{n.title}</span>
                              <span className="text-[10px] text-mute flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" />
                                الآن
                              </span>
                            </div>
                            <p className="text-xs text-body mt-1 leading-snug">{n.message}</p>
                            {n.score && (
                              <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-forest bg-accent-green-soft px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                نسبة المطابقة: {n.score}%
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Account / Login Button */}
              {!isLoggedIn ? (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-soft hover:bg-surface-subtle text-ink font-bold border border-hairline hover:border-brand-mint text-xs transition-all shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-brand-forest" />
                  <span>تسجيل الدخول</span>
                </button>
              ) : (
                <div className="relative" ref={roleRef}>
                  <button
                    onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl hover:bg-surface-soft border border-hairline transition-all"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-emerald/10 border border-brand-mint/40 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-brand-emerald" />
                    </div>
                    <div className="hidden md:flex flex-col text-right">
                      <span className="text-xs font-bold text-ink leading-none">{currentUser?.name || 'حسابي'}</span>
                      <span className="text-[10px] text-mute font-semibold mt-0.5">
                        {currentUser?.role === 'admin' ? 'مدير النظام المعتمد' : (currentUser?.organizationName || 'منصة عائد')}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-mute" />
                  </button>

                  {/* Profile Dropdown */}
                  {isRoleMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-surface-card border border-hairline shadow-floating py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-hairline-soft">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-ink">{currentUser?.name || 'المستخدم'}</p>
                          {currentUser?.role === 'admin' && (
                            <span className="text-[10px] font-bold bg-brand-mint/20 text-brand-forest px-2 py-0.5 rounded">
                              مدير النظام
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-mute font-mono truncate">{currentUser?.email || 'user@aed.sa'}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-brand-forest font-medium">
                          <Building2 className="w-3.5 h-3.5" />
                          <span className="truncate">{currentUser?.organizationName || 'المنظومة الموحدة'}</span>
                        </div>
                      </div>

                      <div className="px-2 py-1.5 space-y-1 text-xs">
                        {currentUser?.role === 'admin' ? (
                          <>
                            <button
                              onClick={() => {
                                setCurrentPage('dashboard');
                                setIsRoleMenuOpen(false);
                              }}
                              className="w-full text-right px-3 py-2 rounded-xl text-ink hover:bg-surface-soft font-bold flex items-center gap-2 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-brand-forest" />
                              <span>لوحة تحكم المسؤول (Dashboard)</span>
                            </button>
                            <button
                              onClick={() => {
                                setCurrentPage('claims_queue');
                                setIsRoleMenuOpen(false);
                              }}
                              className="w-full text-right px-3 py-2 rounded-xl text-ink hover:bg-surface-soft font-bold flex items-center gap-2 transition-colors"
                            >
                              <FileText className="w-4 h-4 text-brand-forest" />
                              <span>إدارة الطلبات والتحقق</span>
                            </button>
                            <button
                              onClick={() => {
                                setCurrentPage('admin_orgs');
                                setIsRoleMenuOpen(false);
                              }}
                              className="w-full text-right px-3 py-2 rounded-xl text-ink hover:bg-surface-soft font-bold flex items-center gap-2 transition-colors"
                            >
                              <Building2 className="w-4 h-4 text-brand-mint" />
                              <span>المواقع والفروع المؤسسية</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setCurrentPage('my_items');
                              setIsRoleMenuOpen(false);
                            }}
                            className="w-full text-right px-3 py-2 rounded-xl text-ink hover:bg-surface-soft font-bold flex items-center gap-2 transition-colors"
                          >
                            <FileText className="w-4 h-4 text-brand-forest" />
                            <span>بلاغاتي ومطالباتي</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setIsRoleMenuOpen(false);
                            setIsAddReportModalOpen(true);
                          }}
                          className="w-full text-right px-3 py-2 rounded-xl text-ink hover:bg-surface-soft font-bold flex items-center gap-2 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-brand-mint" />
                          <span>تسجيل بلاغ جديد</span>
                        </button>

                        <div className="pt-1 border-t border-hairline-soft">
                          <button
                            onClick={() => {
                              setIsRoleMenuOpen(false);
                              logout();
                            }}
                            className="w-full text-right px-3 py-2 rounded-xl text-accent-red hover:bg-accent-red-soft/30 font-bold flex items-center gap-2 transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-accent-red" />
                            <span>تسجيل الخروج</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal & Add Report Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AddReportModal isOpen={isAddReportModalOpen} onClose={() => setIsAddReportModalOpen(false)} />
    </>
  );
};
