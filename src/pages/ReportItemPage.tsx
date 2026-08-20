import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ItemType,
  ItemLocation
} from '../types';
import {
  ORGANIZATIONS,
  CATEGORIES
} from '../services/mockDatabase';
import {
  Upload,
  Sparkles,
  Camera,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Lock,
  Tag,
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Info,
  X,
  Trash2,
  LogIn,
  Image as ImageIcon
} from 'lucide-react';

interface ReportItemPageProps {
  initialType?: ItemType;
}

// Sample realistic images for quick selection in demo/testing
const SAMPLE_PRESET_IMAGES: Record<string, string[]> = {
  'إلكترونيات وأجهزة ذكية': [
    '/images/examples/iphone.png',
    '/images/examples/airpods.png',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  ],
  'حقائب ومحافظ': [
    '/images/examples/wallet.png',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
  ],
  'مفاتيح وأجهزة تحكم': [
    '/images/examples/car_key.png',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'
  ],
  'ساعات ومجوهرات وإكسسوارات': [
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
  ]
};

export const ReportItemPage: React.FC<ReportItemPageProps> = ({ initialType = 'lost' }) => {
  const {
    currentUser,
    isLoggedIn,
    addItem,
    setCurrentPage,
    showToast
  } = useApp();

  const [type, setType] = useState<ItemType>(initialType);
  const [selectedOrgId, setSelectedOrgId] = useState<string>(currentUser.organizationId || ORGANIZATIONS[0].id);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0].name);
  const [subcategory, setSubcategory] = useState<string>(CATEGORIES[0].subcategories[0]);
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [secretDetails, setSecretDetails] = useState('');
  
  // Location
  const currentOrg = ORGANIZATIONS.find(o => o.id === selectedOrgId) || ORGANIZATIONS[0];
  const [building, setBuilding] = useState(currentOrg.buildings[0].name);
  const [floor, setFloor] = useState(currentOrg.buildings[0].floors[0] || 'الدور الأرضي');
  const [roomOrZone, setRoomOrZone] = useState('');
  
  // Date & Time
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  
  // Images Upload
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    let addedCount = 0;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setImages(prev => {
            if (prev.includes(result)) return prev;
            return [...prev, result];
          });
          addedCount++;
        }
      };
      reader.readAsDataURL(file);
    });

    if (showToast) {
      showToast('success', 'تم استلام الصورة', 'تم رفع وتجهيز الصورة بنجاح.');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Helper when category changes to update subcategory
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const def = CATEGORIES.find(c => c.name === newCat);
    if (def && def.subcategories.length > 0) {
      setSubcategory(def.subcategories[0]);
    }
  };

  const handleOrgChange = (newOrgId: string) => {
    setSelectedOrgId(newOrgId);
    const org = ORGANIZATIONS.find(o => o.id === newOrgId);
    if (org && org.buildings.length > 0) {
      setBuilding(org.buildings[0].name);
      setFloor(org.buildings[0].floors[0] || 'الدور الأرضي');
    }
  };

  const addPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('info', 'تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لتتمكن من إرسال وتوثيق البلاغ.');
      setCurrentPage('login');
      return;
    }

    if (!title || !description) {
      alert('يرجى كتابة العنوان والوصف.');
      return;
    }

    setIsSubmitting(true);

    const fullDateTime = `${date}T${time}:00Z`;

    const location: ItemLocation = {
      campus: currentOrg.name,
      building,
      floor,
      roomOrZone: roomOrZone || undefined
    };

    setTimeout(() => {
      addItem({
        type,
        title,
        category,
        subcategory,
        brand: brand || undefined,
        color: color || undefined,
        description,
        secretDetails: secretDetails || undefined,
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'
        ],
        organizationId: selectedOrgId,
        organizationName: currentOrg.name,
        location,
        dateTime: fullDateTime,
        reporter: {
          id: currentUser.id,
          name: currentUser.name,
          phone: currentUser.phone,
          email: currentUser.email
        },
        status: 'active'
      });

      setIsSubmitting(false);
    }, 500);
  };

  const presetImages = SAMPLE_PRESET_IMAGES[category] || [];

  // If user is not logged in, show clean authentication required screen
  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-950 text-brand-mint mx-auto flex items-center justify-center shadow-lift border border-brand-mint/30">
          <Lock className="w-8 h-8 text-brand-mint" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-ink">تسجيل الدخول مطلوب لإضافة بلاغ</h2>
          <p className="text-xs sm:text-sm text-mute leading-relaxed max-w-md mx-auto">
            يتطلب نظام الأمانات والتوثيق الموحد تسجيل الدخول لربط البلاغ بهويتك وتلقي إشعارات المطابقة الفورية وإصدار رمز التحقق المعتمد.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentPage('login')}
            className="w-full sm:w-auto btn-gradient font-bold text-xs sm:text-sm px-8 py-3 rounded-xl shadow-lift flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول الآن</span>
          </button>
          <button
            onClick={() => setCurrentPage('landing')}
            className="w-full sm:w-auto btn-secondary text-xs sm:text-sm px-6 py-3 rounded-xl"
          >
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Banner / Switch */}
      <div className="text-center max-w-xl mx-auto mb-8 space-y-3">
        <div className="inline-flex p-1 bg-surface-soft rounded-lg border border-hairline">
          <button
            type="button"
            onClick={() => setType('lost')}
            className={`px-5 py-2 rounded-md text-xs font-bold transition-all ${
              type === 'lost'
                ? 'bg-accent-red text-white shadow-flat'
                : 'text-body hover:text-ink'
            }`}
          >
            سجل بلاغ مفقود (Lost Item)
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            className={`px-5 py-2 rounded-md text-xs font-bold transition-all ${
              type === 'found'
                ? 'bg-brand-emerald text-white shadow-flat'
                : 'text-body hover:text-ink'
            }`}
          >
            سجل غرض موجود (Found Item)
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
          {type === 'lost' ? 'تسجيل بلاغ عن غرض مفقود' : 'تسجيل وإيداع غرض موجود بالأمانات'}
        </h1>
        <p className="text-xs sm:text-sm text-mute leading-relaxed">
          أدخل بيانات ومواصفات الغرض بدقة لتفعيل التدقيق والمطابقة المباشرة مع سجلات الأمانات المعتمدة.
        </p>
      </div>

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="card-flat bg-surface-card space-y-8">
        {/* Section 1: Organization & Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-hairline-soft pb-2">
            <Building2 className="w-4 h-4 text-brand-forest" />
            <h3 className="font-bold text-sm text-ink">1. المنشأة وموقع الفقدان / العثور</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">المنشأة أو الصرح المؤسسي *</label>
              <select
                value={selectedOrgId}
                onChange={e => handleOrgChange(e.target.value)}
                className="w-full bg-surface-subtle border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              >
                {ORGANIZATIONS.map(org => (
                  <option key={org.id} value={org.id}>{org.name} ({org.city})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">المبنى / الصالة / الكلية *</label>
              <select
                value={building}
                onChange={e => setBuilding(e.target.value)}
                className="w-full bg-surface-subtle border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              >
                {currentOrg.buildings.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الدور أو الطابق</label>
              <input
                type="text"
                value={floor}
                onChange={e => setFloor(e.target.value)}
                placeholder="مثال: الدور الثاني، القبو، بهو الاستقبال..."
                className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">القاعة أو المنطقة المحددة</label>
              <input
                type="text"
                value={roomOrZone}
                onChange={e => setRoomOrZone(e.target.value)}
                placeholder="مثال: قاعة 104، طاولة كافتيريا، طاولة 5 بالمكتبة..."
                className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Item Details & Category */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-hairline-soft pb-2">
            <Tag className="w-4 h-4 text-brand-forest" />
            <h3 className="font-bold text-sm text-ink">2. تصنيف ومواصفات الغرض</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">الفئة الرئيسية *</label>
              <select
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full bg-surface-subtle border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">الفئة الفرعية</label>
              <select
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                className="w-full bg-surface-subtle border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              >
                {CATEGORIES.find(c => c.name === category)?.subcategories.map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              عنوان البلاغ (واضح ومختصر) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: سماعة AirPods Pro بيضاء داخل كفر كحلي"
              className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">العلامة التجارية (Brand)</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="مثال: Apple, Samsung, Sony, Ray-Ban..."
                className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">اللون الأساسي</label>
              <input
                type="text"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="مثال: أبيض، أسود، كحلي، بني جلد..."
                className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              الوصف العام المرئي (يظهر للعامة للمساعدة بالتعرف) *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="صف مظهر الغرض، حالته العامة، وأين قد يكون تُرك..."
              className="w-full bg-surface-card border border-hairline rounded-md p-3 text-xs text-ink focus:outline-none focus:border-brand-emerald resize-none"
            />
          </div>
        </div>

        {/* Section 3: Date & Time */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-hairline-soft pb-2">
            <Clock className="w-4 h-4 text-brand-forest" />
            <h3 className="font-bold text-sm text-ink">3. التوقيت الزمني التقريبي</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">التاريخ *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الساعة التقريبية *</label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-surface-card border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Secret Details (Critical for Verification) */}
        <div className="space-y-3 bg-surface-subtle p-5 rounded-md border border-brand-mint/40">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-forest" />
            <div>
              <h3 className="font-bold text-sm text-brand-emerald">4. تفاصيل وعلامات سرية لإثبات الملكية</h3>
              <p className="text-[11px] text-mute">
                لن تظهر هذه البيانات للعامة! ستستخدم فقط في استبيان التحقق السري لمسؤول الأمانات.
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            value={secretDetails}
            onChange={e => setSecretDetails(e.target.value)}
            placeholder="مثال: يوجد استيكر خلفي صغير، صورة شاشة القفل، الاسم المقترن بالبلوتوث، محتويات سرية داخل الجيب..."
            className="w-full bg-surface-card border border-hairline rounded-md p-3 text-xs text-ink focus:outline-none focus:border-brand-emerald resize-none"
          />
        </div>

        {/* Section 5: Image Upload / Preset selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-hairline-soft pb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-forest" />
              <h3 className="font-bold text-sm text-ink">5. صور الغرض (الرفع المباشر)</h3>
            </div>
            {images.length > 0 && (
              <span className="text-xs font-bold text-brand-forest bg-accent-green-soft px-2.5 py-0.5 rounded-full">
                تم تجهيز {images.length} صورة
              </span>
            )}
          </div>

          {/* Uploaded Images Preview Gallery */}
          {images.length > 0 && (
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-ink">الصور المرفقة بالبلاغ:</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group h-24 rounded-2xl overflow-hidden border-2 border-brand-mint shadow-sm bg-white">
                    <img src={imgUrl} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 left-1 bg-accent-red text-white p-1 rounded-full shadow-md hover:bg-red-700 transition-colors opacity-90 group-hover:opacity-100"
                      title="حذف الصورة"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
            multiple
            className="hidden"
          />

          {/* Interactive Drag & Drop / Click to Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-brand-emerald bg-brand-50/60 scale-[0.99]'
                : 'border-hairline hover:border-brand-mint bg-surface-subtle/50 hover:bg-surface-soft/60'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-hairline shadow-sm flex items-center justify-center mx-auto mb-3 text-brand-emerald">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-ink">انقر لاختيار صور من جهازك أو اسحبها وأفلتها هنا</p>
            <p className="text-xs text-mute mt-1">يدعم ملفات JPG, PNG, WEBP (يمكنك اختيار عدة صور معاً)</p>
          </div>

          {/* Quick presets library */}
          {presetImages.length > 0 && (
            <div className="pt-2 border-t border-hairline-soft">
              <span className="text-[11px] font-bold text-mute mb-2 block">
                أو اختر صورة توضيحية جاهزة:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {presetImages.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => addPresetImage(imgUrl)}
                    className={`h-20 rounded-xl overflow-hidden border-2 cursor-pointer relative group transition-all bg-white ${
                      images.includes(imgUrl)
                        ? 'border-brand-emerald ring-2 ring-brand-mint/40'
                        : 'border-hairline hover:border-brand-forest'
                    }`}
                  >
                    <img src={imgUrl} alt="Preset" className="w-full h-full object-contain p-1" />
                    {images.includes(imgUrl) && (
                      <div className="absolute inset-0 bg-brand-emerald/30 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-hairline-soft flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentPage('landing')}
            className="btn-secondary text-xs"
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-xs sm:text-sm h-11 px-8 shadow-lift"
          >
            <CheckCircle2 className="w-4 h-4 text-brand-mint" />
            <span>{isSubmitting ? 'جاري توثيق البلاغ...' : 'اعتماد وتسجيل البلاغ'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
