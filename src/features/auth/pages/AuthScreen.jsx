import { useState, useEffect } from 'react'
import { ChefHat, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { loginWithPassword, sendOtp, loginWithOtp, register, verifyEmailOtp } from '../api'

function passwordStrength(pw) {
  if (!pw) return { level: 0, label: '', color: '#EBEBEB' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: 'Too short', color: '#FC5C65' },
    { label: 'Weak', color: '#FC5C65' },
    { label: 'Fair', color: '#F6C90E' },
    { label: 'Good', color: '#48BB78' },
    { label: 'Strong', color: '#38A169' },
  ]
  return { level: score, ...map[score] }
}

function Field({ label, type = 'text', placeholder, value, onChange, error, right }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2D3748', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: right ? '12px 44px 12px 14px' : '12px 14px',
            borderRadius: 12,
            border: `1.5px solid ${error ? '#FC5C65' : focused ? '#FF6B35' : '#EBEBEB'}`,
            outline: 'none',
            fontSize: 14,
            color: '#1A202C',
            background: '#fff',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s',
            boxShadow: focused ? '0 0 0 3px rgba(255,107,53,0.1)' : 'none',
          }}
        />
        {right && (
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
            {right}
          </div>
        )}
      </div>
      {error && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#FC5C65' }}>{error}</p>}
    </div>
  )
}

function LoginForm({ onSwitch, onComplete }) {
  const [loginMode, setLoginMode] = useState('password') // 'password' | 'otp'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let interval = null
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [otpSent, resendTimer])

  async function handleSendLoginOtp() {
    if (!email.includes('@')) {
      setErrors({ email: 'Enter a valid email address' })
      return
    }
    setSubmitting(true)
    setErrors({})
    try {
      await sendOtp(email, 'login')
      setOtpSent(true)
      setResendTimer(30)
    } catch (err) {
      setErrors({ email: err.message || 'Failed to send OTP. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = {}
    if (!email.includes('@')) e.email = 'Enter a valid email address'
    if (loginMode === 'password' && password.length < 6) e.password = 'Password must be at least 6 characters'
    if (loginMode === 'otp' && otpCode.length < 6) e.otp = 'Enter 6-digit OTP code'
    if (Object.keys(e).length) { setErrors(e); return }

    setSubmitting(true)
    setErrors({})
    try {
      if (loginMode === 'password') {
        const response = await loginWithPassword(email, password)
        if (response.access_token && onComplete) onComplete('login')
      } else {
        const response = await loginWithOtp(email, otpCode)
        if (response.access_token && onComplete) onComplete('login')
      }
    } catch (err) {
      if (loginMode === 'password') {
        setErrors({ password: err.message || 'Invalid email or password' })
      } else {
        setErrors({ otp: err.message || 'Invalid or expired OTP' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Login Mode Switcher */}
      <div style={{ display: 'flex', background: '#F7F4F1', borderRadius: 999, padding: 4, marginBottom: 20 }}>
        <button type="button" onClick={() => { setLoginMode('password'); setOtpSent(false); setErrors({}) }}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 999, border: 'none', background: loginMode === 'password' ? '#fff' : 'transparent', color: loginMode === 'password' ? '#1A202C' : '#718096', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: loginMode === 'password' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.15s' }}>
          🔑 Password Login
        </button>
        <button type="button" onClick={() => { setLoginMode('otp'); setOtpSent(false); setErrors({}) }}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 999, border: 'none', background: loginMode === 'otp' ? '#fff' : 'transparent', color: loginMode === 'otp' ? '#1A202C' : '#718096', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: loginMode === 'otp' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.15s' }}>
          📲 OTP Login
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: '' })) }} error={errors.email} />

        {loginMode === 'password' && (
          <>
            <Field
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: '' })) }}
              error={errors.password}
              right={
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#A0AEC0', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <a href="#" style={{ fontSize: 13, color: '#FF6B35', fontWeight: 500, textDecoration: 'none' }}>Forgot password?</a>
            </div>
          </>
        )}

        {loginMode === 'otp' && (
          <div>
            {!otpSent ? (
              <button type="button" onClick={handleSendLoginOtp} disabled={submitting}
                style={{ width: '100%', padding: '12px', borderRadius: 999, border: '2px solid #FF6B35', background: '#FFF0EA', color: '#FF6B35', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                {submitting ? 'Sending OTP…' : 'Send 6-Digit Login OTP 📩'}
              </button>
            ) : (
              <div>
                <Field label="Enter 6-Digit Email OTP" type="text" placeholder="123456" value={otpCode} onChange={(v) => { setOtpCode(v.replace(/\D/g, '').slice(0, 6)); setErrors((e) => ({ ...e, otp: '' })) }} error={errors.otp} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12 }}>
                  <span style={{ color: '#48BB78', fontWeight: 600 }}>✓ OTP sent to your email</span>
                  <button type="button" disabled={resendTimer > 0} onClick={handleSendLoginOtp}
                    style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#A0AEC0' : '#FF6B35', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontFamily: 'inherit', padding: 0 }}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(loginMode === 'password' || otpSent) && (
          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 999, border: 'none', background: submitting ? '#E55A2B' : 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(255,107,53,0.3)', transition: 'all 0.18s', letterSpacing: '0.01em' }}>
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                  <path d="M 8 2 A 6 6 0 0 1 14 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Verifying…
              </span>
            ) : (
              <>{loginMode === 'otp' ? 'Verify & Log In' : 'Log In'} <ArrowRight size={16} /></>
            )}
          </button>
        )}

        <p style={{ textAlign: 'center', fontSize: 13, color: '#718096', margin: 0, marginTop: 8 }}>
          Don't have an account?{' '}
          <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#FF6B35', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
            Create account
          </button>
        </p>
      </form>
    </div>
  )
}

