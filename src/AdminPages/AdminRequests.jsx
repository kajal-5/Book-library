import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDropRequests } from "../Store/RequestSlice";
import { setAdminNotificationCount } from "../Store/authSlice";
import { acceptBookReturn, rejectBookReturn } from "../APIs/RentalNotificationService";
import Nav from "./Nav";
import RequestCard from "./Cards/RequestCard";
// import SpaceBar from "./SpaceBar";

const AdminRequests = () => {
  const dispatch = useDispatch();
  const { list: dropRequests, loading } = useSelector((state) => state.requests);
  const [returnRequests, setReturnRequests] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filterType, setFilterType] = useState("all"); // all, drop, return
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, accepted, rejected
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [processedStatusMap, setProcessedStatusMap] = useState(new Map()); // Track processed requests

  useEffect(() => {
    dispatch(fetchDropRequests());
    fetchReturnRequests();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      dispatch(fetchDropRequests());
      fetchReturnRequests();
    }, 5000);

    if (initialLoad) {
      setInitialLoad(false);
    }

    return () => clearInterval(interval);
  }, [dispatch]);

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
              return { id, ...notification, ...processedStatus, requestType: "return" };
            }
            return { id, ...notification, requestType: "return" };
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setReturnRequests(requests);
      } else {
        setReturnRequests([]);
      }
    } catch (error) {
      console.error("Error fetching return requests:", error);
    }
  };

  // Update admin notification count based on pending drop requests AND return requests
  useEffect(() => {
    const pendingDropCount = dropRequests.filter(req => req.status === "pending").length;
    const pendingReturnCount = returnRequests.filter(req => !req.status || req.status === "pending").length;
    const totalCount = pendingDropCount + pendingReturnCount;
    dispatch(setAdminNotificationCount(totalCount));
  }, [dropRequests, returnRequests, dispatch]);

  const handleActionComplete = () => {
    setTimeout(() => {
      dispatch(fetchDropRequests());
      fetchReturnRequests();
    }, 1000);
  };

  const handleAcceptReturn = async (rentalId, notificationId) => {
    if (processingIds.has(notificationId)) return;
    
    if (window.confirm("Accept this return and refund the security deposit?")) {
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

    if (processingIds.has(selectedRequest.id) || isSubmittingReject) return;
    
    setIsSubmittingReject(true);
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
    } else {
      alert(result.message);
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedRequest.id);
        return newSet;
      });
    }
    setIsSubmittingReject(false);
  };

  // Add requestType to drop requests
  const dropRequestsWithType = dropRequests.map(req => ({ ...req, requestType: "drop" }));
  
  // Combine all requests
  const allRequests = [...dropRequestsWithType, ...returnRequests];

  // Filter by type
  const filteredByType = allRequests.filter(req => {
    if (filterType === "all") return true;
    return req.requestType === filterType;
  });

  // Filter by status
  const filteredRequests = filteredByType.filter(req => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending") {
      // Both drop and return requests use Firebase status
      // If no status field, consider it pending (for backward compatibility)
      return !req.status || req.status === "pending";
    }
    return req.status === filterStatus;
  });

  return (
    <>
      {/* <SpaceBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
      <div className="flex h-screen bg-gradient-to-br from-pink-200 via-purple-300 via-pink-300 to-red-700">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Nav onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6  p-10" >
          {/* <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">All Requests</h1> */}
          
          {/* Filter Buttons */}
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-xl shadow-lg p-3 sm:p-4 mb-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 ">
              {/* Type Filter */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Request Type</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                      filterType === "all"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">All Types</span>
                    <span className="sm:hidden">All</span>
                  </button>
                  <button
                    onClick={() => setFilterType("drop")}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                      filterType === "drop"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    📚 <span className="hidden sm:inline">Drop</span>
                  </button>
                  <button
                    onClick={() => setFilterType("return")}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                      filterType === "return"
                        ? "bg-purple-500 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    📦 <span className="hidden sm:inline">Return</span>
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Status</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                      filterStatus === "all"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">All Status</span>
                    <span className="sm:hidden">All</span>
                  </button>
                  <button
                    onClick={() => setFilterStatus("pending")}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                      filterStatus === "pending"
                        ? "bg-yellow-500 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    ⏳ <span className="hidden sm:inline">Pending</span>
                  </button>
                  <button
                    onClick={() => setFilterStatus("accepted")}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                      filterStatus === "accepted"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    ✅ <span className="hidden sm:inline">Accepted</span>
                  </button>
                  <button
                    onClick={() => setFilterStatus("rejected")}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                      filterStatus === "rejected"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    ❌ <span className="hidden sm:inline">Rejected</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading && initialLoad ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                {filterStatus === "pending" ? "No Pending Requests" : 
                 filterStatus === "accepted" ? "No Accepted Requests" :
                 filterStatus === "rejected" ? "No Rejected Requests" : "No Requests Found"}
              </h2>
              <p className="text-gray-500">
                {filterStatus === "pending" ? "All requests have been processed." : "Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:pt-10 md:px-6 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredRequests.map((request) => (
                request.requestType === "drop" ? (
                  <RequestCard key={request.id} request={request} onActionComplete={handleActionComplete} />
                ) : (
                  // Return Request Card
                  <div key={request.id} className="bg-white rounded-xl shadow-lg border-4 border-gray-200 overflow-hidden flex flex-col">
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
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-semibold whitespace-nowrap ml-2">
                          📦 Return
                        </span>
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
                            <span className="text-gray-600">Rental (40%):</span>
                            <span className="font-semibold">₹{request.rentalFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Deposit (60%):</span>
                            <span className="font-semibold text-green-600">₹{request.securityDeposit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons or Status */}
                      {(!request.status || request.status === "pending") && !processingIds.has(request.id) ? (
                        <div className="flex flex-col gap-2 mt-auto">
                          <button 
                            onClick={() => handleAcceptReturn(request.rentalId, request.id)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg font-semibold transition-all shadow-md text-xs"
                          >
                            ✅ Accept (₹{request.securityDeposit})
                          </button>
                          <button 
                            onClick={() => handleRejectClick(request)}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-lg font-semibold transition-all shadow-md text-xs"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      ) : processingIds.has(request.id) ? (
                        <div className="p-2 rounded-lg text-center text-xs font-semibold mt-auto bg-gray-100 text-gray-600">
                          ⏳ Processing...
                        </div>
                      ) : (
                        <div className={`p-2 rounded-lg text-center text-xs font-semibold mt-auto ${
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
                )
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancel Return Request</h2>
            <p className="text-gray-600 mb-4">Provide a reason for canceling:</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Book is damaged, rental period not yet over, etc."
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
                Close
              </button>
              <button 
                onClick={handleRejectSubmit}
                disabled={isSubmittingReject}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingReject ? "⏳ Processing..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    );
};

export default AdminRequests;
