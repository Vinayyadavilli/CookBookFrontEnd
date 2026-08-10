
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
  CheckCircle, Package, Soup, Carrot, ThumbsUp, Utensils, Timer,
  Lightbulb, Pencil
} from 'lucide-react';
import { C } from '@/shared/theme/tokens';
import { VegBadge, PremiumBadge, DifficultyBadge } from '@/shared/components/ui/Badges';
import { RatingStars } from '@/shared/components/ui/RatingStars';
import { Button } from '@/shared/components/ui/Button';
import { NavBar } from '@/shared/components/navigation/NavBar';
import { LandingNavBar } from '@/shared/components/navigation/LandingNavBar';
import { fetchRecipeDetails, fetchScaledServings, fetchRecipes } from '@/features/recipes/api';
import { addFavorite, removeFavorite, rateRecipe, likeRecipe, submitReview, fetchReviews } from '@/features/recipes/api/engagement';

export default function RecipeDetailPage({ onNavigate, isPremium, recipeId }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [servings, setServings] = useState(2)
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [baseIngredients, setBaseIngredients] = useState([])
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewsList, setReviewsList] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        let targetId = recipeId;
        if (!targetId) {
          const listRes = await fetchRecipes({ limit: 1 })
          if (listRes?.data?.[0]?.id) {
            targetId = listRes.data[0].id
          }
        }
        if (!targetId) {
          setLoading(false)
          return
        }
        const res = await fetchRecipeDetails(targetId)
        setRecipe(res.data)
        setServings(res.data.base_servings || 2)
        setBaseIngredients(res.data.recipe_ingredients || [])
        setLikeCount(res.data.like_count || 0)
        // Fetch reviews from API
        try {
          const revRes = await fetchReviews(targetId)
          if (revRes?.data && Array.isArray(revRes.data)) setReviewsList(revRes.data)
        } catch (revErr) { /* reviews endpoint optional */ }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [recipeId])

  if (loading) {
    return <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChefHat size={40} color={C.primary} style={{ animation: 'spin 2s linear infinite', opacity: 0.5 }} /></div>
  }
  
  if (!recipe) {
    return <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh', padding: 40, textAlign: 'center' }}>Recipe not found.</div>
  }

  const heroImg = recipe.cover_image_url || recipe.image_url || recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop';
  const fallbackImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop';
  const avgRating = parseFloat(recipe.avg_rating || 0);
  const ratingCount = recipe.rating_count || 0;
  const prepTime = recipe.prep_time_min || 0;
  const cookTime = recipe.cook_time_min || 0;

  // Ingredient scaling helper
  const scaleNotes = (text, r) => {
    if (!text) return text;
    return text.replace(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)/g, (match, p1, p2, p3) => {
      let val = p1 !== undefined ? parseFloat(p1) / parseFloat(p2) : parseFloat(p3);
      const scaled = val * r;
      const rounded = Math.round(scaled * 10) / 10;
      const fractions = [[3/4,'¾'],[2/3,'⅔'],[1/2,'½'],[1/3,'⅓'],[1/4,'¼']];
      for (const [f, sym] of fractions) {
        if (Math.abs(rounded - f) < 0.07) return sym;
      }
      return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    });
  };

  const tabItems = [
    { id: 'overview', icon: <LayoutDashboard size={15} />, label: 'Overview' },
    { id: 'ingredients', icon: <Pencil size={15} />, label: 'Ingredients' },
    { id: 'steps', icon: <Utensils size={15} />, label: 'Step by Step' },
    { id: 'nutrition', icon: <PieChart size={15} />, label: 'Nutrition' },
    { id: 'reviews', icon: <Star size={15} />, label: `Reviews (${ratingCount})` },
    ...(recipe.chef_tips || recipe.cooking_tips ? [{ id: 'tips', icon: <Lightbulb size={15} />, label: 'Tips' }] : []),
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── HERO SECTION — Dark warm background, split layout ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B12 30%, #3D2415 60%, #1A1A2E 100%)',
        paddingTop: 72, position: 'relative', overflow: 'hidden'
      }}>
        {/* Subtle pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 36px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 36, alignItems: 'center', position: 'relative' }}>
          
          {/* ── LEFT COLUMN: Recipe Info ── */}
          <div>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              {[
                ['Home', 'home'],
                ['Recipes', 'recipes'],
                [recipe.category?.name || 'Recipe', 'recipes'],
                [recipe.title, null]
              ].map(([b, screen], i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {i > 0 && <ChevronRight size={12} color="rgba(255,255,255,0.35)" />}
                  <span onClick={() => screen && onNavigate && onNavigate(screen)}
                    style={{ fontSize: 13, color: i === 3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', fontWeight: i === 3 ? 600 : 400, cursor: screen ? 'pointer' : 'default' }}>
                    {b}
                  </span>
                </span>
              ))}
            </div>

            {/* Badge row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 999, background: recipe.food_type === 'veg' ? '#22C55E' : '#EF4444', color: '#fff', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                {recipe.food_type === 'veg' ? 'VEG' : 'NON-VEG'}
              </span>
              {recipe.difficulty && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 999, background: C.primary, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {recipe.difficulty}
                </span>
              )}
              {recipe.is_featured ? (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: '#fff', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(8px)' }}>
                  <ChefHat size={12} /> CHEF SPECIAL
                </span>
              ) : null}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(34px, 3.5vw, 48px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              {recipe.title}
            </h1>

            {/* Description */}
            {recipe.description && (
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', margin: '0 0 22px', width: '100%', fontWeight: 400 }}>
                {recipe.description}
              </p>
            )}

            {/* Rating + Time + Chef */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(avgRating) ? '#F6C90E' : 'none'} color={s <= Math.round(avgRating) ? '#F6C90E' : 'rgba(255,255,255,0.3)'} />
                ))}
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginLeft: 4 }}>{avgRating.toFixed(1)}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>({ratingCount})</span>
              </div>
              <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                <Clock size={15} color="rgba(255,255,255,0.5)" /> {recipe.total_time_min || (prepTime + cookTime) || '—'} mins
              </span>
              {recipe.is_featured && (
                <>
                  <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                    <ChefHat size={15} color="rgba(255,255,255,0.5)" /> Chef Special
                  </span>
                </>
              )}
            </div>

            {/* Nutrition quick strip */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.06)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 28, backdropFilter: 'blur(8px)' }}>
              {[
                { label: 'CALORIES', val: `${Math.round(recipe.calories_per_serving || 0)}`, unit: 'kcal', color: C.primary },
                { label: 'PROTEIN', val: `${Math.round(recipe.protein_g || 0)}`, unit: 'g', color: '#22C55E' },
                { label: 'CARBS', val: `${Math.round(recipe.carbs_g || 0)}`, unit: 'g', color: '#3B82F6' },
                { label: 'FAT', val: `${Math.round(recipe.fat_g || 0)}`, unit: 'g', color: '#F59E0B' },
              ].map((n, i) => (
                <div key={n.label} style={{ padding: '14px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: 4 }}>{n.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: n.color, lineHeight: 1 }}>
                    {n.val} <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>{n.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={async () => {
                  const nextState = !saved; setSaved(nextState);
                  try { if (nextState) await addFavorite(recipe.id); else await removeFavorite(recipe.id); }
                  catch (e) { setSaved(!nextState); }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.2)', background: saved ? '#fff' : 'transparent', color: saved ? C.ink : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                {saved ? <BookmarkCheck size={16} color={C.primary} /> : <Bookmark size={16} />}{saved ? 'Saved' : 'Save'}
              </button>

              <button onClick={() => onNavigate && onNavigate('meal-planner')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,107,53,0.4)', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                <Plus size={16} />Add to Meal Plan
              </button>

              <button onClick={() => setShowRatingModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, border: 'none', background: userRating > 0 ? C.gold : 'rgba(246,201,14,0.85)', color: userRating > 0 ? '#1A1A2E' : '#1A1A2E', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                <Star size={16} fill="#1A1A2E" color="#1A1A2E" />
                {userRating > 0 ? `Rated ${userRating}.0` : `Rated ${avgRating.toFixed(1)}`}
              </button>

              <button onClick={async () => {
                  const nextLiked = !liked; setLiked(nextLiked);
                  setLikeCount(prev => nextLiked ? prev + 1 : prev - 1);
                  try { await likeRecipe(recipe.id, nextLiked ? 'like' : 'dislike'); }
                  catch (e) { setLiked(!nextLiked); setLikeCount(prev => nextLiked ? prev - 1 : prev + 1); }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.2)', background: liked ? 'rgba(252,92,101,0.15)' : 'transparent', color: liked ? '#FF6B7A' : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                <Heart size={16} fill={liked ? '#FF6B7A' : 'none'} />{liked ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Recipe Image ── */}
          <div style={{ position: 'relative' }}>
            {/* Share button */}
            <button style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', color: C.ink, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <Share2 size={14} /> Share
            </button>
            {/* Like count */}
            <div style={{ position: 'absolute', top: 60, right: 16, zIndex: 10, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', color: C.ink, fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <Heart size={15} color={C.red} fill={C.red} /> {likeCount}
            </div>
            
            {/* Image frame */}
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.4)', border: '3px solid rgba(255,255,255,0.08)', aspectRatio: '4/3' }}>
              <img
                src={heroImg} alt={recipe.title}
                onError={(e) => { e.target.src = fallbackImg }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            
            {/* Calorie badge */}
            {recipe.calories_per_serving > 0 && (
              <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 12, background: 'rgba(26,26,46,0.88)', backdropFilter: 'blur(12px)', color: '#fff', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Flame size={15} color={C.primary} /> {Math.round(recipe.calories_per_serving)} kcal / serving
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB NAVIGATION ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'sticky', top: 72, zIndex: 50, background: C.card, borderBottom: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 0, padding: '0 24px', overflowX: 'auto' }}>
          {tabItems.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '15px 20px', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500, color: activeTab === t.id ? C.primary : C.ink2, cursor: 'pointer', fontFamily: 'inherit', borderBottom: `3px solid ${activeTab === t.id ? C.primary : 'transparent'}`, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB CONTENT ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div>
            {/* Top row: Recipe details + What people are saying */}
            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 28, marginBottom: 36 }}>
              {/* Recipe highlights */}
              <div style={{ background: C.card, borderRadius: 20, padding: '28px', border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Heart size={18} color={C.red} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.primary }}>About this recipe</span>
                </div>
                {recipe.description && (
                  <p style={{ fontSize: 13, color: C.ink2, lineHeight: 1.6, margin: '0 0 16px' }}>{recipe.description}</p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recipe.category?.name && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <CheckCircle size={16} color={C.green} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.ink2 }}>Category: <strong style={{ color: C.ink }}>{recipe.category.name}</strong></span>
                    </div>
                  )}
                  {recipe.cuisine?.name && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <CheckCircle size={16} color={C.green} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.ink2 }}>Cuisine: <strong style={{ color: C.ink }}>{recipe.cuisine.name}</strong></span>
                    </div>
                  )}
                  {likeCount > 0 && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Heart size={16} color={C.red} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.ink2 }}>Liked by <strong style={{ color: C.ink }}>{likeCount}</strong> people</span>
                    </div>
                  )}
                  {recipe.view_count > 0 && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Eye size={16} color={C.ink3} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.ink2 }}><strong style={{ color: C.ink }}>{recipe.view_count}</strong> views</span>
                    </div>
                  )}
                </div>
                {recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
                  <div style={{ marginTop: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {recipe.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: 11, fontWeight: 600, color: C.ink2, background: C.muted, padding: '4px 10px', borderRadius: 8, border: `1px solid ${C.border}` }}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* What people are saying */}
              <div style={{ background: C.card, borderRadius: 20, padding: '28px', border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>What people are saying</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= Math.round(avgRating) ? C.gold : 'none'} color={s <= Math.round(avgRating) ? C.gold : C.ink3} />)}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{avgRating.toFixed(1)} out of 5</span>
                      <span style={{ fontSize: 13, color: C.ink3 }}>Based on {ratingCount} reviews</span>
                    </div>
                  </div>
                  <button onClick={() => setShowRatingModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, border: `1.5px solid ${C.primary}`, background: 'transparent', color: C.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                    <Pencil size={14} /> Write a Review
                  </button>
                </div>

                {/* Review cards row — only real reviews */}
                {reviewsList.length > 0 ? (
                  <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                    {reviewsList.slice(0, 5).map((rev, idx) => (
                      <div key={idx} style={{ background: C.muted, borderRadius: 16, padding: '20px', minWidth: 260, maxWidth: 280, border: `1px solid ${C.border}`, flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primaryLight}, #FFD4C0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.primary, fontSize: 14 }}>
                            {(rev.user || rev.full_name || 'U')[0].toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{rev.user || rev.full_name || 'User'}</span>
                          </div>
                          <span style={{ fontSize: 11, color: C.ink3 }}>{rev.created_at || ''}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                          {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= (rev.rating || 5) ? C.gold : 'none'} color={s <= (rev.rating || 5) ? C.gold : C.ink3} />)}
                        </div>
                        <p style={{ fontSize: 13, color: C.ink2, margin: 0, lineHeight: 1.55 }}>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: C.ink3 }}>
                    <MessageCircle size={28} color={C.ink3} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 14 }}>No reviews yet. Be the first to share your experience!</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom info strip: Prep Time, Cook Time, Servings, Difficulty */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { icon: <Clock size={22} />, label: 'Prep Time', value: prepTime > 0 ? `${prepTime} mins` : '—', bg: '#EFF6FF', color: '#3B82F6' },
                { icon: <Timer size={22} />, label: 'Cook Time', value: cookTime > 0 ? `${cookTime} mins` : '—', bg: C.primaryLight, color: C.primary },
                { icon: <Users size={22} />, label: 'Servings', value: `${recipe.base_servings || 2} people`, bg: '#ECFDF5', color: '#22C55E' },
                { icon: <BarChart3 size={22} />, label: 'Difficulty', value: recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : '—', bg: '#FFFBEB', color: '#F59E0B' },
              ].map(item => (
                <div key={item.label} style={{ background: C.card, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.ink3, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.ink }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INGREDIENTS TAB ── */}
        {activeTab === 'ingredients' && (
          <div>
            {/* Servings selector */}
            <div style={{ background: C.card, borderRadius: 20, padding: '24px 28px', border: `1px solid ${C.border}`, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>Adjust Servings</h3>
                  <p style={{ fontSize: 13, color: C.ink2, margin: '4px 0 0' }}>Scaled for <strong style={{ color: C.primary }}>{servings} {servings === 1 ? 'person' : 'people'}</strong></p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button key={n} onClick={() => { setServings(n); setShowCustomInput(false); }}
                      style={{ width: 40, height: 40, borderRadius: 12, border: `2px solid ${servings === n && !showCustomInput ? C.primary : C.border}`, background: servings === n && !showCustomInput ? C.primary : C.card, color: servings === n && !showCustomInput ? '#fff' : C.ink, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {n}
                    </button>
                  ))}
                  {showCustomInput ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="number" min="1" max="100" value={customValue} autoFocus
                        onChange={e => setCustomValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { const v = parseInt(customValue, 10); if (v > 0 && v <= 100) setServings(v); setShowCustomInput(false); }
                          if (e.key === 'Escape') setShowCustomInput(false);
                        }}
                        style={{ width: 56, height: 40, borderRadius: 12, border: `2px solid ${C.primary}`, textAlign: 'center', fontSize: 15, fontWeight: 700, outline: 'none', fontFamily: 'inherit', color: C.ink }}
                      />
                      <button onClick={() => { const v = parseInt(customValue, 10); if (v > 0 && v <= 100) setServings(v); setShowCustomInput(false); }}
                        style={{ padding: '10px 14px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Set</button>
                    </div>
                  ) : (
                    <button onClick={() => { setShowCustomInput(true); setCustomValue(servings); }}
                      style={{ padding: '10px 14px', borderRadius: 12, border: `2px solid ${C.border}`, background: C.card, fontSize: 13, fontWeight: 600, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {servings > 6 ? `${servings} ✎` : 'Custom'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients list */}
            <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ padding: '14px 24px', background: C.muted, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={16} color={C.primary} />
                <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{baseIngredients.length} Ingredients</span>
              </div>
              {baseIngredients.map((ing, i) => {
                const base = recipe?.base_servings || 1;
                const ratio = servings / base;
                const nameText = ing.ingredient?.name || ing.name || ing.ingredient_name || '';
                const displayText = ing.notes ? (ratio === 1 ? ing.notes : scaleNotes(ing.notes, ratio)) : (nameText || 'Ingredient');
                const baseQty = ing.quantity != null ? ing.quantity : 1;
                const scaledQty = Math.round((baseQty * ratio) * 10) / 10;
                const hasRealUnit = ing.unit && ing.unit.toLowerCase() !== 'unit';
                let quantityBadge = '';
                if (hasRealUnit) quantityBadge = `${scaledQty} ${ing.unit}`;
                else if (!ing.notes) quantityBadge = `${scaledQty} pc`;

                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: i < baseIngredients.length - 1 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? C.card : C.muted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.primary, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{displayText}</span>
                    </div>
                    {quantityBadge && (
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '4px 12px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                        {quantityBadge}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEPS TAB ── */}
        {activeTab === 'steps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: 0 }}>Step by Step Instructions</h3>
              <p style={{ fontSize: 13, color: C.ink3, margin: '4px 0 0' }}>{(recipe.steps || []).length} steps to cook the perfect {recipe.title}</p>
            </div>
            {(recipe.steps || []).map(step => (
              <div key={step.step_number} style={{ display: 'flex', gap: 20, padding: '24px 28px', background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(255,107,53,0.3)' }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>{step.step_number}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.7, margin: 0, marginBottom: step.duration_min ? 12 : 0 }}>{step.instruction}</p>
                  {step.duration_min > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', borderRadius: 8, padding: '5px 12px', border: '1px solid #DBEAFE' }}>
                      <Clock size={12} color="#3B82F6" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#3B82F6' }}>{step.duration_min} min</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── NUTRITION TAB ── */}
        {activeTab === 'nutrition' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Calories', value: Math.round(recipe.calories_per_serving || 0), unit: 'kcal', color: C.primary, bg: C.primaryLight, icon: <Flame size={22} /> },
                { label: 'Protein', value: Math.round(recipe.protein_g || 0), unit: 'g', color: '#22C55E', bg: '#ECFDF5', icon: <Dumbbell size={22} /> },
                { label: 'Carbs', value: Math.round(recipe.carbs_g || 0), unit: 'g', color: '#3B82F6', bg: '#EFF6FF', icon: <Carrot size={22} /> },
                { label: 'Fat', value: Math.round(recipe.fat_g || 0), unit: 'g', color: '#F59E0B', bg: '#FFFBEB', icon: <Droplets size={22} /> },
              ].map(m => (
                <div key={m.label} style={{ background: m.bg, borderRadius: 20, padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0.25, color: m.color }}>{m.icon}</div>
                  <div style={{ fontSize: 42, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: m.color, marginTop: 4 }}>{m.unit}</div>
                  <div style={{ fontSize: 13, color: C.ink2, marginTop: 8 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '14px 24px', background: C.muted, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Nutrient</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Per Serving</span>
              </div>
              {recipe.nutrition ? [
                ['Fiber', `${Math.round(recipe.fiber_g || 0)}g`],
                ['Sugar', `${Math.round(recipe.nutrition.sugar_g || 0)}g`],
                ['Sodium', `${Math.round(recipe.nutrition.sodium_mg || 0)}mg`],
                ['Cholesterol', `${Math.round(recipe.nutrition.cholesterol_mg || 0)}mg`]
              ].map(([n, v], i) => (
                <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 24px', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? C.card : C.muted }}>
                  <span style={{ fontSize: 14, color: C.ink2 }}>{n}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{v}</span>
                </div>
              )) : (
                <div style={{ padding: 24, textAlign: 'center', color: C.ink2, fontSize: 14 }}>Detailed nutrition data not available</div>
              )}
            </div>
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ background: C.card, borderRadius: 20, padding: '28px', border: `1px solid ${C.border}`, marginBottom: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: '0 0 16px' }}>Write a Review</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: C.ink2, fontWeight: 500 }}>Your Rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={async () => {
                      const isFirstRate = userRating === 0; setUserRating(star);
                      try { const res = await rateRecipe(recipe.id, star); setRecipe(prev => ({ ...prev, avg_rating: res?.avg_rating ?? prev.avg_rating, rating_count: res?.rating_count ?? (prev.rating_count || 0) + (isFirstRate ? 1 : 0) })); } catch (e) {}
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Star size={26} fill={star <= userRating ? C.gold : 'none'} color={star <= userRating ? C.gold : C.ink3} />
                  </button>
                ))}
              </div>
              <textarea rows={4} placeholder="Share your cooking experience, tips, or flavor feedback..."
                value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                style={{ width: '100%', padding: '16px 18px', borderRadius: 14, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16, resize: 'vertical', background: C.muted, minHeight: 110, lineHeight: 1.6 }}
              />
              <Button variant="primary" size="md" disabled={submittingReview || !reviewComment.trim()}
                onClick={async () => {
                  try { setSubmittingReview(true); await submitReview(recipe.id, reviewComment.trim());
                    setReviewsList(prev => [{ user: 'You', comment: reviewComment.trim(), created_at: 'Just now', rating: userRating || 5, verified: true }, ...prev]);
                    setReviewComment('');
                  } catch (e) { alert(e.message || 'Failed to submit review'); } finally { setSubmittingReview(false); }
                }}>
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </Button>
            </div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: '0 0 16px' }}>All Reviews</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(reviewsList.length > 0 ? reviewsList : []).map((rev, idx) => (
                <div key={idx} style={{ background: C.card, borderRadius: 16, padding: '20px 24px', border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primaryLight}, #FFD4C0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.primary, fontSize: 14 }}>{rev.user?.[0] || 'U'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{rev.user || 'User'}</span>
                        {rev.verified && <span style={{ fontSize: 10, fontWeight: 600, color: C.green, background: '#ECFDF5', padding: '2px 6px', borderRadius: 4 }}>✓ Verified</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: C.ink3 }}>{rev.created_at || 'Recently'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>{[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= (rev.rating || 5) ? C.gold : 'none'} color={s <= (rev.rating || 5) ? C.gold : C.ink3} />)}</div>
                  <p style={{ fontSize: 14, color: C.ink2, margin: 0, lineHeight: 1.55 }}>{rev.comment}</p>
                </div>
              ))}
              {reviewsList.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: C.ink2, fontSize: 14 }}>
                  <MessageCircle size={32} color={C.ink3} style={{ marginBottom: 12 }} />
                  <div>Be the first to review this recipe!</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TIPS TAB (only shown if backend has tips data) ── */}
        {activeTab === 'tips' && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: '0 0 20px' }}>Cooking Tips & Tricks</h3>
            {recipe.chef_tips && (
              <div style={{ background: C.card, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, marginBottom: 14, display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>👨‍🍳</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Chef Tips</div>
                  <div style={{ fontSize: 14, color: C.ink2, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{recipe.chef_tips}</div>
                </div>
              </div>
            )}
            {recipe.cooking_tips && (
              <div style={{ background: C.card, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>🔥</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Cooking Tips</div>
                  <div style={{ fontSize: 14, color: C.ink2, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{recipe.cooking_tips}</div>
                </div>
              </div>
            )}
            {!recipe.chef_tips && !recipe.cooking_tips && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: C.ink3 }}>
                <Lightbulb size={32} color={C.ink3} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 14 }}>No tips available for this recipe yet.</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── RATE & REVIEW MODAL ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showRatingModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowRatingModal(false)}>
          <div style={{ background: C.card, borderRadius: 24, padding: 36, maxWidth: 460, width: '90%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>Rate & Review</h3>
            <p style={{ fontSize: 14, color: C.ink2, margin: '0 0 24px' }}>How was your experience cooking <strong>{recipe.title}</strong>?</p>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Your Star Rating:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setUserRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'transform 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <Star size={32} fill={star <= userRating ? C.gold : 'none'} color={star <= userRating ? C.gold : C.ink3} />
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Write your review (optional):</div>
              <textarea rows={4} placeholder="Write your feedback, tips, or taste notes..."
                value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', background: C.muted }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="primary" size="md" disabled={submittingReview || userRating === 0}
                onClick={async () => {
                  try {
                    setSubmittingReview(true);
                    const isFirstRate = userRating > 0 && recipe.user_rating == null;
                    if (userRating > 0) { const res = await rateRecipe(recipe.id, userRating); setRecipe(prev => ({ ...prev, avg_rating: res?.avg_rating ?? prev.avg_rating, rating_count: res?.rating_count ?? (prev.rating_count || 0) + (isFirstRate ? 1 : 0) })); }
                    if (reviewComment.trim()) { await submitReview(recipe.id, reviewComment.trim()); setReviewsList(prev => [{ user: 'You', comment: reviewComment.trim(), created_at: 'Just now', rating: userRating || 5, verified: true }, ...prev]); setReviewComment(''); }
                    setShowRatingModal(false);
                  } catch (e) { alert(e.message || 'Failed to submit review'); } finally { setSubmittingReview(false); }
                }}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button variant="outline" size="md" onClick={() => setShowRatingModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — INGREDIENT SEARCH
// ═══════════════════════════════════════════════════════════════════════════════
