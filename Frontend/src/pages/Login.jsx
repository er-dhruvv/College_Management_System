import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

function Login() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [role, setRole] = useState("Student");

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  async function loginHandler(e) {
    e.preventDefault();

    try {
      let res = await axios.post(
        `${API_BASE}/login`,
        {
          role,
          username: username.trim(),
          password: password.trim(),
        },
        {
          withCredentials: true,
        },
      );
      console.log(res);

      if (res.data.success) {
        showNotification(res.data.message, "success");
        res.data.role === "Student"
          ? navigate("/DashboardStudent")
          : navigate("/DashboardFaculty");
      } else {
        showNotification(res.data.message || "Login failed", "error");
      }

      setusername("");
      setpassword("");
      setRole("Student");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
      {/* Wrapper */}
      <div className="flex bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden max-w-4xl w-full">
        {/* Image Section - Updated background and padding */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-16">
          {/* Image - Updated size and padding for proper centering and prominence */}
          <img 
            src="/logo.png" 
            alt="logo" 
            className="w-[350px] object-contain" // Adjusted size for proper presentation
          />
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
            Login
          </h1>

          <form onSubmit={loginHandler} className="space-y-5">
            {/* Role */}
            <div>
              <p className="font-semibold mb-2">Role:</p>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="faculty"
                    checked={role === "faculty"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Faculty
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="Student"
                    checked={role === "Student"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Student
                </label>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block mb-1 font-medium">Enter Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder={
                  "Enter username"
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Enter Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;