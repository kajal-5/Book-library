import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDropRequests, acceptDropRequest, rejectDropRequest } from "../Store/RequestSlice";
import { setAdminNotificationCount } from "../Store/authSlice";
import { acceptBookReturn, rejectBookReturn } from "../APIs/RentalNotificationService";
import Nav from "./Nav";
import AdminNotificationCard from "./Cards/AdminNotificationCard";
// import SpaceBar from "./SpaceBar";

const AdminNotifications = () => {
  const dispatch = useDispatch();
  const { list: requests, loading } = useSelector((state) => state.requests);
  const [returnRequests, setReturnRequests] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processedIds, setProcessedIds] = useState(new Map()); // Track processed requests with their status
  const [processingIds, setProcessingIds] = useState(new Set()); // Track currently processing requests

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
            const processedStatus = processedIds.get(id);
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
    } catch (error) {
      console.error("Error fetching return requests:", error);
    }
  };

  // Update admin notification count based on pending drop requests AND return requests
  useEffect(() => {
    const pendingDropCount = requests.filter(req => req.status === "pending").length;
    const pendingReturnCount = returnRequests.filter(req => !req.status || req.status === "pending").length;
    const totalCount = pendingDropCount + pendingReturnCount;
    dispatch(setAdminNotificationCount(totalCount));
  }, [requests, returnRequests, dispatch]);

  const handleActionComplete = () => {
    setTimeout(() => {
      dispatch(fetchDropRequests());
      fetchReturnRequests();
    }, 1000);
  };

  const handleAcceptDropRequest = async (requestId) => {
    if (processingIds.has(requestId)) return;
    
    setProcessingIds(prev => new Set(prev).add(requestId));
    try {
      await dispatch(acceptDropRequest(requestId)).unwrap();
      setProcessedIds(prev => new Map(prev).set(requestId, { 
        status: "accepted", 
        acceptedDate: new Date().toISOString() 
      }));
      alert("Drop request accepted successfully!");
    } catch (error) {
      alert("Failed to accept drop request");
    }
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(requestId);
      return newSet;
    });
  };

  const handleRejectDropRequest = async (requestId) => {
    if (processingIds.has(requestId)) return;
    
    if (window.confirm("Are you sure you want to reject this drop request?")) {
      setProcessingIds(prev => new Set(prev).add(requestId));
      try {
        await dispatch(rejectDropRequest(requestId)).unwrap();
        setProcessedIds(prev => new Map(prev).set(requestId, { 
          status: "rejected", 
          rejectedDate: new Date().toISOString() 
        }));
        alert("Drop request rejected successfully!");
      } catch (error) {
        alert("Failed to reject drop request");
      }
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleAcceptReturn = async (rentalId, notificationId) => {
    if (processingIds.has(notificationId)) return; // Prevent duplicate clicks
    
    if (window.confirm("Are you sure you want to accept this return and refund the security deposit?")) {
      setProcessingIds(prev => new Set(prev).add(notificationId));
      const result = await acceptBookReturn(rentalId, notificationId);
      if (result.success) {
        // Track this ID as processed
        setProcessedIds(prev => new Map(prev).set(notificationId, { 
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
        alert(result.message);
        // Auto-refresh will sync in 5 seconds
      } else {
        alert(result.message);
      }
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
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

    if (processingIds.has(selectedRequest.id) || isSubmittingReject) return; // Prevent duplicate clicks

    setIsSubmittingReject(true);
    setProcessingIds(prev => new Set(prev).add(selectedRequest.id));
    const result = await rejectBookReturn(
      selectedRequest.rentalId,
      selectedRequest.id,
      rejectReason
    );

    if (result.success) {
      // Track this ID as processed
      setProcessedIds(prev => new Map(prev).set(selectedRequest.id, { 
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
      alert(result.message);
      setRejectModalOpen(false);
      setRejectReason("");
      setSelectedRequest(null);
      // Auto-refresh will sync in 5 seconds
    } else {
      alert(result.message);
    }
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(selectedRequest.id);
      return newSet;
    });
    setIsSubmittingReject(false);
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const allNotifications = [...pendingRequests, ...returnRequests];

  return (
    <div className="flex h-screen  bg-gradient-to-br from-rose-400 via-purple-700 via-cyan-300 via-pink-300 to-red-400">
      {/* <SpaceBar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Nav />
        <div className="flex-1 overflow-y-auto p-10 md:p-16">
          {/* <h1 className="text-3xl font-bold text-white mb-6">Notifications</h1> */}
          {loading && initialLoad ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No Notifications</h2>
              <p className="text-gray-500">All caught up!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Drop Requests */}
              {pendingRequests.map((request) => (
                <AdminNotificationCard 
                  key={request.id} 
                  request={request} 
                  type="drop"
                  onAccept={() => handleAcceptDropRequest(request.id)}
                  onReject={() => handleRejectDropRequest(request.id)}
                  isProcessing={processingIds.has(request.id)}
                />
              ))}
              
              {/* Return Requests */}
              {returnRequests.map((request) => (
                <AdminNotificationCard 
                  key={request.id} 
                  request={request} 
                  type="return"
                  onAccept={() => handleAcceptReturn(request.rentalId, request.id)}
                  onReject={() => handleRejectClick(request)}
                  isProcessing={processingIds.has(request.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancel Return Request</h2>
            <p className="text-gray-600 mb-4">Please provide a reason for canceling this return:</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Book is damaged, pages are missing, rental period not yet over, etc."
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
    </div>
  );
};

export default AdminNotifications;
