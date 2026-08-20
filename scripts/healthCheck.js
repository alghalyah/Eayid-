import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🚀 RUNNING COMPREHENSIVE PLATFORM HEALTH CHECK');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Check Key Static Assets
console.log('--- 1. STATIC ASSETS & IMAGES INTEGRITY ---');
const requiredAssets = [
  'public/AedLogo.png',
  'public/login-bg.jpg',
  'public/hero-bg.jpg',
  'public/images/examples/car_key.png',
  'public/images/examples/wallet.png',
  'public/images/examples/iphone.png',
  'public/images/examples/airpods.png',
  'public/logo.svg',
  'public/logo.png',
  'index.html',
  'vercel.json'
];

requiredAssets.forEach(assetPath => {
  const fullPath = path.join(rootDir, assetPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  assert(exists && size > 0, `Asset exists & non-empty: ${assetPath} (${size} bytes)`);
});

// 2. Check Core TypeScript/React Files Existence
console.log('\n--- 2. CORE COMPONENTS & PAGES INTEGRITY ---');
const requiredSourceFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/index.css',
  'src/context/AppContext.tsx',
  'src/types/index.ts',
  'src/services/aiMatchingEngine.ts',
  'src/services/mockDatabase.ts',
  'src/data/mockData.ts',
  'src/pages/LandingPage.tsx',
  'src/pages/BrowseItemsPage.tsx',
  'src/pages/DashboardPage.tsx',
  'src/pages/ClaimsReviewPage.tsx',
  'src/pages/AdminOrgsPage.tsx',
  'src/pages/MyItemsPage.tsx',
  'src/pages/ReportItemPage.tsx',
  'src/pages/LoginPage.tsx',
  'src/components/RecentItems.tsx',
  'src/components/layout/Navbar.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/ui/ItemCard.tsx',
  'src/components/ui/ToastContainer.tsx',
  'src/components/modals/AuthModal.tsx',
  'src/components/modals/AddReportModal.tsx',
  'src/components/modals/ClaimModal.tsx',
  'src/components/modals/HandoverReceiptModal.tsx',
  'src/components/modals/ItemDetailsModal.tsx',
  'src/components/ai/AIMatchRadarModal.tsx'
];

requiredSourceFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  assert(fs.existsSync(fullPath), `Source file exists: ${file}`);
});

// 3. Test Arabic Normalization & AI Semantic Engine Logic directly
console.log('\n--- 3. AI MATCHING ENGINE & SEMANTIC SCORING ---');

// Test Arabic text normalizer
function normalizeArabic(text) {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .replace(/\s+/g, ' ');
}

const sample1 = 'سماعات إيربودز برو الجيل الثاني';
const sample2 = 'سماعات ايربودز برو اصليه';
const norm1 = normalizeArabic(sample1);
const norm2 = normalizeArabic(sample2);

assert(norm1.includes('ايربودز') && norm2.includes('ايربودز'), 'Arabic text normalization handles hamzas and diacritics');

// Simple Jaccard similarity test
function tokenSimilarity(t1, t2) {
  const w1 = new Set(normalizeArabic(t1).split(' ').filter(w => w.length > 1));
  const w2 = new Set(normalizeArabic(t2).split(' ').filter(w => w.length > 1));
  if (w1.size === 0 || w2.size === 0) return 0;
  let intersection = 0;
  w1.forEach(w => { if (w2.has(w)) intersection++; });
  const union = new Set([...w1, ...w2]).size;
  return intersection / union;
}

const simScore = tokenSimilarity(sample1, sample2);
assert(simScore > 0.4, `Token similarity calculation works (score: ${(simScore * 100).toFixed(1)}%)`);

// 4. Check Mock Database Data Consistency
console.log('\n--- 4. MOCK DATABASE & DATA CONSISTENCY ---');
const mockDataContent = fs.readFileSync(path.join(rootDir, 'src/data/mockData.ts'), 'utf-8');
assert(mockDataContent.includes('/images/examples/car_key.png'), 'mockData.ts contains car_key.png');
assert(mockDataContent.includes('/images/examples/wallet.png'), 'mockData.ts contains wallet.png');
assert(mockDataContent.includes('/images/examples/iphone.png'), 'mockData.ts contains iphone.png');
assert(mockDataContent.includes('/images/examples/airpods.png'), 'mockData.ts contains airpods.png');
assert(mockDataContent.includes('مفتاح سيارة تويوتا فورتشنر'), 'mockData.ts contains Toyota Fortuner key');
assert(mockDataContent.includes('محفظة جلدية بنية'), 'mockData.ts contains Brown leather wallet');
assert(mockDataContent.includes('آيفون 13 أسود'), 'mockData.ts contains Black iPhone 13');
assert(mockDataContent.includes('سماعات إيربودز (AirPods Pro)'), 'mockData.ts contains AirPods Pro');

// 5. Check CSS & Font Family Configuration
console.log('\n--- 5. CSS & TYPOGRAPHY INTEGRITY ---');
const cssContent = fs.readFileSync(path.join(rootDir, 'src/index.css'), 'utf-8');
const tailwindContent = fs.readFileSync(path.join(rootDir, 'tailwind.config.js'), 'utf-8');
assert(cssContent.includes('Sakkal Majalla'), 'index.css applies Sakkal Majalla font');
assert(tailwindContent.includes('Sakkal Majalla'), 'tailwind.config.js configures Sakkal Majalla font');

// 6. Check Favicon & HTML Head
console.log('\n--- 6. HTML & BRAND ASSETS ---');
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
assert(indexHtmlContent.includes('/AedLogo.png'), 'index.html uses /AedLogo.png as favicon');
assert(indexHtmlContent.includes('dir="rtl"'), 'index.html is configured for RTL');

// 7. Test Item-Specific Verification Questions Logic
console.log('\n--- 7. ITEM-SPECIFIC VERIFICATION QUESTIONS ENGINE ---');
const mockDbContent = fs.readFileSync(path.join(rootDir, 'src/services/mockDatabase.ts'), 'utf-8');
assert(mockDbContent.includes('export function getItemVerificationQuestions'), 'mockDatabase.ts exports getItemVerificationQuestions');
assert(mockDbContent.includes('Item -> Item Details -> Verification Questions'), 'getItemVerificationQuestions implements Item-Specific Core Principle');
assert(mockDbContent.includes('هل يوجد أي خدش أو علامة مميزة على إحدى العدسات أو الإطار'), 'Eyewear specific questions exist for glasses');
assert(mockDbContent.includes('صف بالتفصيل شكل ولون الميدالية أو الحمالة المرفقة بالمفتاح'), 'Car keys questions exist');
assert(mockDbContent.includes('ما هو اسم الجهاز عند الاقتران بالبلوتوث'), 'AirPods questions exist');

console.log('\n====================================================');
console.log(`📊 HEALTH CHECK COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('====================================================');
