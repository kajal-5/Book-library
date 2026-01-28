import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAdminNotificationCount } from "../Store/authSlice";
import { getAllTransactions } from "../APIs/TransactionAPI";
import Nav from "./Nav";
import SpaceBar from "./SpaceBar";

const AdminTransactions = () => {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getAllTransactions();
      setTransactions(data);
      setLoading(false);
    };
    fetchTransactions();

    // Refresh every 5 seconds
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update admin notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        // Fetch drop requests
        const dropResponse = await fetch(
          `https://book-app-339c8-default-rtdb.firebaseio.com/requests.json`
        );
        const dropData = await dropResponse.json();
        const pendingDropCount = dropData 
          ? Object.values(dropData).filter(req => req.status === "pending").length 
          : 0;

        // Fetch return requests
        const returnResponse = await fetch(
          `https://book-app-339c8-default-rtdb.firebaseio.com/adminNotifications.json`
        );
        const returnData = await returnResponse.json();
        const pendingReturnCount = returnData
          ? Object.values(returnData).filter(
              notif => notif.type === "return_request" && (!notif.status || notif.status === "pending")
            ).length
          : 0;

        const totalCount = pendingDropCount + pendingReturnCount;
        dispatch(setAdminNotificationCount(totalCount));
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case "purchase":
      case "cart_purchase":
        return "🛒";
      case "rent":
      case "cart_rent":
        return "📚";
      case "security_deposit":
        return "🔒";
      case "security_refund":
        return "💰";
      case "book_drop":
        return "💵";
      default:
        return "📄";
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "purchase":
      case "cart_purchase":
        return "from-blue-100 to-blue-50";
      case "rent":
      case "cart_rent":
        return "from-purple-100 to-purple-50";
      case "security_deposit":
        return "from-yellow-100 to-yellow-50";
      case "security_refund":
        return "from-green-100 to-green-50";
      case "book_drop":
        return "from-emerald-100 to-emerald-50";
      default:
        return "from-gray-100 to-gray-50";
    }
  };

  const getTransactionType = (type) => {
    switch (type) {
      case "purchase":
        return "Purchase";
      case "cart_purchase":
        return "Cart Purchase";
      case "rent":
        return "Rental Fee";
      case "cart_rent":
        return "Cart Rental Fee";
      case "security_deposit":
        return "Security Deposit";
      case "security_refund":
        return "Security Refund";
      case "book_drop":
        return "Book Drop Payment";
      default:
        return "Transaction";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "purchase" && (transaction.type === "purchase" || transaction.type === "cart_purchase")) ||
      (filter === "rent" && (transaction.type === "rent" || transaction.type === "cart_rent")) ||
      (filter === "security" && (transaction.type === "security_deposit" || transaction.type === "security_refund")) ||
      (filter === "book_drop" && transaction.type === "book_drop");

    const matchesSearch =
      searchQuery === "" ||
      transaction.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.bookName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const totalRevenue = transactions
    .filter((t) => t.type === "purchase" || t.type === "cart_purchase" || t.type === "rent" || t.type === "cart_rent")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalSecurityHeld = transactions
    .filter((t) => t.type === "security_deposit")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalRefunded = transactions
    .filter((t) => t.type === "security_refund")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const netSecurityHeld = totalSecurityHeld - totalRefunded;

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-rose-300 via-pink-300 to-red-400">
        <SpaceBar />
        <div className="flex-1 flex flex-col">
          <Nav />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <SpaceBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
      <div className="flex h-screen  bg-gradient-to-br from-rose-400  via-pink-500 via-purple-400 via-pink-400 to-red-400">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Nav onMenuClick={() => setSidebarOpen(true)} />
          
          <div className="flex-1 overflow-y-auto p-3 md:px-30 md:pt-10 pt-5">

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-10  mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 px-5">
              {/* Search */}
              <input
                type="text"
                placeholder="Search by user email or book name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-blue-500 rounded-lg focus:border-blue-500 focus:outline-none"
              />

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-4 pt-2 md:pt-0 justify-center md:justify-end">
                <button
                  onClick={() => setFilter("all")}
                  className={`md:px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "all"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("purchase")}
                  className={`md:px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "purchase"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Purchases
                </button>
                <button
                  onClick={() => setFilter("rent")}
                  className={`md:px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "rent"
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Rentals
                </button>
                <button
                  onClick={() => setFilter("security")}
                  className={`md:px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "security"
                      ? "bg-yellow-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setFilter("book_drop")}
                  className={`md:px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "book_drop"
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  💵 Drops
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className=" rounded-2xl shadow-lg bg-white p-5 ">
            {filteredTransactions.length === 0 ? (
              <div className="p-10 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">No Transactions Found</h2>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="divide-y  divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left: Icon + Details */}
                      <div className="flex items-center gap-10 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          transaction.type === "security_refund" 
                            ? "bg-red-100" 
                            : transaction.type === "security_deposit"
                            ? "bg-yellow-100"
                            : transaction.type.includes("rent")
                            ? "bg-purple-100"
                            : "bg-blue-100"
                        }`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {transaction.bookName || "Transaction"}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600">{getTransactionType(transaction.type)}</p>
                          <p className="text-xs md:text-md text-blue-700 font-medium mt-1">
                            👤 {transaction.userEmail}
                          </p>
                          <p className="text-xs md:text-md text-gray-700 mt-1">
                            {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Right: Amount */}
                      <div className="text-right ml-10 md:px-10 ">
                        <p className={`text-lg font-bold ${
                          transaction.type === "security_refund" 
                            ? "text-red-600" 
                            : "text-green-600"
                        }`}>
                          {transaction.type === "security_refund" ? "-" : "+"}₹{parseFloat(transaction.amount).toFixed(2)}
                        </p>
                        {transaction.quantity && (
                          <p className="text-xs md:text-md text-gray-700">Qty: {transaction.quantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AdminTransactions;
