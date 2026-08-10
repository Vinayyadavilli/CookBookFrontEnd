
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

import { Button } from '../ui/Button';

export function NavBar({ onNavigate, currentScreen, isPremium, isAuthenticated, userProfile, onLogout }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const displayName = userProfile?.full_name?.split(' ')[0] || userProfile?.email?.split('@')[0] || 'User'

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: 'flex', alignItems: 'center', padding: '0 32px', background: scrolled ? 'rgba(250,250,248,0.95)' : 'rgba(250,250,248,0.85)', backdropFilter: 'blur(16px)', borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent', transition: 'all 0.25s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => onNavigate('home')}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255,107,53,0.3)' }}>
          <ChefHat size={20} color="#fff" strokeWidth={2} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em' }}>Cook<span style={{ color: C.primary }}>Book</span></span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
        {(isAuthenticated ? [
          ['home', '🏠 Home', false],
          ['recipes', '🍽️ Recipes', false],
          ['meal-planner', '🤖 Planner', true],
          ['grocery', '🛒 Grocery', false],
          ['search', '🔍 Search', false],
          ['favorites', '❤️ Favorites', false],
          ['ai-chat', '💬 AI Chef', true]
        ] : [
          ['landing', '🏠 Home', false],
          ['recipes', '🍽️ Recipes', false],
          ['categories', '🏷️ Categories', false],
          ['subscription', '👑 Premium', false]
        ]).map(([s, label, isProOnly]) => (
          <button key={s} onClick={() => onNavigate(s)}
            style={{ fontSize: 13, fontWeight: 500, color: (currentScreen === s || (s === 'categories' && currentScreen === 'recipes')) ? C.primary : C.ink2, padding: '6px 14px', borderRadius: 8, border: 'none', background: (currentScreen === s || (s === 'categories' && currentScreen === 'recipes')) ? C.primaryLight : 'transparent', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}>
            {label}
            {isProOnly && !isPremium && (
              <span style={{ fontSize: 9, fontWeight: 800, background: C.gold, color: '#7C5700', borderRadius: 4, padding: '1px 4px', lineHeight: 1 }}>PRO</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {isAuthenticated && !isPremium && (
          <button onClick={() => onNavigate('subscription')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', color: '#fff', border: 'none', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(255,107,53,0.3)', transition: 'all 0.18s' }}>
            <Crown size={12} fill="#fff" color="#fff" /> Upgrade PRO
          </button>
        )}

        {isAuthenticated ? (
          <>
            <button onClick={() => onNavigate('notifications')} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Bell size={18} color={C.ink2} />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: C.red, border: '1.5px solid white' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => onNavigate('profile')}>
              {userProfile?.profile_image_url ? (
                <img src={userProfile.profile_image_url} alt="Avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${isPremium ? C.gold : C.primary}` }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, border: `2px solid ${isPremium ? C.gold : C.primary}` }}>
                  {displayName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>Hi, {displayName} 👋</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {isPremium ? (
                    <>
                      <Crown size={10} color={C.gold} fill={C.gold} />
                      <span style={{ fontSize: 10, color: C.gold, fontWeight: 700 }}>PRO Member</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 10, color: C.ink3, fontWeight: 500 }}>Free Plan</span>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button variant="secondary" size="sm" onClick={() => onNavigate('auth')}>Log In</Button>
            <Button variant="primary" size="sm" onClick={() => onNavigate('auth')}>Get Started</Button>
          </div>
        )}
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — HOME DASHBOARD (Logged-in)
// ═══════════════════════════════════════════════════════════════════════════════
