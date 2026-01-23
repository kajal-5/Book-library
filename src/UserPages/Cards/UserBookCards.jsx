import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Store/CartSlice";
import { saveTransaction, createPurchaseTransaction, createRentTransaction, createSecurityDepositTransaction } from "../../APIs/TransactionAPI";
import ViewBookDetails from "./ViewBookDetails";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [adminContact, setAdminContact] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email || "");
    
    // Fetch admin contact from users database
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

  const handlePurchase = async ({ book, quantity, action }) => {
    if (!userEmail) {
      alert("Please log in to purchase");
      return;
    }

    if (quantity > book.quantity) {
      alert("Not enough quantity available");
      return;
    }

    if (action === "addToCart") {
      // Add to cart
      dispatch(addToCart({ book, quantity, type: "purchase" }));
      alert("Item added to cart!");
      setIsViewModalOpen(false);
    } else if (action === "buyNow") {
      // Process immediate purchase
      try {
        const purchaseData = {
          bookName: book.name,
          bookPrice: book.price,
          bookImage: book.imageUrl,
          bookDescription: book.description,
          bookType: book.type,
          quantity: quantity,
          totalPrice: book.price * quantity,
          userEmail: userEmail,
          adminContact: adminContact,
          purchaseDate: new Date().toISOString(),
          timestamp: Date.now()
        };

        const purchaseResponse = await fetch(
          `https://book-app-339c8-default-rtdb.firebaseio.com/bookpurches.json`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(purchaseData)
          }
        );

        if (!purchaseResponse.ok) throw new Error("Failed to save purchase");

        // Save purchase transaction
        await saveTransaction(createPurchaseTransaction(purchaseData));

        // Update book quantity
        const newQuantity = book.quantity - quantity;
        const bookKey = book.id || book.key;
        const updateResponse = await fetch(
          `https://book-app-339c8-default-rtdb.firebaseio.com/books/${bookKey}.json`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQuantity })
          }
        );

        if (!updateResponse.ok) throw new Error("Failed to update quantity");

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsViewModalOpen(false);
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Purchase error:", error);
        alert("Failed to complete purchase. Please try again.");
      }
    }
  };

  const handleRent = async ({ book, quantity, startDate, endDate, action }) => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (!userEmail) {
      alert("Please log in to rent a book");
      return;
    }

    // Calculate rent breakdown
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const basePrice = book.price * quantity;
    // 30% if ≤180 days, 40% × number of years if >180 days
    const rentalFee = rentalDays <= 180 
      ? basePrice * 0.3 
      : basePrice * 0.4 * Math.ceil(rentalDays / 365);
    // Security deposit is constant 50% of book cost
    const securityDeposit = basePrice * 0.5;
    const totalAmount = rentalFee + securityDeposit;

    if (action === "addToCart") {
      // Add to cart
      dispatch(addToCart({ 
        book, 
        quantity, 
        type: "rent", 
        startDate, 
        endDate,
        rentalFee,
        securityDeposit,
        totalAmount
      }));
      alert("Item added to cart!");
      setIsViewModalOpen(false);
    } else if (action === "buyNow") {
      // Process immediate rental
      try {
        const rentalData = {
          bookId: book.id || book.key,
          bookName: book.name,
          bookPrice: book.price,
          bookImage: book.imageUrl,
          bookDescription: book.description,
          bookType: book.type,
          quantity: quantity,
          userEmail: userEmail,
          adminContact: adminContact,
          startDate: startDate,
          endDate: endDate,
          rentalDays: rentalDays,
          rentalFee: rentalFee.toFixed(2),
          securityDeposit: securityDeposit.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          rentalDate: new Date().toISOString(),
          status: "active",
          returnStatus: "not_returned"
        };

        const response = await fetch(
          `https://book-app-339c8-default-rtdb.firebaseio.com/rentBook.json`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rentalData)
          }
        );

        if (!response.ok) throw new Error("Failed to save rental");

        // Save rental and security deposit transactions
        await saveTransaction(createRentTransaction(rentalData));
        await saveTransaction(createSecurityDepositTransaction(rentalData));

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsViewModalOpen(false);
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Rental error:", error);
        alert("Failed to complete rental. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-xl border-4 border-gray-200 hover:shadow-2xl hover:scale-x-120 hover:scale-y-110 transition-all duration-300 overflow-hidden">
        {book.imageUrl ? (
          <div className="w-full h-60 flex items-center justify-center bg-gradient-to-br from-rose-200 via-amber-200 via-emerald-200 via-cyan-200 to-violet-200">
            <img
              src={book.imageUrl}
              alt={book.name}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-60 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-lg">No Image</span>
          </div>
        )}

        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <h3 className="font-bold text-xl text-gray-800 truncate mb-2">{book.name}</h3>
          
          {book.description && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2 mb-3 leading-relaxed">
              {book.description}
            </p>
          )}

          <div className="space-y-2 mb-3">
            {/* Price and Quantity in same row */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-green-600">₹ {book.price}</p>
              {book.quantity && (
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="font-medium">Qty: {book.quantity}</span>
                </div>
              )}
            </div>
            
            {adminContact && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">{adminContact}</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsViewModalOpen(true)}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View Details
          </button>
        </div>
      </div>

      {/* View Details Modal */}
      <ViewBookDetails 
        book={book}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onPurchase={handlePurchase}
        onRent={handleRent}
        adminContact={adminContact}
      />

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully</p>
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;
