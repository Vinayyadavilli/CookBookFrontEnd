
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

export function Button({ children, variant = 'primary', size = 'md', onClick, fullWidth, icon, disabled }) {
  const [hov, setHov] = useState(false)
  const sizes = { sm: { fontSize: 13, padding: '7px 16px' }, md: { fontSize: 14, padding: '11px 22px' }, lg: { fontSize: 15, padding: '14px 28px' } }
  const variants = {
    primary: { background: disabled ? '#ccc' : hov ? C.primaryDark : C.primary, color: '#fff', boxShadow: hov && !disabled ? '0 6px 20px rgba(255,107,53,0.4)' : '0 2px 8px rgba(255,107,53,0.25)' },
    secondary: { background: hov ? C.primaryLight : 'transparent', color: C.primary, border: `2px solid ${C.primary}` },
    ghost: { background: hov ? 'rgba(255,107,53,0.06)' : 'transparent', color: C.ink, border: '2px solid transparent' },
    danger: { background: hov ? '#E53E3E' : C.red, color: '#fff', border: '2px solid transparent' },
    white: { background: '#fff', color: C.primary, border: '2px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 999, fontFamily: 'inherit', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.18s ease', width: fullWidth ? '100%' : undefined, border: '2px solid transparent', outline: 'none', opacity: disabled ? 0.6 : 1, ...sizes[size], ...variants[variant] }}
    >
      {icon}{children}
    </button>
  )
}
