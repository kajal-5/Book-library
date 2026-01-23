

import Nav from "./Nav";
import Categories from "./Categories";
import BookCard from "./Cards/UserBookCards";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../Store/BookSlice";
import { setNotificationCount, validateToken } from "../Store/authSlice";
import { getUserNotificationsApi } from "../APIs/RequestAPi";
import { checkRentalPeriods } from "../APIs/RentalNotificationService";



const UserHome = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.list); // ✅ FIX 1
  const userEmail = useSelector((state) => state.auth.email);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter books based on search query and category
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      book.name.toLowerCase().includes(query) ||
      (book.description && book.description.toLowerCase().includes(query));
    
    // Category filter matches by type, name, or description
    let matchesCategory = selectedCategory === "All";
    if (!matchesCategory && selectedCategory !== "All") {
      const categoryQuery = selectedCategory.toLowerCase();
      matchesCategory = 
        (book.type && book.type.toLowerCase() === categoryQuery) ||
        (book.name && book.name.toLowerCase().includes(categoryQuery)) ||
        (book.description && book.description.toLowerCase().includes(categoryQuery));
    }
    
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    dispatch(fetchBooks());

    const interval = setInterval(() => {
      dispatch(fetchBooks());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Fetch notification count periodically
  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!userEmail) return;
      
      try {
        const notifications = await getUserNotificationsApi(userEmail);
        const unreadCount = notifications.filter(n => !n.read).length;
        dispatch(setNotificationCount(unreadCount));
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };

    fetchNotificationCount();

    // Check for new notifications every 5 seconds
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [userEmail, dispatch]);

  // Check rental periods periodically
  useEffect(() => {
    const checkRentals = async () => {
      try {
        await checkRentalPeriods();
      } catch (error) {
        console.error("Failed to check rental periods:", error);
      }
    };

    // Check immediately on mount
    checkRentals();

    // Check every hour
    const interval = setInterval(() => {
      checkRentals();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  // Validate token periodically
  useEffect(() => {
    // Validate immediately on mount
    dispatch(validateToken());

    // Validate every 5 minutess
    const interval = setInterval(() => {
      dispatch(validateToken());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-700 via-teal-300 via-purple-800 via-sky-600 via-fuchsia-700 to-rose-700">
      <Nav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
  
 
      <div className="px-12 py-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-15">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 text-lg py-10">
            No books found matching your search.
          </div>
        )}
      </div>

    </div>
  );
};

export default UserHome;
