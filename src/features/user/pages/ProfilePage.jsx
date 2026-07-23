
import { useState, useRef, useEffect } from 'react';
import {
  Bookmark, BookmarkCheck, Clock, ChefHat, Crown, Star, Flame,
  Leaf, Users, Target, ShoppingCart, ChevronRight, ArrowRight,
  Menu, X, Check, Bell, Search, Zap, TrendingUp, Award, MapPin,
  Heart, Filter, Grid, List, ChevronDown, ChevronLeft, Send,
  Plus, Minus, Printer, Share2, Trash2, MessageCircle, Bot,
  LayoutDashboard, UtensilsCrossed, Settings, LogOut, HelpCircle,
  CreditCard, History, ChartBar, BarChart3, PieChart, Dumbbell,
  Droplets, Activity, Eye, EyeOff, Edit3, AlertCircle, Info,
  CheckCircle, Package, Soup, Carrot
} from 'lucide-react';
import { C } from '@/shared/theme/tokens';
import { RECIPES, TRENDING, CATEGORIES, ALL_SCREENS } from '@/shared/data/mockData';
import { VegBadge, PremiumBadge, DifficultyBadge } from '@/shared/components/ui/Badges';
import { RatingStars } from '@/shared/components/ui/RatingStars';
import { Button } from '@/shared/components/ui/Button';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { NavBar } from '@/shared/components/navigation/NavBar';
import { LandingNavBar } from '@/shared/components/navigation/LandingNavBar';

export default function ProfilePage({ onNavigate, onLogout, isPremium }) {
  const [activeSection, setActiveSection] = useState('profile')
  const [editName, setEditName] = useState('Vinay Yadavilli')
  const [editMobile, setEditMobile] = useState('9876543210')

  const navItems = [
    { id: 'profile', label: 'Profile Information', icon: <Users size={16} /> },
    { id: 'health', label: 'Health Information', icon: <Activity size={16} /> },
    { id: 'subscription', label: 'Subscription', icon: <Crown size={16} /> },
    { id: 'payments', label: 'Payment History', icon: <CreditCard size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={16} /> },
  ]

  const healthMetrics = [
    { label: 'BMI', value: '22.4', sub: 'Normal', color: C.green },
    { label: 'BMR', value: '1,724', sub: 'kcal/day', color: '#3182CE' },
    { label: 'TDEE', value: '2,344', sub: 'kcal/day', color: '#9F7AEA' },
    { label: 'Target', value: '2,100', sub: 'kcal/day', color: C.primary },
    { label: 'Protein', value: '140g', sub: 'daily goal', color: C.green },
    { label: 'Water', value: '2.5L', sub: 'daily quota', color: '#0BC5EA' },
  ]

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh', display: 'flex' }}>
      {/* Profile Sidebar */}
      <aside style={{ width: 240, flexShrink: 0, background: C.card, borderRight: `1px solid ${C.border}`, padding: '24px 12px', display: 'flex', flexDirection: 'column' }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 12px' }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=144&h=144&fit=crop&face" alt="Avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${C.primary}` }} />
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: C.primary, border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit3 size={11} color="#fff" />
            </button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>Vinay Yadavilli</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
            {isPremium ? (
              <>
                <Crown size={11} color={C.gold} fill={C.gold} />
                <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>PRO Member</span>
              </>
            ) : (
              <span style={{ fontSize: 12, color: C.ink3, fontWeight: 500 }}>Free Plan</span>
            )}
          </div>
        </div>

        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveSection(item.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: activeSection === item.id ? C.primaryLight : 'none', color: activeSection === item.id ? C.primary : C.ink2, fontSize: 13, fontWeight: activeSection === item.id ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 2, transition: 'all 0.15s', textAlign: 'left', width: '100%' }}>
            {item.icon}{item.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'none', color: C.red, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
            <LogOut size={16} />Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main style={{ flex: 1, padding: '32px 40px' }}>
        {/* PROFILE SECTION */}
        {activeSection === 'profile' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 28 }}>Profile Information</h2>
            <div style={{ background: C.card, borderRadius: 16, padding: '32px', border: `1px solid ${C.border}`, maxWidth: 600 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'Full Name', value: editName, onChange: setEditName, editable: true },
                  { label: 'Email', value: 'vinay@example.com', editable: false },
                  { label: 'Mobile', value: editMobile, onChange: setEditMobile, editable: true },
                ].map(field => (
                  <div key={field.label}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 8 }}>{field.label}</label>
                    <input value={field.value} onChange={field.editable ? e => field.onChange(e.target.value) : undefined} readOnly={!field.editable}
                      style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'inherit', background: field.editable ? C.card : C.muted, cursor: field.editable ? 'text' : 'default' }}
                      onFocus={e => { if (field.editable) e.target.style.borderColor = C.primary }}
                      onBlur={e => (e.target.style.borderColor = C.border)} />
                    {!field.editable && <div style={{ fontSize: 11, color: C.ink3, marginTop: 4 }}>Email cannot be changed</div>}
                  </div>
                ))}
                <Button variant="primary" size="md">Save Changes</Button>
              </div>
            </div>
          </div>
        )}

        {/* HEALTH SECTION */}
        {activeSection === 'health' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 28 }}>Health Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
              <div style={{ background: C.card, borderRadius: 16, padding: '24px', border: `1px solid ${C.border}` }}>
                {[['Age', '25'], ['Gender', 'Male'], ['Height', '175 cm'], ['Weight', '70 kg'], ['Target Weight', '80 kg']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 14, color: C.ink2 }}>{l}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{v}</span>
                  </div>
                ))}
                {[['Activity Level', 'Moderate'], ['Goal', 'Weight Gain'], ['Food Preference', 'Non-Veg']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 14, color: C.ink2 }}>{l}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}><Button variant="primary" size="md" fullWidth>Update Health Info</Button></div>
              </div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Calculated Metrics</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {healthMetrics.map(m => (
                    <div key={m.label} style={{ background: C.card, borderRadius: 14, padding: '16px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${m.color}15`, border: `2px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.value.split(',')[0].replace(/[^0-9.]/g, '').slice(0, 2) || '—'}</span>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: C.ink3, marginTop: 2 }}>{m.sub}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, marginTop: 4 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBSCRIPTION SECTION */}
        {activeSection === 'subscription' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 28 }}>Subscription</h2>
            <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 100%)', borderRadius: 20, padding: '28px', border: `1px solid rgba(246,201,14,0.3)`, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Crown size={18} color={C.gold} fill={C.gold} />
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Premium Monthly</span>
                    <span style={{ padding: '2px 10px', background: 'rgba(72,187,120,0.2)', borderRadius: 999, fontSize: 11, fontWeight: 700, color: C.green }}>ACTIVE</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Started Jul 1, 2026 · Expires Jul 31, 2026</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>₹49<span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>/mo</span></div>
                  <div style={{ fontSize: 12, color: C.gold }}>9 days remaining</div>
                </div>
              </div>
            </div>
            <div style={{ background: C.card, borderRadius: 16, padding: '24px', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div><div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>Auto-Renewal</div><div style={{ fontSize: 13, color: C.ink2 }}>Renews automatically on Jul 31</div></div>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: C.green, cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: 22, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>
              <button style={{ fontSize: 13, color: C.red, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Cancel subscription</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 10 — SUBSCRIPTION / PRICING
// ═══════════════════════════════════════════════════════════════════════════════
