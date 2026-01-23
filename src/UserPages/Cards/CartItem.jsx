import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity, deleteCartItemFromFirebase, saveCartItemToFirebase } from "../../Store/CartSlice";

const CartItem = ({ item, availability }) => {
  const dispatch = useDispatch();
  const isOutOfStock = availability && !availability.isAvailable;

  const handleRemove = () => {
    if (window.confirm(`Remove ${item.book.name} from cart?`)) {
      // Delete from Firebase first
      if (item.firebaseId) {
        dispatch(deleteCartItemFromFirebase(item.firebaseId));
      }
      // Then remove from Redux
      dispatch(removeFromCart(item.id));
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1) {
      // Calculate new total price based on item type
      let newTotalPrice;
      if (item.itemType === "rent") {
        // For rent: (rentalFee + securityDeposit) per quantity unit
        const basePrice = item.book.price * newQuantity;
        const rentalDays = item.startDate && item.endDate ? Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)) : 0;
        const rentalFee = rentalDays <= 180 ? basePrice * 0.3 : basePrice * 0.4 * Math.ceil(rentalDays / 365);
        const securityDeposit = basePrice * 0.5;
        newTotalPrice = rentalFee + securityDeposit;
      } else {
        // For purchase: simply price * quantity
        newTotalPrice = item.book.price * newQuantity;
      }
      
      // Update Redux
      dispatch(updateCartItemQuantity({ itemId: item.id, quantity: newQuantity }));
      // Update Firebase
      if (item.firebaseId) {
        const updatedItem = {
          ...item,
          quantity: newQuantity,
          totalPrice: newTotalPrice
        };
        if (item.itemType === "rent") {
          const basePrice = item.book.price * newQuantity;
          const rentalDays = item.startDate && item.endDate ? Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)) : 0;
          updatedItem.rentalFee = rentalDays <= 180 ? basePrice * 0.3 : basePrice * 0.4 * Math.ceil(rentalDays / 365);
          updatedItem.securityDeposit = basePrice * 0.5;
        }
        dispatch(saveCartItemToFirebase(updatedItem));
      }
    }
  };

  return (
    <div className={`rounded-xl shadow-md border-2 p-3 sm:p-4 hover:shadow-lg transition-all ${
      isOutOfStock 
        ? 'bg-gray-100 border-red-300 opacity-75' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex gap-2 sm:gap-4">
        {/* Book Image */}
        <div className="w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0">
          {item.book.imageUrl ? (
            <img 
              src={item.book.imageUrl} 
              alt={item.book.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm sm:text-lg text-gray-800">{item.book.name}</h4>
              {isOutOfStock && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  OUT OF STOCK
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-2">{item.book.type}</p>
            
            {/* Purchase or Rent Badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
              item.itemType === "purchase" 
                ? "bg-green-100 text-green-700" 
                : "bg-blue-100 text-blue-700"
            }`}>
              {item.itemType === "purchase" ? "Purchase" : "Rent"}
            </span>

            {/* Rental Dates if applicable */}
            {item.itemType === "rent" && item.startDate && item.endDate && (
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1">
                <p>📅 {item.startDate} to {item.endDate}</p>
              </div>
            )}
            
            {/* Rent Price Breakdown */}
            {item.itemType === "rent" && item.rentalFee !== undefined && item.securityDeposit !== undefined && (
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1 bg-blue-50 p-1.5 rounded">
                <p>💵 Rental Fee: ₹{item.rentalFee?.toFixed(2)}</p>
                <p>🔒 Security: ₹{item.securityDeposit?.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 sm:gap-2">
                <label className="text-xs sm:text-sm text-gray-600">Qty:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity} 
                  onChange={handleQuantityChange}
                  disabled={isOutOfStock}
                  className={`w-12 sm:w-16 border-2 rounded px-1 sm:px-2 py-1 text-xs sm:text-sm text-center ${
                    isOutOfStock 
                      ? 'bg-gray-200 border-gray-400 cursor-not-allowed' 
                      : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  }`}
                />
              </div>
              {isOutOfStock && availability && (
                <p className="text-[10px] text-red-600">
                  Available: {availability.available}
                </p>
              )}
            </div>
            <div className="text-right">
              {item.itemType === "purchase" ? (
                <p className="text-[10px] sm:text-xs text-gray-500">₹{item.book.price} each</p>
              ) : (
                <p className="text-[10px] sm:text-xs text-blue-600 font-semibold">Total (Rent+Deposit)</p>
              )}
              <p className="text-base sm:text-lg font-bold text-blue-600">₹{item.totalPrice?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button 
          onClick={handleRemove}
          className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-red-600 transition-all"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
