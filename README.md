# 🏦 Giao diện Internet Banking UIT

Ứng dụng **Internet Banking** được xây dựng bằng React, phục vụ môn học **IE108 - Phân Tích Thiết Kế Phần Mềm** tại Trường Đại học Công nghệ Thông tin (UIT).

> 🌐 **Live Demo:** [internet-banking-uit.vercel.app](https://internet-banking-uit.vercel.app)

---

## ✨ Tính năng

### 👤 Khách hàng (Customer)
- 📊 **Dashboard** — Xem tổng quan tài khoản, số dư, giao dịch gần đây
- 💸 **Chuyển tiền** — Chuyển khoản nội bộ và liên ngân hàng
- 📋 **Lịch sử giao dịch** — Tra cứu và lọc lịch sử giao dịch
- 🧾 **Thanh toán hóa đơn** — Thanh toán điện, nước, internet...
- ⚙️ **Cài đặt tài khoản** — Cập nhật thông tin cá nhân, đổi mật khẩu

### 🔐 Quản trị viên (Admin)
- 📊 **Dashboard** — Tổng quan hệ thống
- 👥 **Quản lý người dùng** — Thêm, sửa, khóa tài khoản khách hàng
- 💳 **Quản lý giao dịch** — Giám sát và xử lý giao dịch
- ⚠️ **Quản lý rủi ro** — Phát hiện và xử lý giao dịch bất thường

### 🔒 Bảo mật
- Đăng nhập phân quyền (Customer / Admin)
- Route bảo vệ (Protected Routes)
- Quên mật khẩu

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mô tả |
|---|---|
| [React 19](https://react.dev/) | Thư viện UI |
| [Vite](https://vite.dev/) | Build tool |
| [React Router v7](https://reactrouter.com/) | Điều hướng SPA |
| [Tailwind CSS v3](https://tailwindcss.com/) | CSS framework |
| [Lucide React](https://lucide.dev/) | Bộ icon |
| [Vercel](https://vercel.com/) | Hosting / Deploy |

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- [Node.js](https://nodejs.org/) >= 18
- npm hoặc yarn

### Các bước

```bash
# 1. Clone repo
git clone https://github.com/ThoChau83/internet-banking-uit.git

# 2. Di chuyển vào thư mục
cd internet-banking-uit

# 3. Cài đặt dependencies
npm install

# 4. Chạy ứng dụng
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

---

## 📁 Cấu trúc thư mục

```
src/
├── assets/            # Hình ảnh, tài nguyên tĩnh
├── components/        # Component dùng chung
│   └── Layout.jsx     # Layout chính (Sidebar + Header)
├── context/           # React Context (quản lý state)
├── data/              # Dữ liệu mẫu
├── pages/
│   ├── Login.jsx           # Trang đăng nhập
│   ├── ForgotPassword.jsx  # Trang quên mật khẩu
│   ├── customer/           # Các trang khách hàng
│   │   ├── Dashboard.jsx
│   │   ├── Transfer.jsx
│   │   ├── Transactions.jsx
│   │   ├── BillPayment.jsx
│   │   └── AccountSettings.jsx
│   └── admin/              # Các trang quản trị
│       ├── Dashboard.jsx
│       ├── ManageUsers.jsx
│       ├── ManageTransactions.jsx
│       └── RiskManagement.jsx
├── utils/             # Hàm tiện ích
├── App.jsx            # Routing chính
├── main.jsx           # Entry point
└── index.css          # Global styles
```

---

## 📝 Thông tin môn học

| | |
|---|---|
| **Môn học** | IE108 - Phân Tích Thiết Kế Phần Mềm |
| **Trường** | Đại học Công nghệ Thông tin — ĐHQG TP.HCM (UIT) |
| **Học kỳ** | HK2 - Năm học 2025–2026 |

---

## 📄 License

Dự án được thực hiện cho mục đích học tập.