function RegisterForm({ onSwitch, onComplete }) {
  const [step, setStep] = useState(1) // 1: Info, 2: OTP Verification
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const strength = passwordStrength(password)

  useEffect(() => {
    let interval = null
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendTimer])

  useEffect(() => {
    if (done && onComplete) {
      const timer = setTimeout(() => onComplete('register'), 1200)
      return () => clearTimeout(timer)
    }
  }, [done, onComplete])

  async function handleRegisterStep1(ev) {
    ev.preventDefault()
    const e = {}
    if (!name.trim()) e.name = 'Full name is required'
    if (!email.includes('@')) e.email = 'Enter a valid email address'
    if (!/^\d{10}$/.test(mobile)) e.mobile = 'Enter a valid 10-digit mobile number'
    if (strength.level < 2) e.password = 'Please choose a stronger password'
    if (!agreed) e.terms = 'You must accept the terms to continue'
    if (Object.keys(e).length) { setErrors(e); return }

    setSubmitting(true)
    setErrors({})
    try {
      await register({ name, email, mobile, password })
      setStep(2)
      setResendTimer(30)
    } catch (err) {
      setErrors({ email: err.message || 'Registration failed. Try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerifyOtpSubmit(ev) {
    ev.preventDefault()
    if (otpCode.length < 6) {
      setErrors({ otp: 'Enter valid 6-digit OTP code' })
      return
    }
    setSubmitting(true)
    setErrors({})
    try {
      await verifyEmailOtp(email, otpCode, 'register')
      setDone(true)
    } catch (err) {
      setErrors({ otp: err.message || 'Invalid or expired verification code' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResendRegisterOtp() {
    setSubmitting(true)
    setErrors({})
    try {
      await sendOtp(email, 'register')
      setResendTimer(30)
    } catch (err) {
      setErrors({ otp: err.message || 'Failed to resend code' })
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #48BB78, #38A169)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Check size={32} color="#fff" strokeWidth={2.5} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A202C', margin: '0 0 8px' }}>Email Verified & Account Created!</h3>
        <p style={{ fontSize: 14, color: '#718096', margin: 0 }}>Welcome to CookBook. Setting up your profile…</p>
      </div>
    )
  }

  if (step === 2) {
    return (
      <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ background: '#FFF0EA', border: '1px solid #FFD8C7', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A202C', marginBottom: 4 }}>Verify Email Address 📩</div>
          <div style={{ fontSize: 12, color: '#718096' }}>We sent a 6-digit OTP code to <strong style={{ color: '#FF6B35' }}>{email}</strong></div>
        </div>

        <Field label="Enter 6-Digit Email OTP" type="text" placeholder="123456" value={otpCode} onChange={(v) => { setOtpCode(v.replace(/\D/g, '').slice(0, 6)); setErrors((e) => ({ ...e, otp: '' })) }} error={errors.otp} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
          <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
            ← Edit Registration Details
          </button>
          <button type="button" disabled={resendTimer > 0 || submitting} onClick={handleResendRegisterOtp}
            style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#A0AEC0' : '#FF6B35', cursor: (resendTimer > 0 || submitting) ? 'not-allowed' : 'pointer', fontWeight: 600, fontFamily: 'inherit', padding: 0 }}>
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>

        <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 999, border: 'none', background: submitting ? '#E55A2B' : 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(255,107,53,0.3)', transition: 'all 0.18s' }}>
          {submitting ? 'Verifying OTP…' : 'Verify Email & Create Account 🚀'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleRegisterStep1} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Full name" placeholder="Priya Sharma" value={name} onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: '' })) }} error={errors.name} />
      <Field label="Email address" type="email" placeholder="priya@example.com" value={email} onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: '' })) }} error={errors.email} />
      <Field label="Mobile number" type="tel" placeholder="98765 43210" value={mobile} onChange={(v) => { setMobile(v.replace(/\D/g, '').slice(0, 10)); setErrors((e) => ({ ...e, mobile: '' })) }} error={errors.mobile} />

      <div>
        <Field
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="Create a strong password"
          value={password}
          onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: '' })) }}
          error={errors.password}
          right={
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#A0AEC0', display: 'flex' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        {password.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= strength.level ? strength.color : '#EBEBEB', transition: 'background 0.2s' }} />
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: strength.color }}>{strength.label}</span>
          </div>
        )}
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <div
            onClick={() => { setAgreed(!agreed); setErrors((e) => ({ ...e, terms: '' })) }}
            style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${errors.terms ? '#FC5C65' : agreed ? '#FF6B35' : '#EBEBEB'}`, background: agreed ? '#FF6B35' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s', cursor: 'pointer' }}
          >
            {agreed && <Check size={11} color="#fff" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: 13, color: '#718096', lineHeight: 1.5 }}>
            I agree to CookBook's{' '}
            <a href="#" style={{ color: '#FF6B35', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>{' '}
            and{' '}
            <a href="#" style={{ color: '#FF6B35', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>
          </span>
        </label>
        {errors.terms && <p style={{ margin: '4px 0 0 28px', fontSize: 12, color: '#FC5C65' }}>{errors.terms}</p>}
      </div>

      <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 999, border: 'none', background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(255,107,53,0.3)', letterSpacing: '0.01em' }}>
        Create Account <ArrowRight size={16} />
      </button>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#718096', margin: 0 }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#FF6B35', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
          Log in
        </button>
      </p>
    </form>
  )
}

export default function AuthScreen({ onComplete }) {
  const [tab, setTab] = useState('login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex: '0 0 50%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <img src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200&h=1600&fit=crop&auto=format" alt="Indian food spread" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(229,90,43,0.75) 0%, rgba(255,107,53,0.55) 40%, rgba(26,32,44,0.80) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '36px 44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={20} color="#fff" strokeWidth={2} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>CookBook</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 380 }}>
            <div style={{ width: 40, height: 3, background: '#FF6B35', borderRadius: 2, marginBottom: 28 }} />
            <blockquote style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, color: '#fff', lineHeight: 1.25, margin: 0, marginBottom: 20 }}>
              "Food is not just<br />fuel — it's the story<br />of who we are."
            </blockquote>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0 }}>Join 2.4 million home cooks discovering recipes built for their bodies.</p>
          </div>
          <div style={{ display: 'flex', gap: 20, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[{ val: '10K+', label: 'Indian Recipes' }, { val: '2.4M', label: 'Active Cooks' }, { val: '4.9★', label: 'App Rating' }].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: '0 0 50%', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '36px 36px 32px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #EBEBEB' }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A202C', margin: 0, marginBottom: 4, letterSpacing: '-0.02em' }}>
                {tab === 'login' ? 'Welcome back 👋' : 'Create your account'}
              </h1>
              <p style={{ fontSize: 14, color: '#718096', margin: 0 }}>
                {tab === 'login' ? 'Sign in to your CookBook account' : 'Start your healthy cooking journey today'}
              </p>
            </div>

            <div style={{ display: 'flex', background: '#F7F4F1', borderRadius: 12, padding: 4, marginBottom: 26 }}>
              {['login', 'register'].map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#1A202C' : '#718096', fontWeight: tab === t ? 700 : 500, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.18s ease' }}>
                  {t === 'login' ? 'Log In' : 'Register'}
                </button>
              ))}
            </div>

            {tab === 'login'
              ? <LoginForm onSwitch={() => setTab('register')} onComplete={onComplete} />
              : <RegisterForm onSwitch={() => setTab('login')} onComplete={onComplete} />
            }
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#A0AEC0' }}>
            Exploring the design?{' '}
            <button onClick={() => onComplete && onComplete('register')} style={{ background: 'none', border: 'none', color: '#FF6B35', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
              Go to Onboarding →
            </button>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
