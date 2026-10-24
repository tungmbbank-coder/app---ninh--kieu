import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { resolveImage, handleImageError } from '../utils/imageHelper';
import { Phone, Menu, X, HelpCircle, Smartphone, Gamepad2, PiggyBank, Calculator, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  onCallAdvisor: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
  PiggyBank: <PiggyBank className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />
};

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onCallAdvisor }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { brand, navigation } = contentData;

  const logoSrc = resolveImage(brand.logo, brand.remoteLogo);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Zone 1: Brand Wordmark & Logo */}
          <div 
            onClick={() => setActiveTab('faq')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
          >
            <div className="h-10 w-auto flex items-center justify-center p-1 bg-white rounded-lg border border-slate-100 shadow-2xs group-hover:border-blue-200 transition-colors">
              <img
                src={logoSrc}
                alt="VietinBank"
                className="h-8 max-w-[140px] sm:max-w-[170px] object-contain"
                onError={(e) => handleImageError(e, brand.remoteLogo)}
              />
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-semibold text-[#00529C] uppercase tracking-wider">
                {brand.branchName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Cổng Tương Tác Khách Hàng
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-Line, cleanly separated) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-[#00529C] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#00529C] hover:bg-slate-100/80'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {iconMap[item.icon]}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action (Advisor Contact) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCallAdvisor}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-linear-to-r from-[#ED1C24] to-[#C4131A] hover:brightness-105 active:scale-[0.98] rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer"
              title={`Chuyên viên tư vấn: ${brand.advisor.name}`}
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">Hỗ trợ:</span>
              <span className="font-bold">{brand.advisor.phone}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 px-4 pt-3 pb-5 space-y-1 shadow-lg">
          <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Danh mục tính năng
          </p>
          {navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#00529C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500'}>
                  {iconMap[item.icon]}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600">
              <p className="font-semibold text-[#00529C] mb-1">
                {brand.advisor.title}: {brand.advisor.name}
              </p>
              <p className="text-slate-500 mb-2">Sẵn sàng hỗ trợ Quý khách tại quầy hoặc qua điện thoại</p>
              <a
                href={`tel:${brand.advisor.cleanPhone}`}
                className="inline-flex items-center gap-1.5 font-bold text-[#ED1C24] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" /> Gọi ngay: {brand.advisor.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
