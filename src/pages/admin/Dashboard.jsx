import React from 'react';
import { useBank } from '../../context/BankContext';
import { formatCurrency } from '../../utils/format';
import { Users, Activity, Banknote, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const { users, transactions } = useBank();

  const totalUsers = users.length;
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan Hệ thống</h1>
        <p className="text-sm text-slate-500 mt-1">Báo cáo thống kê hoạt động của Internet Banking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng người dùng</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalUsers.toLocaleString()}</h3>
            </div>
          </div>
          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <span>+12%</span>
            <span className="text-slate-500 font-normal">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Online hôm nay</p>
              <h3 className="text-2xl font-bold text-slate-900">{Math.floor(totalUsers * 0.4).toLocaleString()}</h3>
            </div>
          </div>
          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <span>+5%</span>
            <span className="text-slate-500 font-normal">so với hôm qua</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng giao dịch</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalTransactions.toLocaleString()}</h3>
            </div>
          </div>
          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <span>+18%</span>
            <span className="text-slate-500 font-normal">so với tuần trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Dòng tiền lưu thông</p>
              <h3 className="text-lg font-bold text-slate-900">{formatCurrency(totalVolume)}</h3>
            </div>
          </div>
          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <span>Ổn định</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80 flex items-center justify-center">
          <p className="text-slate-400">Biểu đồ người dùng đăng ký mới (Giả lập)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80 flex items-center justify-center">
          <p className="text-slate-400">Biểu đồ khối lượng giao dịch 7 ngày qua (Giả lập)</p>
        </div>
      </div>
    </div>
  );
}
