import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "./Cards/CartItem";
import Nav from "./Nav";
import { clearCart, saveCartItemToFirebase, deleteCartItemFromFirebase, clearCartFromFirebase, addToCart, removeFromCart, updateCartItemQuantity } from "../Store/CartSlice";
import { saveTransaction, createCartPurchaseTransaction, createCartRentTransaction, createCartSecurityDepositTransaction } from "../APIs/TransactionAPI";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const totalCount = useSelector((state) => state.cart.totalCount);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const userEmail = useSelector((state) => state.auth.email);
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemAvailability, setItemAvailability] = useState({});
  const [adminContact, setAdminContact] = useState("");

  // Fetch admin contact
  useEffect(() => {
    const fetchAdminContact = async () => {
      try {
        const response = await fetch(
          `https://book-app-339c8-default-rtdb.firebaseio.com/users.json`
        );
        const users = await response.json();
        
        if (users) {
          const adminUser = Object.values(users).find(user => user.role === "admin" || user.isAdmin);
          if (adminUser && adminUser.contactNo) {
            setAdminContact(adminUser.contactNo);
          } else {
            const firstUserWithContact = Object.values(users).find(user => user.contactNo);
            if (firstUserWithContact) {
              setAdminContact(firstUserWithContact.contactNo);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching admin contact:", error);
      }
    };
    
    fetchAdminContact();
  }, []);

  // Check availability of all cart items
  useEffect(() => {
    const checkAvailability = async () => {
      const bookNameToKey = (name) => name.trim().toLowerCase().replace(/\s+/g, "-");
      const availability = {};

      for (const item of cartItems) {
        const bookKey = bookNameToKey(item.book.name);
        try {
          const response = await fetch(`https://book-app-339c8-default-rtdb.firebaseio.com/books/${bookKey}.json`);
          const currentBook = await response.json();
          
          if (currentBook) {
            availability[item.id] = {
              available: currentBook.quantity,
              isAvailable: currentBook.quantity >= item.quantity
            };
          } else {
            availability[item.id] = {
              available: 0,
              isAvailable: false
            };
          }
        } catch (error) {
          console.error(`Error checking availability for ${item.book.name}:`, error);
          availability[item.id] = {
            available: 0,
            isAvailable: false
          };
        }
      }

      setItemAvailability(availability);
    };

    if (cartItems.length > 0) {
      checkAvailability();
      // Re-check every 5 seconds
      const interval = setInterval(checkAvailability, 5000);
      return () => clearInterval(interval);
    }
  }, [cartItems]);

  // Calculate totals only for available items
  const availableItemsTotal = cartItems.reduce((total, item) => {
    const availability = itemAvailability[item.id];
    if (availability && availability.isAvailable) {
      return total + item.totalPrice;
    }
    return total;
  }, 0);

  const availableItemsCount = cartItems.reduce((count, item) => {
    const availability = itemAvailability[item.id];
    if (availability && availability.isAvailable) {
      return count + item.quantity;
    }
    return count;
  }, 0);

  const outOfStockCount = cartItems.length - cartItems.filter(item => {
    const availability = itemAvailability[item.id];
    return availability && availability.isAvailable;
  }).length;

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

      // Separate available and unavailable items
      const availableItems = [];
      const unavailableItems = [];
      
      for (const item of cartItems) {
        const availability = itemAvailability[item.id];
        if (availability && availability.isAvailable) {
          availableItems.push(item);
        } else {
          unavailableItems.push({
            name: item.book.name,
            available: availability ? availability.available : 0,
            requested: item.quantity
          });
        }
      }

      // If ALL items are unavailable, cannot checkout
      if (availableItems.length === 0) {
        alert('All items in your cart are currently out of stock. Please remove them and try again.');
        return;
      }

      // If some items are unavailable, confirm to proceed with available items only
      if (unavailableItems.length > 0) {
        const unavailableMsg = unavailableItems.map(item => 
          `"${item.name}" - Available: ${item.available}, You requested: ${item.requested}`
        ).join('\n');
        const proceed = window.confirm(
          `Some items are out of stock and will be skipped:\n\n${unavailableMsg}\n\nDo you want to proceed with the ${availableItems.length} available item(s)?`
        );
        if (!proceed) {
          return;
        }
      }

      // Process only available items
      for (const item of availableItems) {
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
            adminContact: adminContact,
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

          // Save rental to Firebase - Match exact structure of buy now rental
          const rentalData = {
            bookId: item.book.id || item.book.key,
            bookName: item.book.name,
            bookPrice: item.book.price,
            bookImage: item.book.imageUrl,
            bookDescription: item.book.description,
            bookType: item.book.type,
            quantity: item.quantity,
            userEmail: userEmail,
            adminContact: adminContact,
            startDate: item.startDate,
            endDate: item.endDate,
            rentalDays: rentalDays,
            rentalFee: typeof item.rentalFee === 'number' ? item.rentalFee.toFixed(2) : String(item.rentalFee),
            securityDeposit: typeof item.securityDeposit === 'number' ? item.securityDeposit.toFixed(2) : String(item.securityDeposit),
            totalAmount: typeof item.totalPrice === 'number' ? item.totalPrice.toFixed(2) : String(item.totalPrice),
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
      // Clear cart from Firebase after successful order
      if (userEmail) {
        await dispatch(clearCartFromFirebase(userEmail));
      }
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
                <CartItem 
                  key={item.id} 
                  item={item} 
                  availability={itemAvailability[item.id]}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 sticky top-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Order Summary</h3>
                
                {outOfStockCount > 0 && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-xs sm:text-sm text-red-700 font-semibold">
                      ⚠️ {outOfStockCount} item{outOfStockCount > 1 ? 's' : ''} out of stock
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Only available items will be charged
                    </p>
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Available Items ({availableItemsCount})</span>
                    <span>₹{availableItemsTotal.toFixed(2)}</span>
                  </div>
                  {outOfStockCount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-red-600">
                      <span>Out of Stock ({totalCount - availableItemsCount})</span>
                      <span>-₹{(totalAmount - availableItemsTotal).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  <span>Total</span>
                  <span className="text-blue-600">₹{availableItemsTotal.toFixed(2)}</span>
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
