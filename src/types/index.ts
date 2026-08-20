export type UserRole = 'user' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  avatar?: string;
  department?: string;
  badgeNumber?: string;
}

export type OrganizationType = 'university' | 'hospital' | 'airport' | 'corporate' | 'government';

export interface Organization {
  id: string;
  name: string;
  nameEn: string;
  type: OrganizationType;
  city: string;
  logo: string;
  buildings: {
    id: string;
    name: string;
    floors: string[];
    zones: string[];
  }[];
}

export type ItemType = 'lost' | 'found';

export type ItemStatus = 
  | 'active' 
  | 'in_verification' 
  | 'matched' 
  | 'claimed' 
  | 'handed_over' 
  | 'closed';

export interface ItemLocation {
  campus: string;
  building: string;
  floor?: string;
  roomOrZone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Item {
  id: string;
  trackingCode: string;
  type: ItemType;
  title: string;
  category: string;
  subcategory?: string;
  brand?: string;
  color?: string;
  description: string;
  secretDetails?: string; // Private verification clues
  images: string[];
  organizationId: string;
  organizationName: string;
  location: ItemLocation;
  dateTime: string;
  reporter: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    isAnonymous?: boolean;
  };
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  viewsCount?: number;
}

export interface MatchScoreBreakdown {
  textScore: number;       // 0-100 (Weight: 35%)
  imageScore: number;      // 0-100 (Weight: 30%)
  locationScore: number;   // 0-100 (Weight: 20%)
  timeScore: number;       // 0-100 (Weight: 10%)
  categoryScore: number;   // 0-100 (Weight: 5%)
}

export type MatchConfidenceTier = 'high' | 'medium' | 'low';

export interface AIMatchResult {
  id: string;
  lostItemId: string;
  foundItemId: string;
  lostItem?: Item;
  foundItem?: Item;
  totalScore: number; // 0-100%
  breakdown: MatchScoreBreakdown;
  reasons: string[];
  confidenceTier: MatchConfidenceTier;
  createdAt: string;
  verifiedByStaff?: boolean;
}

export interface ClaimVerificationAnswer {
  question: string;
  userAnswer: string;
  isCorrect?: boolean;
}

export type ClaimStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'handed_over';

export interface ClaimRequest {
  id: string;
  trackingNumber: string;
  itemId: string;
  itemTitle: string;
  itemType: ItemType;
  claimantId: string;
  claimantName: string;
  claimantPhone: string;
  claimantEmail: string;
  organizationId: string;
  secretProofNotes: string;
  answers: ClaimVerificationAnswer[];
  additionalProofImages?: string[];
  status: ClaimStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  handoverOtp?: string;
  handoverReceipt?: {
    receiptNumber: string;
    handedOverAt: string;
    officerName: string;
    idNumberVerified: string;
    pickupLocation: string;
  };
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'claim_update' | 'system' | 'handover';
  read: boolean;
  createdAt: string;
  linkItemId?: string;
  linkClaimId?: string;
  score?: number;
}

export interface CategoryDef {
  id: string;
  name: string;
  iconName: string;
  subcategories: string[];
  commonSecretClues: string[];
}
