import React, { createContext, useState, useContext, useEffect } from 'react';
import { USERS as INITIAL_USERS, TRANSACTIONS as INITIAL_TRANSACTIONS } from '../data/mockData';

const BankContext = createContext();

export const BankProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [users, setUsers] = useState([]); 
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profileUpdateRequests, setProfileUpdateRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data from LocalStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('ib_users');
    const storedTransactions = localStorage.getItem('ib_transactions');
    const storedUser = localStorage.getItem('ib_current_user');
    const storedNotifs = localStorage.getItem('ib_notifications');
    const storedRequests = localStorage.getItem('ib_profile_requests');

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('ib_users', JSON.stringify(INITIAL_USERS));
    }

    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    else {
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('ib_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }

    if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    if (storedRequests) setProfileUpdateRequests(JSON.parse(storedRequests));
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  // Sync state to LocalStorage
  useEffect(() => { if (users.length > 0) localStorage.setItem('ib_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { if (transactions.length > 0) localStorage.setItem('ib_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('ib_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('ib_profile_requests', JSON.stringify(profileUpdateRequests)); }, [profileUpdateRequests]);

  // --- Auth Methods ---
  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.username === username);
        
        if (!foundUser) return reject(new Error('Tên đăng nhập hoặc mật khẩu không chính xác'));
        if (foundUser.cardStatus === 'locked') return reject(new Error('LOCKED'));

        if (foundUser.password !== password) {
          const newFailedAttempts = (foundUser.failedAttempts || 0) + 1;
          const updatedUsers = users.map(u => {
            if (u.id === foundUser.id) {
              return { 
                ...u, 
                failedAttempts: newFailedAttempts,
                cardStatus: newFailedAttempts >= 5 ? 'locked' : u.cardStatus
              };
            }
            return u;
          });
          setUsers(updatedUsers);
          
          if (newFailedAttempts >= 5) {
            addNotification(foundUser.id, 'Tài khoản bị khóa', 'Tài khoản của bạn đã bị khóa do nhập sai mật khẩu 5 lần.', 'error');
            reject(new Error('LOCKED'));
          } else {
            reject(new Error(`Tên đăng nhập hoặc mật khẩu không chính xác. Bạn còn ${5 - newFailedAttempts} lần thử.`));
          }
          return;
        }

        // Success
        const updatedUsers = users.map(u => u.id === foundUser.id ? { ...u, failedAttempts: 0 } : u);
        setUsers(updatedUsers);

        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('ib_current_user', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ib_current_user');
  };

  // --- Notification Methods ---
  const addNotification = (userId, title, message, type = 'info') => {
    const newNotif = {
      id: 'NOTIF' + Date.now() + Math.floor(Math.random() * 1000),
      userId,
      title,
      message,
      type,
      date: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = (userId) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
  };

  // --- Customer Profile Methods ---
  const changePassword = (userId, oldPass, newPass) => {
    return new Promise((resolve, reject) => {
      const targetUser = users.find(u => u.id === userId);
      if (targetUser.password !== oldPass) {
        return reject(new Error('Mật khẩu cũ không chính xác'));
      }
      const updatedUsers = users.map(u => u.id === userId ? { ...u, password: newPass } : u);
      setUsers(updatedUsers);
      addNotification(userId, 'Đổi mật khẩu thành công', 'Bạn vừa đổi mật khẩu đăng nhập thành công.', 'success');
      resolve(true);
    });
  };

  const requestProfileUpdate = (userId, newName) => {
    const targetUser = users.find(u => u.id === userId);
    const newRequest = {
      id: 'REQ' + Date.now(),
      userId,
      oldName: targetUser.name,
      newName,
      status: 'pending',
      date: new Date().toISOString()
    };
    setProfileUpdateRequests(prev => [newRequest, ...prev]);
    addNotification(userId, 'Gửi yêu cầu thành công', 'Yêu cầu đổi thông tin cá nhân đang chờ Admin phê duyệt.', 'info');
  };

  // --- Admin Profile Review Methods ---
  const approveProfileUpdate = (requestId) => {
    const req = profileUpdateRequests.find(r => r.id === requestId);
    if (!req) return;
    
    // Update user
    setUsers(prev => prev.map(u => u.id === req.userId ? { ...u, name: req.newName } : u));
    
    // Update request status
    setProfileUpdateRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
    
    // Notify user
    addNotification(req.userId, 'Yêu cầu được duyệt', `Yêu cầu đổi tên thành "${req.newName}" đã được chấp thuận.`, 'success');
    
    // Update current session if the admin is updating themselves (rare) or user refreshes.
  };

  const rejectProfileUpdate = (requestId) => {
    const req = profileUpdateRequests.find(r => r.id === requestId);
    if (!req) return;
    setProfileUpdateRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
    addNotification(req.userId, 'Yêu cầu bị từ chối', `Yêu cầu đổi tên thành "${req.newName}" đã bị từ chối.`, 'error');
  };

  // --- Transaction Methods ---
  const makeTransaction = (senderId, recipientAcc, amount, note, bankType) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const amountNum = Number(amount);
        const sender = users.find(u => u.id === senderId);
        
        if (!sender || sender.balance < amountNum) {
          return reject(new Error('Số dư không đủ để thực hiện giao dịch'));
        }

        let updatedUsers = [...users];
        let newTransactions = [...transactions];
        const txId = 'TXN' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

        if (bankType === 'bill') {
          // Bill payment
          updatedUsers = updatedUsers.map(u => u.id === senderId ? { ...u, balance: u.balance - amountNum } : u);
          newTransactions.unshift({
            id: txId,
            userId: senderId,
            type: 'send',
            amount: amountNum,
            date: new Date().toISOString(),
            note: note || 'Thanh toán hóa đơn',
            counterparty: recipientAcc, // For bill, this stores bill info
            status: 'success'
          });
          addNotification(senderId, 'Thanh toán hóa đơn', `Thanh toán thành công ${amountNum.toLocaleString()}đ cho ${recipientAcc}`, 'success');

        } else if (bankType === 'vibe') {
          // Internal transfer
          const recipient = users.find(u => u.accountNumber === recipientAcc);
          if (!recipient) return reject(new Error('Không tìm thấy tài khoản người nhận trong hệ thống'));

          updatedUsers = updatedUsers.map(u => {
            if (u.id === senderId) return { ...u, balance: u.balance - amountNum };
            if (u.id === recipient.id) return { ...u, balance: u.balance + amountNum };
            return u;
          });

          newTransactions.unshift({
            id: txId,
            userId: senderId,
            type: 'send',
            amount: amountNum,
            date: new Date().toISOString(),
            note: note || 'Chuyển tiền nội bộ',
            counterparty: recipient.name,
            status: 'success'
          });

          newTransactions.unshift({
            id: txId + '_R',
            userId: recipient.id,
            type: 'receive',
            amount: amountNum,
            date: new Date().toISOString(),
            note: note || 'Nhận tiền nội bộ',
            counterparty: sender.name,
            status: 'success'
          });

          addNotification(senderId, 'Chuyển tiền thành công', `Đã chuyển ${amountNum.toLocaleString()}đ cho ${recipient.name}`, 'success');
          addNotification(recipient.id, 'Nhận tiền', `Đã nhận ${amountNum.toLocaleString()}đ từ ${sender.name}`, 'success');

        } else {
          // External transfer
          updatedUsers = updatedUsers.map(u => u.id === senderId ? { ...u, balance: u.balance - amountNum } : u);
          newTransactions.unshift({
            id: txId,
            userId: senderId,
            type: 'send',
            amount: amountNum,
            date: new Date().toISOString(),
            note: note || 'Chuyển liên ngân hàng',
            counterparty: `TK ${recipientAcc} - ${bankType.toUpperCase()}`,
            status: 'success'
          });
          addNotification(senderId, 'Chuyển tiền liên ngân hàng', `Đã chuyển ${amountNum.toLocaleString()}đ ra ngoài hệ thống`, 'success');
        }

        setUsers(updatedUsers);
        setTransactions(newTransactions);
        
        // Update current user session
        const updatedCurrentUser = updatedUsers.find(u => u.id === senderId);
        setUser(updatedCurrentUser);
        localStorage.setItem('ib_current_user', JSON.stringify(updatedCurrentUser));

        resolve({ success: true, txId });
      }, 1500);
    });
  };

  // --- Admin Methods ---
  const unlockUser = (userId) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, cardStatus: 'active', failedAttempts: 0 } : u);
    setUsers(updatedUsers);
    addNotification(userId, 'Mở khóa tài khoản', 'Tài khoản của bạn đã được Quản trị viên mở khóa.', 'success');
  };

  const lockUser = (userId) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, cardStatus: 'locked' } : u);
    setUsers(updatedUsers);
    addNotification(userId, 'Tài khoản bị khóa', 'Tài khoản của bạn đã bị Quản trị viên khóa.', 'error');
  };

  const markTransactionInvalid = (txId) => {
    const targetTx = transactions.find(t => t.id === txId);
    if (!targetTx) return;

    const updatedTx = transactions.map(t => t.id === txId ? { ...t, status: 'invalid' } : t);
    setTransactions(updatedTx);
    addNotification(targetTx.userId, 'Giao dịch bị hủy', `Giao dịch ${txId} của bạn đã bị đánh dấu là lỗi.`, 'error');
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center text-primary-600">Đang tải hệ thống...</div>;
  }

  return (
    <BankContext.Provider value={{ 
      user, 
      users, 
      transactions, 
      notifications,
      profileUpdateRequests,
      login, 
      logout, 
      makeTransaction,
      unlockUser,
      lockUser,
      markTransactionInvalid,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      changePassword,
      requestProfileUpdate,
      approveProfileUpdate,
      rejectProfileUpdate
    }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => useContext(BankContext);
