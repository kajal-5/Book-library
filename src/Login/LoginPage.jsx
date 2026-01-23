import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Store/authSlice";
import { loadCartFromFirebase } from "../Store/CartSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token, role, email } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  /* ================= ROLE BASED REDIRECT ================= */
  useEffect(() => {
    if (!token || !role) return;

    // Load user's cart from Firebase after successful login
    if (email && role === "user") {
      dispatch(loadCartFromFirebase(email));
    }

    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/user", { replace: true });
    }
  }, [token, role, email, navigate, dispatch]);

  /* ================= CLEAR FORM ON ERROR ================= */
  useEffect(() => {
    if (error) {
      setFormData({ email: "", password: "" });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <img
        src="/Login-img1.png"
        alt="Books Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>

      <div className="relative z-10 w-[95%] sm:w-[90%] md:w-[800px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-[50%]">
          <img
            src="/Login-img.png"
            alt="login"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-[60%] p-4 sm:p-6 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 sm:mb-6 text-center">
            Login
          </h2>

          {/* {error && (
            <p className="text-red-600 text-sm mb-4 text-center">
              {error}
            </p>
          )} */}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
            <div>
              <label className="block mb-1 text-sm sm:text-base">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm sm:text-base">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <div className="mt-3 sm:mt-4 text-center space-y-2">
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-blue-700 cursor-pointer hover:underline text-xs sm:text-sm"
            >
              Forgot Password?
            </p>

            <p
              onClick={() => navigate("/signup")}
              className="text-blue-700 cursor-pointer hover:underline text-sm sm:text-base"
            >
              Create an account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
