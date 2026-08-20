import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  X,
  FileText,
  FileCheck2,
  ChevronLeft
} from 'lucide-react';
import { AIMatchResult } from '../../types';

export const AIMatchRadarModal: React.FC = () => {
  const {
    activeScanItem,
    setActiveScanItem,
    activeScanMatches,
    setSelectedItemId,
    setSelectedClaimId,
    setCurrentPage
  } = useApp();

  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    if (activeScanItem) {
      setIsScanning(true);
      setScanStep(0);

      const timer1 = setTimeout(() => setScanStep(1), 600);
      const timer2 = setTimeout(() => setScanStep(2), 1200);
      const timer3 = setTimeout(() => {
        setScanStep(3);
        setIsScanning(false);
      }, 1800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [activeScanItem]);

  if (!activeScanItem) return null;

  const topMatch = activeScanMatches.length > 0 ? activeScanMatches[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-card border border-hairline rounded-lg shadow-lift w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-surface-subtle border-b border-hairline px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-brand-emerald text-white flex items-center justify-center shadow-flat">
              <FileCheck2 className="w-4 h-4 text-brand-mint" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">نظام المطابقة والتحقق الفوري (عائد)</h3>
              <p className="text-xs text-mute">فحص فوري في قاعدة بيانات المفقودات والموجودات المركزية</p>
            </div>
          </div>

          <button
            onClick={() => setActiveScanItem(null)}
            className="text-mute hover:text-ink p-1.5 rounded-md hover:bg-surface-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Target Item summary badge */}
          <div className="bg-surface-soft/60 border border-hairline-soft rounded-md p-3.5 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {activeScanItem.images?.[0] ? (
                <img
                  src={activeScanItem.images[0]}
                  alt={activeScanItem.title}
                  className="w-12 h-12 rounded object-cover border border-hairline flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-surface-card border border-hairline flex items-center justify-center text-mute font-mono text-xs">
                  {activeScanItem.category.substring(0, 2)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeScanItem.type === 'lost' ? 'bg-accent-red-soft text-accent-red' : 'bg-accent-green-soft text-brand-forest'
                  }`}>
                    {activeScanItem.type === 'lost' ? 'مفقود' : 'موجود'}
                  </span>
                  <span className="font-mono text-xs text-mute">{activeScanItem.trackingCode}</span>
                </div>
                <h4 className="font-bold text-sm text-ink mt-0.5">{activeScanItem.title}</h4>
              </div>
            </div>

            <div className="text-left text-xs text-mute font-mono hidden sm:block">
              <div>{activeScanItem.location.building}</div>
              <div className="text-[11px] text-stone">{activeScanItem.location.campus}</div>
            </div>
          </div>

          {/* Scanning Animation State */}
          {isScanning ? (
            <div className="py-10 text-center flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                {/* Concentric Radar Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-brand-mint/20 animate-pulse-ring" />
                <div className="absolute inset-3 rounded-full border border-brand-forest/30" />
                <div className="absolute inset-8 rounded-full border-2 border-brand-emerald/40" />
                
                {/* Rotating Radar Sweep */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-mint/20 via-transparent to-transparent animate-radar" />
                
                {/* Central Core Icon */}
                <div className="relative w-12 h-12 rounded-full bg-brand-emerald text-brand-mint flex items-center justify-center shadow-lift">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-base text-brand-emerald">
                  {scanStep === 0 && 'تحليل الكلمات المفتاحية والدلالات النصية...'}
                  {scanStep === 1 && 'استخراج المعالم البصرية ومطابقة الأنماط...'}
                  {scanStep === 2 && 'حساب القرب الجغرافي والارتباط الزمني...'}
                  {scanStep === 3 && 'ترتيب وتصنيف درجات الثقة...'}
                </h4>
                <div className="w-64 h-1.5 bg-surface-soft rounded-full mx-auto overflow-hidden">
                  <div
                    className="h-full bg-brand-forest transition-all duration-300 rounded-full"
                    style={{ width: `${(scanStep + 1) * 25}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Results Presentation */
            <div>
              {activeScanMatches.length === 0 || (topMatch && topMatch.totalScore < 40) ? (
                <div className="text-center py-8 bg-surface-soft/40 rounded-md border border-hairline-soft p-6">
                  <div className="w-12 h-12 rounded-full bg-surface-card border border-hairline mx-auto flex items-center justify-center text-mute mb-3">
                    <AlertTriangle className="w-6 h-6 text-mute" />
                  </div>
                  <h4 className="font-bold text-sm text-ink">لم يتم العثور على تطابق فوري في السجلات حالياً</h4>
                  <p className="text-xs text-mute mt-1 max-w-md mx-auto">
                    تم حفظ وتوثيق بلاغك بنجاح. يواصل النظام فحص السجلات ومطابقة البلاغات الجديدة تلقائياً وإشعارك فور تسجيل أي غرض مطابق.
                  </p>
                  <button
                    onClick={() => setActiveScanItem(null)}
                    className="mt-5 btn-secondary text-xs"
                  >
                    إغلاق ومتابعة التصفح
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Top Match Highlight Card */}
                  {topMatch && (
                    <div className="border-2 border-brand-mint/60 bg-surface-card rounded-md p-4 shadow-lift transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          {topMatch.foundItem?.images?.[0] || topMatch.lostItem?.images?.[0] ? (
                            <img
                              src={(topMatch.foundItem?.images?.[0] || topMatch.lostItem?.images?.[0])}
                              alt="Matched Item"
                              className="w-16 h-16 rounded object-cover border border-hairline flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded bg-surface-soft border border-hairline flex items-center justify-center text-brand-forest font-bold">
                              {topMatch.totalScore}%
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-white bg-brand-forest px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-flat">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                تطابق ذكي: {topMatch.totalScore}%
                              </span>
                              <span className="text-xs font-mono text-mute">
                                {topMatch.foundItem?.trackingCode || topMatch.lostItem?.trackingCode}
                              </span>
                            </div>

                            <h4 className="font-bold text-sm sm:text-base text-ink mt-1">
                              {topMatch.foundItem?.title || topMatch.lostItem?.title}
                            </h4>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mute mt-1.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-stone" />
                                {topMatch.foundItem?.location.building || topMatch.lostItem?.location.building}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-stone" />
                                {new Date(topMatch.foundItem?.dateTime || topMatch.lostItem?.dateTime || '').toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Confidence Metric Circle */}
                        <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-surface-subtle rounded-md border border-hairline-soft min-w-[90px]">
                          <span className="text-2xl font-black text-brand-emerald">{topMatch.totalScore}%</span>
                          <span className="text-[10px] font-bold text-brand-forest uppercase">ثقة مرتفعة</span>
                        </div>
                      </div>

                      {/* 5-Factor Score Breakdown Progress */}
                      <div className="mt-4 pt-3 border-t border-hairline-soft grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                        <div className="bg-surface-soft/70 p-2 rounded">
                          <span className="text-mute block text-[10px]">دلالة النص (35%)</span>
                          <span className="font-bold text-ink">{topMatch.breakdown.textScore}%</span>
                        </div>
                        <div className="bg-surface-soft/70 p-2 rounded">
                          <span className="text-mute block text-[10px]">الصورة والرؤية (30%)</span>
                          <span className="font-bold text-ink">{topMatch.breakdown.imageScore}%</span>
                        </div>
                        <div className="bg-surface-soft/70 p-2 rounded">
                          <span className="text-mute block text-[10px]">الموقع (20%)</span>
                          <span className="font-bold text-ink">{topMatch.breakdown.locationScore}%</span>
                        </div>
                        <div className="bg-surface-soft/70 p-2 rounded">
                          <span className="text-mute block text-[10px]">الزمن (10%)</span>
                          <span className="font-bold text-ink">{topMatch.breakdown.timeScore}%</span>
                        </div>
                        <div className="bg-surface-soft/70 p-2 rounded col-span-2 sm:col-span-1">
                          <span className="text-mute block text-[10px]">الفئة (5%)</span>
                          <span className="font-bold text-ink">{topMatch.breakdown.categoryScore}%</span>
                        </div>
                      </div>

                      {/* Top Match Reasoning bullets */}
                      <div className="mt-3 bg-surface-subtle p-3 rounded text-xs text-body space-y-1">
                        <span className="font-bold text-ink text-[11px] block">أسباب المطابقة المستخرجة:</span>
                        {topMatch.reasons.map((reason, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-brand-forest font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-mint" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            const itemId = topMatch.foundItemId || topMatch.lostItemId;
                            setSelectedItemId(itemId);
                            setActiveScanItem(null);
                          }}
                          className="btn-secondary text-xs h-9"
                        >
                          <FileText className="w-4 h-4" />
                          <span>معاينة بيانات الغرض</span>
                        </button>
                        <button
                          onClick={() => {
                            const itemId = topMatch.foundItemId || topMatch.lostItemId;
                            setSelectedItemId(itemId);
                            setActiveScanItem(null);
                          }}
                          className="btn-primary text-xs h-9"
                        >
                          <span>تقديم إثبات ملكية الآن</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
