import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BankProvider, useBank } from "./context/BankContext";

// Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/Layout";

import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerTransactions from "./pages/customer/Transactions";
import CustomerTransfer from "./pages/customer/Transfer";
import CustomerBillPayment from "./pages/customer/BillPayment";
import CustomerSettings from "./pages/customer/AccountSettings";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminManageUsers from "./pages/admin/ManageUsers";
import AdminManageTransactions from "./pages/admin/ManageTransactions";
import AdminRiskManagement from "./pages/admin/RiskManagement"; // Sẽ tạo

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useBank();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useBank();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? `/${user.role}` : "/login"} />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to={`/${user.role}`} /> : <Login />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Customer Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="customer">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="transactions" element={<CustomerTransactions />} />
        <Route path="transfer" element={<CustomerTransfer />} />
        <Route path="bills" element={<CustomerBillPayment />} />
        <Route path="settings" element={<CustomerSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminManageUsers />} />
        <Route path="transactions" element={<AdminManageTransactions />} />
        <Route path="risk" element={<AdminRiskManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BankProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </BankProvider>
  );
}

export default App;
