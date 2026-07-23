
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

export default function IngredientSearchPage() {
  const [input, setInput] = useState('')
  const [ingredients, setIngredients] = useState(['Chicken', 'Tomato', 'Onion'])
  const [searched, setSearched] = useState(false)

  const addIngredient = () => {
    if (input.trim() && !ingredients.includes(input.trim())) {
      setIngredients(prev => [...prev, input.trim()])
      setInput('')
    }
  }

  const matchResults = RECIPES.map((r, i) => ({ ...r, match: Math.floor(75 + Math.random() * 25) })).sort((a, b) => b.match - a.match)

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 32px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧅</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 12 }}>What's in your fridge?</h1>
          <p style={{ fontSize: 16, color: C.ink2, margin: 0, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Enter the ingredients you have and we'll find matching recipes instantly. No more wasted food! 🌱
          </p>
        </div>

        {/* Input Zone */}
        <div style={{ background: C.card, borderRadius: 20, padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: `1px solid ${C.border}`, marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addIngredient()}
                placeholder="Type an ingredient (e.g. Garlic, Paneer, Rice)..."
                style={{ width: '100%', padding: '14px 16px', border: `2px solid ${C.border}`, borderRadius: 12, fontSize: 15, color: C.ink, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                onFocus={e => (e.target.style.borderColor = C.primary)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </div>
            <button onClick={addIngredient} style={{ padding: '14px 22px', background: C.primary, border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, fontFamily: 'inherit' }}>
              <Plus size={16} />Add
            </button>
          </div>

          {/* Ingredient Tags */}
          {ingredients.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {ingredients.map(ing => (
                <span key={ing} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: C.primary, borderRadius: 999, color: '#fff', fontSize: 13, fontWeight: 600 }}>
                  {ing}
                  <button onClick={() => setIngredients(prev => prev.filter(i => i !== ing))} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <button onClick={() => setSearched(true)} style={{ width: '100%', padding: '14px', background: ingredients.length === 0 ? '#ccc' : `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: ingredients.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: ingredients.length > 0 ? '0 4px 16px rgba(255,107,53,0.35)' : 'none' }}>
            <Search size={18} />Find Matching Recipes
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '12px 16px', background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <CheckCircle size={18} color={C.green} />
              <span style={{ fontSize: 15, color: C.ink }}><strong style={{ color: C.green }}>12 recipes found</strong> matching your ingredients</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {matchResults.map(r => (
                <div key={r.id} style={{ position: 'relative' }}>
                  <RecipeCard recipe={r} />
                  <div style={{ position: 'absolute', top: 10, right: 50, background: C.green, borderRadius: 999, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{r.match}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 5 — AI MEAL PLANNER
// ═══════════════════════════════════════════════════════════════════════════════
