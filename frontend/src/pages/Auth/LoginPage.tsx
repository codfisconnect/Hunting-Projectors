import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, HelpCircle, PhoneCall, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import './Auth.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery modal views: null | 'forgot_password' | 'forgot_email'
  const [modalMode, setModalMode] = useState<'forgot_password' | 'forgot_email' | null>(null);
  const [modalEmail, setModalEmail] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalMsg, setModalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const from = redirectParam || (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });

      // If user is ADMIN and attempting to access admin or redirected
      if (user.role === 'ADMIN' && (redirectParam === '/admin' || from.startsWith('/admin'))) {
        navigate('/admin', { replace: true });
        return;
      }

      // If non-admin user tried to access admin
      if (user.role !== 'ADMIN' && (redirectParam === '/admin' || from.startsWith('/admin'))) {
        setError('Access denied: Administrator privileges required to access /admin.');
        setIsSubmitting(false);
        return;
      }

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalSubmitting) return;
    setModalSubmitting(true);
    setModalMsg(null);

    try {
      const res = await authService.forgotPassword(modalEmail);
      setModalMsg({ type: 'success', text: res.message });
    } catch (err: any) {
      setModalMsg({ type: 'error', text: err.message || 'Failed to submit password reset request.' });
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-eyebrow">
            <ShieldCheck size={14} />
            HUNTING CLIENT PRIVILEGE
          </span>
          <h1 className="auth-title">Welcome Back.</h1>
          <p className="auth-subtitle">
            Sign in to track orders, manage deliveries, and access your management dashboard.
          </p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="auth-success-banner" role="alert">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">EMAIL ADDRESS</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="login-email"
                type="email"
                required
                className="auth-input"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="login-password">PASSWORD</label>
              <button
                type="button"
                className="auth-text-link"
                onClick={() => {
                  setModalMode('forgot_password');
                  setModalEmail(email);
                  setModalMsg(null);
                }}
              >
                FORGOT PASSWORD?
              </button>
            </div>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-recovery-row">
          <button
            type="button"
            className="auth-secondary-link"
            onClick={() => {
              setModalMode('forgot_email');
              setModalMsg(null);
            }}
          >
            <HelpCircle size={14} />
            <span>Forgot your login email?</span>
          </button>
        </div>

        <div className="auth-footer">
          Don't have a Hunting account yet?
          <Link to="/register" state={{ from: location.state?.from }} className="auth-link">
            Create Account
          </Link>
        </div>
      </div>

      {/* MODAL: FORGOT PASSWORD */}
      {modalMode === 'forgot_password' && (
        <div className="auth-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="auth-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Reset Your Password</h3>
              <button type="button" className="modal-close" onClick={() => setModalMode(null)}>✕</button>
            </div>

            {modalMsg && (
              <div className={modalMsg.type === 'success' ? 'auth-success-banner' : 'auth-error-banner'}>
                {modalMsg.text}
              </div>
            )}

            <p className="modal-desc">
              Enter your registered email address. If an account is found, we will dispatch a secure 15-minute single-use password reset link.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
              <div className="auth-field">
                <label className="auth-label" htmlFor="forgot-email">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    className="auth-input"
                    placeholder="name@example.com"
                    value={modalEmail}
                    onChange={e => setModalEmail(e.target.value)}
                    disabled={modalSubmitting}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalMode(null)} disabled={modalSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={modalSubmitting}>
                  {modalSubmitting ? 'Sending Request...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FORGOT LOGIN EMAIL */}
      {modalMode === 'forgot_email' && (
        <div className="auth-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="auth-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Forgot Login Email?</h3>
              <button type="button" className="modal-close" onClick={() => setModalMode(null)}>✕</button>
            </div>

            <div className="modal-body-content">
              <p className="modal-desc">
                Your login identity is the registered email address used when placing an order or registering your showroom warranty.
              </p>

              <div className="auth-support-box">
                <div className="support-box-icon">
                  <PhoneCall size={22} />
                </div>
                <div>
                  <h4 className="support-box-title">Contact Account Recovery Support</h4>
                  <p className="support-box-desc">
                    For identity verification and account lookup, please connect with our Chennai specialist team on WhatsApp or telephone with your order invoice number.
                  </p>
                  <a
                    href="https://wa.me/919444012345?text=Hello%20NAP%20Computers,%20I%20need%20help%20recovering%20my%20account%20login%20email."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary support-action-btn"
                  >
                    Chat With Account Support
                  </a>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setModalMode(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
