import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/signup", form);

      // 🔑 Save JWT
      localStorage.setItem("token", res.data.token);

      // 🚀 Redirect to todos
      navigate("/todos");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b12] relative overflow-hidden px-4">

      {/* background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_80px_-20px_rgba(124,58,237,0.6)]">

        <h1 className="text-3xl font-semibold text-center">
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Create your account
          </span>
        </h1>

        <p className="text-center text-gray-400 text-sm mt-2">
          Plan smarter. Live lighter.
        </p>

        {/* 🔴 Error message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-500/20 text-red-300 text-sm px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* Name */}
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
            placeholder="Full name"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Email address"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3 font-medium text-white transition hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
