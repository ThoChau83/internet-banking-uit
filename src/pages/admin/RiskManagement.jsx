import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { AlertOctagon, XCircle, CheckCircle } from 'lucide-react';

export default function RiskManagement() {
  const { transactions, users, markTransactionInvalid } = useBank();
  
  // Show all transactions that are not yet marked invalid
  // In a real app, this would be a list of "flagged" transactions. Here we just show all recent ones.
  const allTransactions = transactions.map(t => {
    const user = users.find(u => u.id === t.userId);
    return { ...t, userName: user?.name, userAccount: user?.accountNumber };
  }).filter(t => t.status !== 'invalid').slice(0, 15);

  const handleMarkInvalid = (txId) => {
    if (window.confirm('Bạn có chắc chắn muốn đánh dấu giao dịch này là LỖI và hủy bỏ? Tiền sẽ KHÔNG được tự động hoàn lại trong bản demo này.')) {
      markTransactionInvalid(txId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Xét duyệt rủi ro</h1>
        <p className="text-sm text-slate-500 mt-1">Chỉ định các thanh toán không hợp lệ hoặc lỗi ngoại cảnh</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
          <AlertOctagon className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-medium text-slate-700">Các giao dịch gần đây (Có thể hủy)</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4 sm:px-6 whitespace-nowrap">Mã GD</th>
                <th className="p-4 sm:px-6 whitespace-nowrap">Khách hàng</th>
                <th className="p-4 sm:px-6 whitespace-nowrap">Số tiền</th>
                <th className="p-4 sm:px-6 whitespace-nowrap text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allTransactions.length > 0 ? (
                allTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:px-6 py-4">
                      <p className="font-mono text-xs font-semibold text-slate-900">{t.id}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(t.date)}</p>
                    </td>
                    <td className="p-4 sm:px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{t.userName}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{t.userAccount}</p>
                    </td>
                    <td className="p-4 sm:px-6 py-4 font-bold text-slate-900">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="p-4 sm:px-6 py-4 text-right">
                      <button 
                        onClick={() => handleMarkInvalid(t.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="h-4 w-4" /> Đánh dấu Lỗi
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" />
                      Không có giao dịch nào cần xét duyệt
                    </div>
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
