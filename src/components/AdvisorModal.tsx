import React from 'react';
import contentData from '../data/contentData.json';
import { Phone, X, User, MessageCircle, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface AdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorModal: React.FC<AdvisorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { brand } = contentData;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#00529C] mx-auto flex items-center justify-center border border-blue-100 mb-3">
            <User className="w-8 h-8 text-[#00529C]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00529C]">
            Chuyên Viên Tư Vấn VietinBank
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {brand.advisor.name}
          </h3>
          <p className="text-xs text-slate-500">
            {brand.advisor.title} · {brand.branchName}
          </p>
        </div>

        <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 mb-6">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#ED1C24] shrink-0" />
            <span className="font-semibold">Hotline trực tiếp:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{brand.advisor.phone}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#00529C] shrink-0" />
            <span>Phục vụ trong giờ hành chính & tiếp nhận yêu cầu 24/7</span>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Quầy giao dịch số 01 - 59-59A Phan Đình Phùng, TP Cần Thơ</span>
          </div>
        </div>

        <div className="space-y-2">
          <a
            href={`tel:${brand.advisor.cleanPhone}`}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#ED1C24] to-[#C4131A] hover:brightness-105 active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi điện thoại ngay ({brand.advisor.phone})</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
