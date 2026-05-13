import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import AuthLayout from "../components/AuthLayout";

export default function VerifyOtp() {
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !otp) return setError('Please provide email and OTP.');

    setLoading(true);
    try {
      await API.post('/users/verify-otp', { email, otp });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Verify OTP</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">Enter the 6-digit OTP sent to your email</p>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">OTP</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="123456" required />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
