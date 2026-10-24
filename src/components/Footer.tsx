import React from 'react';
import contentData from '../data/contentData.json';
import { Phone, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tabId: string) => void;
  onCallAdvisor: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onCallAdvisor }) => {
  const { brand } = contentData;

  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-base uppercase tracking-wider flex items-center gap-2">
              <span className="text-[#ED1C24] font-black">VB</span> {brand.name}
            </h4>
            <p className="text-xs text-slate-400 font-semibold">{brand.branchName}</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cổng tương tác điện tử phục vụ khách hàng trực tiếp tại quầy giao dịch và hỗ trợ trực tuyến.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Nâng tầm giá trị cuộc sống</span>
            </div>
          </div>

          {/* Col 2: Chi nhánh Cần Thơ */}
          <div className="space-y-3 text-xs">
            <h5 className="text-white font-bold text-sm">Hội Sở Chi Nhánh</h5>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-[#ED1C24] shrink-0 mt-0.5" />
              <span>59-59A Phan Đình Phùng, Phường Ninh Kiều, TP Cần Thơ</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-[#0099DA] shrink-0" />
              <a href="tel:02923820875" className="hover:text-white transition-colors">
                Hotline Chi nhánh: 0292.3820875
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-4 text-center font-bold text-slate-500">24/7</span>
              <span>Tổng đài CSKH toàn quốc: 1900 558 868</span>
            </div>
          </div>

          {/* Col 3: Chuyên viên tư vấn phụ trách */}
          <div className="space-y-3 text-xs">
            <h5 className="text-white font-bold text-sm">Chuyên Viên Tư Vấn</h5>
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
              <p className="font-bold text-white text-sm">{brand.advisor.name}</p>
              <p className="text-slate-400">{brand.advisor.title} - Chi nhánh Cần Thơ</p>
              <button
                onClick={onCallAdvisor}
                className="w-full py-2 px-3 bg-[#ED1C24] hover:bg-[#C4131A] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Liên hệ: {brand.advisor.phone}</span>
              </button>
            </div>
          </div>

          {/* Col 4: Tiện ích nhanh */}
          <div className="space-y-3 text-xs">
            <h5 className="text-white font-bold text-sm">Truy Cập Nhanh</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setActiveTab('faq')} className="hover:text-white transition-colors cursor-pointer">
                  • Giải đáp thắc mắc tài khoản & iPay
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('deposit')} className="hover:text-white transition-colors cursor-pointer">
                  • Bảng tính lãi suất tiết kiệm
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('loan')} className="hover:text-white transition-colors cursor-pointer">
                  • Lịch trả nợ khoản vay (Dư nợ giảm dần)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('games')} className="hover:text-white transition-colors cursor-pointer">
                  • Mini Game nhận Voucher xăng tại quầy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('branches')} className="hover:text-white transition-colors cursor-pointer">
                  • Mạng lưới Phòng giao dịch Cần Thơ
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Ngân hàng TMCP Công Thương Việt Nam (VietinBank) - Chi nhánh Cần Thơ. All rights reserved.</p>
          <p className="text-slate-500">Ứng dụng quầy giao dịch số thông minh</p>
        </div>
      </div>
    </footer>
  );
};
