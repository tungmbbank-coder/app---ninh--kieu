import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { generateQrSvg } from '../utils/qrGenerator';
import { Apple, Smartphone, CheckCircle, ExternalLink, QrCode, ShieldCheck, Zap } from 'lucide-react';

export const DownloadAppSection: React.FC = () => {
  const { downloadApp } = contentData;
  const [activePlatform, setActivePlatform] = useState<'both' | 'ios' | 'android'>('both');

  const iosQr = generateQrSvg(downloadApp.iosUrl, 220);
  const androidQr = generateQrSvg(downloadApp.androidUrl, 220);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#00529C] text-xs font-semibold mb-3 border border-blue-100">
          <QrCode className="w-3.5 h-3.5" />
          <span>Quét mã QR cài đặt nhanh tại quầy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {downloadApp.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {downloadApp.subtitle}
        </p>
      </div>

      {/* QR Codes Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
        
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:border-[#00529C]/40 transition-all flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-xs">
            <Apple className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Dành cho thiết bị Apple
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            VietinBank iPay trên iPhone / iPad
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Hỗ trợ iOS 11.0 trở lên · Tương thích Face ID & Touch ID
          </p>

          {/* QR Code Container */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 shadow-2xs group hover:bg-blue-50/50 transition-colors">
            <img
              src={iosQr}
              alt="QR tải VietinBank iPay cho iPhone"
              className="w-44 h-44 object-contain rounded-lg"
              loading="lazy"
            />
            <p className="mt-2 text-[11px] font-semibold text-slate-500 group-hover:text-[#00529C]">
              Mở Camera iPhone để quét tải ngay
            </p>
          </div>

          <a
            href={downloadApp.iosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors shadow-xs cursor-pointer"
          >
            <Apple className="w-4 h-4" />
            <span>Tải trên Apple App Store</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:border-[#00529C]/40 transition-all flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-xs">
            <Smartphone className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Dành cho điện thoại Android
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            VietinBank iPay trên Google Play
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Samsung, Oppo, Xiaomi, Realme, Vivo và các dòng máy Android
          </p>

          {/* QR Code Container */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 shadow-2xs group hover:bg-emerald-50/50 transition-colors">
            <img
              src={androidQr}
              alt="QR tải VietinBank iPay cho Android"
              className="w-44 h-44 object-contain rounded-lg"
              loading="lazy"
            />
            <p className="mt-2 text-[11px] font-semibold text-slate-500 group-hover:text-emerald-700">
              Mở Camera quét hoặc nhấn nút bên dưới
            </p>
          </div>

          <a
            href={downloadApp.androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors shadow-xs cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Tải trên Google Play</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* App Features & Benefits */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00529C] flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#00529C]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Đặc quyền khi trải nghiệm VietinBank iPay
            </h3>
            <p className="text-xs text-slate-500">
              Ngân hàng số hàng đầu Việt Nam phục vụ trọn vẹn nhu cầu giao dịch hàng ngày
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloadApp.features.map((feature, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-3 hover:bg-blue-50/40 hover:border-blue-100 transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00529C]" />
            <span>Bảo mật chuẩn quốc tế PCI-DSS & mã hóa dữ liệu đầu cuối</span>
          </div>
          <span className="text-slate-400">Miễn phí tải và duy trì dịch vụ thường niên</span>
        </div>
      </div>
    </div>
  );
};
