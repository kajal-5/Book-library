import { FaSearch, FaBell, FaBars } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../Store/authSlice";
import { useState, useEffect } from "react";

const Nav = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminNotificationCount = useSelector((state) => state.auth.adminNotificationCount);
  const storeToken = useSelector((state) => state.auth.token);
  const userEmail = useSelector((state) => state.auth.email);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get first letter of user email for profile circle
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "A";

  // Handle real-time search on key press
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Navigate with search query in real-time
    if (value.trim()) {
      navigate(`/admin?search=${encodeURIComponent(value.trim())}`);
    } else {
      // Clear search when input is empty
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };
  
  // Monitor localStorage for token changes (detect tampering)
  useEffect(() => {
    const checkTokenIntegrity = () => {
      const localStorageToken = localStorage.getItem("token");
      
      // If token in localStorage doesn't match Redux store, someone tampered with it
      if (storeToken && localStorageToken !== storeToken) {
        console.warn("Token mismatch detected! Logging out...");
        handleLogout();
      }
      
      // If token was removed from localStorage
      if (storeToken && !localStorageToken) {
        console.warn("Token removed from localStorage! Logging out...");
        handleLogout();
      }
    };

    // Check immediately
    checkTokenIntegrity();

    // Listen for storage events (detects changes in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === null) {
        checkTokenIntegrity();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Check periodically (every 2 seconds)
    const interval = setInterval(checkTokenIntegrity, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [storeToken]);
  
  return (
    <nav className="w-full bg-gradient-to-r from-rose-500  via-purple-600 via-pink-500 to-red-500  px-2 sm:px-3 md:px-6 py-3 sm:py-4 shadow-lg">
      {/* MAIN ROW */}
      <div className="flex items-center justify-between gap-0.5 sm:gap-1 md:gap-4">
        {/* LOGO – flexible */}
        <button 
          onClick={() => navigate("/admin")}
          className="flex items-center justify-start gap-1 sm:gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <div className="bg-white rounded-full p-0.5 sm:p-1 md:p-0 shadow-lg overflow-hidden">
            <img 
              src="/logo1.png" 
              alt="BookNest Logo" 
              className="w-10 h-10 md:w-12 md:h-12"
            />
          </div>
          <span className="text-white font-bold text-sm sm:text-base md:text-2xl lg:text-3xl whitespace-nowrap tracking-wide">
            BookNest
          </span>
        </button>

        {/* SEARCH – flexible */}
        <div className="flex-1 sm:flex-none md:w-[35%] lg:w-[40%] flex items-center min-w-0 mx-2 sm:mx-4 md:mx-8">
          <div className="w-full">
            <div
              className="
                flex items-center
                bg-white
                rounded-md
                px-1 sm:px-1.5 md:px-3
                h-7 sm:h-8 md:h-10
                w-full
              "
            >
              <FaSearch className="text-blue-700 text-[10px] md:text-[16px] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="
                  w-full
                  h-full
                  outline-none
                  px-0.5 sm:px-1 md:px-2
                  text-[10px] sm:text-[11px]
                  md:text-[16px]
                "
              />
            </div>
          </div>
        </div>

        {/* ACTIONS – positioned to right with pr-4 */}
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-x-4 text-white flex-shrink-0 pr-0 sm:pr-2 md:pr-4">
          <button
            onClick={() => navigate("/admin/add-book")}
            className="text-[10px]  md:text-lg lg:text-xl hover:underline whitespace-nowrap"
          >
            AddBooks
          </button>

          <button
            onClick={() => navigate("/admin/requests")}
            className="text-[10px]  md:text-lg lg:text-xl hover:underline whitespace-nowrap"
          >
            Requests
          </button>

          <button
            onClick={() => navigate("/admin/transactions")}
            className="text-[10px] md:text-lg lg:text-xl hover:underline whitespace-nowrap"
          >
            Transactions
          </button>

          <button
            onClick={handleLogout}
            className="text-[10px]  md:text-lg lg:text-xl hover:underline whitespace-nowrap"
          >
            Logout
          </button>

          {/* NOTIFICATION BELL */}
          <button 
            onClick={() => navigate("/admin/notifications")}
            className="relative flex items-center justify-center flex-shrink-0 p-0.5 sm:p-1"
          >
            <FaBell className="text-blue-100 w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            {adminNotificationCount > 0 && (
              <span
                className="
                  absolute -top-0.5 -right-0.5
                  bg-red-600
                  text-white
                  text-[6px] sm:text-[8px]
                  md:text-[10px]
                  font-bold
                  rounded-full
                  px-1
                  min-w-[12px] sm:min-w-[16px]
                  md:min-w-[18px]
                  text-center
                "
              >
                {adminNotificationCount}
              </span>
            )}
          </button>

          {/* USER PROFILE CIRCLE */}
          <div className="relative flex items-center justify-center flex-shrink-0 ml-1 sm:ml-2 group">
            <button className="bg-white rounded-full p-0.5 shadow-lg flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9">
              <div className="bg-gradient-to-br from-rose-500 to-purple-600 rounded-full w-full h-full flex items-center justify-center">
                <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm">
                  {userInitial}
                </span>
              </div>
            </button>
            
            {/* Hover Tooltip */}
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl p-3 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-br from-rose-500 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{userInitial}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {userEmail?.split('@')[0]}
                  </p>
                  <p className="text-xs text-purple-600 font-semibold">Admin</p>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-gray-600 break-all">
                  📧 {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* CART */}
          {/* <div className="relative flex items-center justify-center">
            <BsCartCheckFill className="text-blue-700 text-[12px] w-[20px] md:text-[22px] w-[30px] h-[30px]" />
            <span
              className="
                absolute -top-1 -right-1
                bg-white
                text-blue-900
                text-[8px]
                md:text-[12px]
                font-bold
                rounded-full
                px-1
              "
            >
              0
            </span>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
