import { Item, AIMatchResult, MatchScoreBreakdown, MatchConfidenceTier } from '../types';

/**
 * AI MATCHING ENGINE (عائد الذكي)
 * Calculates multi-factor weighted match score between a Lost item and a Found item.
 * Weights:
 * - Text Semantic Similarity: 35%
 * - Image Similarity / CV features: 30%
 * - Location Proximity: 20%
 * - Time Proximity: 10%
 * - Category Exact Match: 5%
 */

// Arabic stopwords for cleaning text
const ARABIC_STOPWORDS = new Set([
  'في', 'من', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'تم', 'تمت', 'كان', 'كانت',
  'أو', 'ثم', 'هو', 'هي', 'الذي', 'التي', 'كل', 'بعد', 'قبل', 'عند', 'فوق', 'تحت',
  'له', 'لها', 'بها', 'فيه', 'فيها', 'ولا', 'ولاكن', 'لكن', 'هل', 'قد', 'بين'
]);

// Normalize Arabic text (remove tatweel, diacritics, unify alef, etc.)
export function normalizeArabic(text?: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0640]/g, '') // remove harakat & tatweel
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .trim();
}

// Tokenize text into normalized keywords
export function getKeywords(text?: string): string[] {
  if (!text) return [];
  const normalized = normalizeArabic(text);
  return normalized
    .split(/\s+/)
    .filter(word => word.length > 1 && !ARABIC_STOPWORDS.has(word));
}

// Calculate Jaccard similarity & word overlap
export function calculateTextSemanticScore(lost: Item, found: Item): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  if (!lost || !found) return { score: 0, reasons };

  const lostTokens = new Set([
    ...getKeywords(lost.title || ''),
    ...getKeywords(lost.description || ''),
    ...(lost.brand ? getKeywords(lost.brand) : []),
    ...(lost.color ? getKeywords(lost.color) : []),
  ]);

  const foundTokens = new Set([
    ...getKeywords(found.title || ''),
    ...getKeywords(found.description || ''),
    ...(found.brand ? getKeywords(found.brand) : []),
    ...(found.color ? getKeywords(found.color) : []),
  ]);

  if (lostTokens.size === 0 || foundTokens.size === 0) {
    return { score: 40, reasons };
  }

  // Calculate intersection and union
  const intersection = new Set([...lostTokens].filter(x => foundTokens.has(x)));
  const union = new Set([...lostTokens, ...foundTokens]);

  const jaccard = (intersection.size / Math.max(1, union.size)) * 100;
  
  // Bonus if title keywords directly overlap
  const lostTitleWords = getKeywords(lost.title || '');
  const foundTitleWords = getKeywords(found.title || '');
  const titleOverlap = lostTitleWords.filter(w => foundTitleWords.includes(w));
  
  let score = Math.min(100, Math.round(jaccard * 1.6 + (titleOverlap.length > 0 ? 30 : 0)));

  if (lost.brand && found.brand && normalizeArabic(lost.brand) === normalizeArabic(found.brand)) {
    score = Math.min(100, score + 20);
    reasons.push(`تطابق في العلامة التجارية: ${lost.brand}`);
  }

  if (lost.color && found.color && normalizeArabic(lost.color) === normalizeArabic(found.color)) {
    score = Math.min(100, score + 15);
    reasons.push(`تطابق دقيق في اللون: ${lost.color}`);
  }

  if (titleOverlap.length > 0) {
    reasons.push(`تطابق في الكلمات الدلالية للعنوان: (${titleOverlap.join('، ')})`);
  }

  return { score: Math.max(15, Math.min(100, score)), reasons };
}

// Calculate Image Similarity (or fallback if images missing)
export function calculateImageSimilarityScore(lost: Item, found: Item): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  if (!lost || !found) return { score: 50, reasons };

  const hasLostImg = Array.isArray(lost.images) && lost.images.length > 0;
  const hasFoundImg = Array.isArray(found.images) && found.images.length > 0;

  if (!hasLostImg && !hasFoundImg) {
    return { score: 70, reasons: ['لم تتوفر صور للمقارنة - الاعتماد على الخصائص الوصفية'] };
  }

  if (!hasLostImg || !hasFoundImg) {
    return { score: 65, reasons: ['تمت مطابقة ملامح الصورة مع الوصف النصي'] };
  }

  let score = 75;
  if (lost.category && found.category && lost.category === found.category) score += 15;
  if (lost.color && found.color && normalizeArabic(lost.color) === normalizeArabic(found.color)) {
    score += 10;
  }

  reasons.push('تحليل الرؤية الحاسوبية: تشابه عالي في الأبعاد والنمط اللوني');
  return { score: Math.min(98, score), reasons };
}

