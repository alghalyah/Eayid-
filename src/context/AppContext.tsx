import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Item,
  ClaimRequest,
  NotificationItem,
  AIMatchResult
} from '../types';
import {
  MOCK_USERS,
  loadItemsFromStorage,
  saveItemsToStorage,
  loadClaimsFromStorage,
  saveClaimsToStorage,
  loadNotificationsFromStorage,
  saveNotificationsToStorage
} from '../services/mockDatabase';
import { scanAndRankMatches } from '../services/aiMatchingEngine';
import confetti from 'canvas-confetti';

export type PageView = 
  | 'landing' 
  | 'browse' 
  | 'report_lost' 
  | 'report_found' 
  | 'claims_queue' 
  | 'dashboard' 
  | 'admin_orgs'
  | 'my_items'
  | 'login';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  browseFilterType: 'all' | 'lost' | 'found';
  setBrowseFilterType: (type: 'all' | 'lost' | 'found') => void;
  items: Item[];
  claims: ClaimRequest[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedClaimId: string | null;
  setSelectedClaimId: (id: string | null) => void;
  activeScanItem: Item | null;
  setActiveScanItem: (item: Item | null) => void;
  activeScanMatches: AIMatchResult[];
  
  // Actions
  addItem: (item: Omit<Item, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt'>) => Item;
  updateItemStatus: (id: string, status: Item['status']) => void;
  deleteItem: (id: string) => void;
  submitClaim: (claim: Omit<ClaimRequest, 'id' | 'trackingNumber' | 'status' | 'createdAt'>) => ClaimRequest;
  reviewClaim: (claimId: string, status: 'approved' | 'rejected', notes?: string) => void;
  completeHandover: (claimId: string, officerName: string, idNumber: string, location: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aed_logged_in_v9') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('aed_current_user_v9');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_USERS[0];
  });

  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [browseFilterType, setBrowseFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [items, setItems] = useState<Item[]>(loadItemsFromStorage);
  const [claims, setClaims] = useState<ClaimRequest[]>(loadClaimsFromStorage);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('aed_logged_in_v9') === 'true') {
      return loadNotificationsFromStorage();
    }
    return [];
  });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [activeScanItem, setActiveScanItem] = useState<Item | null>(null);
  const [activeScanMatches, setActiveScanMatches] = useState<AIMatchResult[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const login = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('aed_logged_in_v9', 'true');
      localStorage.setItem('aed_current_user_v9', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setNotifications(loadNotificationsFromStorage());
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('aed_logged_in_v9');
      localStorage.removeItem('aed_current_user_v9');
    } catch (e) {
      console.error(e);
    }
    setNotifications([]);
    showToast('info', 'تسجيل الخروج', 'تم تسجيل خروجك بنجاح.');
  };

  // Sync with storage on state updates
  useEffect(() => {
    saveItemsToStorage(items);
  }, [items]);

  useEffect(() => {
    saveClaimsToStorage(claims);
  }, [claims]);

  useEffect(() => {
    if (isLoggedIn) {
      saveNotificationsToStorage(notifications);
    }
  }, [notifications, isLoggedIn]);

  const visibleNotifications = isLoggedIn ? notifications : [];
  const unreadNotifsCount = isLoggedIn ? visibleNotifications.filter(n => !n.read).length : 0;

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1B4332', '#2D6A4F', '#52B788', '#F7A501', '#2C84E0']
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  const switchRole = (role: UserRole) => {
    const targetUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(targetUser);
    showToast(
      'info',
      'تم تغيير الدور',
      `تم التبديل إلى: ${targetUser.name} (${role === 'user' ? 'مستخدم عادي' : role === 'staff' ? 'مسؤول المفقودات' : 'مدير النظام'})`
    );
  };

  // Add Item & trigger immediate AI scan
  const addItem = (itemData: Omit<Item, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt'>): Item => {
    const now = new Date().toISOString();
    const prefix = itemData.type === 'lost' ? 'AED-L' : 'AED-F';
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `${prefix}-${randomCode}`;
    const id = `item_${itemData.type}_${Date.now()}`;

    const newItem: Item = {
      ...itemData,
      id,
      trackingCode,
      createdAt: now,
      updatedAt: now,
      viewsCount: 1
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);

    // Run AI scan against existing items
    const matches = scanAndRankMatches(newItem, updatedItems);
    setActiveScanItem(newItem);
    setActiveScanMatches(matches);

    // If top match has high confidence (>80%), create notification
    if (matches.length > 0 && matches[0].totalScore >= 80) {
      const topMatch = matches[0];
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: `🎯 تطابق ذكي فائق بنسبة ${topMatch.totalScore}%!`,
        message: `تم العثور على تطابق قوي للبلاغ "${newItem.title}" مع "${topMatch.foundItem?.title || topMatch.lostItem?.title}".`,
        type: 'match',
        read: false,
        createdAt: now,
        linkItemId: topMatch.foundItemId,
        score: topMatch.totalScore
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    showToast(
      'success',
      'تم تسجيل البلاغ بنجاح',
      `رمز التتبع الخاص بك هو: ${trackingCode}. جاري فحص التطابقات الذكية...`
    );

    return newItem;
  };

  const updateItemStatus = (id: string, status: Item['status']) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
    ));
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
    showToast(
      'info',
      'تم حذف البلاغ',
      `تم حذف البلاغ (${itemToDelete?.trackingCode || id}) من سجلات المنظومة بنجاح.`
    );
  };

  const submitClaim = (claimData: Omit<ClaimRequest, 'id' | 'trackingNumber' | 'status' | 'createdAt'>): ClaimRequest => {
    const now = new Date().toISOString();
    const trackingNumber = `CLM-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newClaim: ClaimRequest = {
      ...claimData,
      id: `claim_${Date.now()}`,
      trackingNumber,
      status: 'pending',
      createdAt: now
    };

    setClaims(prev => [newClaim, ...prev]);
    updateItemStatus(claimData.itemId, 'in_verification');

    // Notify staff
    const notif: NotificationItem = {
      id: `notif_claim_${Date.now()}`,
      title: `📋 طلب استلام جديد (${trackingNumber})`,
      message: `قدم ${claimData.claimantName} إثبات ملكية للغرض "${claimData.itemTitle}". يتطلب مراجعة مسؤول المفقودات.`,
      type: 'claim_update',
      read: false,
      createdAt: now,
      linkClaimId: newClaim.id
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(
      'success',
      'تم رفع طلب إثبات الملكية',
      `رقم الطلب: ${trackingNumber}. سيتم إشعارك فور مراجعة المشرف للإثباتات السرية.`
    );

    return newClaim;
  };

  const reviewClaim = (claimId: string, status: 'approved' | 'rejected', notes?: string) => {
    const now = new Date().toISOString();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status,
          reviewNotes: notes || (status === 'approved' ? 'تمت الموافقة وتطابق الإثباتات السرية' : 'رفض الطلب لعدم مطابقة المواصفات'),
          reviewedBy: currentUser.name,
          reviewedAt: now,
          handoverOtp: status === 'approved' ? otp : undefined
        };
      }
      return c;
    }));

    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      if (status === 'approved') {
        updateItemStatus(claim.itemId, 'claimed');
        triggerConfetti();
        const notif: NotificationItem = {
          id: `notif_app_${Date.now()}`,
          title: '✅ تمت الموافقة على طلب استلام الغرض!',
          message: `تم اعتماد إثبات ملكيتك للغرض "${claim.itemTitle}". رمز التحقق للاستلام هو [${otp}]. يرجى التوجه لمكتب المفقودات.`,
          type: 'claim_update',
          read: false,
          createdAt: now,
          linkClaimId: claimId
        };
        setNotifications(prev => [notif, ...prev]);
        showToast('success', 'تم اعتماد الملكية', `تم إصدار رمز التحقق ${otp} لصاحب الغرض.`);
      } else {
        updateItemStatus(claim.itemId, 'active');
        const notif: NotificationItem = {
          id: `notif_rej_${Date.now()}`,
          title: '❌ تم رفض طلب الاستلام',
          message: `عذراً، لم تتطابق الإثباتات المقدمة مع المواصفات المسجلة للغرض "${claim.itemTitle}".`,
          type: 'claim_update',
          read: false,
          createdAt: now,
          linkClaimId: claimId
        };
        setNotifications(prev => [notif, ...prev]);
        showToast('warning', 'تم رفض الطلب', 'تم تحديث حالة الطلب وإشعار المستخدم.');
      }
    }
  };

  const completeHandover = (claimId: string, officerName: string, idNumber: string, location: string) => {
    const now = new Date().toISOString();
    const receiptNum = `RCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: 'handed_over',
          handoverReceipt: {
            receiptNumber: receiptNum,
            handedOverAt: now,
            officerName,
            idNumberVerified: idNumber,
            pickupLocation: location
          }
        };
      }
      return c;
    }));

    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      updateItemStatus(claim.itemId, 'handed_over');
      triggerConfetti();
      const notif: NotificationItem = {
        id: `notif_hand_${Date.now()}`,
        title: '🎉 تم إتمام التسليم بنجاح!',
        message: `تم تسليم الغرض وإصدار إيصال استلام رسمي برقم (${receiptNum}). شكراً لاستخدامك منصة عائد!`,
        type: 'handover',
        read: false,
        createdAt: now,
        linkClaimId: claimId
      };
      setNotifications(prev => [notif, ...prev]);
      showToast('success', 'اكتمل التسليم بنجاح', `تم إصدار إيصال الاستلام رقم ${receiptNum}.`);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        login,
        logout,
        switchRole,
        currentPage,
        setCurrentPage,
        browseFilterType,
        setBrowseFilterType,
        items,
        claims,
        notifications: visibleNotifications,
        unreadNotifsCount,
        selectedItemId,
        setSelectedItemId,
        selectedClaimId,
        setSelectedClaimId,
        activeScanItem,
        setActiveScanItem,
        activeScanMatches,
        addItem,
        updateItemStatus,
        deleteItem,
        submitClaim,
        reviewClaim,
        completeHandover,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        showToast,
        removeToast,
        triggerConfetti,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
