import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Loader2, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-200/50 blur-3xl"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại đăng nhập
        </Link>
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Khôi phục mật khẩu</h2>
            <p className="mt-2 text-sm text-slate-500">
              Nhập email hoặc tên đăng nhập của bạn. Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
            </p>
          </div>

          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email hoặc Tên đăng nhập</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                    placeholder="vidu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Gửi yêu cầu'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-6">
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm">
                Đã gửi thành công! Vui lòng kiểm tra email của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
              </div>
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                Quay về trang đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
