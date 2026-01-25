import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createDropRequest } from "../Store/RequestSlice";
import Nav from "./Nav";

const DropBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.email);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    mrpPrice: "",
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

  // Calculate 70% of MRP price * quantity (amount user will receive)
  const calculatedPayment = form.mrpPrice && form.quantity ? (parseFloat(form.mrpPrice) * 0.7 * parseInt(form.quantity)).toFixed(2) : "0";

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
      const requestData = {
        userEmail: userEmail || "unknown",
        date: new Date().toISOString(),
        name: trimmedName,
        description: form.description.trim(),
        type: finalCategory,
        mrpPrice: parseFloat(form.mrpPrice),
        price: parseFloat(calculatedPayment), // 70% of MRP - amount user receives
        quantity: Number(form.quantity),
        imageUrl: form.imageUrl,
      };
      await dispatch(createDropRequest(requestData));
      setForm({
        name: "",
        description: "",
        type: "",
        mrpPrice: "",
        quantity: "",
        imageUrl: "",
      });
      setCustomCategory("");
      setShowCustomInput(false);
      navigate("/user");
    } catch (error) {
      console.error("Error submitting drop request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/user");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-300 to-pink-600 flex flex-col relative">
      {/* Background Image with Opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/DropBookImg.png')" }}
      ></div>
      
      <div className="relative z-20">
        <Nav />
      </div>
      <div className="flex-1 flex justify-center items-center p-3 sm:p-4 md:p-6 relative z-10">
      <div className="w-full max-w-5xl min-h-[55vh] rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 bg-indigo-100 backdrop-blur-sm">
        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="md:w-[60%] bg-gradient-to-br from-blue-300 to-purple-500 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
          <h2 className="text-xl sm:text-2xl py-2 sm:py-3 font-bold text-gray-900 text-center mb-3 sm:mb-4 bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">Drop a Book</h2>
          <div className="space-y-3 sm:space-y-4">
            <input 
              type="text" 
              name="name" 
              placeholder="Book Name" 
              value={form.name} 
              onChange={handleChange} 
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all" 
              required 
            />
            <textarea 
              name="description" 
              placeholder="Book Description" 
              value={form.description} 
              onChange={handleChange} 
              rows={2}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all resize-none" 
            />
            <select
              name="type"
              value={showCustomInput ? "Other" : form.type}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Category</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
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
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all" 
                required 
              />
            )}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <input 
                type="number" 
                name="mrpPrice" 
                placeholder="MRP Price" 
                value={form.mrpPrice} 
                onChange={handleChange} 
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all" 
                min={50} 
                required 
              />
              <input 
                type="number" 
                name="quantity" 
                placeholder="Quantity" 
                value={form.quantity} 
                onChange={handleChange} 
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all" 
                min={1} 
                required 
              />
            </div>
            <div className="bg-rose-50 border-2 border-rose-300 rounded-lg px-3 py-2 text-xs sm:text-sm">
              <span className="font-semibold text-rose-700">💰 You will receive: ₹{calculatedPayment}</span>
              <span className="text-rose-600 text-xs ml-2">(70% of MRP × Quantity)</span>
            </div>
            <input 
              type="text" 
              name="imageUrl" 
              placeholder="Image URL" 
              value={form.imageUrl} 
              onChange={handleChange} 
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all" 
              required 
            />
            <div className="flex justify-between mt-3 sm:mt-4">
              <button 
                type="button" 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg" 
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-800 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </form>
        {/* ================= PREVIEW CARD ================= */}
        <div className="md:w-[40%] flex flex-col items-center justify-center bg-gradient-to-br from-purple-300 to-pink-300 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Preview</h2>
          <div className="w-52 h-72 sm:w-60 sm:h-80 md:w-64 md:h-80 bg-white rounded-lg shadow-xl overflow-hidden border-2 border-gray-200">
            {form.imageUrl ? (
              <div className="w-full h-40 sm:h-44 md:h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <img src={form.imageUrl} alt="Book" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="h-40 sm:h-44 md:h-48 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-sm sm:text-base">No Image</span>
              </div>
            )}
            <div className="p-2 sm:p-3">
              <h4 className="font-bold text-sm sm:text-base text-gray-800 truncate">{form.name || "Book Name"}</h4>
              {form.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">{form.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">MRP: ₹{form.mrpPrice || "0"}</p>
              <p className="text-sm text-green-700 font-bold">You Get: ₹{calculatedPayment}</p>
              <p className="text-sm text-gray-700 font-semibold">Quantity: {form.quantity || "0"}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DropBook;
