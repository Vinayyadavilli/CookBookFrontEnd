import { useState } from 'react';
import { ChefHat, Lock, Mail, Eye, EyeOff, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { C } from '@/shared/theme/tokens';
import { adminLogin } from '../api';
import '../admin.css';

export default function AdminLoginScreen({ onNavigate, onAdminAuthSuccess }) {
  const [email, setEmail] = useState('admin@cookbook.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await adminLogin(email, password);
      if (res?.access_token) {
        if (onAdminAuthSuccess) onAdminAuthSuccess(res);
        if (onNavigate) onNavigate('admin');
      } else {
        setError('Invalid admin credentials or access denied.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 440, width: '100%', background: '#121624', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', padding: '40px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
        
        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(255,107,53,0.4)', marginBottom: 16 }}>
            <ChefHat size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>CookBook Admin Portal</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Restricted access for platform administrators only.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13, fontWeight: 500, marginBottom: 24 }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 8 }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@cookbook.in"
                className="admin-input"
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="admin-input"
                style={{ paddingLeft: 42, paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8, fontSize: 15 }}
          >
            {loading ? 'Authenticating Admin...' : 'Sign In to Admin Dashboard'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer info */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Shield size={12} color={C.green} /> Encrypted 256-bit Admin Authentication
          </div>
        </div>
      </div>
    </div>
  );
}
