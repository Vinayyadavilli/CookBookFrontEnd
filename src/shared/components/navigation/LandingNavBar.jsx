
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
export function LandingNavBar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: 'flex', alignItems: 'center', padding: '0 32px', background: scrolled ? 'rgba(250,250,248,0.95)' : 'rgba(250,250,248,0.85)', backdropFilter: 'blur(16px)', borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent', transition: 'all 0.25s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255,107,53,0.3)' }}>
          <ChefHat size={20} color="#fff" strokeWidth={2} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em' }}>Cook<span style={{ color: C.primary }}>Book</span></span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
        {[
          ['Home', 'landing'],
          ['Recipes', 'recipes'],
          ['Categories', 'recipes'],
          ['Premium', 'subscription']
        ].map(([label, screen]) => (
          <button key={label} onClick={() => onNavigate(screen)} style={{ fontSize: 14, fontWeight: 500, color: label === 'Premium' ? C.primary : C.ink2, padding: '6px 14px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.target.style.background = C.primaryLight; e.target.style.color = C.primary }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = label === 'Premium' ? C.primary : C.ink2 }}>
            {label === 'Premium' && <Crown size={13} fill={C.primary} color={C.primary} />}{label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Button variant="secondary" size="sm" onClick={() => onNavigate('auth')}>Log In</Button>
        <Button variant="primary" size="sm" onClick={() => onNavigate('auth')}>Get Started</Button>
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
