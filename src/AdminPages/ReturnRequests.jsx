import { useState, useEffect } from "react";
import { acceptBookReturn, rejectBookReturn } from "../APIs/RentalNotificationService";
import Nav from "./Nav";
import SpaceBar from "./SpaceBar";

const ReturnRequests = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [processedStatusMap, setProcessedStatusMap] = useState(new Map()); // Track processed requests

  useEffect(() => {
    fetchReturnRequests();
    // Refresh every 5 seconds
    const interval = setInterval(fetchReturnRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchReturnRequests = async () => {
    try {
      const response = await fetch(
        `https://book-app-339c8-default-rtdb.firebaseio.com/adminNotifications.json`
      );
      const data = await response.json();

      if (data) {
        const requests = Object.entries(data)
          .filter(([_, notification]) => notification.type === "return_request")
          .map(([id, notification]) => {
            // Check if we have a local processed status for this ID
            const processedStatus = processedStatusMap.get(id);
            if (processedStatus) {
              // Use local status instead of Firebase status
              return { id, ...notification, ...processedStatus };
            }
            return { id, ...notification };
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setReturnRequests(requests);
      } else {
        setReturnRequests([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching return requests:", error);
      setLoading(false);
    }
  };

  const handleAccept = async (rentalId, notificationId) => {
    if (processingIds.has(notificationId)) return;
    
    if (window.confirm("Are you sure you want to accept this return and refund the security deposit?")) {
      setProcessingIds(prev => new Set([...prev, notificationId]));
      const result = await acceptBookReturn(rentalId, notificationId);
      if (result.success) {
        // Track this ID as processed
        setProcessedStatusMap(prev => new Map(prev).set(notificationId, { 
          status: "accepted", 
          acceptedDate: new Date().toISOString() 
        }));
        // Update local state immediately
        setReturnRequests(prev => 
          prev.map(req => 
            req.id === notificationId 
              ? { ...req, status: "accepted", acceptedDate: new Date().toISOString() }
              : req
          )
        );
        setProcessingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
        alert(result.message);
        // Auto-refresh will sync in 5 seconds
      } else {
        alert(result.message);
        setProcessingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
      }
    }
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    if (processingIds.has(selectedRequest.id)) return;
    
    setProcessingIds(prev => new Set([...prev, selectedRequest.id]));
    const result = await rejectBookReturn(
      selectedRequest.rentalId,
      selectedRequest.id,
      rejectReason
    );

    if (result.success) {
      // Track this ID as processed
      setProcessedStatusMap(prev => new Map(prev).set(selectedRequest.id, { 
        status: "rejected", 
        rejectionReason: rejectReason, 
        processedAt: new Date().toISOString() 
      }));
      // Update local state immediately
      setReturnRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: "rejected", rejectionReason: rejectReason, processedAt: new Date().toISOString() }
            : req
        )
      );
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedRequest.id);
        return newSet;
      });
      alert(result.message);
      setRejectModalOpen(false);
      setRejectReason("");
      setSelectedRequest(null);
      // Auto-refresh will sync in 5 seconds
    } else {
      alert(result.message);
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedRequest.id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-rose-300 via-pink-300 to-red-400">
        <SpaceBar />
        <div className="flex-1 flex flex-col">
          <Nav />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SpaceBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex h-screen bg-gradient-to-br from-rose-300 via-pink-300 to-red-400">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Nav onMenuClick={() => setSidebarOpen(true)} />
          
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Return Requests</h1>

            {returnRequests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">No Return Requests</h2>
                <p className="text-gray-500">All return requests have been processed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {returnRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-xl shadow-lg border-4 border-gray-200 hover:scale-105 transition duration-300 overflow-hidden flex flex-col">
                    {/* Book Image */}
                    <div className="w-full h-60 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      {request.bookImage ? (
                        <img src={request.bookImage} alt={request.bookName} className="h-full w-full object-cover" />
                      ) : (
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 bg-[#FAF7F3] flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg truncate flex-1">{request.bookName}</h3>
                        {request.status === "accepted" ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold whitespace-nowrap ml-2">
                            ✅ Accepted
                          </span>
                        ) : request.status === "rejected" ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-semibold whitespace-nowrap ml-2">
                            ❌ Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-semibold whitespace-nowrap ml-2">
                            📦 Pending
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">{request.message}</p>

                      <div className="space-y-1 text-xs text-gray-600 mb-2">
                        <p className="truncate">
                          <span className="font-semibold">User:</span> {request.userEmail}
                        </p>
                        <p>
                          <span className="font-semibold">Period:</span> {request.startDate} - {request.endDate}
                        </p>
                        <p>
                          <span className="font-semibold">Qty:</span> {request.quantity}
                        </p>
                      </div>

                      {/* Financial Details */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-2 mb-3">
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rental Fee:</span>
                            <span className="font-semibold">₹{request.rentalFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">To Refund:</span>
                            <span className="font-semibold text-green-600">₹{request.securityDeposit}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[9px] text-gray-400 mb-2">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>

                      {/* Action Buttons or Status */}
                      {(!request.status || request.status === "pending") && !processingIds.has(request.id) ? (
                        <div className="flex gap-2 mt-auto">
                          <button 
                            onClick={() => handleAccept(request.rentalId, request.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 px-2 rounded-md text-[10px] font-semibold transition-all"
                          >
                            ✓ Accept
                          </button>
                          <button 
                            onClick={() => handleRejectClick(request)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-2 rounded-md text-[10px] font-semibold transition-all"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      ) : processingIds.has(request.id) ? (
                        <div className="p-2 rounded-md text-center text-[10px] font-semibold mt-auto bg-gray-100 text-gray-600">
                          ⏳ Processing...
                        </div>
                      ) : (
                        <div className={`p-2 rounded-md text-center text-[10px] font-semibold mt-auto ${
                          request.status === "accepted" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {request.status === "accepted" 
                            ? `✅ Accepted - ₹${request.securityDeposit} Refunded` 
                            : `❌ Rejected`
                          }
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reject Return Request</h2>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this return:</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Book is damaged, pages are missing, etc."
              className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:border-red-500 focus:outline-none min-h-[100px]"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectReason("");
                  setSelectedRequest(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectSubmit}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
    </>
  );
};

export default ReturnRequests;