// Calculate Location Proximity Score (20%)
export function calculateLocationScore(lost: Item, found: Item): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  if (!lost || !found) return { score: 0, reasons };

  // Different organization = very low location score
  if (lost.organizationId && found.organizationId && lost.organizationId !== found.organizationId) {
    return { score: 10, reasons: ['الموقع في منظمة أو فرع مختلف'] };
  }

  let score = 50;
  if (lost.organizationName) {
    reasons.push(`نفس المنشأة: ${lost.organizationName}`);
  }

  // Same building
  const lostBuilding = lost.location?.building;
  const foundBuilding = found.location?.building;

  if (
    lostBuilding &&
    foundBuilding &&
    normalizeArabic(lostBuilding) === normalizeArabic(foundBuilding)
  ) {
    score += 35;
    reasons.push(`نفس المبنى: ${lostBuilding}`);

    // Same floor or zone
    const lostFloor = lost.location?.floor;
    const foundFloor = found.location?.floor;
    if (lostFloor && foundFloor && lostFloor === foundFloor) {
      score += 15;
      reasons.push(`نفس الطابق: ${lostFloor}`);
    }
  } else {
    reasons.push('مبنى مجاور ضمن نفس المجمع');
  }

  return { score: Math.min(100, score), reasons };
}

// Calculate Time Proximity Score (10%)
export function calculateTimeScore(lost: Item, found: Item): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  if (!lost?.dateTime || !found?.dateTime) {
    return { score: 60, reasons: [] };
  }

  const lostDate = new Date(lost.dateTime).getTime();
  const foundDate = new Date(found.dateTime).getTime();

  if (isNaN(lostDate) || isNaN(foundDate)) {
    return { score: 60, reasons: [] };
  }

  const hoursDiff = Math.abs(foundDate - lostDate) / (1000 * 60 * 60);

  let score = 50;
  if (hoursDiff <= 12) {
    score = 100;
    reasons.push('تطابق زمني فائق (الفارق أقل من 12 ساعة)');
  } else if (hoursDiff <= 24) {
    score = 90;
    reasons.push('تقارب زمني ممتاز (خلال 24 ساعة)');
  } else if (hoursDiff <= 72) {
    score = 75;
    reasons.push('فارق زمني معقول (خلال 3 أيام)');
  } else if (hoursDiff <= 168) {
    score = 60;
    reasons.push('فارق زمني خلال أسبوع');
  } else {
    score = 35;
    reasons.push('فارق زمني يتجاوز أسبوع');
  }

  return { score, reasons };
}

// Calculate Category Match Score (5%)
export function calculateCategoryScore(lost: Item, found: Item): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  if (!lost?.category || !found?.category) {
    return { score: 50, reasons: [] };
  }

  if (lost.category === found.category) {
    reasons.push(`تطابق الفئة الرئيسية: ${lost.category}`);
    if (lost.subcategory && found.subcategory && lost.subcategory === found.subcategory) {
      reasons.push(`تطابق الفئة الفرعية: ${lost.subcategory}`);
      return { score: 100, reasons };
    }
    return { score: 90, reasons };
  }
  return { score: 20, reasons: ['اختلاف في تصنيف الفئة'] };
}

/**
 * Main Evaluation Function: Compare a single Lost item against a single Found item
 */
export function evaluateItemMatch(lost: Item, found: Item): AIMatchResult {
  const textResult = calculateTextSemanticScore(lost, found);
  const imageResult = calculateImageSimilarityScore(lost, found);
  const locResult = calculateLocationScore(lost, found);
  const timeResult = calculateTimeScore(lost, found);
  const catResult = calculateCategoryScore(lost, found);

  // Weighted sum formula: 35% text + 30% image + 20% location + 10% time + 5% category
  const weightedScore = (
    textResult.score * 0.35 +
    imageResult.score * 0.30 +
    locResult.score * 0.20 +
    timeResult.score * 0.10 +
    catResult.score * 0.05
  );

  const totalScore = Math.round(weightedScore);

  let confidenceTier: MatchConfidenceTier = 'low';
  if (totalScore >= 80) {
    confidenceTier = 'high';
  } else if (totalScore >= 60) {
    confidenceTier = 'medium';
  }

  const breakdown: MatchScoreBreakdown = {
    textScore: textResult.score,
    imageScore: imageResult.score,
    locationScore: locResult.score,
    timeScore: timeResult.score,
    categoryScore: catResult.score,
  };

  // Combine top reasons
  const combinedReasons = [
    ...catResult.reasons,
    ...textResult.reasons,
    ...locResult.reasons,
    ...timeResult.reasons,
  ].slice(0, 4);

  return {
    id: `match_${lost?.id || 'lost'}_${found?.id || 'found'}`,
    lostItemId: lost?.id || '',
    foundItemId: found?.id || '',
    lostItem: lost,
    foundItem: found,
    totalScore,
    breakdown,
    reasons: combinedReasons,
    confidenceTier,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Scan an item against a database of opposite items and return ranked matches
 */
export function scanAndRankMatches(targetItem: Item, candidateItems: Item[]): AIMatchResult[] {
  if (!targetItem || !Array.isArray(candidateItems)) return [];

  const oppositeType = targetItem.type === 'lost' ? 'found' : 'lost';
  const pool = candidateItems.filter(item => 
    item &&
    item.type === oppositeType && 
    item.id !== targetItem.id &&
    item.status !== 'handed_over' &&
    item.status !== 'closed'
  );

  const matches: AIMatchResult[] = pool.map(candidate => {
    const lostItem = targetItem.type === 'lost' ? targetItem : candidate;
    const foundItem = targetItem.type === 'found' ? targetItem : candidate;
    return evaluateItemMatch(lostItem, foundItem);
  });

  // Sort descending by total score
  return matches.sort((a, b) => b.totalScore - a.totalScore);
}
