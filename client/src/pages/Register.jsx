import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/users/register", { name, email, password });
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create an account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">Start your journey with a secure account</p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-shadow shadow-sm hover:shadow-md"
            placeholder="you@example.com"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Choose a secure password"
          />
          <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-8 text-sm text-gray-500">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60 transition-transform active:scale-95"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;
