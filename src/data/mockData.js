export const USERS = [
  { 
    id: 1, 
    username: 'admin', 
    password: '123', 
    role: 'admin', 
    name: 'Quản trị viên Hệ thống' 
  },
  { 
    id: 2, 
    username: 'khachhang', 
    password: '123', 
    role: 'customer', 
    name: 'Nguyễn Văn A', 
    accountNumber: '1012345678', 
    balance: 50000000,
    cardNumber: '4584 **** **** 1234',
    cardStatus: 'active'
  },
  { 
    id: 3, 
    username: 'khachhang2', 
    password: '123', 
    role: 'customer', 
    name: 'Trần Thị B', 
    accountNumber: '1098765432', 
    balance: 15000000,
    cardNumber: '4584 **** **** 5678',
    cardStatus: 'locked'
  }
];

export const TRANSACTIONS = [
  { id: 'TXN001', userId: 2, type: 'receive', amount: 15000000, date: '2026-05-01T10:00:00Z', note: 'Nhận lương tháng 4', counterparty: 'Công ty TNHH ABC' },
  { id: 'TXN002', userId: 2, type: 'send', amount: 500000, date: '2026-05-05T08:30:00Z', note: 'Thanh toán tiền điện', counterparty: 'EVN HCMC' },
  { id: 'TXN003', userId: 2, type: 'send', amount: 1200000, date: '2026-05-08T14:15:00Z', note: 'Chuyển tiền mua sắm', counterparty: 'ShopeePay' },
  { id: 'TXN004', userId: 3, type: 'receive', amount: 2000000, date: '2026-05-09T09:00:00Z', note: 'Hoàn tiền', counterparty: 'Lazada' },
];

export const SYSTEM_STATS = {
  totalUsers: 1250,
  activeToday: 420,
  totalTransactions: 5600,
  totalVolume: 15000000000,
};
