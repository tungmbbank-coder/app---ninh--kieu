import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { resolveImage, handleImageError } from '../utils/imageHelper';
import { 
  KeyRound, 
  CreditCard, 
  Fingerprint, 
  ReceiptText, 
  CalendarClock, 
  Youtube, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ZoomIn, 
  X, 
  ChevronRight, 
  PhoneCall, 
  Sparkles,
  MessageSquareOff
} from 'lucide-react';

interface FaqSectionProps {
  onContactAdvisor: () => void;
}

const cardIcons: Record<string, React.ReactNode> = {
  'forgot-password': <KeyRound className="w-6 h-6 text-[#00529C]" />,
  'close-card': <CreditCard className="w-6 h-6 text-[#00529C]" />,
  'biometrics': <Fingerprint className="w-6 h-6 text-[#00529C]" />,
  'e-tax': <ReceiptText className="w-6 h-6 text-[#00529C]" />,
  'appointment-booking': <CalendarClock className="w-6 h-6 text-[#00529C]" />
};

export const FaqSection: React.FC<FaqSectionProps> = ({ onContactAdvisor }) => {
  const { faq, brand } = contentData;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'none' | 'satisfied' | 'unsatisfied' | 'ended'>('none');
  const [zoomedImage, setZoomedImage] = useState<{ src: string; caption: string } | null>(null);

  const selectedTopic = faq.categories.find(c => c.id === selectedTopicId);

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setFeedbackState('none');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleResetToMenu = () => {
    setSelectedTopicId(null);
    setFeedbackState('none');
  };

  const handleEndConversation = () => {
    setFeedbackState('ended');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner & Title */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#00529C] text-xs font-semibold mb-3 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5 text-[#00529C]" />
          <span>Hỗ trợ thao tác số trực tuyến 24/7</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {faq.title}
        </h1>
        <p className="mt-2 text-base text-slate-600 font-medium">
          {faq.prompt}
        </p>
      </div>

      {/* State 1: When no topic is selected (Card Grid Selection) */}
      {!selectedTopic && feedbackState !== 'ended' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {faq.categories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleSelectTopic(category.id)}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#00529C]/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50/80 flex items-center justify-center border border-blue-100/60 group-hover:scale-105 transition-transform">
                      {cardIcons[category.id] || <KeyRound className="w-6 h-6 text-[#00529C]" />}
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-[#00529C] transition-colors">
                      Mục 0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00529C] transition-colors leading-snug">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {category.shortDesc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#00529C]">
                  <span>{category.steps.length} bước hướng dẫn trực quan</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Xem ngay</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Help Card at the bottom */}
          <div className="mt-8 p-5 bg-gradient-to-r from-blue-900 to-[#00529C] rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-base">Cần nhân viên tư vấn hỗ trợ trực tiếp?</h4>
              <p className="text-xs text-blue-100 mt-0.5">
                Chuyên viên tư vấn {brand.advisor.name} sẵn sàng đồng hành cùng Quý khách tại quầy.
              </p>
            </div>
            <button
              onClick={onContactAdvisor}
              className="px-5 py-2.5 bg-white text-[#00529C] font-bold text-sm rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#ED1C24]" />
              <span>Gọi {brand.advisor.phone}</span>
            </button>
          </div>
        </div>
      )}

      {/* State 2: Guide detail step-by-step view */}
      {selectedTopic && feedbackState !== 'ended' && (
        <div className="space-y-6">
          {/* Back button bar */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200">
            <button
              onClick={handleResetToMenu}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#00529C] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách câu hỏi</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">
              {selectedTopic.steps.length} bước thực hiện
            </span>
          </div>

          {/* Topic Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00529C]">
                  Hướng dẫn chi tiết
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {selectedTopic.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {selectedTopic.shortDesc}
                </p>
              </div>

              {/* YouTube Action Button */}
              {selectedTopic.videoUrl && (
                <a
                  href={selectedTopic.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-[#ED1C24] hover:bg-red-100 font-semibold text-xs sm:text-sm border border-red-200 transition-all shrink-0 shadow-xs cursor-pointer"
                >
                  <Youtube className="w-5 h-5 text-[#ED1C24]" />
                  <span>Xem Video Hướng Dẫn YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Step list cards */}
          <div className="space-y-6">
            {selectedTopic.steps.map((step) => {
              const imgSrc = resolveImage(step.image, step.remoteUrl);
              return (
                <div
                  key={step.step}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Text instructions */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#00529C] text-xs font-bold border border-blue-100">
                        <span>Bước {step.step}</span>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                        {step.text}
                      </p>
                    </div>

                    {/* Step illustration with zoom */}
                    <div className="lg:col-span-5">
                      <div 
                        onClick={() => setZoomedImage({ src: imgSrc, caption: `Bước ${step.step}: ${step.text}` })}
                        className="relative group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden cursor-zoom-in aspect-16/10 flex items-center justify-center"
                      >
                        <img
                          src={imgSrc}
                          alt={`Minh họa bước ${step.step}`}
                          className="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-200"
                          onError={(e) => handleImageError(e, step.remoteUrl)}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                          <ZoomIn className="w-4 h-4" />
                          <span>Bấm để phóng to</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Video preview & direct YouTube link at end of guide */}
          {selectedTopic.videoUrl && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                  <Youtube className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Theo dõi video hướng dẫn trực tiếp</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Mở ứng dụng YouTube để xem thao tác mẫu từng bước chi tiết nhất
                  </p>
                </div>
              </div>
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
              >
                <span>Xem trên YouTube</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Customer Feedback Section (As requested in PDF) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Khách hàng thực hiện ổn hay chưa?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
              Đánh giá của Quý khách giúp VietinBank phục vụ ngày càng chuyên nghiệp và tận tâm hơn.
            </p>

            {feedbackState === 'none' && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setFeedbackState('satisfied')}
                  className="px-6 py-2.5 bg-[#00529C] hover:bg-[#003B70] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã ổn (Tôi đã làm được)</span>
                </button>

                <button
                  onClick={() => setFeedbackState('unsatisfied')}
                  className="px-6 py-2.5 bg-rose-50 hover:bg-rose-100 text-[#ED1C24] font-bold text-sm rounded-xl border border-rose-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Chưa ổn (Cần hỗ trợ thêm)</span>
                </button>
              </div>
            )}

            {/* Satisfied State */}
            {feedbackState === 'satisfied' && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 max-w-xl mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 font-bold text-base text-emerald-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Tuyệt vời! Cảm ơn Quý khách đã thao tác thành công</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Quý khách có thể quay lại danh sách giải đáp để tra cứu thêm hoặc kết thúc cuộc trò chuyện.
                </p>
              </div>
            )}

            {/* Unsatisfied State (Exact prompt required by PDF) */}
            {feedbackState === 'unsatisfied' && (
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-slate-800 max-w-2xl mx-auto space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {brand.advisorHelpMessage}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={`tel:${brand.advisor.cleanPhone}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#ED1C24] hover:bg-[#C4131A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Gọi trực tiếp {brand.advisor.name}: {brand.advisor.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions: "Quay lại menu chính" & "Kết thúc cuộc trò chuyện" */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleResetToMenu}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Quay lại menu chính
              </button>

              <button
                onClick={handleEndConversation}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageSquareOff className="w-4 h-4 text-slate-300" />
                <span>Kết thúc cuộc trò chuyện</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 3: End Conversation Screen (Exact thank-you text required by PDF) */}
      {feedbackState === 'ended' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#00529C] mx-auto flex items-center justify-center border border-blue-100">
            <Sparkles className="w-8 h-8 text-[#00529C]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              VietinBank Trân Trọng Cảm Ơn
            </h2>
            <p className="text-base text-slate-700 font-medium leading-relaxed">
              "{brand.farewellMessage}"
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
            Chi nhánh Cần Thơ - 59-59A Phan Đình Phùng, TP Cần Thơ · Hotline: {brand.advisor.phone}
          </div>

          <button
            onClick={handleResetToMenu}
            className="px-6 py-2.5 bg-[#00529C] hover:bg-[#003B70] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Bắt đầu yêu cầu mới
          </button>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl p-4 max-w-3xl max-h-[90vh] overflow-auto shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage.src}
              alt="Chi tiết bước"
              className="max-h-[75vh] w-auto object-contain rounded-lg border border-slate-100"
            />
            <p className="mt-3 text-xs sm:text-sm font-semibold text-slate-700 text-center">
              {zoomedImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
