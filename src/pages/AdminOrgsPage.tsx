import React, { useState } from 'react';
import { ORGANIZATIONS } from '../services/mockDatabase';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Layers,
  MapPin,
  PlusCircle,
  CheckCircle2,
  Shield,
  Search,
  ChevronLeft,
  Lock
} from 'lucide-react';
import { Organization, Item } from '../types';

export const AdminOrgsPage: React.FC = () => {
  const { items, currentUser, showToast } = useApp();
  const isAdmin = currentUser?.role === 'admin';
  const [orgsList, setOrgsList] = useState<Organization[]>(ORGANIZATIONS);
  const [selectedOrg, setSelectedOrg] = useState<Organization>(ORGANIZATIONS[0]);
  const [newBuildingName, setNewBuildingName] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-accent-amber-soft border border-accent-amber/30 text-accent-amber mx-auto flex items-center justify-center shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-ink">صلاحية الوصول مقيدة</h2>
          <p className="text-xs text-mute">
            عذراً، هذا القسم مقيد ويتطلب صلاحيات خاصة للوصول إليه.
          </p>
        </div>
      </div>
    );
  }

  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) return;

    const newBuilding = {
      id: `b_${Date.now()}`,
      name: newBuildingName.trim(),
      floors: ['الدور الأرضي', 'الدور الأول'],
      zones: ['المدخل الرئيسي', 'صالة الاستقبال']
    };

    const updatedOrgs = orgsList.map(o => {
      if (o.id === selectedOrg.id) {
        return {
          ...o,
          buildings: [...o.buildings, newBuilding]
        };
      }
      return o;
    });

    setOrgsList(updatedOrgs);
    setSelectedOrg({
      ...selectedOrg,
      buildings: [...selectedOrg.buildings, newBuilding]
    });
    setNewBuildingName('');
    showToast('success', 'تم إضافة المبنى بنجاح', `تم تسجيل "${newBuilding.name}" ضمن ${selectedOrg.name}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="bg-brand-emerald text-white text-xs font-bold px-2 py-0.5 rounded">
            إدارة المنشآت والمواقع
          </span>
          <span className="text-xs text-mute font-mono">Super Admin Control</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
          إدارة الصروح المؤسسية والمباني التابعة
        </h1>
        <p className="text-xs sm:text-sm text-mute mt-0.5">
          تهيئة المجمعات الجامعية، المطارات، والمستشفيات، وتحديد خريطة المباني والقاعات
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Organizations List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-mute uppercase tracking-wider block">
            المنشآت المسجلة في عائد ({orgsList.length})
          </span>
          <div className="space-y-2">
            {orgsList.map(org => {
              const orgItemCount = items.filter((i: Item) => i.organizationId === org.id).length;
              const isSelected = selectedOrg.id === org.id;

              return (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className={`p-4 rounded-md border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-surface-card border-brand-emerald shadow-lift ring-1 ring-brand-mint/40'
                      : 'bg-surface-card border-hairline hover:border-brand-forest'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-soft border border-hairline flex items-center justify-center text-brand-emerald flex-shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-ink">{org.name}</h3>
                      <span className="text-xs text-mute font-mono">{org.city} • {org.type}</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-xs font-bold text-brand-forest font-mono">{orgItemCount}</span>
                    <span className="text-[10px] text-mute block">غرض مسجل</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Org Details & Building Directory */}
        <div className="md:col-span-2 space-y-6">
          {/* Org Banner Card */}
          <div className="card-flat bg-surface-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hairline-soft">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-soft border border-brand-mint/30 flex items-center justify-center text-brand-emerald shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-ink">{selectedOrg.name}</h2>
                  <p className="text-xs text-mute font-mono">{selectedOrg.nameEn} - {selectedOrg.city}</p>
                </div>
              </div>
              <span className="bg-brand-50 text-brand-forest border border-brand-mint/30 px-3 py-1 rounded text-xs font-bold font-mono">
                {selectedOrg.buildings.length} مباني ومرافق
              </span>
            </div>

            {/* Buildings Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                دليل المباني والأدوار والقاعات
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedOrg.buildings.map(b => (
                  <div key={b.id} className="p-3.5 rounded bg-surface-subtle border border-hairline-soft space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-ink">
                      <Building2 className="w-4 h-4 text-brand-forest flex-shrink-0" />
                      <span>{b.name}</span>
                    </div>

                    <div className="text-[11px] text-mute space-y-1">
                      <div>
                        الأدوار: <strong className="text-body">{b.floors.join(' • ')}</strong>
                      </div>
                      <div>
                        المناطق: <strong className="text-body">{b.zones.join(' • ')}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Building Form */}
            <form onSubmit={handleAddBuilding} className="pt-4 border-t border-hairline-soft flex gap-2">
              <input
                type="text"
                value={newBuildingName}
                onChange={e => setNewBuildingName(e.target.value)}
                placeholder="إضافة مبنى أو كلية جديدة إلى المنشأة..."
                className="flex-1 bg-surface-subtle border border-hairline rounded-md px-3 py-2 text-xs text-ink focus:outline-none focus:border-brand-emerald"
              />
              <button
                type="submit"
                className="btn-primary text-xs h-9 px-4 flex-shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة مبنى</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
