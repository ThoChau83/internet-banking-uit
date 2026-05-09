import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { Search, Filter, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function ManageTransactions() {
  const { transactions, users } = useBank();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Combine transactions with user details for admin view
  const allTransactions = transactions.map(t => {
    const user = users.find(u => u.id === t.userId);
    return { ...t, userName: user?.name, userAccount: user?.accountNumber };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = allTransactions.filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    return (
      t.id.toLowerCase().includes(term) ||
      formatDate(t.date).toLowerCase().includes(term) ||
      (t.userName && t.userName.toLowerCase().includes(term)) ||
      t.counterparty.toLowerCase().includes(term) ||
      t.note.toLowerCase().includes(term) ||
      t.amount.toString().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Giám sát giao dịch</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý toàn bộ giao dịch trên hệ thống</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nhập từ khóa tìm kiếm (Mã GD, Số tiền, Tên)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4 sm:px-6 whitespace-nowrap">Mã GD / Thời gian</th>
                <th className="p-4 sm:px-6 whitespace-nowrap">Khách hàng</th>
                <th className="p-4 sm:px-6 whitespace-nowrap">Loại / Đối tác</th>
                <th className="p-4 sm:px-6 text-right whitespace-nowrap">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:px-6 py-4">
                      <p className="font-mono text-xs font-semibold text-slate-900">{t.id}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(t.date)}</p>
                    </td>
                    <td className="p-4 sm:px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{t.userName}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{t.userAccount}</p>
                    </td>
                    <td className="p-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          t.status === 'invalid' ? 'bg-slate-200 text-slate-700' :
                          t.type === 'receive' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {t.status === 'invalid' ? 'Đã hủy' : (t.type === 'receive' ? 'Nhận' : 'Chuyển')}
                        </span>
                        <span className="text-slate-600 truncate max-w-[150px]">{t.counterparty}</span>
                      </div>
                    </td>
                    <td className={`p-4 sm:px-6 py-4 text-right text-sm font-bold whitespace-nowrap ${
                      t.status === 'invalid' ? 'text-slate-400 line-through' :
                      (t.type === 'receive' ? 'text-emerald-600' : 'text-rose-600')
                    }`}>
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    Không tìm thấy giao dịch nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
