import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";
import logo from "../assets/logo.png";
import authpic from "../assets/authpic.png";
import authicon from "../assets/authicon.svg";

const SignupPage = () => {
  const { authUser, isSigningUp, signup } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (formData) => {
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is Required");
    if (formData.password.length < 6)
      return toast.error("Password length should be greater than 5");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm(formData);

    if (success === true) signup(formData);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section (Form) */}
      <div className="w-full md:w-3/5 flex flex-col justify-center items-center p-8 bg-white">
        <span className="text-red-600 ml-2">
          <img src={logo} alt="Logo" className="h-20 object-contain" />
        </span>
        <h1 className="text-3xl font-semibold mb-2 text-center flex items-center">
          Welcome <img src={authicon} alt="Auth" className="w-10 h-10 ml-2" />
        </h1>
        <p className="text-gray-500 mt-2 text-center max-w-sm">
          Create an account and manage your inventory with ease.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-6">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border bg-[#f8f8f8] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-3 border bg-[#f8f8f8] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border bg-[#f8f8f8] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 border bg-[#f8f8f8] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 flex justify-center"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600">
            Log In
          </Link>
        </p>
      </div>

      {/* Right Section (Image) */}
      <div className="hidden md:flex w-2/5 justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${authpic})` }}>
              
            </div>
    </div>
  );
};

export default SignupPage;
