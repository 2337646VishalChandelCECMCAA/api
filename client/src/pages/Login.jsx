import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await API.post("/users/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);

      if (remember) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Sign in to continue to your account</p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pr-16 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
            placeholder="Your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-[2.5rem] text-sm font-medium text-gray-500 transition hover:text-indigo-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={() => setRemember((r) => !r)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/register" className="text-sm font-medium text-indigo-600 hover:underline">
              Create account
            </Link>
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">
              Forgot password?
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60 active:scale-95"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path
                    fill="currentColor"
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}