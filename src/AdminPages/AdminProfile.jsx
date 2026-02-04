// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import Nav from "./Nav";
// import SpaceBar from "./SpaceBar";

// const AdminProfile = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const userEmail = useSelector((state) => state.auth.email);
//   const [profileData, setProfileData] = useState({
//     name: "",
//     email: userEmail || "",
//     contactNo: "",
//     role: "Admin",
//     joinedDate: new Date().toLocaleDateString(),
//   });

//   useEffect(() => {
//     // Fetch admin profile from Firebase if available
//     const fetchProfile = async () => {
//       if (!userEmail) return;
      
//       try {
//         const response = await fetch(
//           `https://book-app-339c8-default-rtdb.firebaseio.com/users.json`
//         );
//         const users = await response.json();
        
//         if (users) {
//           const adminUser = Object.values(users).find(user => user.email === userEmail);
//           if (adminUser) {
//             setProfileData({
//               name: adminUser.name || "Admin User",
//               email: adminUser.email,
//               contactNo: adminUser.contactNo || "",
//               role: adminUser.role || "Admin",
//               joinedDate: adminUser.createdAt ? new Date(adminUser.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();
//   }, [userEmail]);

//   return (
//     <>
//       <SpaceBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="flex h-screen bg-gradient-to-br from-rose-300 via-pink-300 to-red-400">
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <Nav onMenuClick={() => setSidebarOpen(true)} />
          
//           <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
//             <div className="max-w-4xl mx-auto">
//             <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Admin Profile</h1>
            
//             {/* Profile Card */}
//             <div className="bg-red-500 rounded-2xl shadow-2xl overflow-hidden">
//               {/* Header Section */}
//               <div className="bg-gradient-to-r from-indigo-900 via-pink-500 to-red-500 p-6 sm:p-8">
//                 <div className="flex flex-col sm:flex-row items-center gap-6">
//                   {/* Avatar */}
//                   {/* <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
//                     <svg className="w-12 h-12 sm:w-16 sm:h-16 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//                     </svg>
//                   </div> */}
                  
//                   {/* Profile Info */}
//                   <div className="text-center sm:text-left text-white flex-1">
//                     <h2 className="text-2xl sm:text-3xl font-bold mb-2">{profileData.name || "Admin User"}{"Hi"}</h2>
//                     <p className="text-sm sm:text-base opacity-90 mb-1">{profileData.email}</p>
//                     <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
//                       🛡️ {profileData.role}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Details Section */}
//               {/* <div className="p-6 sm:p-8"> */}
//                 {/* <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3> */}
                
//                 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
//                   {/* Email */}
//                   {/* <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
//                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Email Address</label>
//                     <p className="text-gray-800 font-medium break-all">{profileData.email}</p>
//                   </div> */}

//                   {/* Contact Number */}
//                   {/* <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4">
//                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Contact Number</label>
//                     <p className="text-gray-800 font-medium">{profileData.contactNo || "Not provided"}</p>
//                   </div> */}

//                   {/* Role */}
//                   {/* <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-4">
//                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Role</label>
//                     <p className="text-gray-800 font-medium">{profileData.role}</p>
//                   </div> */}

//                   {/* Joined Date */}
//                   {/* <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4">
//                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Member Since</label>
//                     <p className="text-gray-800 font-medium">{profileData.joinedDate}</p>
//                   </div>
//                 </div> */}

//                 {/* Stats Section */}
//                 {/* <div className="mt-8 pt-6 border-t border-gray-200">
//                   <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                     <div className="text-center p-4 bg-blue-100 rounded-lg">
//                       <p className="text-3xl font-bold text-blue-600">📚</p>
//                       <p className="text-xs text-gray-600 mt-1">Books</p>
//                     </div>
//                     <div className="text-center p-4 bg-green-100 rounded-lg">
//                       <p className="text-3xl font-bold text-green-600">👥</p>
//                       <p className="text-xs text-gray-600 mt-1">Users</p>
//                     </div>
//                     <div className="text-center p-4 bg-purple-100 rounded-lg">
//                       <p className="text-3xl font-bold text-purple-600">📦</p>
//                       <p className="text-xs text-gray-600 mt-1">Requests</p>
//                     </div>
//                     <div className="text-center p-4 bg-orange-100 rounded-lg">
//                       <p className="text-3xl font-bold text-orange-600">💰</p>
//                       <p className="text-xs text-gray-600 mt-1">Revenue</p>
//                     </div>
//                   </div>
//                 </div> */}

//                 {/* Action Buttons */}
//                 {/* <div className="mt-8 flex flex-col sm:flex-row gap-4">
//                   <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
//                     Edit Profile
//                   </button>
//                   <button className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-md">
//                     Change Password
//                   </button>
//                 </div> */}
//               {/* </div> */}
//             </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminProfile;
