import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { Search, Filter, MoreHorizontal, Shield, User, Lock, Unlock, KeyRound, CheckCircle, XCircle } from 'lucide-react';

export default function ManageUsers() {
  const { users, unlockUser, profileUpdateRequests, approveProfileUpdate, rejectProfileUpdate } = useBank();
  const [searchTerm, setSearchTerm] = useState('');

  const customers = users.filter(u => u.role === 'customer');

  const filteredUsers = customers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.accountNumber?.includes(searchTerm)
  );

  const pendingRequests = profileUpdateRequests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Profile Update Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Yêu cầu phê duyệt ({pendingRequests.length})</h2>
            <p className="text-sm text-slate-500 mt-1">Các yêu cầu thay đổi thông tin cá nhân cần duyệt</p>
          </div>
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50 border-b border-amber-200 text-xs uppercase tracking-wider text-amber-700 font-semibold">
                    <th className="p-4 sm:px-6 whitespace-nowrap">Người yêu cầu</th>
                    <th className="p-4 sm:px-6 whitespace-nowrap">Thay đổi</th>
                    <th className="p-4 sm:px-6 whitespace-nowrap">Thời gian</th>
                    <th className="p-4 sm:px-6 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRequests.map(req => {
                    const reqUser = users.find(u => u.id === req.userId);
                    return (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 sm:px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900">{req.oldName}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{reqUser?.accountNumber}</p>
                        </td>
                        <td className="p-4 sm:px-6 py-4">
                          <div className="text-sm">
                            Tên mới: <span className="font-bold text-primary-600">{req.newName}</span>
                          </div>
                        </td>
                        <td className="p-4 sm:px-6 py-4 text-sm text-slate-500">
                          {formatDate(req.date)}
                        </td>
                        <td className="p-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                if (window.confirm(`Chấp thuận đổi tên thành "${req.newName}"?`)) approveProfileUpdate(req.id);
                              }}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Chấp thuận"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Từ chối yêu cầu đổi tên?`)) rejectProfileUpdate(req.id);
                              }}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users List Section */}
      <div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500 mt-1">Danh sách khách hàng đang hoạt động trên hệ thống</p>
        </div>

        <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên hoặc số tài khoản..." 
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
                  <th className="p-4 sm:px-6 whitespace-nowrap">Khách hàng</th>
                  <th className="p-4 sm:px-6 whitespace-nowrap">Số tài khoản</th>
                  <th className="p-4 sm:px-6 whitespace-nowrap">Số dư</th>
                  <th className="p-4 sm:px-6 whitespace-nowrap">Trạng thái thẻ</th>
                  <th className="p-4 sm:px-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:px-6 py-4">
                        <span className="font-mono text-sm font-medium text-slate-700">{user.accountNumber}</span>
                      </td>
                      <td className="p-4 sm:px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(user.balance || 0)}</span>
                      </td>
                      <td className="p-4 sm:px-6 py-4">
                        {user.cardStatus === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <Unlock className="h-3 w-3" /> Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                            <Lock className="h-3 w-3" /> Đã khóa
                          </span>
                        )}
                      </td>
                      <td className="p-4 sm:px-6 py-4 text-right">
                        {user.cardStatus === 'locked' ? (
                          <button 
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc muốn mở khóa tài khoản của ${user.name}?`)) {
                                unlockUser(user.id);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                          >
                            <KeyRound className="h-4 w-4" /> Mở khóa
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc muốn khóa tài khoản của ${user.name}?`)) {
                                lockUser(user.id);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                          >
                            <Lock className="h-4 w-4" /> Khóa thẻ
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
