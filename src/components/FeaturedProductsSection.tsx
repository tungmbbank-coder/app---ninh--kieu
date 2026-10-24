import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { resolveImage, handleImageError } from '../utils/imageHelper';
import { 
  Sparkles, 
  Gift, 
  Star, 
  PhoneCall, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  HeartHandshake,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FeaturedProductsProps {
  onContactAdvisor: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsProps> = ({ onContactAdvisor }) => {
  const { featuredProducts, brand } = contentData;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [interestedProduct, setInterestedProduct] = useState<any | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const filteredItems = featuredProducts.items.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev === 0 ? featuredProducts.items.length - 1 : prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev === featuredProducts.items.length - 1 ? 0 : prev + 1));
  };

  const currentCarouselItem = featuredProducts.items[carouselIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title & Prominent Badge (Red border / subtle blue gradient as required) */}
      <div className="relative mb-8 text-center max-w-3xl mx-auto p-6 rounded-3xl bg-gradient-to-b from-blue-50/60 to-white border-2 border-[#ED1C24]/30 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#C4131A] text-white text-xs font-bold mb-3 shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>NỔI BẬT</span>
          <Gift className="w-3.5 h-3.5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {featuredProducts.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          {featuredProducts.description}
        </p>

        {/* View mode toggle */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'carousel'
                ? 'bg-[#00529C] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Chế độ Carousel
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#00529C] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Xem toàn bộ thẻ
          </button>
        </div>
      </div>

      {/* Filter Category Chips (Functional interactive buttons) */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
        {featuredProducts.categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCarouselIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00529C] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:border-blue-200 hover:text-[#00529C]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* MODE 1: CAROUSEL VIEW (Recommended in PDF for modern mobile experience) */}
      {viewMode === 'carousel' && currentCarouselItem && (
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden transition-all">
            {/* Poster Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-bold text-[#00529C] uppercase tracking-wider">
                {currentCarouselItem.categoryLabel}
              </span>
              <span className="text-xs font-mono font-medium text-slate-400">
                {carouselIndex + 1} / {featuredProducts.items.length}
              </span>
            </div>

            {/* Poster Image */}
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={resolveImage(currentCarouselItem.image, currentCarouselItem.remoteUrl)}
                alt={currentCarouselItem.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => handleImageError(e, currentCarouselItem.remoteUrl)}
                loading="lazy"
              />

              {/* Prev / Next Buttons */}
              <button
                onClick={handlePrevCarousel}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow-md transition-all active:scale-95 cursor-pointer"
                aria-label="Poster trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextCarousel}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow-md transition-all active:scale-95 cursor-pointer"
                aria-label="Poster sau"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Card Content & Action */}
            <div className="p-6 space-y-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold mb-2 border border-amber-200">
                  {currentCarouselItem.highlight}
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {currentCarouselItem.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentCarouselItem.description}
                </p>
              </div>

              {/* "Tôi quan tâm" Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  onClick={() => setInterestedProduct(currentCarouselItem)}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-[#ED1C24] to-[#C4131A] hover:brightness-105 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {featuredProducts.items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  carouselIndex === idx ? 'w-6 bg-[#00529C]' : 'w-2 bg-slate-300'
                }`}
                aria-label={`Đi tới poster ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: GRID VIEW (Browse all posters) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-[#00529C]/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative aspect-4/3 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <img
                    src={resolveImage(item.image, item.remoteUrl)}
                    alt={item.name}
                    className="w-full h-full object-contain p-3"
                    onError={(e) => handleImageError(e, item.remoteUrl)}
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 rounded-lg text-[10px] font-bold text-[#00529C] border border-slate-200 shadow-2xs">
                    {item.categoryLabel}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-bold text-[#ED1C24] block mb-1">
                    {item.highlight}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setInterestedProduct(item)}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white font-bold text-xs rounded-xl border border-red-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
       * "TÔI QUAN TÂM" MODAL (As strictly specified in PDF 5)
       * ========================================================================= */}
      {interestedProduct && (
        <div 
          onClick={() => setInterestedProduct(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 text-center cursor-default"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#ED1C24] mx-auto flex items-center justify-center border border-red-100">
              <HeartHandshake className="w-8 h-8 text-[#ED1C24]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Xác nhận đăng ký tư vấn
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {interestedProduct.name}
              </h3>
            </div>

            {/* Exact text required by PDF */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed text-left space-y-2">
              <p className="font-medium text-slate-900">
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <p className="font-semibold text-[#00529C] pt-2 border-t border-slate-200">
                Hoặc liên hệ Chuyên viên tư vấn {brand.advisor.name} - {brand.advisor.cleanPhone}.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`tel:${brand.advisor.cleanPhone}`}
                className="w-full py-3 bg-[#ED1C24] hover:bg-[#C4131A] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Chuyên viên tư vấn: {brand.advisor.phone}</span>
              </a>

              <button
                onClick={() => setInterestedProduct(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
