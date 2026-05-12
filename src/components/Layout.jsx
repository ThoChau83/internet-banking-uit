import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useBank } from "../context/BankContext";
import {
  LayoutDashboard,
  ArrowRightLeft,
  History,
  LogOut,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ShieldCheck,
  AlertOctagon,
  Receipt,
  UserCog,
  CheckCircle2,
} from "lucide-react";

export default function Layout() {
  const {
    user,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useBank();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logoutModalRef = useRef(false);

  const userNotifs = notifications.filter((n) => n.userId === user?.id);
  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logoutModalRef.current = false;
    handleLogout();
  };

  // Auto logout after 5 minutes of inactivity
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (logoutModalRef.current) return;

      clearTimeout(timeoutId);
      // 5 minutes = 300,000 milliseconds
      timeoutId = setTimeout(() => {
        setShowLogoutModal(true);
        logoutModalRef.current = true;
      }, 300000);
    };

    // Initialize timer
    resetTimer();

    // Events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [logout, navigate]);

  const customerLinks = [
    { name: "Tổng quan", path: "/customer", icon: LayoutDashboard },
    { name: "Chuyển tiền", path: "/customer/transfer", icon: ArrowRightLeft },
    { name: "Thanh toán hóa đơn", path: "/customer/bills", icon: Receipt },
    {
      name: "Lịch sử giao dịch",
      path: "/customer/transactions",
      icon: History,
    },
  ];

  const adminLinks = [
    { name: "Thống kê dòng tiền", path: "/admin", icon: LayoutDashboard },
    { name: "Lịch sử giao dịch", path: "/admin/transactions", icon: History },
    { name: "Quản lý người dùng", path: "/admin/users", icon: Users },
    { name: "Xét duyệt rủi ro", path: "/admin/risk", icon: AlertOctagon },
  ];

  const links = user?.role === "admin" ? adminLinks : customerLinks;

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <Link
            to={`/${user?.role}`}
            className="flex items-center gap-2 text-primary-600"
          >
            <ShieldCheck className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">
              Internet Banking
            </span>
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="px-4 py-6">
            <div className="mb-6 px-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Menu Chính
              </p>
            </div>
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive
                          ? "text-primary-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-0 overflow-hidden">
        {/* Top Header */}
        <div className="relative z-40 flex-shrink-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 text-slate-500 hover:text-slate-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead(user.id)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {userNotifs.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {userNotifs.map((n) => (
                          <div
                            key={n.id}
                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? "bg-primary-50/30" : ""}`}
                            onClick={() => markNotificationRead(n.id)}
                          >
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                {n.type === "success" && (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                )}
                                {n.type === "error" && (
                                  <AlertOctagon className="h-5 w-5 text-red-500" />
                                )}
                                {n.type === "info" && (
                                  <Bell className="h-5 w-5 text-primary-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm ${!n.isRead ? "font-semibold text-slate-900" : "text-slate-700"}`}
                                >
                                  {n.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-2">
                                  {new Date(n.date).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        Bạn không có thông báo nào.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative pl-4 border-l border-slate-200">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 text-left hover:bg-slate-50 p-2 rounded-xl transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user?.role}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold border border-primary-200">
                  {user?.name?.charAt(0)}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-2">
                    {user?.role === "customer" && (
                      <Link
                        to="/customer/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                      >
                        <UserCog className="h-4 w-4" /> Quản lý tài khoản
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium mt-1"
                    >
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Inactivity Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 opacity-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertOctagon className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Phiên đăng nhập hết hạn
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Bạn đã không có bất kỳ thao tác nào trong 5 phút. Để đảm bảo an
                toàn, hệ thống đã tạm ngưng phiên làm việc của bạn.
              </p>
              <button
                onClick={handleConfirmLogout}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 active:scale-[0.98]"
              >
                Xác nhận đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
