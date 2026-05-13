import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) return setError("Please enter your email.");

    setLoading(true);
    try {
      await API.post('/users/forgot-password', { email });
      setMessage('OTP sent to your email.');
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 700);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Forgot password</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">Enter your email to receive an OTP</p>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded mb-4">{error}</div>}
      {message && <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/30 p-3 rounded mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
