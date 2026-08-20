import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { AIMatchRadarModal } from './components/ai/AIMatchRadarModal';
import { ItemDetailsModal } from './components/modals/ItemDetailsModal';
import { ClaimModal } from './components/modals/ClaimModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { BrowseItemsPage } from './pages/BrowseItemsPage';
import { ReportItemPage } from './pages/ReportItemPage';
import { ClaimsReviewPage } from './pages/ClaimsReviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyItemsPage } from './pages/MyItemsPage';
import { AdminOrgsPage } from './pages/AdminOrgsPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  const { currentPage, setSelectedItemId } = useApp();
  const [claimItemId, setClaimItemId] = useState<string | null>(null);

  const handleOpenClaim = (itemId: string) => {
    setClaimItemId(itemId);
  };

  const handleCloseClaim = () => {
    setClaimItemId(null);
  };

  // Full-screen dedicated view for Login Page (No Navbar, No Footer)
  if (currentPage === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body font-sans selection:bg-brand-mint/30 selection:text-brand-emerald">
      {/* Top Main Navigation Header */}
      <Navbar />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'landing' && <LandingPage onSelectItem={setSelectedItemId} />}
        {currentPage === 'browse' && <BrowseItemsPage />}
        {currentPage === 'report_lost' && <ReportItemPage initialType="lost" />}
        {currentPage === 'report_found' && <ReportItemPage initialType="found" />}
        {currentPage === 'claims_queue' && <ClaimsReviewPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'my_items' && <MyItemsPage />}
        {currentPage === 'admin_orgs' && <AdminOrgsPage />}
      </main>

      {/* Modals & Portals */}
      <ItemDetailsModal onOpenClaim={handleOpenClaim} />
      <ClaimModal itemId={claimItemId} onClose={handleCloseClaim} />
      <AIMatchRadarModal />
      <ToastContainer />

      {/* Bottom Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
