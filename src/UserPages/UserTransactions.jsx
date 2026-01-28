import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserTransactions } from "../APIs/TransactionAPI";
import Nav from "./Nav";

const UserTransactions = () => {
  const userEmail = useSelector((state) => state.auth.email);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, purchase, rent, security

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userEmail) {
        const data = await getUserTransactions(userEmail);
        setTransactions(data);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [userEmail]);

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
    if (filter === "all") return true;
    if (filter === "purchase") return transaction.type === "purchase" || transaction.type === "cart_purchase";
    if (filter === "rent") return transaction.type === "rent" || transaction.type === "cart_rent";
    if (filter === "security") return transaction.type === "security_deposit" || transaction.type === "security_refund";
    return true;
  });

  const totalSpent = transactions
    .filter((t) => t.type !== "security_refund" && t.type !== "book_drop")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalRefunded = transactions
    .filter((t) => t.type === "security_refund")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  
  const totalEarned = transactions
    .filter((t) => t.type === "book_drop")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-300 to-pink-400">
        <Nav />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-300 to-pink-400">
      <Nav />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-25 py-4 sm:py-6 md:py-8">

        {/* Filter Buttons */}
        <div className="bg-gradient-to-br from-pink-100 via-pink-100 to-purple-100 rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
        {/* <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6"> */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-blue-800 to-indigo-600 text-white shadow-md"
                  : "bg-gradient-to-r from-blue-300 to-indigo-600 text-white  hover:from-rose-400 hover:to-purple-600"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setFilter("purchase")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                filter === "purchase"
                  ? "bg-gradient-to-br from-blue-800 to-indigo-600 text-white shadow-md"
                  : "bg-gradient-to-r from-sky-300 to-indigo-600 text-white  hover:from-pink-400 hover:to-purple-600"
              }`}
            >
              Purchases
            </button>
            <button
              onClick={() => setFilter("rent")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                filter === "rent"
                  ? "bg-gradient-to-r from-blue-800 to-indigo-600 text-white shadow-md"
                  : "bg-gradient-to-r from-sky-300 to-indigo-600 text-white  hover:from-rose-400 hover:to-purple-600"
              }`}
            >
              Rentals
            </button>
            <button
              onClick={() => setFilter("security")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                filter === "security"
                  ? "bg-gradient-to-r from-yellow-500 to-green-600 text-white shadow-md"
                  : "bg-gradient-to-r from-blue-300 to-indigo-600 text-white  hover:from-rose-400 hover:to-purple-600"
              }`}
            >
              Security Deposits
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-lg bg-gradient-to-br from-purple-200 via-pink-200 to-purple-200 p-5">
          {filteredTransactions.length === 0 ? (
            <div className="p-10 text-center">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No Transactions Yet</h2>
              <p className="text-gray-500">Start purchasing or renting books to see your transaction history.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-300">
              {filteredTransactions.map((transaction, index) => (
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
                    <div className="text-right ml-10 md:px-10">
                      <p className={`text-lg font-bold ${
                        transaction.type === "security_refund" || transaction.type === "book_drop"
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {transaction.type === "security_refund" || transaction.type === "book_drop" ? "+" : "-"}₹{parseFloat(transaction.amount).toFixed(2)}
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
  );
};

export default UserTransactions;
