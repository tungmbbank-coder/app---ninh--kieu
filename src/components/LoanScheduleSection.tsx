import React, { useState, useMemo } from 'react';
import contentData from '../data/contentData.json';
import { 
  Calculator, 
  Calendar, 
  FileSpreadsheet, 
  X, 
  Info, 
  Download, 
  ChevronRight, 
  Clock, 
  Percent, 
  BadgeDollarSign
} from 'lucide-react';

interface RepaymentRow {
  period: number;
  paymentDate: string;
  openingPrincipal: number;
  principal: number;
  interest: number;
  totalPayment: number;
  closingPrincipal: number;
}

export const LoanScheduleSection: React.FC = () => {
  const { loan } = contentData;

  // Form inputs (No slider, direct input as explicitly requested in PDF 3)
  const [loanAmount, setLoanAmount] = useState<number>(500000000); // 500M VND
  const [loanAmountInput, setLoanAmountInput] = useState<string>('500,000,000');
  
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60); // 5 years = 60 months
  const [interestRateYear, setInterestRateYear] = useState<number>(8.5); // 8.5%/year
  
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-06-16');
  const [selectedCycleId, setSelectedCycleId] = useState<string>('monthly');
  const [periodicDay, setPeriodicDay] = useState<number>(25); // Day 25 of the month
  const [roundingMode, setRoundingMode] = useState<'none' | '1000'>('none');

  // Modal view state
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);

  // Formatting helpers
  const formatVND = (val: number): string => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(val));
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setLoanAmountInput('');
      setLoanAmount(0);
      return;
    }
    const num = parseInt(raw, 10);
    setLoanAmount(num);
    setLoanAmountInput(new Intl.NumberFormat('en-US').format(num));
  };

  // Get active cycle configuration
  const activeCycle = loan.cycles.find(c => c.id === selectedCycleId) || loan.cycles[0];

  // Number of repayment periods
  const totalPeriods = useMemo(() => {
    let monthsPerPeriod = 1;
    if (selectedCycleId === 'quarterly') monthsPerPeriod = 3;
    else if (selectedCycleId === 'semi_annual') monthsPerPeriod = 6;
    else if (selectedCycleId === 'annual') monthsPerPeriod = 12;

    return Math.max(1, Math.round(loanTermMonths / monthsPerPeriod));
  }, [loanTermMonths, selectedCycleId]);

  // Periodic interest rate
  const periodicRate = useMemo(() => {
    return (interestRateYear / 100) / activeCycle.divisor;
  }, [interestRateYear, activeCycle.divisor]);

  // Generate Repayment Schedule: Reducing balance method (Dư nợ giảm dần)
  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || totalPeriods <= 0) return [];

    const rows: RepaymentRow[] = [];
    let currentBalance = loanAmount;
    
    // Equal principal per period: Số tiền vay / Tổng số kỳ trả nợ
    let rawBasePrincipal = loanAmount / totalPeriods;
    let basePrincipal = roundingMode === '1000' 
      ? Math.round(rawBasePrincipal / 1000) * 1000 
      : Math.round(rawBasePrincipal);

    // Date generation logic: from disbursement date + period * cycle months, adjusted to periodicDay
    const [disbYear, disbMonth, disbDay] = disbursementDate.split('-').map(Number);
    let startDate = new Date(disbYear, disbMonth - 1, disbDay);

    let monthsIncrement = 1;
    if (selectedCycleId === 'quarterly') monthsIncrement = 3;
    else if (selectedCycleId === 'semi_annual') monthsIncrement = 6;
    else if (selectedCycleId === 'annual') monthsIncrement = 12;

    let accumulatedPrincipalPaid = 0;

    for (let p = 1; p <= totalPeriods; p++) {
      const opening = currentBalance;
      
      // Calculate period payment date
      const targetDate = new Date(startDate);
      targetDate.setMonth(targetDate.getMonth() + (p * monthsIncrement));
      // Clamp to selected periodicDay (handling months with fewer days like Feb)
      const lastDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
      const actualDay = Math.min(periodicDay, lastDayOfMonth);
      targetDate.setDate(actualDay);

      const dayStr = String(targetDate.getDate()).padStart(2, '0');
      const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
      const yearStr = targetDate.getFullYear();
      const formattedDate = `${dayStr}/${monthStr}/${yearStr}`;

      // In the final period, principal is whatever balance remains to ensure zero rounding error
      let periodPrincipal = basePrincipal;
      if (p === totalPeriods) {
        periodPrincipal = opening;
      } else {
        periodPrincipal = Math.min(basePrincipal, opening);
      }

      // Interest for current period = Dư nợ đầu kỳ * Lãi suất kỳ
      let rawInterest = opening * periodicRate;
      let periodInterest = roundingMode === '1000'
        ? Math.round(rawInterest / 1000) * 1000
        : Math.round(rawInterest);

      const totalPayment = periodPrincipal + periodInterest;
      const closing = Math.max(0, opening - periodPrincipal);

      rows.push({
        period: p,
        paymentDate: formattedDate,
        openingPrincipal: opening,
        principal: periodPrincipal,
        interest: periodInterest,
        totalPayment,
        closingPrincipal: closing
      });

      currentBalance = closing;
      accumulatedPrincipalPaid += periodPrincipal;
    }

    return rows;
  }, [loanAmount, totalPeriods, periodicRate, disbursementDate, selectedCycleId, periodicDay, roundingMode]);

  // Summary Metrics
  const firstPeriodPayment = scheduleData.length > 0 ? scheduleData[0].totalPayment : 0;
  const lastPeriodPayment = scheduleData.length > 0 ? scheduleData[scheduleData.length - 1].totalPayment : 0;
  const totalInterest = useMemo(() => scheduleData.reduce((acc, row) => acc + row.interest, 0), [scheduleData]);
  const totalRepayment = loanAmount + totalInterest;

  // CSV Export helper
  const exportToCSV = () => {
    let csv = "Kỳ,Ngày trả nợ,Số gốc còn lại (VND),Gốc trả (VND),Lãi trả (VND),Tổng Gốc + Lãi (VND)\n";
    scheduleData.forEach(r => {
      csv += `${r.period},${r.paymentDate},${Math.round(r.openingPrincipal)},${Math.round(r.principal)},${Math.round(r.interest)},${Math.round(r.totalPayment)}\n`;
    });
    csv += `TỔNG CỘNG,,${Math.round(loanAmount)},${Math.round(loanAmount)},${Math.round(totalInterest)},${Math.round(totalRepayment)}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Lich_tra_no_VietinBank_${loanAmount}_VND.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#00529C] text-xs font-semibold mb-3 border border-blue-100">
          <Calculator className="w-3.5 h-3.5" />
          <span>Minh bạch · Tối ưu tài chính theo phương thức Dư nợ giảm dần</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {loan.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {loan.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Direct input, strictly no slider as per user requirement) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Thông số khoản vay</span>
            <span className="text-xs font-normal text-slate-500">Dư nợ giảm dần</span>
          </h3>

          {/* 1. Số tiền vay (dạng nhập) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Số tiền vay (VND) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={loanAmountInput}
                onChange={handleLoanAmountChange}
                placeholder="Nhập số tiền vay (ví dụ: 500,000,000)"
                className="w-full px-4 py-3 text-base sm:text-lg font-mono font-bold rounded-xl border border-slate-300 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-slate-400">
                VND
              </span>
            </div>

            {/* Quick amounts */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {[200000000, 500000000, 1000000000, 2000000000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setLoanAmount(val);
                    setLoanAmountInput(new Intl.NumberFormat('en-US').format(val));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    loanAmount === val
                      ? 'bg-blue-50 border-[#00529C] text-[#00529C]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {val >= 1000000000 ? `${val / 1000000000} Tỷ` : `${val / 1000000} Triệu`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Thời gian vay & Lãi suất */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Thời gian vay (Tháng) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-4 py-2.5 text-base font-mono font-bold rounded-xl border border-slate-300 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  Tháng
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tương đương {(loanTermMonths / 12).toFixed(1)} năm
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Lãi suất (%/năm) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={interestRateYear}
                  onChange={(e) => setInterestRateYear(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-base font-mono font-bold rounded-xl border border-slate-300 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  %/năm
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Lãi suất kỳ: {(periodicRate * 100).toFixed(3)}%/{activeCycle.periodName}
              </span>
            </div>
          </div>

          {/* 3. Chu kỳ trả nợ & Ngày giải ngân */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Chu kỳ trả nợ
              </label>
              <select
                value={selectedCycleId}
                onChange={(e) => setSelectedCycleId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white font-medium"
              >
                {loan.cycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ngày giải ngân
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white font-mono"
              >
              </input>
            </div>
          </div>

          {/* 4. Ngày trả nợ định kỳ & Làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ngày trả nợ định kỳ
              </label>
              <select
                value={periodicDay}
                onChange={(e) => setPeriodicDay(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white"
              >
                {[5, 10, 15, 20, 25, 28].map(day => (
                  <option key={day} value={day}>
                    Ngày {day} hàng {activeCycle.periodName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Quy tắc làm tròn
              </label>
              <select
                value={roundingMode}
                onChange={(e) => setRoundingMode(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white"
              >
                {loan.roundingOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Output: Summary Dashboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00529C]">
              Tóm tắt nghĩa vụ trả nợ
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Lịch Trình Chi Tiết
            </h3>

            {/* First and Last Payment Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block mb-1">Số tiền trả kỳ đầu:</span>
                <span className="text-base sm:text-lg font-extrabold font-mono text-[#00529C] block">
                  {formatVND(firstPeriodPayment)}
                </span>
                <span className="text-[10px] text-slate-400">VND</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block mb-1">Số tiền trả kỳ cuối:</span>
                <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-600 block">
                  {formatVND(lastPeriodPayment)}
                </span>
                <span className="text-[10px] text-slate-400">VND</span>
              </div>
            </div>

            {/* Total Interest & Total Outlay */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Tổng gốc phải trả:</span>
                <span className="font-mono font-bold text-slate-900">{formatVND(loanAmount)} VND</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Tổng tiền lãi dự tính:</span>
                <span className="font-mono font-bold text-[#ED1C24]">{formatVND(totalInterest)} VND</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                <span className="font-bold text-slate-900">Tổng gốc và lãi:</span>
                <span className="font-mono font-extrabold text-base text-[#00529C]">{formatVND(totalRepayment)} VND</span>
              </div>
            </div>

            {/* CTA Button: "Xem chi tiết" (Step 2 from PDF 3) */}
            <button
              onClick={() => setShowScheduleModal(true)}
              className="w-full py-3.5 px-4 bg-[#00529C] hover:bg-[#003B70] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xem Chi Tiết Bảng Tính Lịch Trả Nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Repayment Rule Notice */}
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
              <p className="font-bold text-[#00529C] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Quy tắc tính toán theo chuẩn ngân hàng:</span>
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                <li>Gốc trả mỗi kỳ = Số tiền vay / Tổng số kỳ trả nợ</li>
                <li>Lãi kỳ = Dư nợ đầu kỳ × Lãi suất kỳ</li>
                <li>Số tiền phải trả giảm dần đều theo thời gian, giúp tiết kiệm chi phí lãi vay tối đa.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * STEP 2 MODAL: FULL DETAILED REPAYMENT SCHEDULE TABLE
       * ========================================================================= */}
      {showScheduleModal && (
        <div 
          onClick={() => setShowScheduleModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00529C]">
                  Bảng tính lịch trả nợ chi tiết
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  Lịch Trả Nợ Với Dư Nợ Giảm Dần ({totalPeriods} kỳ)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gốc vay: <strong className="font-mono text-slate-800">{formatVND(loanAmount)} VND</strong> · Lãi suất: <strong className="font-mono text-slate-800">{interestRateYear}%/năm</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportToCSV}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Xuất bảng tính sang định dạng file CSV/Excel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xuất Excel/CSV</span>
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Table Body (Scrollable) */}
            <div className="overflow-auto flex-1 p-4 sm:p-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="sticky top-0 bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-300 shadow-2xs">
                  <tr>
                    <th className="py-3 px-3 text-center">STT</th>
                    <th className="py-3 px-3">Kỳ trả nợ</th>
                    <th className="py-3 px-3 text-right">Số gốc còn lại</th>
                    <th className="py-3 px-3 text-right">Gốc</th>
                    <th className="py-3 px-3 text-right">Lãi</th>
                    <th className="py-3 px-3 text-right">Tổng Gốc + Lãi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Period 0: Disbursement row */}
                  <tr className="bg-blue-50/40 font-medium">
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">0</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {disbursementDate.split('-').reverse().join('/')} (Giải ngân)
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#00529C]">
                      {formatVND(loanAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">-</td>
                  </tr>

                  {scheduleData.map((row) => (
                    <tr key={row.period} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 text-center font-mono text-slate-500">{row.period}</td>
                      <td className="py-2 px-3 font-mono font-medium text-slate-800">{row.paymentDate}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">{formatVND(row.openingPrincipal)}</td>
                      <td className="py-2 px-3 text-right font-mono font-medium text-slate-800">{formatVND(row.principal)}</td>
                      <td className="py-2 px-3 text-right font-mono text-rose-600">{formatVND(row.interest)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-[#00529C]">{formatVND(row.totalPayment)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-950">
                    <td className="py-3 px-3 text-center uppercase" colSpan={2}>TỔNG CỘNG</td>
                    <td className="py-3 px-3 text-right font-mono text-blue-200">-</td>
                    <td className="py-3 px-3 text-right font-mono">{formatVND(loanAmount)}</td>
                    <td className="py-3 px-3 text-right font-mono text-amber-300">{formatVND(totalInterest)}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-300">{formatVND(totalRepayment)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>* Số liệu tính toán minh họa dựa trên lãi suất hiện hành và phương thức trả gốc đều.</span>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
