const UserNotificationCard = ({ notification }) => {
  const isAccepted = notification.type === "accepted";
  const isRentalReminder = notification.type === "rental_reminder";
  const isOneDayReminder = notification.type === "one_day_reminder";
  const isRentalExpired = notification.type === "rental_expired";
  const isSecurityRefund = notification.type === "security_refund";
  const isReturnRejected = notification.type === "return_rejected";
  
  let bgColor = "bg-blue-100";
  let textColor = "text-blue-800";
  let statusText = "📢 Notification";
  let icon = "📢";

  if (isAccepted) {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    statusText = "✓ Accepted";
    icon = "✅";
  } else if (notification.type === "cancelled") {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    statusText = "✗ Cancelled";
    icon = "❌";
  } else if (isOneDayReminder) {
    bgColor = "bg-blue-100";
    textColor = "text-blue-800";
    statusText = "📅 1 Day to Go";
    icon = "📅";
  } else if (isRentalReminder) {
    bgColor = "bg-orange-100";
    textColor = "text-orange-800";
    statusText = "⏰ Reminder";
    icon = "⏰";
  } else if (isRentalExpired) {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    statusText = "🔴 Rental Ended";
    icon = "🔴";
  } else if (isSecurityRefund) {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    statusText = "💰 Refund";
    icon = "✅";
  } else if (isReturnRejected) {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    statusText = "❌ Return Rejected";
    icon = "❌";
  }
  
  return (
    <div className="bg-red-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {notification.imageUrl ? (
        <img
          src={notification.imageUrl}
          alt={notification.bookName || "Notification"}
          className="w-full h-36 sm:h-40 md:h-48 object-cover"
        />
      ) : (
        <div className="w-full h-36 sm:h-40 md:h-48 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
          <span className="text-4xl sm:text-5xl md:text-6xl">{icon}</span>
        </div>
      )}

      <div className="p-3 sm:p-4">
        <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-2 ${bgColor} ${textColor}`}>
          {statusText}
        </div>
        {notification.bookName && (
          <h3 className="font-bold text-base sm:text-lg mb-1">{notification.bookName}</h3>
        )}
        <p className="text-xs sm:text-sm text-gray-700 mt-2 leading-relaxed">{notification.message}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
          {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
        </p>
        
        {/* Return Book and Rent Again buttons for rental reminders and expired */}
        {(isRentalReminder || isRentalExpired || isOneDayReminder) && notification.rentalId && (
          <div className="mt-3 sm:mt-4 flex gap-2">
            <button 
              onClick={() => window.location.href = `/my-rentals?action=return&id=${notification.rentalId}`}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md"
            >
              Return Book
            </button>
            <button 
              onClick={() => window.location.href = `/rent-again?rentalId=${notification.rentalId}`}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              Rent Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotificationCard;
