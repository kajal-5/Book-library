// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { saveTransaction, createRentTransaction, createSecurityDepositTransaction } from "../APIs/TransactionAPI";
// import Nav from "./Nav";

// const RentAgain = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [rental, setRental] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [userEmail, setUserEmail] = useState("");
  
//   const today = new Date().toISOString().split('T')[0];
//   const rentalId = searchParams.get("rentalId");

//   useEffect(() => {
//     const email = localStorage.getItem("email");
//     setUserEmail(email || "");
    
//     if (rentalId) {
//       fetchRentalDetails(rentalId);
//     }
//   }, [rentalId]);

//   const fetchRentalDetails = async (id) => {
//     try {
//       const response = await fetch(
//         `https://book-app-339c8-default-rtdb.firebaseio.com/rentBook/${id}.json`
//       );
//       const data = await response.json();
      
//       if (data) {
//         setRental({ id, ...data });
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching rental details:", error);
//       setLoading(false);
//     }
//   };

//   const calculateRentalDays = () => {
//     if (!startDate || !endDate) return 0;
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   // Rent Again: 50% per 6 months, 50% security deposit
//   const calculateRentAgainBreakdown = () => {
//     if (!rental) return { rentalFee: 0, securityDeposit: 0, totalAmount: 0 };
    
//     const rentalDays = calculateRentalDays();
//     const basePrice = rental.bookPrice * rental.quantity;
    
//     // 30% × number of years for re-rental
//     const rentalFee = basePrice * 0.3 * Math.ceil(rentalDays / 365);
//     // Security deposit is constant 50% of book cost
//     const securityDeposit = basePrice * 0.5;
//     const totalAmount = rentalFee + securityDeposit;
    
//     return {
//       rentalDays,
//       rentalFee: rentalFee.toFixed(2),
//       securityDeposit: securityDeposit.toFixed(2),
//       totalAmount: totalAmount.toFixed(2)
//     };
//   };

//   const handleRentAgain = async () => {
//     if (!startDate || !endDate) {
//       alert("Please select both start and end dates");
//       return;
//     }

//     if (!userEmail) {
//       alert("Please log in to rent again");
//       return;
//     }

//     const breakdown = calculateRentAgainBreakdown();
    
//     try {
//       const rentAgainData = {
//         bookId: rental.bookId,
//         bookName: rental.bookName,
//         bookPrice: rental.bookPrice,
//         bookImage: rental.bookImage,
//         bookDescription: rental.bookDescription,
//         bookType: rental.bookType,
//         quantity: rental.quantity,
//         userEmail: userEmail,
//         adminContact: rental.adminContact,
//         startDate: startDate,
//         endDate: endDate,
//         rentalDays: breakdown.rentalDays,
//         rentalFee: breakdown.rentalFee,
//         securityDeposit: breakdown.securityDeposit,
//         totalAmount: breakdown.totalAmount,
//         rentalDate: new Date().toISOString(),
//         status: "active",
//         returnStatus: "not_returned",
//         isRentAgain: true, // Flag to identify re-rentals
//         originalRentalId: rental.id
//       };

//       const rentResponse = await fetch(
//         "https://book-app-339c8-default-rtdb.firebaseio.com/rentBook.json",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(rentAgainData)
//         }
//       );

//       if (!rentResponse.ok) throw new Error("Failed to process rent again");

//       // Save rental transaction (20% fee only)
//       await saveTransaction(createRentTransaction(rentAgainData));

//       alert("Rent again successful! You paid only 20% of the rental cost with no security deposit.");
//       navigate("/my-rentals");
//     } catch (error) {
//       console.error("Rent again error:", error);
//       alert("Failed to process rent again. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-300 to-pink-400">
//         <Nav />
//         <div className="flex justify-center items-center h-screen">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!rental) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-300 to-pink-400">
//         <Nav />
//         <div className="p-6">
//           <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
//             <h2 className="text-2xl font-bold text-gray-700 mb-2">Rental Not Found</h2>
//             <p className="text-gray-500 mb-6">The rental you're looking for doesn't exist.</p>
//             <button
//               onClick={() => navigate("/my-rentals")}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Back to My Rentals
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const breakdown = calculateRentAgainBreakdown();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-300 to-pink-400">
//       <Nav />
//       <div className="p-6">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-3xl font-bold text-white mb-6">🔄 Rent Again - Special Rate!</h1>
          
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//             {/* Book Info */}
//             <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//               <div className="flex items-center gap-4">
//                 {rental.bookImage && (
//                   <img
//                     src={rental.bookImage}
//                     alt={rental.bookName}
//                     className="w-24 h-32 object-cover rounded-lg shadow-lg"
//                   />
//                 )}
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">{rental.bookName}</h2>
//                   <p className="text-sm opacity-90">Quantity: {rental.quantity}</p>
//                   <p className="text-sm opacity-90">Original Rental: {rental.startDate} to {rental.endDate}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Special Offer Banner */}
//             <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-4 text-center">
//               <p className="text-xl font-bold">🎉 Special Rent Again Offer!</p>
//               <p className="text-sm">Pay only 20% rental fee with NO security deposit required</p>
//             </div>

//             {/* Date Selection */}
//             <div className="p-6">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Select New Rental Period</h3>
              
//               <div className="space-y-4 mb-6">
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 mb-2 block">Start Date</label>
//                   <input 
//                     type="date" 
//                     value={startDate} 
//                     onChange={(e) => setStartDate(e.target.value)}
//                     min={today}
//                     className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 mb-2 block">End Date</label>
//                   <input 
//                     type="date" 
//                     value={endDate} 
//                     onChange={(e) => setEndDate(e.target.value)}
//                     min={startDate || today}
//                     className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Pricing Breakdown */}
//               {startDate && endDate && (
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 mb-6 border-2 border-green-200">
//                   <h4 className="text-lg font-bold text-green-700 mb-4">💰 Rent Again Pricing</h4>
//                   <p className="text-sm text-gray-600 mb-4">Period: {startDate} to {endDate} ({breakdown.rentalDays} days)</p>
                  
//                   <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-700">Rental Fee (20% Special Rate):</span>
//                       <span className="font-bold text-green-600">₹{breakdown.rentalFee}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-700">Security Deposit:</span>
//                       <span className="font-bold text-green-600">₹0 (Waived!)</span>
//                     </div>
//                     <div className="border-t-2 border-green-300 pt-3 flex justify-between text-lg font-bold">
//                       <span className="text-gray-800">Total Amount:</span>
//                       <span className="text-green-600">₹{breakdown.totalAmount}</span>
//                     </div>
//                   </div>

//                   <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
//                     <p className="text-xs text-gray-600 flex items-start gap-2">
//                       <span className="text-green-600 text-lg">✓</span>
//                       <span>Special re-rental rate: Only 20% rental fee, no security deposit required! This is an exclusive offer for returning customers.</span>
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex gap-4">
//                 <button
//                   onClick={() => navigate("/my-rentals")}
//                   className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleRentAgain}
//                   disabled={!startDate || !endDate}
//                   className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Confirm Rent Again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RentAgain;
