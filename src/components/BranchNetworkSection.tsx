import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { resolveImage, handleImageError } from '../utils/imageHelper';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  Search, 
  Copy, 
  Check, 
  Building2, 
  Navigation,
  Sparkles
} from 'lucide-react';

export const BranchNetworkSection: React.FC = () => {
  const { branches } = contentData;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredBranches = branches.list.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.branch.toLowerCase().includes(term) ||
      item.room.toLowerCase().includes(term) ||
      item.address.toLowerCase().includes(term) ||
      item.phone.includes(term)
    );
  });

  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#00529C] text-xs font-semibold mb-3 border border-blue-100">
          <MapPin className="w-3.5 h-3.5" />
          <span>Mạng lưới Chi nhánh & Phòng giao dịch tại TP Cần Thơ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {branches.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {branches.subtitle}
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên PGD, đường hoặc quận/huyện..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-[#00529C]/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Branch photo */}
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden border-b border-slate-100 flex items-center justify-center">
                <img
                  src={resolveImage(item.image, item.remoteUrl)}
                  alt={item.branch}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, item.remoteUrl)}
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 rounded-lg text-xs font-extrabold text-[#00529C] border border-slate-200 shadow-xs">
                  {item.branch}
                </div>
              </div>

              {/* Branch Details */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.room}
                  </h3>
                  
                  {/* Address with Google Maps link */}
                  <div className="mt-2 flex items-start gap-2 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-[#ED1C24] shrink-0 mt-0.5" />
                    <span className="leading-relaxed flex-1">{item.address}</span>
                  </div>
                </div>

                {/* Operating Hours (Sáng & Chiều) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-[#00529C]" />
                    <span>Thời gian giao dịch:</span>
                  </div>
                  <div className="text-slate-600 pl-5 space-y-0.5">
                    <p>• Sáng: {item.workingHours.morning}</p>
                    <p>• Chiều: {item.workingHours.afternoon}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Call Hotline & Open Google Maps */}
            <div className="p-5 pt-0 space-y-2">
              <div className="flex items-center gap-2">
                {/* Clickable Hotline Phone Number (As required by PDF) */}
                <a
                  href={`tel:${item.cleanPhone}`}
                  className="flex-1 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-[#ED1C24] font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Bấm để gọi hotline PGD"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{item.phone}</span>
                </a>

                {/* Copy Address */}
                <button
                  onClick={() => handleCopyAddress(item.id, item.address)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Sao chép địa chỉ"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Google Maps External Button (With Google Maps icon as requested in PDF) */}
              <a
                href={item.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-[#00529C] hover:bg-[#003B70] text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-200" />
                <span>Chỉ đường trên Google Maps</span>
                <ExternalLink className="w-3 h-3 text-blue-300" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-slate-500 text-sm">Không tìm thấy phòng giao dịch phù hợp với từ khóa "{searchTerm}".</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
          >
            Xem tất cả phòng giao dịch
          </button>
        </div>
      )}
    </div>
  );
};
