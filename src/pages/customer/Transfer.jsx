import React, { useState, useEffect } from 'react';
import { useBank } from '../../context/BankContext';
import { formatCurrency } from '../../utils/format';
import { ArrowRight, KeyRound, Loader2, CheckCircle2, Banknote, Building2, AlertTriangle, X } from 'lucide-react';

export default function Transfer() {
  const { user, users, makeTransaction, transactions } = useBank();
  
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [bank, setBank] = useState('vibe');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [otp, setOtp] = useState('');
  const [recipientName, setRecipientName] = useState('');

  useEffect(() => {
    if (bank === 'vibe' && accountNumber.length > 0) {
      const recipient = users.find(u => u.accountNumber === accountNumber && u.id !== user.id);
      if (recipient) {
        setRecipientName(recipient.name);
      } else {
        setRecipientName('');
      }
    } else {
      setRecipientName('');
    }
  }, [accountNumber, bank, users, user.id]);

  const isRecipientValid = bank !== 'vibe' || (bank === 'vibe' && recipientName !== '');

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!accountNumber || !amount) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }
    
    const numAmount = Number(amount);
    
    if (numAmount > user.balance) {
      setErrorMessage('Số dư không đủ để thực hiện giao dịch. Vui lòng kiểm tra lại số dư khả dụng.');
      setShowErrorModal(true);
      return;
    }

    const today = new Date().toDateString();
    const todayTransfers = transactions
      .filter(t => t.userId === user.id && t.type === 'send' && t.status === 'success' && new Date(t.date).toDateString() === today)
      .reduce((sum, t) => sum + t.amount, 0);

    if (todayTransfers + numAmount > 100000000) {
      setErrorMessage(`Giao dịch vượt quá hạn mức. Bạn chỉ có thể chuyển tối đa 100,000,000 VND/ngày. (Đã chuyển trong ngày: ${formatCurrency(todayTransfers)})`);
      setShowErrorModal(true);
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simulate API validation
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Go to OTP
    }, 800);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Mã OTP không hợp lệ. Vui lòng thử lại.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await makeTransaction(user.id, accountNumber, amount, note, bank);
      setLoading(false);
      setStep(3); // Success
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setStep(1); // Go back if error
    }
  };

  const resetForm = () => {
    setAccountNumber('');
    setAmount('');
    setNote('');
    setOtp('');
    setStep(1);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chuyển tiền</h1>
        <p className="text-sm text-slate-500 mt-1">Chuyển tiền nhanh chóng 24/7</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <span className={`text-sm font-medium ${step >= 1 ? 'text-primary-900' : 'text-slate-500'}`}>Nhập thông tin</span>
          </div>
          <div className="h-px flex-1 bg-slate-200 mx-4"></div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-primary-900' : 'text-slate-500'}`}>Xác thực OTP</span>
          </div>
          <div className="h-px flex-1 bg-slate-200 mx-4"></div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-emerald-700' : 'text-slate-500'}`}>Hoàn tất</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleTransferSubmit} className="space-y-6">
              
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-primary-900">Từ tài khoản (Số dư: {formatCurrency(user.balance)})</span>
                <span className="font-mono font-bold text-primary-700">{user.accountNumber}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ngân hàng thụ hưởng</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select 
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors appearance-none"
                    >
                      <option value="vibe">Internet Banking (Nội bộ)</option>
                      <option value="vcb">Vietcombank</option>
                      <option value="tcb">Techcombank</option>
                      <option value="mbb">MB Bank</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số tài khoản thụ hưởng *</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                    placeholder="Nhập số tài khoản"
                  />
                  {bank === 'vibe' && accountNumber.length > 0 && !recipientName && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><X className="h-3 w-3"/> Không tìm thấy tài khoản hợp lệ</p>
                  )}
                  {bank === 'vibe' && recipientName && (
                    <p className="text-emerald-600 text-xs mt-2 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Người nhận: <strong>{recipientName}</strong></p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Số tiền chuyển *</label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    required
                    disabled={!isRecipientValid}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors text-lg font-bold disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">VND</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nội dung chuyển tiền</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Nhập nội dung (Không bắt buộc)"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center items-center gap-2 py-3 px-8 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>Tiếp tục <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-8 max-w-md mx-auto py-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <KeyRound className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Xác thực giao dịch</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Vui lòng nhập mã OTP để xác nhận chuyển số tiền <strong className="text-slate-900">{formatCurrency(Number(amount))}</strong>.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  className="block w-full text-center tracking-[1em] text-3xl py-4 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors font-mono"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 flex justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Xác nhận'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Chuyển tiền thành công!</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Giao dịch của bạn đã được xử lý thành công. Số tiền đã được trừ vào tài khoản.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left space-y-3 border border-slate-100 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(Number(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Người nhận:</span>
                  <span className="font-medium text-slate-900 font-mono">{accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã GD:</span>
                  <span className="font-medium text-slate-900 font-mono">TXN{Math.floor(Math.random() * 100000)}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetForm}
                  className="py-3 px-6 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  Giao dịch mới
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Giao dịch không hợp lệ</h3>
              <p className="text-slate-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
