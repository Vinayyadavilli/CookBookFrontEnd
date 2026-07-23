
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

export default function HomeDashboard({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const filters = ['All', 'Veg', 'Non-Veg', 'Breakfast', 'Snacks', 'Protein']

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>

      {/* ── Personalized Greeting Card ── */}
      <section style={{ padding: '32px 32px 0', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 60%, #CC4E25 100%)', borderRadius: 24, padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: 200, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>☀️</span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: '#fff', margin: 0 }}>Good morning, Vinay!</h2>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16, margin: 0, marginBottom: 24, fontWeight: 500 }}>
              You need <strong style={{ color: '#fff' }}>2,100 kcal</strong> today to reach your weight gain goal 💪
            </p>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'BMI', value: '22.4', sub: 'Normal', color: C.green },
                { label: 'Goal', value: 'Weight Gain', sub: 'Active', color: C.gold },
                { label: 'Daily Target', value: '2,100 kcal', sub: 'Protein: 140g', color: '#fff' },
                { label: 'Water', value: '2.5 L', sub: 'Today\'s quota', color: '#7DD3F8' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '12px 18px', minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0, zIndex: 1, textAlign: 'right' }}>
            <Button variant="white" size="md" icon={<Zap size={14} />} onClick={() => onNavigate('meal-planner')}>Generate Meal Plan</Button>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>AI-powered · Premium</div>
          </div>
        </div>
      </section>

      {/* ── Filter Pills ── */}
      <section style={{ padding: '24px 32px 0', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              style={{ flexShrink: 0, borderRadius: 999, padding: '8px 18px', border: `2px solid ${activeFilter === f ? C.primary : C.border}`, background: activeFilter === f ? C.primaryLight : '#fff', color: activeFilter === f ? C.primary : C.ink2, fontSize: 13, fontWeight: activeFilter === f ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Recipes ── */}
      <section style={{ padding: '36px 32px 0', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Award size={16} color={C.primary} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Featured</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.ink, margin: 0 }}>Featured This Week</h2>
          </div>
          <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />} onClick={() => onNavigate('recipes')}>View all recipes</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {RECIPES.slice(0, 4).map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>

      {/* ── Trending Now ── */}
      <section style={{ padding: '48px 32px 0', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><TrendingUp size={16} color={C.primary} /><span style={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trending</span></div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.ink, margin: 0 }}>Trending Now</h2>
          </div>
          <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />} onClick={() => onNavigate('recipes')}>View all</Button>
        </div>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '8px 0 12px', scrollSnapType: 'x mandatory' }}>
          {TRENDING.map(r => <div key={r.id} style={{ scrollSnapAlign: 'start' }}><RecipeCard recipe={r} size="trending" onClick={() => onNavigate('recipe-detail')} /></div>)}
        </div>
      </section>

      {/* ── Weight Gain Section ── */}
      <section style={{ padding: '48px 32px 0', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Dumbbell size={16} color="#4299E1" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4299E1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Goal</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.ink, margin: 0 }}>Top Recipes for Weight Gain</h2>
          </div>
          <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />} onClick={() => onNavigate('recipes')}>View all</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {RECIPES.slice(4, 8).map(r => (
            <div key={r.id} onClick={() => onNavigate('recipe-detail')} style={{ background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'all 0.22s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ position: 'relative', height: 160 }}>
                <img src={r.image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', top: 8, left: 8 }}><VegBadge isVeg={r.isVeg} /></div>
                {/* Calorie badge */}
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(255,107,53,0.92)', borderRadius: 8, padding: '4px 9px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Flame size={11} color="#fff" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{r.calories} kcal</span>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{r.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <RatingStars rating={r.rating} />
                  <span style={{ fontSize: 11, color: C.ink2 }}>{r.time}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <div style={{ flex: 1, background: '#E8F9F0', borderRadius: 8, padding: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{r.protein}g</div>
                    <div style={{ fontSize: 10, color: C.ink3 }}>Protein</div>
                  </div>
                  <div style={{ flex: 1, background: '#EBF8FF', borderRadius: 8, padding: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#3182CE' }}>{r.carbs}g</div>
                    <div style={{ fontSize: 10, color: C.ink3 }}>Carbs</div>
                  </div>
                  <div style={{ flex: 1, background: '#FFF0F1', borderRadius: 8, padding: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.red }}>{r.fat}g</div>
                    <div style={{ fontSize: 10, color: C.ink3 }}>Fat</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Premium Teaser Banner ── */}
      <section style={{ padding: '48px 32px 72px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 50%, #1A1A2E 100%)', borderRadius: 24, padding: '48px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div style={{ position: 'absolute', top: -60, right: 200, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ zIndex: 1, flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(246,201,14,0.15)', borderRadius: 999, padding: '5px 14px', marginBottom: 16, border: '1px solid rgba(246,201,14,0.3)' }}>
              <Crown size={13} color={C.gold} fill={C.gold} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: '0.08em' }}>PREMIUM FEATURES</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 12, lineHeight: 1.2 }}>
              Unlock the Full Kitchen Experience
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: 0, marginBottom: 28, maxWidth: 440, lineHeight: 1.6 }}>
              Join 400K+ health-focused cooks with unlimited AI-powered tools.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['🤖', 'AI Meal Planner — Weekly & Monthly plans generated for you'],
                ['👨‍🍳', 'AI Cook Assistant — Personal AI nutritionist, 24/7'],
                ['📊', 'Budget Meal Plans — Stay healthy within your daily budget'],
                ['🛒', 'Grocery List Generator — Auto-created from your meal plan'],
                ['👑', '100+ Exclusive Premium Recipes — High-protein, diet-specific'],
              ].map(([emoji, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color={C.primary} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{emoji} {text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0, zIndex: 1, textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px', border: '1px solid rgba(255,255,255,0.12)', minWidth: 260 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textDecoration: 'line-through' }}>₹99/month</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>₹49<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>/mo</span></div>
              <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, marginTop: 4, marginBottom: 24 }}>⚡ Limited offer — Save 51%!</div>
              <Button variant="primary" size="lg" fullWidth onClick={() => onNavigate('subscription')}>Go Premium Now 👑</Button>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>Cancel anytime · No lock-in</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — RECIPE BROWSE PAGE
// ═══════════════════════════════════════════════════════════════════════════════
