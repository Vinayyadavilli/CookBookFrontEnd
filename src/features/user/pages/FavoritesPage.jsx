
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

export default function FavoritesPage({ onNavigate }) {
  const [tab, setTab] = useState('recipes')
  const [favorites, setFavorites] = useState(RECIPES.slice(0, 6))

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 24 }}>My Favorites</h1>
        <div style={{ display: 'flex', gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 32 }}>
          {['recipes', 'collections'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '12px 24px', border: 'none', background: 'none', fontSize: 14, fontWeight: tab === t ? 700 : 500, color: tab === t ? C.primary : C.ink2, cursor: 'pointer', fontFamily: 'inherit', borderBottom: `3px solid ${tab === t ? C.primary : 'transparent'}`, textTransform: 'capitalize', marginBottom: -2, transition: 'all 0.15s' }}>
              {t} {tab === t && <span style={{ marginLeft: 6, background: C.primaryLight, borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 700, color: C.primary }}>{t === 'recipes' ? favorites.length : 3}</span>}
            </button>
          ))}
        </div>

        {tab === 'recipes' && (
          favorites.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {favorites.map(r => (
                <div key={r.id} style={{ position: 'relative' }}>
                  <RecipeCard recipe={r} onClick={() => onNavigate && onNavigate('recipe-detail')} />
                  <button onClick={() => setFavorites(prev => prev.filter(f => f.id !== r.id))}
                    style={{ position: 'absolute', top: 50, right: 10, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.15s' }}
                    title="Remove from favorites"
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F1' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)' }}>
                    <Heart size={16} color={C.red} fill={C.red} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 32px' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💝</div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: C.ink, margin: 0, marginBottom: 12 }}>No favorites yet!</h3>
              <p style={{ fontSize: 15, color: C.ink2, margin: 0, marginBottom: 24 }}>Start saving recipes you love and they'll appear here.</p>
              <Button variant="primary" size="md" icon={<Search size={14} />}>Explore Recipes</Button>
            </div>
          )
        )}

        {tab === 'collections' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[{ name: 'Weight Gain Meals', count: 12, image: RECIPES[0].image }, { name: 'Quick Dinners', count: 8, image: RECIPES[2].image }, { name: 'South Indian', count: 15, image: RECIPES[3].image }].map(col => (
              <div key={col.name} style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, cursor: 'pointer' }}>
                <div style={{ height: 160, position: 'relative' }}>
                  <img src={col.image} alt={col.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{col.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{col.count} recipes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 9 — PROFILE & SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
