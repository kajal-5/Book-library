import Nav from "./Nav";
import Categories from "./Categories";
import BookCard from "./Cards/BooksCard";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../Store/BookSlice";
import { setAdminNotificationCount, validateToken } from "../Store/authSlice";
import { fetchDropRequests } from "../Store/RequestSlice";
import { useSearchParams, useParams } from "react-router-dom";

const AdminHome = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.list); // ✅ FIX 1
  const requests = useSelector((state) => state.requests.list);
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [returnRequests, setReturnRequests] = useState([]);

  // Convert URL category slug back to category name
  const getCategoryFromSlug = (slug) => {
    if (!slug) return "All";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(/And/g, "&");
  };

  const [selectedCategory, setSelectedCategory] = useState(
    getCategoryFromSlug(categoryName),
  );

  // Update selected category when URL changes
  useEffect(() => {
    setSelectedCategory(getCategoryFromSlug(categoryName));
  }, [categoryName]);

  // Filter books based on category and search query
  const filteredBooks = useMemo(() => {
    // const filteredBooks = books.filter((book) => {
    return books.filter((book) => {
      // Category filter
      let categoryMatch = true;
      if (selectedCategory !== "All") {
        const query = selectedCategory.toLowerCase();
        const matchesType = book.type && book.type.toLowerCase() === query;
        const matchesName =
          book.name && book.name.toLowerCase().includes(query);
        const matchesDescription =
          book.description && book.description.toLowerCase().includes(query);
        categoryMatch = matchesType || matchesName || matchesDescription;
      }

      // Search query filter
      let searchMatch = true;
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        searchMatch =
          (book.name && book.name.toLowerCase().includes(search)) ||
          (book.description &&
            book.description.toLowerCase().includes(search)) ||
          (book.type && book.type.toLowerCase().includes(search));
        // (book.isbn && book.isbn.toLowerCase().includes(search));
      }

      return categoryMatch && searchMatch;
    });
  }, [books, selectedCategory, searchQuery]);

  useEffect(() => {
    dispatch(fetchBooks());
    const interval = setInterval(() => {
      dispatch(fetchBooks());
      // console.log("Filtered Books: down");
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Fetch pending requests count for admin notifications
  useEffect(() => {
    dispatch(fetchDropRequests());
    const interval = setInterval(() => {
      dispatch(fetchDropRequests());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Fetch return requests from adminNotifications
  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        const response = await fetch(
          `https://book-app-339c8-default-rtdb.firebaseio.com/adminNotifications.json`,
        );
        const data = await response.json();

        if (data) {
          const requests = Object.entries(data)
            .filter(
              ([_, notification]) =>
                notification.type === "return_request" &&
                notification.status === "pending",
            )
            .map(([id, notification]) => ({ id, ...notification }));

          setReturnRequests(requests);
        } else {
          setReturnRequests([]);
        }
      } catch (error) {
        console.error("Error fetching return requests:", error);
        setReturnRequests([]);
      }
    };

    fetchReturnRequests();

    const interval = setInterval(() => {
      fetchReturnRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update admin notification count based on pending drop requests AND return requests
  useEffect(() => {
    const pendingDropCount = requests.filter(
      (req) => req.status === "pending",
    ).length;
    const pendingReturnCount = returnRequests.length;
    const totalCount = pendingDropCount + pendingReturnCount;
    dispatch(setAdminNotificationCount(totalCount));
  }, [requests, returnRequests, dispatch]);

  // Validate token periodically
  useEffect(() => {
    // Validate immediately on mount
    dispatch(validateToken());

    // Validate every 5 minutes
    const interval = setInterval(
      () => {
        dispatch(validateToken());
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-purple-600 to-pink-600 overflow-x-hidden">
      <Nav />
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="p-10 sm:p-10 md:p-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-x-6 md:gap-y-10">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => <BookCard key={book.id} book={book} />)
        ) : (
          <div className="col-span-full text-center text-white text-base sm:text-lg py-6 sm:py-10">
            No books found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
