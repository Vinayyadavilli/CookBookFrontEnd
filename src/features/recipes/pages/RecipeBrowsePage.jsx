
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

export default function RecipeBrowsePage({ onNavigate }) {
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [foodType, setFoodType] = useState('all')
  const [difficulty, setDifficulty] = useState([])
  const [cookTime, setCookTime] = useState('any')
  const [page, setPage] = useState(1)
  const cats = ['Rice', 'Biryani', 'Breakfast', 'Snacks', 'Chinese', 'South Indian', 'North Indian', 'Desserts']

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh', display: 'flex' }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 240, flexShrink: 0, background: C.card, borderRight: `1px solid ${C.border}`, padding: '24px 16px', position: 'sticky', top: 72, height: 'calc(100vh - 72px)', overflowY: 'auto' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={15} color={C.ink3} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input placeholder="Search recipes..." style={{ width: '100%', padding: '9px 9px 9px 34px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', fontFamily: 'inherit' }} />
        </div>

        {/* Category accordion */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setCategoryOpen(!categoryOpen)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', borderBottom: `1px solid ${C.border}`, marginBottom: 10, fontFamily: 'inherit' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</span>
            {categoryOpen ? <ChevronDown size={14} color={C.ink3} /> : <ChevronRight size={14} color={C.ink3} />}
          </button>
          {categoryOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cats.map(c => (
                <button key={c} style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: C.ink2, fontFamily: 'inherit', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.primaryLight; e.currentTarget.style.color = C.primary }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.ink2 }}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Food Type */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Food Type</div>
          {[['all', '🍽️ All'], ['veg', '🥦 Vegetarian'], ['non_veg', '🍗 Non-Veg'], ['egg', '🥚 Eggetarian']].map(([v, l]) => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: C.ink2 }}>
              <input type="radio" name="foodType" checked={foodType === v} onChange={() => setFoodType(v)} style={{ accentColor: C.primary }} />{l}
            </label>
          ))}
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Difficulty</div>
          {['Easy', 'Medium', 'Hard'].map(d => (
            <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: C.ink2 }}>
              <input type="checkbox" checked={difficulty.includes(d)} onChange={e => setDifficulty(prev => e.target.checked ? [...prev, d] : prev.filter(x => x !== d))} style={{ accentColor: C.primary }} />
              <DifficultyBadge level={d} />
            </label>
          ))}
        </div>

        {/* Cooking Time */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Cooking Time</div>
          {[['any', 'Any time'], ['lt30', '< 30 min'], ['30-60', '30–60 min'], ['gt60', '> 60 min']].map(([v, l]) => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: C.ink2 }}>
              <input type="radio" name="cookTime" checked={cookTime === v} onChange={() => setCookTime(v)} style={{ accentColor: C.primary }} />{l}
            </label>
          ))}
        </div>

        {/* Region */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Region / State</div>
          <select style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
            <option>All States</option>
            <option>Telangana</option><option>Maharashtra</option><option>Kerala</option>
            <option>Punjab</option><option>Tamil Nadu</option><option>West Bengal</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, padding: '9px', border: `1.5px solid ${C.border}`, borderRadius: 10, background: 'none', fontSize: 13, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
          <button style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 10, background: C.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Apply</button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '28px 32px' }}>
        {/* Sort bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '12px 16px', background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 14, color: C.ink2 }}><strong style={{ color: C.ink }}>240 recipes</strong> found</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: C.ink2 }}>Sort by:</span>
            <select style={{ padding: '6px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <option>Popular</option><option>Rating</option><option>Newest</option><option>Quick</option>
            </select>
          </div>
        </div>

        {/* Recipe Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          {RECIPES.map(r => <RecipeCard key={r.id} recipe={r} onClick={() => onNavigate && onNavigate('recipe-detail')} />)}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
          <button style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.ink2 }}>
            <ChevronLeft size={14} />Prev
          </button>
          {[1, 2, 3, '...', 12].map((p, i) => (
            <button key={i} onClick={() => typeof p === 'number' && setPage(p)}
              style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${page === p ? C.primary : C.border}`, background: page === p ? C.primary : C.card, color: page === p ? '#fff' : C.ink2, cursor: 'pointer', fontSize: 13, fontWeight: page === p ? 700 : 400 }}>
              {p}
            </button>
          ))}
          <button style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.ink2 }}>
            Next<ChevronRight size={14} />
          </button>
        </div>
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — RECIPE DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════════════
