import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteBook } from "../../Store/BookSlice";
import EditBookDetails from "./EditBookDetails";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.name}"?`)) {
      try {
        await dispatch(deleteBook(book.id)).unwrap();
        alert("Book deleted successfully!");
      } catch (error) {
        alert("Failed to delete book: " + error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-lg border-2 sm:border-4 border-gray-200 md:hover:scale-x-120 md:hover:scale-y-110  hover:scale-120 transition duration-300 overflow-hidden">
      {book.imageUrl ? (
        <img
          src={book.imageUrl}
          alt={book.name}
          className="w-full h-40 sm:h-48 md:h-60 object-cover"
        />
      ) : (
        <div className="w-full h-40 sm:h-48 md:h-60 flex items-center justify-center bg-gray-200">
          <span className="text-gray-400">No Image</span>
        </div>
      )}

      <div className="p-2 sm:p-3 md:p-4 bg-[#FAF7F3]">
        <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">{book.name}</h3>
        {book.description && (
          <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1 line-clamp-2">{book.description}</p>
        )}
        <p className="text-xs sm:text-sm text-gray-600 mt-1 md:mt-0">{book.type}</p>
        <div className="flex items-center justify-between mt-1">
              <p className="text-lg font-bold text-green-600">₹ {book.price}</p>
        {book.quantity && (
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-700 mt-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-medium">Quantity: {book.quantity}</span>
          </div>
        )}
        </div>

        {book.contactName && (
          <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Contact: {book.contactName}</p>
        )}
        {book.mobileNo && (
          <p className="text-[10px] sm:text-xs text-gray-600">Mobile: {book.mobileNo}</p>
        )}

        <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-4">
          <button 
            onClick={handleEdit}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

      {/* Use EditBookDetails Component */}
      <EditBookDetails 
        book={book}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
      />
    </>
  );
};

export default BookCard;
