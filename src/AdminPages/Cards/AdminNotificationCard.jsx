const AdminNotificationCard = ({ 
  request, 
  type = "drop", // "drop" or "return"
  onAccept, 
  onReject,
  isProcessing = false 
}) => {
  const isDrop = type === "drop";
  const isReturn = type === "return";

  // Get status badge
  const getStatusBadge = () => {
    if (request.status === "accepted") {
      return (
        <span className="px-3 py-1 bg-green-200 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Accepted
        </span>
      );
    }
    if (request.status === "rejected") {
      return (
        <span className="px-3 py-1 bg-red-200 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Rejected
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded-full text-xs font-semibold">
        {isDrop ? "📚 Drop Request" : "📦 Return Request"}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      <div className="flex flex-col md:flex-row">
        {/* Book Image */}
        <div className="m-3 md:m-6 md:w-48 h-64 md:h-auto bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          {(isDrop ? request.imageUrl : request.bookImage) ? (
            <img 
              src={isDrop ? request.imageUrl : request.bookImage} 
              alt={isDrop ? request.name : request.bookName} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6 ">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {isDrop ? request.name : request.bookName}
              </h3>
              {isDrop && request.description && (
                <p className="text-sm text-gray-500">{request.description}</p>
              )}
              {isReturn && request.message && (
                <p className="text-sm text-gray-500">{request.message}</p>
              )}
            </div>
            {getStatusBadge()}
          </div>

          {/* Request Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                👤 <span className="font-semibold">User:</span> {request.userEmail}
              </p>
              <p className="text-gray-600">
                📦 <span className="font-semibold">Quantity:</span> {request.quantity}
              </p>
              {isDrop && request.contactName && (
                <p className="text-gray-600">
                  📞 <span className="font-semibold">Contact:</span> {request.contactName}
                </p>
              )}
              {isDrop && request.mobileNo && (
                <p className="text-gray-600">
                  📱 <span className="font-semibold">Mobile:</span> {request.mobileNo}
                </p>
              )}
              {isReturn && (
                <>
                  <p className="text-gray-600">
                    📅 <span className="font-semibold">Start:</span> {request.startDate}
                  </p>
                  <p className="text-gray-600">
                    📅 <span className="font-semibold">End:</span> {request.endDate}
                  </p>
                </>
              )}
            </div>

            {/* Financial Details */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                {isDrop ? "Payment Details" : "Financial Details"}
              </h4>
              <div className="space-y-1 text-sm">
                {isDrop ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MRP Price:</span>
                      <span className="font-semibold">₹{request.mrpPrice}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="text-green-700 font-semibold">Payment to User:</span>
                      <span className="font-bold text-green-600">₹{request.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 italic">(70% of MRP)</p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental Fee:</span>
                      <span className="font-semibold">₹{request.rentalFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-semibold text-green-600">₹{request.securityDeposit}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons or Status */}
          {(!request.status || request.status === "pending") && !isProcessing ? (
            <div className="flex gap-3">
              <button 
                onClick={onAccept}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {isDrop ? "Accept Book" : `Accept & Refund ₹${request.securityDeposit}`}
              </button>
              <button 
                onClick={onReject}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>
            </div>
          ) : isProcessing ? (
            <div className="p-4 rounded-lg text-center font-semibold text-lg bg-gray-100 text-gray-600">
              ⏳ Processing...
            </div>
          ) : (
            <div className={`p-4 rounded-lg text-center font-semibold text-lg flex items-center justify-center gap-2 ${
              request.status === "accepted" 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {request.status === "accepted" ? (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {isReturn ? `Accepted - ₹${request.securityDeposit} Refunded` : "Book Accepted & Added"}
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {`${isDrop ? "Request" : "Return"} Rejected`}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationCard;
