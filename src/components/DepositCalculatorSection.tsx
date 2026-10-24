import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { 
  PiggyBank, 
  TrendingUp, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Coins, 
  Video
} from 'lucide-react';

export const DepositCalculatorSection: React.FC = () => {
  const { deposit } = contentData;

  const [depositAmount, setDepositAmount] = useState<number>(100000000); // 100M VND default
  const [amountInputStr, setAmountInputStr] = useState<string>('100,000,000');
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(12);
  const [customInterestRate, setCustomInterestRate] = useState<number>(4.8);
  const [rateInputStr, setRateInputStr] = useState<string>('4.8');

  const [amountError, setAmountError] = useState<string | null>(null);
  const [termError, setTermError] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  // Format currency helper
  const formatVND = (val: number): string => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(val));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setAmountInputStr('');
      setDepositAmount(0);
      setAmountError(deposit.errorMessages.amount);
      return;
    }
    const num = parseInt(raw, 10);
    setDepositAmount(num);
    setAmountInputStr(new Intl.NumberFormat('en-US').format(num));

    if (num < deposit.minAmount) {
      setAmountError(`Số tiền gửi tối thiểu là ${formatVND(deposit.minAmount)} VND.`);
    } else {
      setAmountError(null);
    }
  };

  const handleSelectTerm = (months: number) => {
    setSelectedTermMonths(months);
    setTermError(null);
    const termObj = deposit.defaultTerms.find(t => t.months === months);
    if (termObj) {
      setCustomInterestRate(termObj.rate);
      setRateInputStr(termObj.rate.toString());
      setRateError(null);
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRateInputStr(val);
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      setRateError(deposit.errorMessages.rate);
    } else if (num > 20) {
      setRateError('Lãi suất không được vượt quá mức trần 20%/năm.');
    } else {
      setRateError(null);
      setCustomInterestRate(num);
    }
  };

  // Calculation: Tiền lãi = Tiền gửi * (Lãi suất/100) * (Số tháng / 12)
  const isValid = !amountError && !termError && !rateError && depositAmount >= deposit.minAmount && customInterestRate >= 0;
  
  const estimatedInterest = isValid
    ? (depositAmount * (customInterestRate / 100) * (selectedTermMonths / 12))
    : 0;

  const totalMaturityAmount = isValid ? depositAmount + estimatedInterest : depositAmount;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#00529C] text-xs font-semibold mb-3 border border-blue-100">
          <PiggyBank className="w-3.5 h-3.5" />
          <span>Sinh lời tối ưu · An toàn tuyệt đối cùng VietinBank</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {deposit.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {deposit.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Thông tin tiền gửi</span>
            <span className="text-xs font-normal text-slate-500">Trả lãi cuối kỳ</span>
          </h3>

          {/* 1. Số tiền gửi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Số tiền gửi (VND) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={amountInputStr}
                onChange={handleAmountChange}
                placeholder="Ví dụ: 100,000,000"
                className={`w-full px-4 py-3 text-lg font-mono font-bold rounded-xl border ${
                  amountError ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20' : 'border-slate-300 focus:border-[#00529C] focus:ring-blue-100'
                } focus:outline-none focus:ring-2 transition-all`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-slate-400">
                VND
              </span>
            </div>

            {amountError && (
              <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{amountError}</span>
              </p>
            )}

            {/* Quick Amount Chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[50000000, 100000000, 300000000, 500000000, 1000000000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setDepositAmount(val);
                    setAmountInputStr(new Intl.NumberFormat('en-US').format(val));
                    setAmountError(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    depositAmount === val
                      ? 'bg-blue-50 border-[#00529C] text-[#00529C]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {val >= 1000000000 ? `${val / 1000000000} Tỷ` : `${val / 1000000} Tr`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Kỳ hạn gửi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Kỳ hạn gửi <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {deposit.defaultTerms.map(term => {
                const isSelected = selectedTermMonths === term.months;
                return (
                  <button
                    key={term.months}
                    type="button"
                    onClick={() => handleSelectTerm(term.months)}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00529C] bg-blue-50/70 text-[#00529C] font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="block text-xs">{term.label}</span>
                    <span className="block text-[11px] font-mono text-slate-500 mt-0.5">
                      {term.rate}%/năm
                    </span>
                  </button>
                );
              })}
            </div>
            {termError && (
              <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{termError}</span>
              </p>
            )}
          </div>

          {/* 3. Lãi suất */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Lãi suất áp dụng (%/năm) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Có thể điều chỉnh theo thỏa thuận tại quầy</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="20"
                value={rateInputStr}
                onChange={handleRateChange}
                className={`w-full px-4 py-3 text-lg font-mono font-bold rounded-xl border ${
                  rateError ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20' : 'border-slate-300 focus:border-[#00529C] focus:ring-blue-100'
                } focus:outline-none focus:ring-2 transition-all`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-slate-400">
                %/năm
              </span>
            </div>
            {rateError && (
              <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{rateError}</span>
              </p>
            )}
          </div>

          {/* Video Guide Link */}
          <div className="pt-4 border-t border-slate-100">
            <a
              href={deposit.videoGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#00529C] hover:underline"
            >
              <Video className="w-4 h-4 text-[#ED1C24]" />
              <span>Xem video hướng dẫn gửi tiết kiệm VietinBank trực quan</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Right Output: Calculation Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#00529C] to-[#003B70] text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Kết quả dự tính
            </span>
            <h3 className="text-xl font-bold mt-1 mb-6 text-white">
              Lợi Nhuận Tiết Kiệm
            </h3>

            {/* Interest Result Card */}
            <div className="p-4 bg-white/10 rounded-2xl border border-white/15 mb-4 backdrop-blur-2xs">
              <span className="text-xs text-blue-100 block mb-1">
                Tiền lãi dự tính nhận được:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
                  {formatVND(estimatedInterest)}
                </span>
                <span className="text-sm font-semibold text-blue-200">VND</span>
              </div>
            </div>

            {/* Total Maturity Amount */}
            <div className="p-4 bg-white/10 rounded-2xl border border-white/15 mb-6 backdrop-blur-2xs">
              <span className="text-xs text-blue-100 block mb-1">
                Tổng tiền nhận khi đáo hạn (Gốc + Lãi):
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {formatVND(totalMaturityAmount)}
                </span>
                <span className="text-sm font-semibold text-blue-200">VND</span>
              </div>
            </div>

            {/* Parameter Summary */}
            <div className="space-y-2 pt-2 border-t border-white/15 text-xs text-blue-100">
              <div className="flex justify-between">
                <span>Số tiền gửi ban đầu:</span>
                <span className="font-mono font-semibold text-white">{formatVND(depositAmount)} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Kỳ hạn gửi:</span>
                <span className="font-semibold text-white">{selectedTermMonths} tháng</span>
              </div>
              <div className="flex justify-between">
                <span>Lãi suất áp dụng:</span>
                <span className="font-mono font-semibold text-white">{customInterestRate}% / năm</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 text-[11px] text-blue-200 leading-relaxed">
              * Kết quả mang tính chất tham khảo. Lãi suất và số tiền thực nhận có thể điều chỉnh tùy theo chính sách ưu đãi cộng lãi suất tại quầy của VietinBank vào từng thời kỳ.
            </div>
          </div>

          {/* Quick Tip for Counter Teller / Customer */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 flex items-start gap-3 shadow-2xs">
            <Coins className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 mb-1">Gửi tiết kiệm online trên VietinBank iPay</p>
              <p className="leading-relaxed">
                Khách hàng gửi tiết kiệm trực tuyến qua App iPay thường xuyên được cộng thêm từ <strong>+0.2% đến +0.4%/năm</strong> so với gửi tại quầy, chủ động tất toán 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
