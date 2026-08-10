
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

import { fetchRecipesByIngredients } from '@/features/recipes/api';

export default function IngredientSearchPage({ onNavigate }) {
  const [input, setInput] = useState('')
  const [ingredients, setIngredients] = useState(['Onion', 'Rice', 'Curd'])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const addIngredient = () => {
    if (input.trim() && !ingredients.includes(input.trim())) {
      setIngredients(prev => [...prev, input.trim()])
      setInput('')
    }
  }

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    try {
      setLoading(true)
      setSearched(true)
      const res = await fetchRecipesByIngredients(ingredients)
      const data = res?.data || []
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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

          <button onClick={handleSearch} disabled={loading} style={{ width: '100%', padding: '14px', background: ingredients.length === 0 ? '#ccc' : `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: ingredients.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: ingredients.length > 0 ? '0 4px 16px rgba(255,107,53,0.35)' : 'none' }}>
            <Search size={18} />{loading ? 'Searching Recipes...' : 'Find Matching Recipes'}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '12px 16px', background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <CheckCircle size={18} color={C.green} />
              <span style={{ fontSize: 15, color: C.ink }}><strong style={{ color: C.green }}>{results.length} recipes found</strong> matching your search</span>
            </div>
            {results.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {results.map(r => (
                  <div
                    key={r.id || r.recipe_id}
                    onClick={() => onNavigate && onNavigate('recipe-detail', { recipeId: r.id || r.recipe_id })}
                    style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ position: 'relative', height: 160, width: '100%', background: C.muted }}>
                      <img
                        src={r.cover_image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&fit=crop'}
                        alt={r.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: 12, right: 12, background: C.green, borderRadius: 999, padding: '4px 12px', color: '#fff', fontSize: 12, fontWeight: 800, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                        {r.match_score || 100}% Match
                      </div>
                      {r.food_type && (
                        <div style={{ position: 'absolute', top: 12, left: 12 }}>
                          <VegBadge type={r.food_type} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: '0 0 8px', lineHeight: 1.3 }}>{r.title}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: C.ink2, marginBottom: 12 }}>
                          {r.total_time_min && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {r.total_time_min} mins</span>}
                          {r.difficulty && <span style={{ textTransform: 'capitalize' }}>• {r.difficulty}</span>}
                        </div>
                        {r.matched_ingredients && r.matched_ingredients.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                            {r.matched_ingredients.map((m, idx) => (
                              <span key={idx} style={{ fontSize: 10, fontWeight: 700, color: C.green, background: '#ECFDF5', padding: '2px 6px', borderRadius: 4 }}>
                                ✓ {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                        View Recipe <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: C.ink3 }}>
                <Search size={32} color={C.ink3} style={{ marginBottom: 12 }} />
                <div>No recipes found matching these ingredients. Try adding ingredients like "Rice", "Onion", "Curd", or "Chicken"!</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 5 — AI MEAL PLANNER
// ═══════════════════════════════════════════════════════════════════════════════
