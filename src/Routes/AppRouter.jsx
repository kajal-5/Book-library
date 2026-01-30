import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* ================= AUTH PAGES ================= */
import LoginPage from "../Login/LoginPage";
import SignupPage from "../Login/SignupPage";
import ForgotPassword from "../Login/ForgotPassword";

/* ================= USER & ADMIN ================= */
import UserHome from "../UserPages/Home";
import DropBook from "../UserPages/DropBook";
import UserNotifications from "../UserPages/UserNotifications";
import Cart from "../UserPages/Cart";
import MyRentals from "../UserPages/MyRentals";
// import RentAgain from "../UserPages/RentAgain";
import UserTransactions from "../UserPages/UserTransactions";
import AdminHome from "../AdminPages/AdminHome";
import AddBook from "../AdminPages/AddBook/AddBook";
import AdminRequests from "../AdminPages/AdminRequests";
import AdminNotifications from "../AdminPages/AdminNotifications";
import AdminProfile from "../AdminPages/AdminProfile";
import AdminTransactions from "../AdminPages/AdminTransactions";

const AppRoutes = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* ================= ROOT ================= */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* ================= AUTH ROUTES ================= */}
      {!isAuthenticated && (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </>
      )}

      {/* ================= USER ROUTES ================= */}
      {isAuthenticated && role === "user" && (
        <>
          <Route path="/user" element={<UserHome />} />
          <Route path="/user/dropbook" element={<DropBook />} />
          <Route path="/user/notifications" element={<UserNotifications />} />
          <Route path="/user/cart" element={<Cart />} />
          <Route path="/user/rentals" element={<MyRentals />} />
          {/* <Route path="/rent-again" element={<RentAgain />} /> */}
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/user/transactions" element={<UserTransactions />} />
          {/* future user pages */}
        </>
      )}

      {/* ================= ADMIN ROUTES ================= */}
      {isAuthenticated && role === "admin" && (
        <>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/category/:categoryName" element={<AdminHome />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/add-book" element={<AddBook />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          {/* future admin pages */}
        </>
      )}

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
