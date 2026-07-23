
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

export default function SubscriptionPage({ isPremium, setIsPremium, onNavigate }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 32px' }}>
        {isPremium && (
          <div style={{ background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)', borderRadius: 20, padding: '24px 32px', color: '#fff', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 30px rgba(72,187,120,0.3)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Crown size={18} fill="#fff" /> Active Subscription
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>You are a CookBook PRO Member!</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>Enjoy unlimited AI Meal Planning, AI Chef assistance, and exclusive PRO recipes.</div>
            </div>
            <Button variant="white" size="md" onClick={() => onNavigate('meal-planner')}>Open Meal Planner 🤖</Button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Simple Pricing</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 14 }}>Choose Your Plan</h1>
          <p style={{ fontSize: 16, color: C.ink2, margin: 0 }}>Start free. Upgrade when you're ready to unlock the full power of CookBook.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Free Plan */}
          <div style={{ background: C.card, borderRadius: 24, padding: '36px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink2, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Free</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: C.ink }}>₹0</span>
              <span style={{ fontSize: 16, color: C.ink2 }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: C.ink3, marginBottom: 32 }}>Free forever · No credit card needed</div>
            {['Browse 1,000+ free recipes', 'Ingredient search', 'Basic recipe filters', 'User profile & goals', 'View nutrition info'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Check size={16} color={C.ink3} strokeWidth={2} />
                <span style={{ fontSize: 14, color: C.ink2 }}>{f}</span>
              </div>
            ))}
            <button disabled style={{ width: '100%', padding: '14px', borderRadius: 999, border: `2px solid ${C.border}`, background: C.muted, color: C.ink3, fontSize: 15, fontWeight: 700, cursor: 'not-allowed', marginTop: 24, fontFamily: 'inherit' }}>
              {!isPremium ? 'Current Plan' : 'Free Tier'}
            </button>
          </div>

          {/* Premium Plan */}
          <div style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 60%, #CC4E25 100%)', borderRadius: 24, padding: '36px', position: 'relative', boxShadow: '0 20px 60px rgba(255,107,53,0.35)' }}>
            <div style={{ position: 'absolute', top: -14, right: 24, background: C.gold, borderRadius: 999, padding: '5px 16px', fontSize: 12, fontWeight: 800, color: '#7C5700', boxShadow: '0 4px 12px rgba(246,201,14,0.4)' }}>⭐ MOST POPULAR</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Crown size={16} color={C.gold} fill={C.gold} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Premium</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>₹99</span>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', marginLeft: 4 }}>₹49</span>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)' }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>Limited offer · Cancel anytime</div>
            {['AI Meal Planner (Weekly & Monthly)', 'AI Cook Assistant — 24/7', '100+ Exclusive Premium Recipes', 'Budget Meal Plans', 'Grocery List Generator', 'Priority Customer Support'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={12} color="#fff" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
            <button onClick={() => { if (isPremium) onNavigate('meal-planner'); else setShowModal(true); }} style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: '#fff', color: C.primary, fontSize: 16, fontWeight: 800, cursor: 'pointer', marginTop: 24, fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'transform 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              {isPremium ? 'PRO Active — Open Planner 🤖' : 'Get Premium Now 👑'}
            </button>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 10 }}>Cancel anytime · Instant access</div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: C.card, borderRadius: 24, padding: '36px', maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: C.ink, margin: 0 }}>Order Summary</h3>
              <button onClick={() => setShowModal(false)} style={{ background: C.muted, border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ background: C.muted, borderRadius: 14, padding: '16px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: C.ink2 }}>CookBook Premium Monthly</span>
                <span style={{ fontSize: 14, color: C.ink3, textDecoration: 'line-through' }}>₹99</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>🎉 Special Discount</span>
                <span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>-₹50</span>
              </div>
              <div style={{ height: 1, background: C.border, margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>₹49/month</span>
              </div>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={() => { setIsPremium(true); setShowModal(false); onNavigate('meal-planner'); }}>
              Pay ₹49 & Activate PRO 👑
            </Button>
            <div style={{ fontSize: 12, color: C.ink3, textAlign: 'center', marginTop: 12 }}>🔒 Secured by Razorpay · Cancel anytime</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 11 — ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
