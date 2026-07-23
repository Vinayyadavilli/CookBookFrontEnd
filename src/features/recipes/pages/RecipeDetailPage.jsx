
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

export default function RecipeDetailPage({ onNavigate, isPremium }) {
  const [activeTab, setActiveTab] = useState('ingredients')
  const [servings, setServings] = useState(2)
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const recipe = RECIPES[0]

  const baseIngredients = [
    { name: 'Chicken (Boneless)', qty: 500, unit: 'g' },
    { name: 'Tomato Puree', qty: 1, unit: 'cup' },
    { name: 'Onion', qty: 1, unit: 'large' },
    { name: 'Butter', qty: 2, unit: 'tbsp' },
    { name: 'Ginger Garlic Paste', qty: 1, unit: 'tbsp' },
    { name: 'Heavy Cream', qty: 0.5, unit: 'cup' },
    { name: 'Garam Masala', qty: 1, unit: 'tsp' },
  ]

  const steps = [
    { n: 1, text: 'Marinate chicken with yogurt, lemon juice, and spices for 30 minutes.', dur: 30 },
    { n: 2, text: 'Heat butter in a pan, sauté onions until golden brown.', dur: 10 },
    { n: 3, text: 'Add ginger garlic paste and cook for 2 minutes until fragrant.', dur: 2 },
    { n: 4, text: 'Add tomato puree and cook on medium heat until oil separates.', dur: 15 },
    { n: 5, text: 'Add marinated chicken, cover and cook for 20 minutes.', dur: 20 },
    { n: 6, text: 'Finish with cream and garam masala. Simmer for 5 minutes.', dur: 5 },
  ]

  const scaleQty = (q) => {
    const scaled = (q * servings) / 2
    return scaled % 1 === 0 ? scaled : scaled.toFixed(1)
  }

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 40px 40px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            {[
              ['Home', 'home'],
              ['Recipes', 'recipes'],
              ['Chicken', 'recipes'],
              [recipe.title, null]
            ].map(([b, screen], i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <ChevronRight size={12} color="rgba(255,255,255,0.5)" />}
                <span onClick={() => screen && onNavigate && onNavigate(screen)} style={{ fontSize: 12, color: i === 3 ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: i === 3 ? 600 : 400, cursor: screen ? 'pointer' : 'default' }}>{b}</span>
              </span>
            ))}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 16 }}>{recipe.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
            <VegBadge isVeg={recipe.isVeg} />
            <RatingStars rating={recipe.rating} count={recipe.reviewCount} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}><Clock size={13} />{recipe.time}</span>
            <DifficultyBadge level={recipe.difficulty} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>👨‍🍳 {recipe.chef}</span>
          </div>
          {/* Action row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { icon: saved ? <BookmarkCheck size={16} color={C.primary} /> : <Bookmark size={16} />, label: saved ? 'Saved' : 'Save', action: () => setSaved(!saved), active: saved },
              { icon: <Plus size={16} />, label: 'Add to Meal Plan', action: () => onNavigate && onNavigate('meal-planner'), active: true },
              { icon: <Star size={16} fill={userRating > 0 ? C.gold : 'none'} color={userRating > 0 ? C.gold : '#fff'} />, label: 'Rate', action: () => setUserRating(5), active: userRating > 0 },
              { icon: <Heart size={16} fill={liked ? C.red : 'none'} color={liked ? C.red : '#fff'} />, label: liked ? 'Liked' : 'Like', action: () => setLiked(!liked), active: liked },
            ].map(a => (
              <button key={a.label} onClick={a.action}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: `1.5px solid ${a.active ? 'transparent' : 'rgba(255,255,255,0.3)'}`, background: a.active ? '#fff' : 'rgba(255,255,255,0.12)', color: a.active ? C.primary : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.15s', fontFamily: 'inherit' }}>
                {a.icon}{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Tabs ── */}
      <div style={{ position: 'sticky', top: 72, zIndex: 50, background: C.card, borderBottom: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 0, padding: '0 40px' }}>
          {['ingredients', 'steps', 'nutrition', 'tips'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '16px 24px', border: 'none', background: 'none', fontSize: 14, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? C.primary : C.ink2, cursor: 'pointer', fontFamily: 'inherit', borderBottom: `3px solid ${activeTab === tab ? C.primary : 'transparent'}`, textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* INGREDIENTS TAB */}
        {activeTab === 'ingredients' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: 0 }}>How many people are you cooking for?</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <button key={n} onClick={() => setServings(n)}
                    style={{ width: 36, height: 36, borderRadius: 10, border: `2px solid ${servings === n ? C.primary : C.border}`, background: servings === n ? C.primary : C.card, color: servings === n ? '#fff' : C.ink, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {n}
                  </button>
                ))}
                <button style={{ padding: '8px 14px', borderRadius: 10, border: `2px solid ${C.border}`, background: C.card, fontSize: 13, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>Custom</button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '10px 16px', background: C.primaryLight, borderRadius: 10 }}>
              <Info size={14} color={C.primary} />
              <span style={{ fontSize: 13, color: C.primaryDark }}>Ingredients scaled for <strong>{servings} people</strong></span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {baseIngredients.map((ing, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: i % 2 === 0 ? C.muted : C.card, border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.primary }} />
                    <span style={{ fontSize: 15, color: C.ink, fontWeight: 500 }}>{ing.name}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{scaleQty(ing.qty)} {ing.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEPS TAB */}
        {activeTab === 'steps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map(step => (
              <div key={step.n} style={{ display: 'flex', gap: 20, padding: '24px', background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(255,107,53,0.3)' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{step.n}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.7, margin: 0, marginBottom: step.dur ? 12 : 0 }}>{step.text}</p>
                  {step.dur && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EBF8FF', borderRadius: 8, padding: '5px 12px' }}>
                      <Clock size={12} color="#3182CE" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#3182CE' }}>⏱ {step.dur} min</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NUTRITION TAB */}
        {activeTab === 'nutrition' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Calories', value: recipe.calories, unit: 'kcal', color: C.primary, bg: C.primaryLight },
                { label: 'Protein', value: recipe.protein, unit: 'g', color: C.green, bg: '#E8F9F0' },
                { label: 'Carbs', value: recipe.carbs, unit: 'g', color: '#3182CE', bg: '#EBF8FF' },
                { label: 'Fat', value: recipe.fat, unit: 'g', color: C.red, bg: '#FFF0F1' },
              ].map(m => (
                <div key={m.label} style={{ background: m.bg, borderRadius: 16, padding: '24px', textAlign: 'center', border: `1px solid ${m.bg}` }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: m.color, marginTop: 4 }}>{m.unit}</div>
                  <div style={{ fontSize: 13, color: C.ink2, marginTop: 6 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', background: C.muted }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Nutrient</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Per Serving</span>
              </div>
              {[['Fiber', '2.5g'], ['Sugar', '4g'], ['Sodium', '480mg'], ['Potassium', '620mg'], ['Calcium', '80mg'], ['Iron', '3.2mg'], ['Vitamin C', '12mg'], ['Vitamin A', '450mcg']].map(([n, v], i) => (
                <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 20px', borderBottom: i < 7 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? C.card : C.muted }}>
                  <span style={{ fontSize: 14, color: C.ink2 }}>{n}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIPS TAB */}
        {activeTab === 'tips' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #FFF7E6 0%, #FFF0EA 100%)', borderRadius: 16, padding: '24px', marginBottom: 24, border: `1px solid rgba(246,201,14,0.3)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 18 }}>👨‍🍳</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Chef's Tips</span>
              </div>
              <p style={{ fontSize: 15, color: C.ink2, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                "For the best results, marinate the chicken overnight in the refrigerator. The longer it marinates, the more tender and flavorful it becomes. Always use fresh tomatoes over canned for a brighter, more authentic flavor."
              </p>
            </div>
            <div style={{ background: C.card, borderRadius: 16, padding: '24px', border: `1px solid ${C.border}`, marginBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: 0, marginBottom: 16 }}>Cooking Tips</h4>
              {['Use full-fat cream for the richest texture', 'Don\'t skip the butter — it gives that signature silky mouthfeel', 'A pinch of kasuri methi at the end elevates the aroma dramatically', 'For a smoky flavor, char the onions slightly before blending'].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <Check size={16} color={C.green} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: C.ink2, lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['#HighProtein', '#NonVeg', '#Dinner', '#Indian', '#MealPrep', '#NorthIndian'].map(tag => (
                <span key={tag} style={{ padding: '6px 14px', borderRadius: 999, background: C.primaryLight, color: C.primary, fontSize: 13, fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Related Recipes */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: "'Playfair Display', Georgia, serif" }}>You May Also Like</h3>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
            {TRENDING.map(r => <div key={r.id} style={{ scrollSnapAlign: 'start' }}><RecipeCard recipe={r} size="trending" /></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — INGREDIENT SEARCH
// ═══════════════════════════════════════════════════════════════════════════════
