
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
import { addFavorite, removeFavorite } from '@/features/recipes/api/engagement';

export function RecipeCard({ recipe, isFavorite = false, size = 'default', onClick }) {
  const [saved, setSaved] = useState(isFavorite)
  const [hov, setHov] = useState(false)

  useEffect(() => {
    setSaved(isFavorite);
  }, [isFavorite]);

  if (!recipe) return null;

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    const nextState = !saved;
    setSaved(nextState);
    try {
      if (nextState) {
        await addFavorite(recipe.id);
      } else {
        await removeFavorite(recipe.id);
      }
    } catch (err) {
      setSaved(!nextState);
    }
  };
  
  const coverImage = recipe?.cover_image_url || recipe?.image_url || recipe?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  const fallbackImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  const isVeg = recipe.food_type === 'veg'
  const isPremium = recipe.is_premium === 1 || recipe.is_premium === true
  const timeLabel = `${recipe.total_time_min || 0} mins`
  const calLabel = Math.round(recipe.calories_per_serving || 0)
  const rating = parseFloat(recipe.avg_rating || 0)
  const cuisineName = recipe.cuisine?.name || 'Indian'

  if (size === 'trending') {
    return (
      <div onClick={onClick} style={{ width: 240, flexShrink: 0, background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: hov ? '0 8px 30px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)', transition: 'all 0.22s ease', transform: hov ? 'translateY(-4px)' : 'none', cursor: 'pointer' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ position: 'relative', height: 140 }}>
          <img src={coverImage} alt={recipe.title} onError={(e) => { e.target.src = fallbackImg }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 8, left: 8 }}><VegBadge isVeg={isVeg} /></div>
          {isPremium && <div style={{ position: 'absolute', top: 8, right: 8 }}><PremiumBadge /></div>}
        </div>
        <div style={{ padding: '12px 14px' }}>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.35, marginBottom: 6 }}>{recipe.title}</h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <RatingStars rating={rating} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.ink2 }}><Clock size={11} />{timeLabel}</span>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flame size={12} color={C.primary} />
            <span style={{ fontSize: 12, color: C.ink2 }}>{calLabel} kcal</span>
            <span style={{ fontSize: 12, color: C.ink3 }}>·</span>
            <DifficultyBadge level={recipe.difficulty || 'medium'} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div onClick={onClick} style={{ background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: hov ? '0 8px 30px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)', transition: 'all 0.22s ease', transform: hov ? 'translateY(-4px)' : 'none', cursor: 'pointer', border: `1px solid ${C.border}` }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: 'relative', height: 200 }}>
        <img src={coverImage} alt={recipe.title} onError={(e) => { e.target.src = fallbackImg }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          <VegBadge isVeg={isVeg} />
          {isPremium && <PremiumBadge />}
        </div>
        <button onClick={handleBookmarkClick}
          style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          {saved ? <BookmarkCheck size={16} color={C.primary} fill={C.primary} /> : <Bookmark size={16} color={C.ink2} />}
        </button>
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#fff', background: 'rgba(0,0,0,0.45)', borderRadius: 6, padding: '3px 7px' }}>{cuisineName}</span>
        </div>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.ink, lineHeight: 1.35, marginBottom: 10 }}>{recipe.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.ink2 }}><Clock size={12} color={C.ink3} />{timeLabel}</span>
          <span style={{ color: C.border }}>|</span>
          <DifficultyBadge level={recipe.difficulty || 'medium'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <RatingStars rating={rating} count={recipe.rating_count || 0} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.ink2 }}>
            <Flame size={12} color={C.primary} /><span>{calLabel} kcal</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── NavBar (Logged-in) ───────────────────────────────────────────────────────
