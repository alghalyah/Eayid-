import React from 'react';
import { useApp, PageView } from '../../context/AppContext';
import {
  Building2,
  Search,
  FileCheck2,
  LayoutDashboard,
  Layers,
  Package,
  PlusCircle,
  PackageCheck,
  Shield,
  ShieldCheck,
  User as UserIcon,
  ChevronLeft,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    isLoggedIn,
    showToast,
    currentPage,
    setCurrentPage,
    unreadNotifsCount,
    logout
  } = useApp();

  const currentRole = currentUser?.role || 'user';

  const navItems = [
    {
      id: 'landing' as PageView,
      label: 'الرئيسية',
      icon: <Building2 className="w-4 h-4" />,
      roles: ['user', 'staff', 'admin']
    },
    {
      id: 'browse' as PageView,
      label: 'استعراض السجلات',
      icon: <Search className="w-4 h-4" />,
      roles: ['user', 'staff', 'admin']
    },
    {
      id: 'my_items' as PageView,
      label: 'سجل بلاغاتي ومطالباتي',
      icon: <Package className="w-4 h-4" />,
      roles: ['user', 'staff', 'admin']
    },
    {
      id: 'claims_review' as PageView,
      label: 'طلبات الاستلام والتحقق',
      icon: <FileCheck2 className="w-4 h-4" />,
      roles: ['staff', 'admin']
    },
    {
      id: 'dashboard' as PageView,
      label: 'لوحة القيادة والمؤشرات',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['staff', 'admin']
    },
    {
      id: 'admin_orgs' as PageView,
      label: 'إدارة المنشآت والمواقع',
      icon: <Layers className="w-4 h-4" />,
      roles: ['admin']
    }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className={`fixed inset-y-0 right-0 z-40 w-72 bg-surface-card border-l border-hairline p-5 shadow-floating flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
      <div className="space-y-6">
        {/* Brand Area with Prominent Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-surface-soft transition-colors"
          onClick={() => setCurrentPage('landing')}
        >
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-1 border border-hairline shadow-flat flex items-center justify-center flex-shrink-0">
            <img src="/AedLogo.png" alt="عائد Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-brand-emerald font-sans">عائـِـد</span>
            </div>
            <p className="text-[10px] text-mute font-medium truncate max-w-[130px]">
              {currentUser?.organizationName || 'المنظومة الموحدة'}
            </p>
          </div>
        </div>

        {/* Admin Mode Badge in Sidebar */}
        {currentRole === 'admin' && (
          <div className="bg-emerald-950 text-brand-mint px-2.5 py-1.5 rounded-md border border-brand-mint/40 text-[11px] font-bold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-mint" />
              <span>وضع مدير النظام</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-mint animate-pulse" />
          </div>
        )}

        {/* Quick Report CTAs */}
        <div className="space-y-1.5 pt-2 border-t border-hairline-soft">
          <button
            onClick={() => {
              if (!isLoggedIn) {
                showToast('info', 'تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لتتمكن من تسجيل بلاغ مفقود.');
                setCurrentPage('login');
                return;
              }
              setCurrentPage('report_lost');
            }}
            className="w-full btn-primary text-xs h-9 justify-start px-3 gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل مفقود جديد</span>
          </button>
          <button
            onClick={() => {
              if (!isLoggedIn) {
                showToast('info', 'تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لتتمكن من تسجيل غرض موجود.');
                setCurrentPage('login');
                return;
              }
              setCurrentPage('report_found');
            }}
            className="w-full btn-secondary text-xs h-9 justify-start px-3 gap-2"
          >
            <PackageCheck className="w-4 h-4 text-brand-forest" />
            <span>تسجيل موجود بالأمانات</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1 pt-2">
          <p className="text-[10px] font-bold text-mute uppercase px-3 mb-2">
            {currentRole === 'admin' ? 'إدارة المنظومة' : 'التنقل الرئيسي'}
          </p>
          {filteredNavItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-emerald text-white shadow-flat'
                    : 'text-body hover:text-ink hover:bg-surface-soft'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Card & Logout at bottom */}
      <div className="pt-4 border-t border-hairline-soft space-y-2">
        <div className="bg-surface-subtle p-3 rounded-lg border border-hairline flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-emerald/10 border border-brand-mint/40 flex items-center justify-center flex-shrink-0">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-brand-emerald" />
              )}
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-xs font-bold text-ink truncate">{currentUser?.name || 'مستخدم'}</p>
              <p className="text-[10px] text-brand-forest font-semibold">
                {currentRole === 'admin' ? 'مدير النظام (أ. عبدالعزيز)' : currentRole === 'staff' ? 'مسؤول مفقودات' : 'مستخدم عادي'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="تسجيل الخروج"
            className="p-1.5 rounded-lg hover:bg-accent-red-soft/40 text-accent-red transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
