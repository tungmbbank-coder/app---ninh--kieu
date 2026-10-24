import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Header } from './components/Header';
import { FaqSection } from './components/FaqSection';
import { DownloadAppSection } from './components/DownloadAppSection';
import { GamesSection } from './components/GamesSection';
import { DepositCalculatorSection } from './components/DepositCalculatorSection';
import { LoanScheduleSection } from './components/LoanScheduleSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchNetworkSection } from './components/BranchNetworkSection';
import { Footer } from './components/Footer';
import { AdvisorModal } from './components/AdvisorModal';
import contentData from './data/contentData.json';
import { 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Sparkles, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Building,
  Headphones
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState<boolean>(false);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  // Smooth animation on tab transition using GSAP
  useEffect(() => {
    if (contentContainerRef.current) {
      gsap.fromTo(
        contentContainerRef.current,
        { opacity: 0.2, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCallAdvisor={() => setIsAdvisorModalOpen(true)}
      />

      {/* Hero Welcome Ribbon for Banking Counter */}
      <div className="bg-gradient-to-r from-[#00529C] via-[#003B70] to-[#0A2540] text-white border-b border-blue-900/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Chào Mừng Quý Khách Đến Với VietinBank {contentData.brand.branchName}
                </h2>
                <p className="text-xs text-blue-100">
                  Kiosk tương tác tự phục vụ tại quầy · Giải đáp, mô phỏng tài chính & săn quà liền tay
                </p>
              </div>
            </div>

            {/* Quick Feature Pill Switcher for Kiosk / Tablet */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('games')}
                className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Mini Game Nhận Voucher</span>
              </button>
              <button
                onClick={() => setActiveTab('loan')}
                className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Tính Lịch Trả Nợ Vay</span>
              </button>
              <button
                onClick={() => setActiveTab('deposit')}
                className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                <PiggyBank className="w-3.5 h-3.5" />
                <span>Tính Lãi Tiền Gửi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dynamic View Content */}
      <main ref={contentContainerRef} className="flex-1">
        {activeTab === 'faq' && (
          <FaqSection onContactAdvisor={() => setIsAdvisorModalOpen(true)} />
        )}
        {activeTab === 'download' && <DownloadAppSection />}
        {activeTab === 'games' && <GamesSection />}
        {activeTab === 'deposit' && <DepositCalculatorSection />}
        {activeTab === 'loan' && <LoanScheduleSection />}
        {activeTab === 'products' && (
          <FeaturedProductsSection onContactAdvisor={() => setIsAdvisorModalOpen(true)} />
        )}
        {activeTab === 'branches' && <BranchNetworkSection />}
      </main>

      {/* Advisor Support Modal */}
      <AdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
      />

      {/* Global Banking Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onCallAdvisor={() => setIsAdvisorModalOpen(true)}
      />
    </div>
  );
}
