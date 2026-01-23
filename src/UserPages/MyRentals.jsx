import { useState, useEffect } from "react";
import { requestBookReturn } from "../APIs/RentalNotificationService";
import Nav from "./Nav";

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [requestingReturn, setRequestingReturn] = useState(new Set());

  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email || "");
    
    if (email) {
      fetchUserRentals(email);
    }
  }, []);

  const fetchUserRentals = async (email) => {
    try {
      const response = await fetch(
        `https://book-app-339c8-default-rtdb.firebaseio.com/rentBook.json`
      );
      const data = await response.json();

      if (data) {
        const userRentals = Object.entries(data)
          .filter(([_, rental]) => rental.userEmail === email)
          .map(([id, rental]) => ({ id, ...rental }))
          .sort((a, b) => new Date(b.rentalDate || b.startDate || b.createdAt || 0) - new Date(a.rentalDate || a.startDate || a.createdAt || 0)); // Newest rented first
        
        setRentals(userRentals);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      setLoading(false);
    }
  };

  const handleRequestReturn = async (rentalId) => {
    if (requestingReturn.has(rentalId)) return;
    
    if (window.confirm("Do you want to request return for this book?")) {
      setRequestingReturn(prev => new Set([...prev, rentalId]));
      const result = await requestBookReturn(rentalId, userEmail);
      if (result.success) {
        alert(result.message);
        fetchUserRentals(userEmail);
      } else {
        alert(result.message);
      }
      setRequestingReturn(prev => {
        const newSet = new Set(prev);
        newSet.delete(rentalId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (rental) => {
    // Use the rental status from database (set by notification service)
    // Status flow: not_returned → return_window_open → expired_no_refund
    
    if (rental.returnStatus === "returned") {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">✅ Returned</span>;
    }
    if (rental.returnStatus === "return_requested" || rental.returnStatus === "return_pending") {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">⏳ Return Pending</span>;
    }
    if (rental.returnStatus === "return_rejected") {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">❌ Return Rejected</span>;
    }
    if (rental.returnStatus === "expired_no_refund") {
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">⏰ Expired</span>;
    }
    
    // Don't show special badge for return_window_open - show as Active
    // If status is "not_returned" or "return_window_open", show as active
    const endDate = new Date(rental.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0) {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">📚 Active</span>;
    }
    
    // If rental ended, show active (return button will show appropriate message)
    return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">📚 Active</span>;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-500 via-pink-700 via-indigo-700 to-pink-400 relative">
      {/* Background Image with Opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
        style={{ backgroundImage: "url('/RentalImg.png')" }}
      ></div>
      
      <div className="relative z-10">
        <Nav />
      </div>
      
      <div className="px-12 py-15 relative z-10">
        {/* <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">My Rentals</h1> */}

        {rentals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-6  sm:p-8 md:p-16 text-center ">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Rentals Yet</h2>
            <p className="text-gray-500">You haven't rented any books yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-15">
            {rentals.map((rental) => (
              <div key={rental.id} className="bg-white rounded-xl shadow-lg overflow-hidden ">
                {/* Book Image */}
                <div className="h-56 sm:h-60 md:h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  {rental.bookImage ? (
                    <img src={rental.bookImage} alt={rental.bookName} className="h-full w-full object-cover" />
                  ) : (
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">{rental.bookName}</h3>
                    {getStatusBadge(rental)}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <p>📅 <span className="font-semibold">Start:</span> {rental.startDate}</p>
                      <p>📅 <span className="font-semibold">End:</span> {rental.endDate}</p>
                    </div>
                    <p>📦 <span className="font-semibold">Quantity:</span> {rental.quantity}</p>
                  </div>

                  {/* Financial Details */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 text-[10px] sm:text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Rental Fee:</span>
                      <span className="font-semibold">₹{rental.rentalFee}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-semibold text-green-600">₹{rental.securityDeposit}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-blue-600">₹{rental.totalAmount}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {(() => {
                    // Show return button only if rental is not yet returned
                    if (rental.returnStatus === "not_returned" || rental.returnStatus === "return_window_open") {
                      const endDate = new Date(rental.endDate);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      endDate.setHours(0, 0, 0, 0);
                      const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                      const daysAfterEnd = Math.abs(diffDays);
                      const withinReturnWindow = diffDays < 0 && daysAfterEnd <= 5;

                      return (
                        <div className="space-y-2">
                          <button 
                            onClick={() => handleRequestReturn(rental.id)}
                            disabled={requestingReturn.has(rental.id)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg text-sm sm:text-base font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {requestingReturn.has(rental.id) ? "⏳ Requesting..." : "📤 Request Return"}
                          </button>
                          {diffDays >= 0 && (
                            <p className="text-xs text-center text-blue-600">
                              📚 {diffDays} days left in rental period
                            </p>
                          )}
                          {withinReturnWindow && (
                            <p className="text-xs text-center text-orange-600 font-semibold">
                              ⚠️ {5 - daysAfterEnd} days left to return for refund
                            </p>
                          )}
                          {diffDays < 0 && !withinReturnWindow && (
                            <p className="text-xs text-center text-red-600">
                              🔴 Return window expired
                            </p>
                          )}
                        </div>
                      );
                    }
                    if (rental.returnStatus === "return_requested" || rental.returnStatus === "return_pending") {
                      return (
                        <div className="text-center text-yellow-600 text-xs sm:text-sm font-semibold py-2">
                          ⏳ Return request pending approval
                        </div>
                      );
                    }
                    if (rental.returnStatus === "returned") {
                      return (
                        <div className="text-center text-green-600 text-xs sm:text-sm font-semibold py-2">
                          ✅ Book returned, deposit refunded
                        </div>
                      );
                    }
                    if (rental.returnStatus === "expired_no_refund") {
                      return (
                        <div className="text-center py-2">
                          <p className="text-gray-600 text-xs sm:text-sm font-semibold">
                            ⏰ Rental expired
                          </p>
                          <p className="text-gray-500 text-[10px] sm:text-xs mt-1">
                            No refund available
                          </p>
                        </div>
                      );
                    }
                    if (rental.returnStatus === "return_rejected") {
                      return (
                        <div className="text-center text-red-600 text-xs sm:text-sm font-semibold py-2">
                          ❌ Return request rejected
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentals;
