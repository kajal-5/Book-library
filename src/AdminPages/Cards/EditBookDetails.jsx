import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBook } from "../../Store/BookSlice";

const EditBookDetails = ({ book, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [editForm, setEditForm] = useState({
    name: book.name || "",
    description: book.description || "",
    type: book.type || "",
    price: book.price || "",
    quantity: book.quantity || "",
    imageUrl: book.imageUrl || "",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      if (value === "Other") {
        setShowCustomInput(true);
        setEditForm({ ...editForm, [name]: customCategory });
      } else {
        setShowCustomInput(false);
        setCustomCategory("");
        setEditForm({ ...editForm, [name]: value });
      }
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = editForm.name.trim();
    if (!trimmedName) {
      alert("Book name cannot be empty!");
      return;
    }
    const finalCategory = showCustomInput ? customCategory.trim() : editForm.type.trim();
    if (!finalCategory) {
      alert("Please select or enter a category!");
      return;
    }
    try {
      await dispatch(
        updateBook({
          bookId: book.id,
          bookData: {
            name: trimmedName,
            description: editForm.description.trim(),
            type: finalCategory,
            price: parseFloat(editForm.price),
            quantity: Number(editForm.quantity),
            imageUrl: editForm.imageUrl,
            createdAt: book.createdAt,
          },
        })
      ).unwrap();
      alert("Book updated successfully!");
      onClose();
    } catch (error) {
      alert("Failed to update book: " + error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border-4 border-white" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-5 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-1">Edit Book</h2>
              <p className="text-blue-100 text-sm">Update book information</p>
            </div>
            <button 
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleEditSubmit} className="p-8 space-y-5">
            {/* Book Name */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 w-32 flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Book Name
              </label>
              <input 
                type="text" 
                name="name" 
                placeholder="Enter book name" 
                value={editForm.name} 
                onChange={handleEditChange} 
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:border-purple-300 bg-white" 
                required 
              />
            </div>

            {/* Description */}
            <div className="flex items-start gap-4">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 w-32 flex-shrink-0 pt-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </label>
              <textarea 
                name="description" 
                placeholder="Enter book description" 
                value={editForm.description} 
                onChange={handleEditChange} 
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none shadow-sm hover:border-purple-300 bg-white" 
                rows="3" 
                required 
              />
            </div>

            {/* Category */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 w-32 flex-shrink-0">
                <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category
              </label>
              <select
                name="type"
                value={showCustomInput ? "Other" : editForm.type}
                onChange={handleEditChange}
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:border-purple-300 bg-white"
                required
              >
                <option value="">Select Category</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Comics">Comics</option>
                <option value="Literature">Literature</option>
                <option value="Real-Life Stories">Real-Life Stories</option>
                <option value="Spiritual">Spiritual</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
                <option value="Short Stories">Short Stories</option>
                <option value="Art & Design">Art & Design</option>
                <option value="Travel">Travel</option>
                <option value="Wellness">Wellness</option>
                <option value="Cooking">Cooking</option>
                <option value="Other">Other (Custom)</option>
              </select>
            </div>

            {/* Custom Category Input */}
            {showCustomInput && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 w-32 flex-shrink-0">
                  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Custom Type
                </label>
                <input 
                  type="text" 
                  placeholder="Enter custom category" 
                  value={customCategory} 
                  onChange={(e) => setCustomCategory(e.target.value)} 
                  className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:border-purple-300 bg-white" 
                  required 
                />
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 w-32 flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Price
              </label>
              <input 
                type="number" 
                name="price" 
                placeholder="₹ Price" 
                value={editForm.price} 
                onChange={handleEditChange} 
                className="w-40 border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:border-purple-300 bg-white" 
                min={50} 
                required 
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 w-32 flex-shrink-0">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Quantity
              </label>
              <input 
                type="number" 
                name="quantity" 
                placeholder="Quantity" 
                value={editForm.quantity} 
                onChange={handleEditChange} 
                className="w-40 border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:border-purple-300 bg-white" 
                min={1} 
                required 
              />
            </div>

            {/* Image URL */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 w-32 flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Image URL
              </label>
              <input 
                type="text" 
                name="imageUrl" 
                placeholder="Enter image URL" 
                value={editForm.imageUrl} 
                onChange={handleEditChange} 
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:border-purple-300 bg-white" 
                required 
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Update Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookDetails;
