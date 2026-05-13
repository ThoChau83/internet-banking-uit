import React from 'react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Wallet,
  ShieldCheck,
  MoreHorizontal,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, transactions } = useBank();
  
  // Get recent transactions for this user
  const recentTransactions = transactions
    .filter(t => t.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Calculate simple stats
  const totalReceived = transactions
    .filter(t => t.userId === user.id && t.type === 'receive')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalSent = transactions
    .filter(t => t.userId === user.id && t.type === 'send')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xin chào, {user.name} 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Chào mừng bạn quay lại Internet Banking</p>
        </div>
        <Link 
          to="/customer/transfer"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-primary-700 hover:shadow transition-all"
        >
          <ArrowRight className="h-4 w-4" />
          Chuyển tiền ngay
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-primary-900/20 relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-primary-100 text-sm font-medium mb-1">Tổng số dư khả dụng</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {formatCurrency(user.balance)}
                </h2>
              </div>
              <ShieldCheck className="h-10 w-10 text-primary-200" />
            </div>
            
            <div className="relative z-10 mt-10 sm:mt-12 flex justify-between items-end">
              <div>
                <p className="text-primary-200 text-xs uppercase tracking-widest mb-1">Số tài khoản</p>
                <p className="font-mono text-lg tracking-wider">{user.accountNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-primary-200 text-xs uppercase tracking-widest mb-1">Thẻ Visa</p>
                <p className="font-mono text-sm tracking-wider">{user.cardNumber}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng thu</p>
                  <p className="text-xs text-emerald-600 font-medium">+15% so với tháng trước</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalReceived)}</h3>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng chi</p>
                  <p className="text-xs text-rose-600 font-medium">+5% so với tháng trước</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalSent)}</h3>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Giao dịch gần đây</h3>
            <Link to="/customer/transactions" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Xem tất cả
            </Link>
          </div>
          <div className="p-6 flex-1">
            {recentTransactions.length > 0 ? (
              <div className="space-y-6">
                {recentTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        t.type === 'receive' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {t.type === 'receive' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{t.counterparty}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatDate(t.date)}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${t.type === 'receive' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {t.type === 'receive' ? '+' : '-'}{formatCurrency(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                <History className="h-10 w-10 text-slate-300" />
                <p className="text-sm">Chưa có giao dịch nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
