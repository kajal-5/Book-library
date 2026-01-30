import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationCount } from "../Store/authSlice";
import { getUserNotificationsApi, markAllNotificationsAsReadApi } from "../APIs/RequestAPi";
import Nav from "./Nav";
import UserNotificationCard from "./Cards/UserNotificationCard";

const UserNotifications = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.email);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userEmail) return;
      
      try {
        const userNotifications = await getUserNotificationsApi(userEmail);
        setNotifications(userNotifications);
        
        // Mark all notifications as read
        await markAllNotificationsAsReadApi(userEmail);
        
        // Reset notification count to 0
        dispatch(setNotificationCount(0));
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userEmail, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-300 to-pink-400">
      <Nav />
      <div className="md:pt-16 md:px-10 ">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Notifications</h2>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {notifications.map((notification) => (
              <UserNotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;
