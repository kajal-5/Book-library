import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../Store/CartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    if (window.confirm(`Remove ${item.book.name} from cart?`)) {
      dispatch(removeFromCart(item.id));
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1) {
      dispatch(updateCartItemQuantity({ itemId: item.id, quantity: newQuantity }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all">
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
            <h4 className="font-bold text-sm sm:text-lg text-gray-800 mb-1">{item.book.name}</h4>
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
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <label className="text-xs sm:text-sm text-gray-600">Qty:</label>
              <input 
                type="number" 
                min="1" 
                value={item.quantity} 
                onChange={handleQuantityChange}
                className="w-12 sm:w-16 border-2 border-gray-300 rounded px-1 sm:px-2 py-1 text-xs sm:text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="text-right">
              <p className="text-[10px] sm:text-xs text-gray-500">₹{item.book.price} each</p>
              <p className="text-base sm:text-lg font-bold text-blue-600">₹{item.totalPrice}</p>
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
