import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "./Cards/CartItem";
import Nav from "./Nav";
import { clearCart } from "../Store/CartSlice";
import { saveTransaction, createCartPurchaseTransaction, createCartRentTransaction, createCartSecurityDepositTransaction } from "../APIs/TransactionAPI";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const totalCount = useSelector((state) => state.cart.totalCount);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      alert("Please log in to checkout");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // Helper function to get book key from name
      const bookNameToKey = (name) => name.trim().toLowerCase().replace(/\s+/g, "-");

      // Validate all items are still available before processing
      const unavailableItems = [];
      for (const item of cartItems) {
        const bookKey = bookNameToKey(item.book.name);
        const bookResponse = await fetch(`https://book-app-339c8-default-rtdb.firebaseio.com/books/${bookKey}.json`);
        const currentBook = await bookResponse.json();
        
        if (!currentBook || currentBook.quantity < item.quantity) {
          unavailableItems.push({
            name: item.book.name,
            available: currentBook ? currentBook.quantity : 0,
            requested: item.quantity
          });
        }
      }

      // If any items are unavailable, show error
      if (unavailableItems.length > 0) {
        const errorMsg = unavailableItems.map(item => 
          `"${item.name}" - Available: ${item.available}, You requested: ${item.requested}`
        ).join('\n');
        alert(`Some items are no longer available:\n\n${errorMsg}\n\nPlease update your cart.`);
        return;
      }

      // Process each item in cart
      for (const item of cartItems) {
        const bookKey = bookNameToKey(item.book.name);

        // Decrease book quantity in /books
        const bookResponse = await fetch(`https://book-app-339c8-default-rtdb.firebaseio.com/books/${bookKey}.json`);
        const currentBook = await bookResponse.json();
        
        if (currentBook) {
          await fetch(`https://book-app-339c8-default-rtdb.firebaseio.com/books/${bookKey}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              quantity: currentBook.quantity - item.quantity,
              updatedAt: new Date().toISOString()
            })
          });
        }

        if (item.itemType === "purchase") {
          // Save purchase to Firebase
          const purchaseData = {
            bookName: item.book.name,
            bookPrice: item.book.price,
            bookImage: item.book.imageUrl,
            bookDescription: item.book.description,
            bookType: item.book.type,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            userEmail: userEmail,
            purchaseDate: new Date().toISOString(),
            timestamp: Date.now()
          };

          await fetch(
            `https://book-app-339c8-default-rtdb.firebaseio.com/bookpurches.json`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(purchaseData)
            }
          );

          // Save purchase transaction
          await saveTransaction(createCartPurchaseTransaction(item, userEmail));

        } else if (item.itemType === "rent") {
          // Calculate rent breakdown
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          const diffTime = Math.abs(end - start);
          const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Save rental to Firebase
          const rentalData = {
            bookId: item.book.id || item.book.key,
            bookName: item.book.name,
            bookPrice: item.book.price,
            bookImage: item.book.imageUrl,
            bookDescription: item.book.description,
            bookType: item.book.type,
            quantity: item.quantity,
            userEmail: userEmail,
            startDate: item.startDate,
            endDate: item.endDate,
            rentalDays: rentalDays,
            rentalFee: item.rentalFee,
            securityDeposit: item.securityDeposit,
            totalAmount: item.totalAmount,
            rentalDate: new Date().toISOString(),
            status: "active",
            returnStatus: "not_returned"
          };

          await fetch(
            `https://book-app-339c8-default-rtdb.firebaseio.com/rentBook.json`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(rentalData)
            }
          );

          // Save rental and security deposit transactions
          await saveTransaction(createCartRentTransaction(item, userEmail));
          await saveTransaction(createCartSecurityDepositTransaction(item, userEmail));
        }
      }

      alert("Order placed successfully!");
      dispatch(clearCart());
      navigate("/user");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to complete checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-300 via-fuchsia-300 to-pink-400">
      <Nav />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-sm sm:text-base text-white/80">{totalCount} {totalCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Start adding books to see them here!</p>
            <button 
              onClick={() => navigate("/user")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 sticky top-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Order Summary</h3>
                
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Items ({totalCount})</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  <span>Total</span>
                  <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all shadow-lg ${
                    isProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Proceed to Checkout'}
                </button>

                <button 
                  onClick={() => navigate("/user")}
                  className="w-full mt-2 sm:mt-3 border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
