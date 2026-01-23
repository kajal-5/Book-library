import { useState } from "react";
import { useDispatch } from "react-redux";
import { acceptDropRequest, rejectDropRequest } from "../../Store/RequestSlice";

const RequestCard = ({ request, onActionComplete }) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    const bookData = {
      name: request.name,
      description: request.description || "",
      price: request.price,
      quantity: request.quantity,
      imageUrl: request.imageUrl,
      contactName: request.contactName || "",
      mobileNo: request.mobileNo || "",
    };
    await dispatch(acceptDropRequest({ 
      requestId: request.id, 
      bookData,
      userEmail: request.userEmail 
    }));
    if (onActionComplete) onActionComplete();
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await dispatch(rejectDropRequest({ 
      requestId: request.id,
      userEmail: request.userEmail,
      bookName: request.name,
      imageUrl: request.imageUrl
    }));
    if (onActionComplete) onActionComplete();
  };

  const getStatusBadge = () => {
    if (request.status === "accepted") {
      return (
        <div className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-center font-semibold">
          Accepted
        </div>
      );
    }
    if (request.status === "rejected") {
      return (
        <div className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg text-center font-semibold">
          Rejected
        </div>
      );
    }
    return (
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAccept}
          disabled={isProcessing}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Accept"}
        </button>
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Cancel"}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-4 border-gray-200 hover:scale-105 transition duration-300 overflow-hidden">
      {request.imageUrl ? (
        <img
          src={request.imageUrl}
          alt={request.name}
          className="w-full h-60 object-cover"
        />
      ) : (
        <div className="w-full h-60 flex items-center justify-center bg-gray-200">
          <span className="text-gray-400">No Image</span>
        </div>
      )}

      <div className="p-4 bg-white">
        <h3 className="font-bold text-lg truncate">{request.name}</h3>
        {request.description && (
          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{request.description}</p>
        )}
        <p className="text-sm text-gray-600 mt-2">Quantity: {request.quantity}</p>
        <p className="font-semibold mt-1">₹ {request.price}</p>
        {request.contactName && (
          <p className="text-xs text-gray-600 mt-1">Contact: {request.contactName}</p>
        )}
        {request.mobileNo && (
          <p className="text-xs text-gray-600">Mobile: {request.mobileNo}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">User: {request.userEmail}</p>
        <p className="text-xs text-gray-500">
          {new Date(request.date).toLocaleDateString()}
        </p>

        {getStatusBadge()}
      </div>
    </div>
  );
};

export default RequestCard;
