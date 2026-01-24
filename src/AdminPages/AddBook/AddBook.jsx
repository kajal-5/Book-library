import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBook } from "../../Store/BookSlice";
import Nav from "../Nav";

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      if (value === "Other") {
        setShowCustomInput(true);
        setForm({ ...form, [name]: customCategory });
      } else {
        setShowCustomInput(false);
        setCustomCategory("");
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      alert("Book name cannot be empty or just spaces.");
      return;
    }
    if (!form.imageUrl) {
      alert("Image URL is required.");
      return;
    }
    const finalCategory = showCustomInput ? customCategory.trim() : form.type.trim();
    if (!finalCategory) {
      alert("Please select or enter a category!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const bookData = {
        name: trimmedName,
        description: form.description.trim(),
        type: finalCategory,
        price: parseFloat(form.price),
        quantity: Number(form.quantity),
        imageUrl: form.imageUrl,
      };
      await dispatch(addBook(bookData));
      setForm({
        name: "",
        description: "",
        type: "",
        price: "",
        quantity: "",
        imageUrl: "",
      });
      setCustomCategory("");
      setShowCustomInput(false);
      navigate("/admin");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-300 to-pink-600 flex flex-col">
      <Nav />
      <div className="flex-1 flex justify-center items-center p-6">
      <div className="w-full max-w-5xl rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 bg-indigo-100 backdrop-blur-sm">
        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="md:w-[60%] bg-gradient-to-br from-blue-500 via-purple-500  to-pink-500 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl py-4 font-bold text-gray-800 text-center mb-6 bg-gradient-to-r from-red-950 to-purple-800 bg-clip-text text-transparent">Add New Book</h2>
          <div className="space-y-3">
            <input 
              type="text" 
              name="name" 
              placeholder="Book Name" 
              value={form.name} 
              onChange={handleChange} 
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              required 
            />
            <textarea 
              name="description" 
              placeholder="Book Description" 
              value={form.description} 
              onChange={handleChange} 
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
              rows="3" 
              required 
            />
            <select
              name="type"
              value={showCustomInput ? "Other" : form.type}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all "
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
            {showCustomInput && (
              <input 
                type="text" 
                placeholder="Enter custom category" 
                value={customCategory} 
                onChange={(e) => setCustomCategory(e.target.value)} 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                required 
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                name="price" 
                placeholder="Price" 
                value={form.price} 
                onChange={handleChange} 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                min={50} 
                required 
              />
              <input 
                type="number" 
                name="quantity" 
                placeholder="Quantity" 
                value={form.quantity} 
                onChange={handleChange} 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                min={1} 
                required 
              />
            </div>
            <input 
              type="text" 
              name="imageUrl" 
              placeholder="Image URL" 
              value={form.imageUrl} 
              onChange={handleChange} 
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              required 
            />
          </div>
          {/* BUTTONS */}
          <div className="flex justify-between mt-10 gap-6">
            <button 
              type="button" 
              className="flex-1 bg-gray-600 text-white px-6 py-2.5 text-sm font-semibold rounded-lg hover:bg-gray-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105" 
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-700 to-purple-800 text-white px-6 py-2.5 text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        {/* ================= PREVIEW CARD ================= */}
        <div className="md:w-[40%] flex flex-col items-center justify-center rounded-xl p-6 bg-gradient-to-br from-purple-400 to-pink-50 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Preview</h3>
          <div className="w-64 bg-white rounded-xl shadow-xl overflow-hidden border-2 border-gray-200 hover:shadow-lg transition-all">
            {form.imageUrl ? (
              <div className="w-full h-72 bg-gray-100 flex items-center justify-center">
                <img src={form.imageUrl} alt="Book" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                <span className="text-lg">No Image</span>
              </div>
            )}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h4 className="font-bold text-xl mb-3 text-gray-800 truncate">{form.name || "Book Name"}</h4>
              {form.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{form.description}</p>
              )}
              <p className="text-lg font-bold text-green-600 mb-1">₹{form.price || "0"}</p>
              <p className="text-sm text-gray-600 mb-1">Quantity: {form.quantity || "0"}</p>
              {form.mobileNo && (
                <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">{form.mobileNo}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AddBook;
