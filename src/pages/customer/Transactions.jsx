import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { ArrowDownLeft, ArrowUpRight, Search, Filter } from 'lucide-react';

export default function Transactions() {
  const { user, transactions } = useBank();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions
    .filter(t => t.userId === user.id)
    .filter(t => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      
      switch (filterType) {
        case 'id': 
          return t.id.toLowerCase().includes(term);
        case 'date': 
          return formatDate(t.date).toLowerCase().includes(term);
        case 'name': 
          return t.counterparty.toLowerCase().includes(term);
        case 'note': 
          return t.note.toLowerCase().includes(term);
        case 'amount': 
          return t.amount.toString().includes(term);
        case 'all':
        default:
          return (
            t.id.toLowerCase().includes(term) ||
            formatDate(t.date).toLowerCase().includes(term) ||
            t.counterparty.toLowerCase().includes(term) ||
            t.note.toLowerCase().includes(term) ||
            t.amount.toString().includes(term)
          );
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lịch sử giao dịch</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi các khoản thu chi của bạn</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50">
          
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white text-slate-700"
            >
              <option value="all">Tất cả thông tin</option>
              <option value="id">Mã giao dịch</option>
              <option value="date">Thời gian</option>
              <option value="name">Tên đối tác</option>
              <option value="note">Nội dung</option>
              <option value="amount">Số tiền</option>
            </select>
          </div>

          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nhập từ khóa tìm kiếm..." 
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
                <th className="p-4 sm:px-6 whitespace-nowrap">Mã GD</th>
                <th className="p-4 sm:px-6 whitespace-nowrap">Thời gian</th>
                <th className="p-4 sm:px-6">Đối tác</th>
                <th className="p-4 sm:px-6">Nội dung</th>
                <th className="p-4 sm:px-6 text-right whitespace-nowrap">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:px-6 py-4">
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{t.id}</span>
                    </td>
                    <td className="p-4 sm:px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="p-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          t.type === 'receive' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                          {t.type === 'receive' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{t.counterparty}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:px-6 py-4 text-sm text-slate-600">
                      {t.note}
                    </td>
                    <td className={`p-4 sm:px-6 py-4 text-right text-sm font-bold whitespace-nowrap ${
                      t.type === 'receive' ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {t.type === 'receive' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
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
