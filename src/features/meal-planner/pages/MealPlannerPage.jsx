
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

export default function MealPlannerPage({ isPremium = true, onNavigate }) {
  const [planType, setPlanType] = useState('weekly')
  const [goal, setGoal] = useState('weight_gain')
  const [days, setDays] = useState(7)
  const [budget, setBudget] = useState('')
  const [planName, setPlanName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1)

  const meals = [
    { type: 'Breakfast', emoji: '🌅', recipe: 'Oats with Chicken', kcal: 450, servings: 1 },
    { type: 'Lunch', emoji: '☀️', recipe: 'Chicken Brown Rice Bowl', kcal: 650, servings: 2 },
    { type: 'Snack', emoji: '⚡', recipe: 'Protein Smoothie', kcal: 250, servings: 1 },
    { type: 'Dinner', emoji: '🌙', recipe: 'Grilled Chicken Salad', kcal: 500, servings: 1 },
  ]

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 2500)
  }

  if (!isPremium) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 72, filter: 'blur(8px)', overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ background: C.card, borderRadius: 20, padding: '32px', margin: '32px auto', maxWidth: 700 }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 60, background: C.muted, borderRadius: 12, marginBottom: 12 }} />)}
          </div>
        </div>
        <div style={{ background: C.card, borderRadius: 24, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: `1px solid ${C.border}`, zIndex: 10, margin: '0 32px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${C.gold}, #F59E0B)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 8px 24px rgba(246,201,14,0.4)` }}>
            <Crown size={32} color="#fff" fill="#fff" />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Premium Feature</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 12 }}>AI Meal Planner</h2>
          <p style={{ fontSize: 15, color: C.ink2, lineHeight: 1.6, margin: 0, marginBottom: 28 }}>Generate personalized weekly or monthly meal plans tailored to your goals, budget, and food preferences.</p>
          {['AI-Generated Weekly & Monthly Plans', 'Budget-Optimized Meal Selection', 'Automatic Grocery List', 'Nutrition Goal Tracking'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textAlign: 'left' }}>
              <Check size={16} color={C.green} strokeWidth={2.5} />
              <span style={{ fontSize: 14, color: C.ink2 }}>{f}</span>
            </div>
          ))}
          <Button variant="primary" size="lg" fullWidth icon={<Crown size={16} />} onClick={() => onNavigate('subscription')}>Unlock Premium — ₹49/month</Button>
          <div style={{ fontSize: 12, color: C.ink3, marginTop: 10 }}>Cancel anytime · No commitments</div>
        </div>
      </div>
    )
  }

  if (generated) {
    return (
      <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <button onClick={() => setGenerated(false)} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18} /></button>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: C.ink, margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>{planName || 'My Weekly Plan'}</h1>
              <span style={{ fontSize: 13, color: C.ink2 }}>Jul 22 – Jul 28, 2026 · Weight Gain · AI Generated ✨</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
            <div>
              {/* Day Tabs */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24 }}>
                {Array.from({ length: days }, (_, i) => i + 1).map(d => (
                  <button key={d} onClick={() => setSelectedDay(d)}
                    style={{ flexShrink: 0, padding: '10px 20px', borderRadius: 999, border: `2px solid ${selectedDay === d ? C.primary : C.border}`, background: selectedDay === d ? C.primary : C.card, color: selectedDay === d ? '#fff' : C.ink2, fontSize: 13, fontWeight: selectedDay === d ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                    Day {d}
                  </button>
                ))}
              </div>

              {/* Meal Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {meals.map(meal => (
                  <div key={meal.type} style={{ background: C.card, borderRadius: 16, padding: '18px 20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: C.primaryLight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 20 }}>{meal.emoji}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{meal.type}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{meal.recipe}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.ink2 }}><Flame size={12} color={C.primary} />{meal.kcal} kcal</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.ink2 }}><Users size={12} />{meal.servings} serving{meal.servings > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <img src={RECIPES[meals.indexOf(meal) % RECIPES.length].image} alt={meal.recipe} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div style={{ background: C.card, borderRadius: 16, padding: '24px', border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0, marginBottom: 16 }}>Day {selectedDay} Summary</h4>
                {/* Donut chart placeholder */}
                <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 36 36" style={{ width: 120, height: 120, transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EBEBEB" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={C.primary} strokeWidth="3" strokeDasharray="85 15" />
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>1850</div>
                    <div style={{ fontSize: 10, color: C.ink3 }}>kcal</div>
                  </div>
                </div>
                {[['Protein', '120g', C.green, 65], ['Carbs', '210g', '#3182CE', 75], ['Fat', '58g', C.red, 40]].map(([n, v, color, pct]) => (
                  <div key={n} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: C.ink2 }}>{n}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color }}>{v}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: C.muted }}>
                      <div style={{ height: 6, borderRadius: 3, background: color, width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="primary" size="md" fullWidth icon={<ShoppingCart size={15} />} onClick={() => onNavigate && onNavigate('grocery')}>Generate Grocery List 🛒</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.card, borderRadius: 24, padding: '40px', maxWidth: 600, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: `1px solid ${C.border}`, margin: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${C.gold}, #F59E0B)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 6px 20px rgba(246,201,14,0.35)' }}>
            <Zap size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, color: C.ink, margin: 0 }}>Generate My Meal Plan 🤖</h2>
          <p style={{ fontSize: 14, color: C.ink2, margin: '8px 0 0' }}>Powered by AI • Personalized for your goals</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Plan Name */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 8 }}>Plan Name</label>
            <input value={planName} onChange={e => setPlanName(e.target.value)} placeholder="e.g. My July Weight Gain Plan" style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'inherit' }} />
          </div>

          {/* Plan Type */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 8 }}>Plan Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly']].map(([v, l]) => (
                <button key={v} onClick={() => setPlanType(v)}
                  style={{ flex: 1, padding: '10px', borderRadius: 12, border: `2px solid ${planType === v ? C.primary : C.border}`, background: planType === v ? C.primaryLight : C.card, color: planType === v ? C.primary : C.ink2, fontSize: 14, fontWeight: planType === v ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 8 }}>Your Goal</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['weight_gain', '🏋️ Gain'], ['weight_loss', '🔥 Lose'], ['maintain', '⚖️ Maintain']].map(([v, l]) => (
                <button key={v} onClick={() => setGoal(v)}
                  style={{ flex: 1, padding: '10px', borderRadius: 12, border: `2px solid ${goal === v ? C.primary : C.border}`, background: goal === v ? C.primaryLight : C.card, color: goal === v ? C.primary : C.ink2, fontSize: 13, fontWeight: goal === v ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Days */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 8 }}>Number of Days: <span style={{ color: C.primary }}>{days}</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setDays(d => Math.max(1, d - 1))} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: C.muted, position: 'relative' }}>
                <div style={{ height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${C.primary}, ${C.primaryDark})`, width: `${(days / 30) * 100}%` }} />
              </div>
              <button onClick={() => setDays(d => Math.min(30, d + 1))} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 8 }}>Daily Budget (Optional)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: C.ink2, fontWeight: 600 }}>₹</span>
              <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. 300" style={{ width: '100%', padding: '12px 16px 12px 32px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth icon={generating ? null : <Zap size={18} />} onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                AI is crafting your plan...
              </span>
            ) : 'Generate Plan ✨'}
          </Button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 6 — GROCERY LIST
// ═══════════════════════════════════════════════════════════════════════════════
