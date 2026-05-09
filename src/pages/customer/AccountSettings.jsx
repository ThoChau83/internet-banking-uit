import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { UserCog, KeyRound, Loader2, CheckCircle } from 'lucide-react';

export default function AccountSettings() {
  const { user, requestProfileUpdate, changePassword } = useBank();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' }); // type: error or success

  // Profile Form
  const [newName, setNewName] = useState(user?.name || '');

  // Password Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (newName === user.name) return;

    requestProfileUpdate(user.id, newName);
    setMsg({ text: 'Đã gửi yêu cầu đổi tên thành công. Vui lòng đợi Admin phê duyệt.', type: 'success' });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      await changePassword(user.id, oldPassword, newPassword);
      setMsg({ text: 'Đổi mật khẩu thành công!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý tài khoản</h1>
        <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin và bảo mật</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setActiveTab('profile'); setMsg({ text:'', type:'' }); }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'profile' ? 'border-b-2 border-primary-600 text-primary-600 bg-primary-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserCog className="h-4 w-4" /> Thông tin cá nhân
          </button>
          <button
            onClick={() => { setActiveTab('security'); setMsg({ text:'', type:'' }); }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'security' ? 'border-b-2 border-primary-600 text-primary-600 bg-primary-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <KeyRound className="h-4 w-4" /> Đổi mật khẩu
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {msg.text && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm ${
              msg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              {msg.type === 'success' && <CheckCircle className="h-5 w-5" />}
              {msg.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="max-w-xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Số tài khoản (Không thể đổi)</label>
                <input
                  type="text"
                  disabled
                  value={user.accountNumber}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tên hiển thị</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                />
                <p className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                  ⚠️ Yêu cầu đổi tên sẽ cần được Admin phê duyệt mới có hiệu lực.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={newName === user.name}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-all"
                >
                  Gửi yêu cầu cập nhật
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="max-w-xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !oldPassword || !newPassword}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Đổi mật khẩu ngay'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
