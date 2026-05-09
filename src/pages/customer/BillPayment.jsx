import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { formatCurrency } from '../../utils/format';
import { Receipt, Lightbulb, Droplets, Wifi, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function BillPayment() {
  const { user, makeTransaction } = useBank();
  
  const [step, setStep] = useState(1); // 1: Choose bill, 2: OTP & Confirm, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [billType, setBillType] = useState('electric');
  const [customerCode, setCustomerCode] = useState('');
  const [billAmount, setBillAmount] = useState(0);
  const [otp, setOtp] = useState('');

  const handleSearchBill = (e) => {
    e.preventDefault();
    if (!customerCode) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Giả lập tìm thấy hóa đơn ngẫu nhiên từ 100k đến 500k
      setBillAmount(Math.floor(Math.random() * 400000) + 100000);
      setStep(2);
    }, 1000);
  };

  const handlePayBill = async (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Mã OTP không hợp lệ. Vui lòng thử lại.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const typeName = billType === 'electric' ? 'Điện' : billType === 'water' ? 'Nước' : 'Internet';
      await makeTransaction(user.id, `Mã KH: ${customerCode}`, billAmount, `Thanh toán hóa đơn ${typeName}`, 'bill');
      setLoading(false);
      setStep(3);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Thanh toán hóa đơn</h1>
        <p className="text-sm text-slate-500 mt-1">Thanh toán điện, nước, internet nhanh chóng</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 sm:px-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dịch vụ tiện ích</h2>
              <p className="text-sm text-slate-500">Số dư khả dụng: <span className="font-bold text-primary-600">{formatCurrency(user.balance)}</span></p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 sm:px-8 bg-slate-50/50">
          {error && step !== 3 && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSearchBill} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Chọn dịch vụ</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setBillType('electric')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${billType === 'electric' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                  >
                    <Lightbulb className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Tiền điện</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillType('water')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${billType === 'water' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                  >
                    <Droplets className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Tiền nước</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillType('internet')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${billType === 'internet' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                  >
                    <Wifi className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Internet</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mã khách hàng</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập mã khách hàng (vd: PE0123456)"
                  value={customerCode}
                  onChange={(e) => setCustomerCode(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !customerCode}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-70 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Tra cứu hóa đơn'}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePayBill} className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500">Dịch vụ</span>
                  <span className="font-medium text-slate-900">
                    {billType === 'electric' ? 'Tiền điện' : billType === 'water' ? 'Tiền nước' : 'Internet'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500">Mã khách hàng</span>
                  <span className="font-medium text-slate-900">{customerCode}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-500">Số tiền cần thanh toán</span>
                  <span className="text-2xl font-bold text-primary-600">{formatCurrency(billAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Xác thực OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  className="block w-full text-center tracking-widest text-2xl py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white transition-colors"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-2/3 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Xác nhận thanh toán'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Thanh toán thành công!</h2>
              <p className="text-slate-500 mb-8">
                Hóa đơn của mã KH <span className="font-bold">{customerCode}</span> đã được gạch nợ.
              </p>
              <button
                onClick={() => {
                  setStep(1);
                  setCustomerCode('');
                  setOtp('');
                }}
                className="inline-flex justify-center items-center py-3 px-6 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                Thanh toán hóa đơn khác
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
