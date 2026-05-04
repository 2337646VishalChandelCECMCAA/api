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
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Sign in to continue to your account</p>
        </div>
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-700 rounded-lg flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8H9L12 2Z" fill="#6366F1"/><path d="M12 22L9 16H15L12 22Z" fill="#8B5CF6"/></svg>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-shadow shadow-sm hover:shadow-md"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Your password"
            required
          />
          <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-8 text-sm text-gray-500">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input id="remember" type="checkbox" checked={remember} onChange={() => setRemember(r => !r)} className="h-4 w-4 text-indigo-600 rounded" />
            <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300">Remember me</label>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/register" className="text-sm text-indigo-600 hover:underline">Create account</Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60 transition-transform transform active:scale-95"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              ) : 'Sign in'}
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import AuthLayout from "../components/AuthLayout";

function Login() {
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
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

        return (
            <AuthLayout>
                <div>
                    {/** content rendered inside card via AuthLayout */}
                </div>
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Welcome back</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Sign in to continue to your account</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-700 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8H9L12 2Z" fill="#6366F1"/><path d="M12 22L9 16H15L12 22Z" fill="#8B5CF6"/></svg>
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded mb-4">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-shadow shadow-sm hover:shadow-md"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-shadow shadow-sm hover:shadow-md"
                            placeholder="Your password"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-8 text-sm text-gray-500">
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input id="remember" type="checkbox" checked={remember} onChange={() => setRemember(r => !r)} className="h-4 w-4 text-indigo-600 rounded" />
                            <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300">Remember me</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link to="/register" className="text-sm text-indigo-600 hover:underline">Create account</Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60 transition-transform transform active:scale-95"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                                ) : 'Sign in'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;