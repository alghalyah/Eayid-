import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  FileCheck2,
  RefreshCw,
  Check,
  X,
  Send,
  ExternalLink,
  ChevronDown,
  User,
  PackageCheck,
  FileText,
  BadgeAlert,
  ArrowRightLeft,
  Lock,
  Trash2
} from 'lucide-react';
import { CATEGORIES, ORGANIZATIONS } from '../services/mockDatabase';
import { Item, ItemStatus, ClaimRequest } from '../types';
import { HandoverReceiptModal } from '../components/modals/HandoverReceiptModal';

interface AIMatchItem {
  id: string;
  lostItemTitle: string;
  lostItemCode: string;
  lostItemImage: string;
  lostItemLocation: string;
  lostReporter: string;
  lostDate: string;
  foundItemTitle: string;
  foundItemCode: string;
  foundItemImage: string;
  foundItemLocation: string;
  foundOfficer: string;
  foundDate: string;
  score: number;
  semanticReason: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

export const DashboardPage: React.FC = () => {
  const {
    items,
    claims,
    currentUser,
    setCurrentPage,
    setSelectedItemId,
    updateItemStatus,
    deleteItem,
    showToast,
    triggerConfetti
  } = useApp();

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'admin@aed.sa';

  // Filter & Search states for Reports Table
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('all');
  const [reportTypeFilter, setReportTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceiptClaim, setSelectedReceiptClaim] = useState<ClaimRequest | null>(null);

  // AI Matches state
  const [aiMatches, setAiMatches] = useState<AIMatchItem[]>([
    {
      id: 'match_1',
      lostItemTitle: 'مفتاح سيارة تويوتا فورتشنر',
      lostItemCode: 'AED-L-2012',
      lostItemImage: '/images/examples/car_key.png',
      lostItemLocation: 'جامعة الملك سعود - مواقف بوابة 5',
      lostReporter: 'م. عبدالله القحطاني (0501234567)',
      lostDate: '19 أغسطس 2026',
      foundItemTitle: 'مفتاح ريموت تويوتا أسود',
      foundItemCode: 'AED-F-5011',
      foundItemImage: '/images/examples/car_key.png',
      foundItemLocation: 'مكتب أمانات جامعة الملك سعود (بوابة 5)',
      foundOfficer: 'إدارة الأمن والسلامة (جامعة الملك سعود)',
      foundDate: '19 أغسطس 2026',
      score: 94,
      semanticReason: 'تطابق كامل للماركة (Toyota) وموديل الريموت والموقع الجغرافي والوقت الزمني.',
      status: 'pending'
    },
    {
      id: 'match_2',
      lostItemTitle: 'آيفون 13 أسود (Black iPhone 13)',
      lostItemCode: 'AED-L-2013',
      lostItemImage: '/images/examples/iphone.png',
      lostItemLocation: 'بهو الاستقبال الرئيسي - الدور الأول',
      lostReporter: 'سارة بنت فهد (0509876543)',
      lostDate: '18 أغسطس 2026',
      foundItemTitle: 'هاتف آبل ذكي أسود بحافظة شفافة',
      foundItemCode: 'AED-F-3903',
      foundItemImage: '/images/examples/iphone.png',
      foundItemLocation: 'مكتب الأمانات المركزي',
      foundOfficer: 'شعبة الموجودات المعتمدة',
      foundDate: '18 أغسطس 2026',
      score: 91,
      semanticReason: 'تطابق الرؤية الحاسوبية (CV) للون والموديل والحافظة والوصف الدقيق للشاشة.',
      status: 'pending'
    },
    {
      id: 'match_3',
      lostItemTitle: 'محفظة رجالية جلدية بنية',
      lostItemCode: 'AED-L-2402',
      lostItemImage: '/images/examples/wallet.png',
      lostItemLocation: 'المكتبة المركزية - صالة القراءة',
      lostReporter: 'خالد بن ناصر (0504433221)',
      lostDate: '17 أغسطس 2026',
      foundItemTitle: 'محفظة جلد طبيعي تحتوي وثائق',
      foundItemCode: 'AED-F-3904',
      foundItemImage: '/images/examples/wallet.png',
      foundItemLocation: 'أمانات كلية الحاسب',
      foundOfficer: 'أمن المرافق التعليمية',
      foundDate: '17 أغسطس 2026',
      score: 88,
      semanticReason: 'تطابق لون وخامة الجلد ونوع الوثائق المرفقة والموقع الأكاديمي.',
      status: 'pending'
    }
  ]);

  // Handle AI Match Approval
  const handleConfirmMatch = (match: AIMatchItem) => {
    setAiMatches(prev =>
      prev.map(m => (m.id === match.id ? { ...m, status: 'confirmed' } : m))
    );
    triggerConfetti();
    showToast(
      'success',
      'تم اعتماد المطابقة بنجاح!',
      `تم ربط البلاغ (${match.lostItemCode}) مع الموجود (${match.foundItemCode}) وإرسال إشعار فوري وتذكرة توجيهية للمالك.`
    );
  };

  // Handle AI Match Rejection
  const handleRejectMatch = (matchId: string) => {
    setAiMatches(prev =>
      prev.map(m => (m.id === matchId ? { ...m, status: 'rejected' } : m))
    );
    showToast('info', 'تم استبعاد المطابقة', 'تم نقل المطابقة للأرشيف وتحديث محددات الذكاء الاصطناعي.');
  };

  // Status mapping
  const statusLabels: Record<ItemStatus, { text: string; bg: string; color: string }> = {
    active: { text: 'قيد البحث والتحقق', bg: 'bg-accent-blue-soft text-accent-blue border-accent-blue/30', color: 'text-accent-blue' },
    in_verification: { text: 'قيد المراجعة', bg: 'bg-accent-amber-soft text-accent-amber border-accent-amber/30', color: 'text-accent-amber' },
    matched: { text: 'تم العثور عليه (مطابق)', bg: 'bg-emerald-100 text-brand-emerald border-emerald-300', color: 'text-brand-emerald' },
    claimed: { text: 'بانتظار التسليم', bg: 'bg-purple-100 text-purple-800 border-purple-300', color: 'text-purple-700' },
    handed_over: { text: 'مكتمل ومُسلّم', bg: 'bg-accent-green-soft text-brand-forest border-brand-mint/40', color: 'text-brand-forest' },
    closed: { text: 'مغلق', bg: 'bg-gray-100 text-gray-700 border-gray-300', color: 'text-gray-600' }
  };

  // Safe filter logic for reports table
  const filteredItems = (items || []).filter(item => {
    if (!item) return false;
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.trackingCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location?.campus || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.reporter?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = reportTypeFilter === 'all' || item.type === reportTypeFilter;
    const matchesStatus =
      reportStatusFilter === 'all' ||
      (reportStatusFilter === 'review' && (item.status === 'in_verification' || item.status === 'active')) ||
      (reportStatusFilter === 'matched' && item.status === 'matched') ||
      (reportStatusFilter === 'claimed' && item.status === 'claimed') ||
      (reportStatusFilter === 'handed_over' && item.status === 'handed_over');

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate metrics
  const totalReportsCount = (items || []).length + 74;
  const activeLostCount = (items || []).filter(i => i?.type === 'lost' && (i?.status === 'active' || i?.status === 'in_verification')).length + 32;
  const receivedItemsCount = (items || []).filter(i => i?.type === 'found').length + 56;
  const handedOverCount = (items || []).filter(i => i?.status === 'handed_over').length + 48;
  const successRecoveryRate = Math.round((handedOverCount / Math.max(1, totalReportsCount)) * 100);

  // Hotspot data
  const hotspotData = [
    { name: 'المكتبة المركزية', count: 32, resolved: 27 },
    { name: 'كلية الحاسب (31)', count: 28, resolved: 23 },
    { name: 'مطار KKIA صالة 3', count: 22, resolved: 19 },
    { name: 'كلية العلوم (4)', count: 18, resolved: 15 },
    { name: 'مواقف P4 و P7', count: 14, resolved: 10 },
    { name: 'مركز أبحاث التخصصي', count: 12, resolved: 11 }
  ];

  // Category breakdown
  const categoryData = [
    { name: 'إلكترونيات وأجهزة', value: 42, color: '#1B4332' },
    { name: 'بطاقات وهويات', value: 28, color: '#2D6A4F' },
    { name: 'حقائب ومحافظ', value: 22, color: '#40916C' },
    { name: 'مفاتيح وتحكم', value: 16, color: '#52B788' },
    { name: 'ساعات ومجوهرات', value: 10, color: '#F7A501' }
  ];

  // Monthly trends
  const trendData = [
    { month: 'يناير', reported: 45, recovered: 36 },
    { month: 'فبراير', reported: 52, recovered: 44 },
    { month: 'مارس', reported: 68, recovered: 58 },
    { month: 'أبريل', reported: 61, recovered: 54 },
    { month: 'مايو', reported: 75, recovered: 69 },
    { month: 'يونيو', reported: 84, recovered: 79 },
    { month: 'يوليو', reported: 78, recovered: 73 },
    { month: 'أغسطس', reported: 96, recovered: 89 }
  ];

  // Generate a mock handover receipt for a specific item
  const handleOpenReceiptForItem = (item: Item) => {
    const mockClaim: ClaimRequest = {
      id: `claim_admin_${item.id}`,
      trackingNumber: `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
      itemId: item.id,
      itemTitle: item.title,
      itemType: item.type,
      claimantId: item.reporter?.id || 'usr_claimant',
      claimantName: item.reporter?.name || 'المستفيد المعتمد',
      claimantPhone: item.reporter?.phone || '0501234567',
      claimantEmail: item.reporter?.email || 'user@aed.sa',
      organizationId: item.organizationId,
      secretProofNotes: item.secretDetails || item.description,
      answers: [],
      status: 'handed_over',
      createdAt: item.createdAt,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'أ. عبدالعزيز (مدير النظام)',
      handoverReceipt: {
        receiptNumber: `EAYID-REC-${Math.floor(100000 + Math.random() * 900000)}`,
        handedOverAt: new Date().toISOString(),
        officerName: 'أ. عبدالعزيز (مدير النظام)',
        idNumberVerified: '1098******',
        pickupLocation: `${item.location?.campus || 'المركز الرئيسي'} - ${item.location?.building || 'مكتب الأمانات'}`
      }
    };
    setSelectedReceiptClaim(mockClaim);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 readex-font">
      {/* 1. Admin Header & Profile Banner */}
      <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-brand-mint/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 flex items-center justify-center flex-shrink-0 shadow-lg">
              <img src="/AedLogo.png" alt="عائد" className="w-full h-full object-contain" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-emerald-950/90 text-brand-mint border border-brand-mint/40 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-sm bg-brand-mint animate-pulse" />
                  <span>وضع مدير النظام | Admin Mode</span>
                </span>
                <span className="text-xs text-white/70 font-mono">
                  سدايا | الهيئة السعودية للبيانات والذكاء الاصطناعي
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                لوحة القيادة والتحكم لمنظومة "عائد"
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 font-light">
                مرحباً بك <span className="font-bold text-white">أ. عبدالعزيز</span> — المشرف العام على مركز إدارة المفقودات والمطابقات الذكية.
              </p>
            </div>
          </div>

          {/* Quick Date, Status & Export */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl text-right">
              <span className="text-[10px] text-white/70 block font-medium">حالة المنظومة والربط</span>
              <span className="text-xs font-bold text-brand-mint flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-mint" />
                متصل سحابياً 100%
              </span>
            </div>

            <button
              onClick={() => {
                showToast('success', 'تم تصدير التقرير التنفيذي', 'تم تجهيز وتنزيل ملف التقرير الإحصائي الشامل بصيغة PDF.');
              }}
              className="bg-brand-mint text-[#1B4332] hover:bg-brand-mint/90 font-bold text-xs h-11 px-4 rounded-2xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تصدير التقرير التنفيذي (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick KPI Stats Cards (4 Key Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Reports */}
        <div className="bg-surface-card border border-hairline hover:border-brand-mint/50 rounded-2xl p-5 shadow-card hover:shadow-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mute">إجمالي البلاغات المسجلة</span>
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-mint/30 flex items-center justify-center text-brand-forest">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-ink font-mono">{totalReportsCount}</span>
            <span className="text-xs font-bold text-brand-forest bg-accent-green-soft px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +18% شهرياً
            </span>
          </div>
          <p className="text-[11px] text-mute mt-2">شاملة كافة الجامعات والمطارات والمستشفيات</p>
        </div>

        {/* Metric 2: Active Lost */}
        <div className="bg-surface-card border border-hairline hover:border-accent-amber/50 rounded-2xl p-5 shadow-card hover:shadow-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mute">مفقودات نشطة قيد البحث</span>
            <div className="w-10 h-10 rounded-xl bg-accent-amber-soft border border-accent-amber/30 flex items-center justify-center text-accent-amber">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-ink font-mono">{activeLostCount}</span>
            <span className="text-xs font-bold text-accent-amber bg-accent-amber-soft px-2 py-0.5 rounded-full">
              قيد المطابقة الذكية
            </span>
          </div>
          <p className="text-[11px] text-mute mt-2">يتم فحصها فورياً عبر الذكاء الاصطناعي</p>
        </div>

        {/* Metric 3: Items Received */}
        <div className="bg-surface-card border border-hairline hover:border-brand-forest/50 rounded-2xl p-5 shadow-card hover:shadow-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mute">موجودات تم استلامها</span>
            <div className="w-10 h-10 rounded-xl bg-surface-soft border border-brand-mint/40 flex items-center justify-center text-brand-forest">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-ink font-mono">{receivedItemsCount}</span>
            <span className="text-xs font-mono font-bold text-brand-forest bg-accent-green-soft px-2.5 py-1 rounded flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-brand-forest" />
              +6.2% في سرعة الحل
            </span>
          </div>
          <p className="text-[11px] text-mute mt-2">معدل قياسي وفق مؤشرات الأداء الوطنية</p>
        </div>

        {/* Metric 4: Success Recovery Rate */}
        <div className="bg-surface-card border border-hairline hover:border-brand-mint/50 rounded-2xl p-5 shadow-card hover:shadow-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mute">نسبة الاستعادة الناجحة</span>
            <div className="w-10 h-10 rounded-xl bg-accent-green-soft border border-brand-mint/30 flex items-center justify-center text-brand-forest">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-emerald font-mono">84%</span>
            <span className="text-xs font-bold text-brand-forest bg-accent-green-soft px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              معدل استرداد معتمد
            </span>
          </div>
          <p className="text-[11px] text-mute mt-2">معدل قياسي وفق مؤشرات الأداء الوطنية</p>
        </div>
      </div>

      {/* 3. Verification & Matches Management Section */}
      <div className="bg-surface-card border border-hairline rounded-3xl p-6 sm:p-7 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-soft pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-emerald text-white flex items-center justify-center shadow-md">
              <FileCheck2 className="w-6 h-6 text-brand-mint" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-ink flex items-center gap-2">
                <span>مركز إدارة وتدقيق المطابقات الآلية</span>
                {isAdmin ? (
                  <span className="text-xs font-bold bg-brand-mint/20 text-brand-forest px-2.5 py-0.5 rounded-full border border-brand-mint/30">
                    {aiMatches.filter(m => m.status === 'pending').length} مطابقات بانتظار الاعتماد
                  </span>
                ) : (
                  <span className="text-xs font-bold bg-accent-amber-soft text-accent-amber px-2.5 py-0.5 rounded-full border border-accent-amber/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>صلاحية الوصول مقيدة</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-mute mt-0.5">
                يقوم النظام بالتدقيق المباشر ومقارنة مواصفات البلاغات المفقودة مع المحفوظات بالأمانات وإصدار تنبيهات فورية للمسؤولين.
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                showToast('info', 'تحديث سجلات المطابقة', 'جاري إعادة مسح كافة البلاغات وتحديث مصفوفات التشابه الدلالي.');
              }}
              className="btn-secondary text-xs h-9 px-3.5 gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة فحص السجلات</span>
            </button>
          )}
        </div>

        {/* Access Restriction Check */}
        {!isAdmin ? (
          <div className="bg-surface-subtle border border-hairline rounded-2xl p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-accent-amber-soft border border-accent-amber/30 text-accent-amber mx-auto flex items-center justify-center shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-base text-ink">صلاحية الوصول مقيدة</h3>
              <p className="text-xs text-mute">
                عذراً، هذا القسم مقيد ويتطلب صلاحيات خاصة للوصول إليه.
              </p>
            </div>
          </div>
        ) : (
          /* AI Matches Cards List for Admin */
          <div className="space-y-4">
            {aiMatches.map(match => (
              <div
                key={match.id}
                className={`rounded-2xl border transition-all p-4 sm:p-5 ${
                  match.status === 'confirmed'
                    ? 'bg-emerald-50/50 border-brand-mint/60'
                    : match.status === 'rejected'
                    ? 'bg-gray-50/70 border-gray-200 opacity-60'
                    : 'bg-surface-subtle/50 hover:bg-surface-soft/40 border-hairline shadow-sm'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Lost Item Column (Left) */}
                  <div className="lg:col-span-4 bg-surface-card p-3.5 rounded-xl border border-hairline space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-accent-red bg-accent-red-soft px-2 py-0.5 rounded">
                        الغرض المفقود
                      </span>
                      <span className="text-xs font-mono font-bold text-mute">{match.lostItemCode}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-soft border border-hairline flex-shrink-0">
                        <img src={match.lostItemImage} alt={match.lostItemTitle} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 text-right">
                        <h4 className="text-xs font-bold text-ink truncate">{match.lostItemTitle}</h4>
                        <p className="text-[11px] text-mute truncate flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {match.lostItemLocation}
                        </p>
                        <p className="text-[10px] text-body font-medium truncate mt-0.5">المبلغ: {match.lostReporter}</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge (Center) */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-2 space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 bg-brand-emerald text-white px-3 py-1.5 rounded-full shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-brand-mint animate-pulse" />
                      <span className="text-xs font-extrabold font-mono">نسبة المطابقة: {match.score}%</span>
                    </div>
                    <p className="text-[11px] text-body leading-snug max-w-xs">{match.semanticReason}</p>
                  </div>

                  {/* Found Item Column (Right) */}
                  <div className="lg:col-span-4 bg-surface-card p-3.5 rounded-xl border border-hairline space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-forest bg-accent-green-soft px-2 py-0.5 rounded">
                        الموجود بالأمانات
                      </span>
                      <span className="text-xs font-mono font-bold text-mute">{match.foundItemCode}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-soft border border-hairline flex-shrink-0">
                        <img src={match.foundItemImage} alt={match.foundItemTitle} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 text-right">
                        <h4 className="text-xs font-bold text-ink truncate">{match.foundItemTitle}</h4>
                        <p className="text-[11px] text-mute truncate flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {match.foundItemLocation}
                        </p>
                        <p className="text-[10px] text-brand-forest font-semibold truncate mt-0.5">الجهة: {match.foundOfficer}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="mt-4 pt-3 border-t border-hairline-soft flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {match.status === 'confirmed' && (
                      <span className="text-xs font-bold text-brand-forest bg-accent-green-soft px-3 py-1 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم الاعتماد وإرسال كود الاستلام للمالك</span>
                      </span>
                    )}
                    {match.status === 'rejected' && (
                      <span className="text-xs font-bold text-mute bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <X className="w-4 h-4" />
                        <span>تم استبعاد المطابقة المقترحة</span>
                      </span>
                    )}
                    {match.status === 'pending' && (
                      <span className="text-[11px] text-mute flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        بانتظار مراجعة وقرار مدير النظام
                      </span>
                    )}
                  </div>

                  {match.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectMatch(match.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-hairline text-mute hover:text-accent-red hover:bg-accent-red-soft/30 transition-all flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>رفض المطابقة</span>
                      </button>
                      <button
                        onClick={() => handleConfirmMatch(match)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-brand-emerald hover:bg-brand-forest text-white shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5 text-brand-mint" />
                        <span>تأكيد المطابقة وإشعار المالك</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Reports Management Table */}
      <div className="bg-surface-card border border-hairline rounded-3xl p-6 sm:p-7 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-soft pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-ink flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-forest" />
              <span>جدول إدارة ومتابعة كافة البلاغات المؤسسية</span>
              {!isAdmin && (
                <span className="text-xs font-bold bg-accent-amber-soft text-accent-amber px-2.5 py-0.5 rounded-full border border-accent-amber/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>صلاحية الوصول مقيدة</span>
                </span>
              )}
            </h2>
            <p className="text-xs text-mute mt-0.5">
              استعراض وتحديث حالات البلاغات، والتواصل المباشر مع أصحاب البلاغات، وإصدار سندات الاستلام الرسمية.
            </p>
          </div>

          {/* Quick Item Counter */}
          {isAdmin && (
            <span className="text-xs font-mono font-bold bg-surface-soft text-brand-forest px-3 py-1 rounded-full border border-hairline self-start sm:self-auto">
              {filteredItems.length} بلاغ معروض
            </span>
          )}
        </div>

        {/* Access Restriction Check for Reports Table */}
        {!isAdmin ? (
          <div className="bg-surface-subtle border border-hairline rounded-2xl p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-accent-amber-soft border border-accent-amber/30 text-accent-amber mx-auto flex items-center justify-center shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-base text-ink">صلاحية الوصول مقيدة</h3>
              <p className="text-xs text-mute">
                عذراً، هذا القسم مقيد ويتطلب صلاحيات خاصة للوصول إليه.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Status Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {[
                  { id: 'all', label: 'كافة البلاغات' },
                  { id: 'review', label: 'قيد المراجعة' },
                  { id: 'matched', label: 'تم العثور عليه' },
                  { id: 'claimed', label: 'بانتظار التسليم' },
                  { id: 'handed_over', label: 'مكتمل ومُسلّم' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setReportStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      reportStatusFilter === tab.id
                        ? 'bg-brand-emerald text-white shadow-sm'
                        : 'bg-surface-soft text-body hover:text-ink hover:bg-surface-subtle'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Type Select */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-mute absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم، الكود، أو الموقع..."
                    className="w-full pl-3 pr-9 py-2 text-xs bg-surface-soft border border-hairline rounded-xl text-ink placeholder-mute focus:outline-none focus:border-brand-mint"
                  />
                </div>

                <select
                  value={reportTypeFilter}
                  onChange={e => setReportTypeFilter(e.target.value as any)}
                  className="py-2 px-3 text-xs bg-surface-soft border border-hairline rounded-xl text-ink font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">كل الأنواع</option>
                  <option value="lost">مفقودات فقط</option>
                  <option value="found">موجودات فقط</option>
                </select>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-2xl border border-hairline">
              <table className="w-full text-right text-xs divide-y divide-hairline">
                <thead className="bg-surface-subtle text-mute font-bold">
                  <tr>
                    <th className="px-4 py-3.5">رمز البلاغ والغرض</th>
                    <th className="px-4 py-3.5">النوع والتصنيف</th>
                    <th className="px-4 py-3.5">الموقع والصرح</th>
                    <th className="px-4 py-3.5">صاحب البلاغ / التواصل</th>
                    <th className="px-4 py-3.5">الحالة الحالية</th>
                    <th className="px-4 py-3.5 text-center">الإجراءات والقرارات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline bg-surface-card">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-mute">
                        لا توجد بلاغات تطابق شروط البحث والفلترة المحددة.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                      const statusInfo = statusLabels[item.status] || statusLabels.active;
                      return (
                        <tr key={item.id} className="hover:bg-surface-soft/40 transition-colors">
                          {/* Code & Title */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-soft border border-hairline flex-shrink-0">
                                <img
                                  src={item.images?.[0] || '/images/examples/car_key.png'}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span className="font-mono text-[11px] font-bold text-brand-forest block">
                                  {item.trackingCode}
                                </span>
                                <span className="font-bold text-ink text-xs line-clamp-1">{item.title}</span>
                              </div>
                            </div>
                          </td>

                          {/* Type & Category */}
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${
                                item.type === 'lost'
                                  ? 'bg-accent-red-soft text-accent-red'
                                  : 'bg-accent-green-soft text-brand-forest'
                              }`}
                            >
                              {item.type === 'lost' ? 'مفقود' : 'موجود بالأمانات'}
                            </span>
                            <span className="text-[11px] text-mute block">{item.category}</span>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-ink text-xs block">{item.location?.campus}</span>
                            <span className="text-[11px] text-mute block">{item.location?.building}</span>
                          </td>

                          {/* Reporter Contact */}
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-ink text-xs block">{item.reporter?.name || 'مستخدم'}</span>
                            <span className="text-[11px] font-mono text-mute block">{item.reporter?.phone || '0501234567'}</span>
                          </td>

                          {/* Status Dropdown/Badge */}
                          <td className="px-4 py-3.5">
                            <select
                              value={item.status}
                              onChange={e => {
                                updateItemStatus(item.id, e.target.value as ItemStatus);
                                showToast('success', 'تم تحديث حالة البلاغ', `تم تعديل حالة الغرض (${item.trackingCode}) بنجاح.`);
                              }}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${statusInfo.bg}`}
                            >
                              <option value="active">قيد البحث والتحقق</option>
                              <option value="in_verification">قيد المراجعة</option>
                              <option value="matched">تم العثور عليه (مطابق)</option>
                              <option value="claimed">بانتظار التسليم</option>
                              <option value="handed_over">مكتمل ومُسلّم</option>
                              <option value="closed">مغلق</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => setSelectedItemId(item.id)}
                                title="عرض تفاصيل الغرض"
                                className="p-1.5 rounded-lg border border-hairline hover:bg-surface-soft text-body hover:text-ink transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Contact Reporter */}
                              <button
                                onClick={() => {
                                  showToast(
                                    'info',
                                    'بيانات التواصل',
                                    `المبلغ: ${item.reporter?.name} | الجوال: ${item.reporter?.phone || '0501234567'}`
                                  );
                                }}
                                title="التواصل مع صاحب البلاغ"
                                className="p-1.5 rounded-lg border border-hairline hover:bg-surface-soft text-brand-forest hover:text-brand-emerald transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                              </button>

                              {/* Generate Handover Receipt */}
                              <button
                                onClick={() => handleOpenReceiptForItem(item)}
                                title="إصدار سند استلام رسمي"
                                className="p-1.5 rounded-lg bg-brand-50 border border-brand-mint/40 hover:bg-brand-100 text-brand-forest transition-colors"
                              >
                                <FileCheck2 className="w-4 h-4" />
                              </button>

                              {/* Delete Report */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`هل أنت متأكد من رغبتك في حذف البلاغ (${item.trackingCode}) نهائياً؟`)) {
                                    deleteItem(item.id);
                                  }
                                }}
                                title="حذف البلاغ نهائياً"
                                className="p-1.5 rounded-lg border border-hairline hover:bg-accent-red-soft/50 text-mute hover:text-accent-red transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* 5. Hotspots & Category Analytics (Visual Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotspots Bar Chart */}
        <div className="lg:col-span-2 bg-surface-card border border-hairline rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-hairline-soft pb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-ink">أبرز مواقع ونقاط الفقدان الساخنة (Hotspots)</h3>
              <p className="text-xs text-mute">تحليل جغرافي للمواقع الأكثر تسجيلاً للبلاغات مع معدل حلها</p>
            </div>
            <span className="text-xs font-mono text-brand-forest bg-accent-green-soft px-2.5 py-1 rounded">
              تحديث فوري
            </span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotspotData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF4F0" />
                <XAxis dataKey="name" stroke="#5A6F64" fontSize={11} />
                <YAxis stroke="#5A6F64" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2EBE6', borderRadius: '12px', fontSize: '11px', textAlign: 'right' }}
                />
                <Bar dataKey="count" name="إجمالي البلاغات" fill="#1B4332" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name="تمت استعادتها" fill="#52B788" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-surface-card border border-hairline rounded-3xl p-6 shadow-card space-y-4">
          <div className="border-b border-hairline-soft pb-3">
            <h3 className="font-bold text-sm sm:text-base text-ink">توزيع البلاغات حسب التصنيف</h3>
            <p className="text-xs text-mute">النسب المئوية للأغراض الأكثر تكراراً</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-hairline-soft text-xs">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-body font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-ink font-mono">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Monthly Recovery Trend Area Chart */}
      <div className="bg-surface-card border border-hairline rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-hairline-soft pb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-ink">مسار النمو ونسب الاسترجاع الشهرية</h3>
            <p className="text-xs text-mute">مقارنة شهرية بين البلاغات المسجلة والأغراض المسلمة لأصحابها</p>
          </div>
          <span className="text-xs font-mono text-brand-forest bg-accent-green-soft px-2.5 py-1 rounded">
            معدل استرجاع تصاعدي
          </span>
        </div>

        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReported" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRecovered" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#52B788" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#52B788" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF4F0" />
              <XAxis dataKey="month" stroke="#5A6F64" fontSize={11} />
              <YAxis stroke="#5A6F64" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2EBE6', borderRadius: '12px', fontSize: '11px', textAlign: 'right' }}
              />
              <Area type="monotone" dataKey="reported" name="البلاغات المسجلة" stroke="#2D6A4F" strokeWidth={2} fillOpacity={1} fill="url(#colorReported)" />
              <Area type="monotone" dataKey="recovered" name="الأغراض المسترجعة" stroke="#52B788" strokeWidth={2} fillOpacity={1} fill="url(#colorRecovered)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Handover Receipt Modal */}
      {selectedReceiptClaim && (
        <HandoverReceiptModal
          claim={selectedReceiptClaim}
          onClose={() => setSelectedReceiptClaim(null)}
        />
      )}
    </div>
  );
};
