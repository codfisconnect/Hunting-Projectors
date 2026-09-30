import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ fullName, email, phoneNumber, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-eyebrow">
            <ShieldCheck size={14} />
            HUNTING CLIENT REGISTRATION
          </span>
          <h1 className="auth-title">Create Account.</h1>
          <p className="auth-subtitle">
            Join the Hunting community for priority showroom bookings, direct order tracking, and brand warranty coverage.
          </p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-name">Full Name</label>
            <div className="auth-input-wrapper">
              <UserIcon size={18} className="auth-input-icon" />
              <input
                id="reg-name"
                type="text"
                required
                className="auth-input"
                placeholder="Ramesh Kumar"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-email">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="reg-email"
                type="email"
                required
                className="auth-input"
                placeholder="ramesh@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-phone">Phone Number (Optional)</label>
            <div className="auth-input-wrapper">
              <Phone size={18} className="auth-input-icon" />
              <input
                id="reg-phone"
                type="tel"
                className="auth-input"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-password">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="reg-password"
                type="password"
                required
                className="auth-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          Already registered with Hunting?
          <Link to="/login" state={{ from: location.state?.from }} className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
