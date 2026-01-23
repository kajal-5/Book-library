import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../Store/authSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      alert("Email is required");
      return;
    }
    dispatch(forgotPassword(email));
    setEmail("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background image */}
      <img
        src="/Login-img1.png"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>

      {/* Card */}
      <div className="relative z-10 w-[90%] md:w-[800px] bg-white rounded-lg shadow-2xl flex overflow-hidden">
        {/* Left image */}
        <div className="hidden md:block w-[50%]">
          <img
            src="/Login-img.png"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right form */}
        <div className="w-full md:w-[60%] p-8">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
            Forgot Password
          </h2>

          <p className="text-gray-600 text-center mb-6 text-sm">
            Enter your registered email to receive password reset instructions
          </p>

          {error && (
            <p className="text-red-600 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <button
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to login */}
          <p
            onClick={() => navigate("/login")}
            className="text-center text-blue-700 mt-6 cursor-pointer hover:underline"
          >
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
