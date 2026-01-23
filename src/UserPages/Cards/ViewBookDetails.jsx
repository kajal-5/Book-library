import { useState } from "react";

const ViewBookDetails = ({ book, isOpen, onClose, onPurchase, onRent, adminContact, isProcessing }) => {
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showRentDialog, setShowRentDialog] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().split('T')[0];

  // Calculate rental days
  const calculateRentalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate rent breakdown (40% rental fee + 60% security deposit)
  const calculateRentBreakdown = () => {
    const rentalDays = calculateRentalDays();
    const basePrice = book.price * quantity;
    
    // 30% if ≤180 days, 40% × number of years if >180 days
    const rentalFee = rentalDays <= 180 
      ? basePrice * 0.3 
      : basePrice * 0.4 * Math.ceil(rentalDays / 365);
    // Security deposit is constant 50% of book cost
    const securityDeposit = basePrice * 0.5;
    const totalAmount = rentalFee + securityDeposit;
    
    return {
      rentalDays,
      rentalFee: rentalFee.toFixed(2),
      securityDeposit: securityDeposit.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= book.quantity) {
      setQuantity(value);
    }
  };

  const handlePurchaseClick = () => {
    setShowPurchaseDialog(true);
  };

  const handleRentClick = () => {
    setShowRentDialog(true);
  };

  const handleAddToCart = (type) => {
    if (type === "purchase") {
      onPurchase({ book, quantity, action: "addToCart" });
    } else if (type === "rent") {
      if (!startDate || !endDate) {
        alert("Please select rental dates");
        return;
      }
      onRent({ book, quantity, startDate, endDate, action: "addToCart" });
    }
    handleClose();
  };

  const handleBuyNow = (type) => {
    if (type === "purchase") {
      onPurchase({ book, quantity, action: "buyNow" });
    } else if (type === "rent") {
      if (!startDate || !endDate) {
        alert("Please select rental dates");
        return;
      }
      onRent({ book, quantity, startDate, endDate, action: "buyNow" });
    }
    handleClose();
  };

  const handleClose = () => {
    setShowPurchaseDialog(false);
    setShowRentDialog(false);
    setQuantity(1);
    setStartDate("");
    setEndDate("");
    onClose();
  };

  if (!isOpen) return null;

  const totalPrice = (book.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4" onClick={handleClose}>
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 sm:border-4 border-white" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-3 sm:px-6 py-3 sm:py-4 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1">Book Details</h2>
              <p className="text-blue-100 text-xs sm:text-sm">View complete information</p>
            </div>
            <button 
              onClick={handleClose}
              className="hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-all"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-3 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            
            {/* Book Image */}
            <div className="md:w-1/3">
              {book.imageUrl ? (
                <img 
                  src={book.imageUrl} 
                  alt={book.name} 
                  className="w-full h-60 sm:h-80 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full h-60 sm:h-80 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                  <span className="text-sm sm:text-base text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="md:w-2/3 space-y-3 sm:space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{book.name}</h3>
              
              {/* Description */}
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
                <h4 className="text-base sm:text-lg font-semibold text-purple-600 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  {book.description || "No description available."}
                </p>
              </div>

              {/* Category & Availability */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-md">
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Category</p>
                  <p className="text-base sm:text-lg font-semibold text-blue-600">{book.type}</p>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-md">
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Available</p>
                  <p className="text-base sm:text-lg font-semibold text-green-600">{book.quantity} units</p>
                </div>
              </div>

              {/* Price & Quantity Selector */}
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Price per Unit</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">₹{book.price}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Quantity:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={book.quantity} 
                      value={quantity} 
                      onChange={handleQuantityChange}
                      className="w-16 sm:w-20 border-2 border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base text-center font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="border-t pt-2 sm:pt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-base sm:text-lg font-semibold text-gray-700">Total Price:</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">₹{totalPrice}</p>
                  </div>
                </div>
              </div>

              {/* Admin Contact */}
              {adminContact && (
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-2 sm:p-3 shadow-md">
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-medium">Contact: {adminContact}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handlePurchaseClick}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Purchase
                </button>
                <button 
                  onClick={handleRentClick}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Rent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Dialog */}
        {showPurchaseDialog && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPurchaseDialog(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Purchase</h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Item: <span className="font-semibold">{book.name}</span></p>
                <p className="text-sm text-gray-600 mb-2">Quantity: <span className="font-semibold">{quantity}</span></p>
                <p className="text-lg font-bold text-blue-600">Total: ₹{totalPrice}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleAddToCart("purchase")}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => handleBuyNow("purchase")}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Buy Now"}
                </button>
              </div>
              <button 
                onClick={() => setShowPurchaseDialog(false)}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Rent Dialog */}
        {showRentDialog && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowRentDialog(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rent Book</h3>
              
              {/* Date Selection */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    min={today}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">End Date</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || today}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Book: <span className="font-semibold">{book.name}</span></p>
                <p className="text-sm text-gray-600 mb-2">Quantity: <span className="font-semibold">{quantity}</span></p>
                {startDate && endDate && (
                  <>
                    <p className="text-sm text-gray-600 mb-3">Period: <span className="font-semibold">{startDate} to {endDate}</span> ({calculateRentalDays()} days)</p>
                    
                    {/* Rent Breakdown */}
                    <div className="border-t pt-3 space-y-2">
                      <h4 className="text-sm font-bold text-blue-700 mb-2">💰 Rent Breakdown</h4>
                      <div className="flex justify-between text-xs text-gray-700">
                        <span>Rental Fee (40%):</span>
                        <span className="font-semibold">₹{calculateRentBreakdown().rentalFee}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-700">
                        <span>Security Deposit (60%):</span>
                        <span className="font-semibold text-green-600">₹{calculateRentBreakdown().securityDeposit}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-blue-600 border-t pt-2">
                        <span>Total Amount:</span>
                        <span>₹{calculateRentBreakdown().totalAmount}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 italic mt-2">
                        * Security deposit will be refunded upon book return
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleAddToCart("rent")}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => handleBuyNow("rent")}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Buy Now"}
                </button>
              </div>
              <button 
                onClick={() => setShowRentDialog(false)}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookDetails;
