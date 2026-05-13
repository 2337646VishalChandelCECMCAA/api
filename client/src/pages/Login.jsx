import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import heroImage from "../assets/hero.png";

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
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-hero" aria-label="Login inspiration panel">
          <div className="auth-hero-media">
            <img src={heroImage} alt="Abstract stacked platform artwork" className="auth-hero-image" />
            <div className="auth-hero-overlay" />

            <div className="auth-hero-top">
              <div className="auth-brand">USER API</div>
              <Link to="/" className="auth-back-link">
                Back to website
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="auth-hero-copy">
              <p>Secure access, wrapped in a calm violet interface.</p>
              <div className="auth-hero-dots" aria-hidden="true">
                <span />
                <span />
                <span className="is-active" />
              </div>
            </div>
          </div>
        </aside>

        <div className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-header">
              <h1>Welcome back</h1>
              <p>
                Sign in to continue to your account. New here? <Link to="/register">Create one</Link>
              </p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email" className="auth-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <div className="auth-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input auth-input-with-icon"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="auth-password-toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M3.98 8.223A11.13 11.13 0 0 1 12 5.25c5.002 0 8.907 3.02 10.02 6.75a10.53 10.53 0 0 1-2.22 3.62M6.65 6.65l10.7 10.7M9.5 9.5a3.5 3.5 0 1 0 4.95 4.95"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M2.5 12s3.75-6.75 9.5-6.75S21.5 12 21.5 12s-3.75 6.75-9.5 6.75S2.5 12 2.5 12Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="auth-row">
                <label className="auth-remember">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember((current) => !current)}
                    className="auth-checkbox"
                  />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot-password" className="auth-inline-link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? <span className="auth-spinner" aria-hidden="true" /> : "Sign in"}
              </button>
            </form>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="auth-social">
              <button type="button" className="auth-social-button">
                <span className="auth-social-icon google" aria-hidden="true">
                  G
                </span>
                Google
              </button>
              <button type="button" className="auth-social-button">
                <span className="auth-social-icon apple" aria-hidden="true">
                  
                </span>
                Apple
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}