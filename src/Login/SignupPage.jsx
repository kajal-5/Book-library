
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../Store/authSlice";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // ✅ trim + normalize email
    const trimmedEmail = formData.email.trim().toLowerCase();

    dispatch(
      signupUser({
        email: trimmedEmail,
        password: formData.password,
        name: formData.name.trim(),
        contactNo: formData.contactNo.trim(),
        address: formData.address.trim(),
        role: "user", // ✅ NEW: save role as user
      })
    );
  }

  // ✅ clear inputs if signup fails (existing logic)
  useEffect(() => {
    if (error) {
      setFormData({
        name: "",
        contactNo: "",
        address: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [error]);

  // ✅ NEW: navigate to HOME after successful signup
  useEffect(() => {
    if (isAuthenticated || token) {
      navigate("/");
    }
  }, [isAuthenticated, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <img
        src="/Login-img1.png"
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>

      <div className="relative z-10 w-[95%] sm:w-[90%] md:w-[800px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-[50%]">
          <img
            src="/createAccountImg.png"
            alt="signup"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-[60%] p-4 sm:p-6 md:p-10 flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 sm:mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 flex-grow">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              required
            />

            <input
              type="tel"
              name="contactNo"
              placeholder="Contact Number"
              value={formData.contactNo}
              onChange={handleChange}
              pattern="[0-9]{10}"
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm sm:text-base"
            >
              {loading ? "Creating..." : "Signup"}
            </button>
          </form>

          <div className="mt-3 sm:mt-4 text-center">
            <p
              onClick={() => navigate("/login")}
              className="text-blue-700 cursor-pointer hover:underline text-sm sm:text-base"
            >
              Back to Login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
