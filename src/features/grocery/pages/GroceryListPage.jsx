
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

export default function GroceryListPage() {
  const [purchased, setPurchased] = useState(new Set())
  const categories = [
    { name: 'Proteins 🍗', color: '#FC5C65', items: [{ id: 'c1', name: 'Chicken (Boneless)', qty: '3.5 kg' }, { id: 'c2', name: 'Eggs', qty: '24 pieces' }, { id: 'c3', name: 'Paneer', qty: '500 g' }] },
    { name: 'Vegetables 🥦', color: '#48BB78', items: [{ id: 'v1', name: 'Tomatoes', qty: '14 cups' }, { id: 'v2', name: 'Onions', qty: '8 large' }, { id: 'v3', name: 'Spinach', qty: '400 g' }, { id: 'v4', name: 'Garlic', qty: '3 bulbs' }] },
    { name: 'Dairy 🥛', color: '#4299E1', items: [{ id: 'd1', name: 'Cream', qty: '400 ml' }, { id: 'd2', name: 'Butter', qty: '200 g' }, { id: 'd3', name: 'Yogurt', qty: '500 g' }] },
    { name: 'Spices 🌶️', color: '#F6C90E', items: [{ id: 's1', name: 'Garam Masala', qty: '3 tbsp' }, { id: 's2', name: 'Turmeric', qty: '2 tsp' }, { id: 's3', name: 'Cumin Seeds', qty: '2 tbsp' }] },
  ]
  const togglePurchased = (id) => {
    setPurchased(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }
  const total = categories.flatMap(c => c.items).length
  const done = purchased.size

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 800, color: C.ink, margin: 0 }}>Grocery List</h1>
            <p style={{ fontSize: 14, color: C.ink2, margin: '4px 0 0' }}>My July Weight Gain Plan · {done}/{total} items purchased</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 13, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}><Printer size={14} />Print</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 13, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}><Share2 size={14} />Share</button>
            <button onClick={() => setPurchased(new Set())} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 13, color: C.red, cursor: 'pointer', fontFamily: 'inherit' }}><Trash2 size={14} />Clear</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ height: 6, borderRadius: 3, background: C.muted, marginTop: 12 }}>
            <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, #38A169)`, width: `${total > 0 ? (done / total) * 100 : 0}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Categories */}
        {categories.map(cat => (
          <div key={cat.name} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 20px', borderLeft: `4px solid ${cat.color}`, background: C.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{cat.name}</span>
              <span style={{ fontSize: 12, color: C.ink3, marginLeft: 'auto' }}>{cat.items.filter(i => purchased.has(i.id)).length}/{cat.items.length}</span>
            </div>
            {cat.items.map((item, i) => {
              const done = purchased.has(item.id)
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i > 0 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => togglePurchased(item.id)}
                  onMouseEnter={e => (e.currentTarget.style.background = C.muted)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? cat.color : C.border}`, background: done ? cat.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {done && <Check size={13} color="#fff" strokeWidth={3} />}
                  </div>
                  <span style={{ flex: 1, fontSize: 14, color: done ? C.ink3 : C.ink, textDecoration: done ? 'line-through' : 'none', fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: done ? C.ink3 : cat.color }}>{item.qty}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 7 — AI COOK ASSISTANT CHAT
// ═══════════════════════════════════════════════════════════════════════════════
