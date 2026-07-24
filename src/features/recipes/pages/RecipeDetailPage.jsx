
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
import { fetchRecipeDetails, fetchScaledServings } from '@/features/recipes/api';
import { addFavorite, removeFavorite, rateRecipe, likeRecipe, submitReview } from '@/features/recipes/api/engagement';

export default function RecipeDetailPage({ onNavigate, isPremium, recipeId }) {
  const [activeTab, setActiveTab] = useState('ingredients')
  const [servings, setServings] = useState(2)
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
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
    if (!recipeId) return
    const loadData = async () => {
      try {
        setLoading(true)
        const res = await fetchRecipeDetails(recipeId)
        setRecipe(res.data)
        setServings(res.data.base_servings || 2)
        setBaseIngredients(res.data.recipe_ingredients || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [recipeId])

  if (loading) {
    return <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChefHat size={40} className="spin" color={C.primary} style={{ animation: 'spin 2s linear infinite', opacity: 0.5 }} /></div>
  }
  
  if (!recipe) {
    return <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh', padding: 40, textAlign: 'center' }}>Recipe not found.</div>
  }

  // We no longer need baseIngredients, steps, scaleQty logic locally since it comes from DB

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <img
          src={recipe.cover_image_url || recipe.image_url || recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop'}
          alt={recipe.title}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 40px 40px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            {[
              ['Home', 'home'],
              ['Recipes', 'recipes'],
              [recipe.category?.name || 'Recipe', 'recipes'],
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
            <VegBadge isVeg={recipe.food_type === 'veg'} />
            <RatingStars rating={parseFloat(recipe.avg_rating || 0)} count={recipe.rating_count || 0} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}><Clock size={13} />{recipe.total_time_min} mins</span>
            <DifficultyBadge level={recipe.difficulty || 'medium'} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>👨‍🍳 {recipe.created_by ? 'Chef' : 'Chef'}</span>
          </div>
          {/* Action row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={async () => {
                const nextState = !saved; setSaved(nextState);
                try { if (nextState) await addFavorite(recipe.id); else await removeFavorite(recipe.id); }
                catch (e) { setSaved(!nextState); }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: `1.5px solid ${saved ? 'transparent' : 'rgba(255,255,255,0.3)'}`, background: saved ? '#fff' : 'rgba(255,255,255,0.12)', color: saved ? C.primary : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.15s', fontFamily: 'inherit' }}>
              {saved ? <BookmarkCheck size={16} color={C.primary} /> : <Bookmark size={16} />}{saved ? 'Saved' : 'Save'}
            </button>
            <button onClick={() => onNavigate && onNavigate('meal-planner')}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: '1.5px solid transparent', background: '#fff', color: C.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.15s', fontFamily: 'inherit' }}>
              <Plus size={16} />Add to Meal Plan
            </button>
            <button onClick={() => setShowRatingModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: `1.5px solid ${userRating > 0 ? 'transparent' : 'rgba(255,255,255,0.3)'}`, background: userRating > 0 ? '#fff' : 'rgba(255,255,255,0.12)', color: userRating > 0 ? C.gold : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.15s', fontFamily: 'inherit' }}>
              <Star size={16} fill={userRating > 0 ? C.gold : 'none'} color={userRating > 0 ? C.gold : '#fff'} />
              {userRating > 0 ? `Rated ${userRating}★ (${recipe.rating_count || 0})` : `Rate & Review ✍️ (${recipe.rating_count || 0})`}
            </button>
            <button onClick={async () => {
                const nextLiked = !liked; setLiked(nextLiked);
                try { await likeRecipe(recipe.id, nextLiked ? 'like' : 'dislike'); }
                catch (e) { setLiked(!nextLiked); }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: `1.5px solid ${liked ? 'transparent' : 'rgba(255,255,255,0.3)'}`, background: liked ? '#fff' : 'rgba(255,255,255,0.12)', color: liked ? C.red : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.15s', fontFamily: 'inherit' }}>
              <Heart size={16} fill={liked ? C.red : 'none'} color={liked ? C.red : '#fff'} />{liked ? 'Liked' : 'Like'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Sticky Tabs ── */}
      <div style={{ position: 'sticky', top: 72, zIndex: 50, background: C.card, borderBottom: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 0, padding: '0 40px' }}>
          {['ingredients', 'steps', 'nutrition', 'reviews'].map(tab => (
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: 0 }}>How many people are you cooking for?</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <button key={n} onClick={() => { setServings(n); setShowCustomInput(false); }}
                    style={{ width: 36, height: 36, borderRadius: 10, border: `2px solid ${servings === n && !showCustomInput ? C.primary : C.border}`, background: servings === n && !showCustomInput ? C.primary : C.card, color: servings === n && !showCustomInput ? '#fff' : C.ink, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {n}
                  </button>
                ))}
                {showCustomInput ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number" min="1" max="100"
                      value={customValue}
                      autoFocus
                      onChange={e => setCustomValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const v = parseInt(customValue, 10);
                          if (v > 0 && v <= 100) setServings(v);
                          setShowCustomInput(false);
                        }
                        if (e.key === 'Escape') setShowCustomInput(false);
                      }}
                      style={{ width: 60, height: 36, borderRadius: 10, border: `2px solid ${C.primary}`, textAlign: 'center', fontSize: 14, fontWeight: 700, outline: 'none', fontFamily: 'inherit', color: C.ink }}
                    />
                    <button onClick={() => {
                      const v = parseInt(customValue, 10);
                      if (v > 0 && v <= 100) setServings(v);
                      setShowCustomInput(false);
                    }} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Set</button>
                  </div>
                ) : (
                  <button onClick={() => { setShowCustomInput(true); setCustomValue(servings); }}
                    style={{ padding: '8px 14px', borderRadius: 10, border: `2px solid ${C.border}`, background: C.card, fontSize: 13, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {servings > 6 ? `${servings} ✎` : 'Custom'}
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '10px 16px', background: C.primaryLight, borderRadius: 10 }}>
              <Info size={14} color={C.primary} />
              <span style={{ fontSize: 13, color: C.primaryDark }}>Ingredients scaled for <strong>{servings} people</strong></span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {baseIngredients.map((ing, i) => {
                const base = recipe?.base_servings || 1;
                const ratio = servings / base;

                // Parses notes text and scales all embedded numbers by ratio
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

                const nameText = ing.ingredient?.name || ing.name || ing.ingredient_name || '';
                const displayText = ing.notes
                  ? (ratio === 1 ? ing.notes : scaleNotes(ing.notes, ratio))
                  : (nameText || 'Ingredient');

                // Right-side quantity & unit calculation
                const baseQty = ing.quantity != null ? ing.quantity : 1;
                const scaledQty = Math.round((baseQty * ratio) * 10) / 10;
                const hasRealUnit = ing.unit && ing.unit.toLowerCase() !== 'unit';

                let quantityBadge = '';
                if (hasRealUnit) {
                  quantityBadge = `${scaledQty} ${ing.unit}`;
                } else if (!ing.notes) {
                  quantityBadge = `${scaledQty} pc`;
                }

                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: i % 2 === 0 ? C.muted : C.card, border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.primary, flexShrink: 0 }} />
                      <span style={{ fontSize: 15, color: C.ink, fontWeight: 500, lineHeight: 1.4 }}>{displayText}</span>
                    </div>
                    {quantityBadge && (
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '4px 12px', borderRadius: 8, whiteSpace: 'nowrap', marginLeft: 16 }}>
                        {quantityBadge}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEPS TAB */}
        {activeTab === 'steps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(recipe.steps || []).map(step => (
              <div key={step.step_number} style={{ display: 'flex', gap: 20, padding: '24px', background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(255,107,53,0.3)' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{step.step_number}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.7, margin: 0, marginBottom: step.duration_min ? 12 : 0 }}>{step.instruction}</p>
                  {step.duration_min > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EBF8FF', borderRadius: 8, padding: '5px 12px' }}>
                      <Clock size={12} color="#3182CE" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#3182CE' }}>⏱ {step.duration_min} min</span>
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
                { label: 'Calories', value: Math.round(recipe.calories_per_serving || 0), unit: 'kcal', color: C.primary, bg: C.primaryLight },
                { label: 'Protein', value: Math.round(recipe.protein_g || 0), unit: 'g', color: C.green, bg: '#E8F9F0' },
                { label: 'Carbs', value: Math.round(recipe.carbs_g || 0), unit: 'g', color: '#3182CE', bg: '#EBF8FF' },
                { label: 'Fat', value: Math.round(recipe.fat_g || 0), unit: 'g', color: C.red, bg: '#FFF0F1' },
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
              {recipe.nutrition ? [
                ['Fiber', `${Math.round(recipe.fiber_g || 0)}g`],
                ['Sugar', `${Math.round(recipe.nutrition.sugar_g || 0)}g`],
                ['Sodium', `${Math.round(recipe.nutrition.sodium_mg || 0)}mg`],
                ['Cholesterol', `${Math.round(recipe.nutrition.cholesterol_mg || 0)}mg`]
              ].map(([n, v], i) => (
                <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 20px', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? C.card : C.muted }}>
                  <span style={{ fontSize: 14, color: C.ink2 }}>{n}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{v}</span>
                </div>
              )) : (
                <div style={{ padding: 20, textAlign: 'center', color: C.ink2, fontSize: 14 }}>Detailed nutrition not available</div>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div>
            {/* Submit Review Box */}
            <div style={{ background: C.card, borderRadius: 16, padding: '24px', border: `1px solid ${C.border}`, marginBottom: 32 }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0, marginBottom: 16 }}>Rate & Review this Recipe</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: C.ink2, fontWeight: 500 }}>Your Rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={async () => {
                      const isFirstRate = userRating === 0;
                      setUserRating(star);
                      try {
                        const res = await rateRecipe(recipe.id, star);
                        setRecipe(prev => ({
                          ...prev,
                          avg_rating: res?.avg_rating != null ? res.avg_rating : prev.avg_rating,
                          rating_count: res?.rating_count != null ? res.rating_count : (prev.rating_count || 0) + (isFirstRate ? 1 : 0)
                        }));
                      } catch (e) {}
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Star size={24} fill={star <= userRating ? C.gold : 'none'} color={star <= userRating ? C.gold : C.ink3} />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                placeholder="Share your cooking experience, tips, or flavor feedback..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16, resize: 'vertical' }}
              />
              <Button
                variant="primary"
                size="md"
                disabled={submittingReview || !reviewComment.trim()}
                onClick={async () => {
                  try {
                    setSubmittingReview(true);
                    await submitReview(recipe.id, reviewComment.trim());
                    setReviewsList(prev => [{ user: 'You', comment: reviewComment.trim(), created_at: 'Just now', rating: userRating || 5 }, ...prev]);
                    setReviewComment('');
                  } catch (e) {
                    alert(e.message || 'Failed to submit review');
                  } finally {
                    setSubmittingReview(false);
                  }
                }}>
                {submittingReview ? 'Submitting...' : 'Post Review 💬'}
              </Button>
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>Community Reviews</h4>
              {reviewsList.length > 0 ? (
                reviewsList.map((rev, idx) => (
                  <div key={idx} style={{ background: C.card, borderRadius: 12, padding: '16px 20px', border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.primary, fontSize: 13 }}>
                          {rev.user ? rev.user[0].toUpperCase() : 'U'}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{rev.user || 'User'}</span>
                      </div>
                      <span style={{ fontSize: 12, color: C.ink3 }}>{rev.created_at || 'Recently'}</span>
                    </div>
                    <RatingStars rating={rev.rating || 5} />
                    <p style={{ fontSize: 14, color: C.ink2, marginTop: 8, margin: 0, lineHeight: 1.5 }}>{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0', color: C.ink2, fontSize: 14 }}>Be the first to review this recipe!</div>
              )}
            </div>
          </div>
        )}

        {/* Related Recipes */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: "'Playfair Display', Georgia, serif" }}>You May Also Like</h3>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
            {/* Related recipes would be fetched here, for now using mock TRENDING to keep layout intact */}
            {TRENDING.slice(0, 4).map(r => <div key={r.id} style={{ scrollSnapAlign: 'start' }}><RecipeCard recipe={r} size="trending" /></div>)}
          </div>
        </div>
      </div>

      {/* ── Interactive Rate & Review Modal ── */}
      {showRatingModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowRatingModal(false)}>
          <div style={{ background: C.card, borderRadius: 24, padding: 32, maxWidth: 440, width: '90%', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>Rate & Review Recipe</h3>
            <p style={{ fontSize: 14, color: C.ink2, margin: 0, marginBottom: 20 }}>How was your experience cooking {recipe.title}?</p>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Your Star Rating:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setUserRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Star size={30} fill={star <= userRating ? C.gold : 'none'} color={star <= userRating ? C.gold : C.ink3} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Write your review (optional):</div>
              <textarea
                rows={3}
                placeholder="Write your feedback, tips, or taste notes..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                variant="primary"
                size="md"
                disabled={submittingReview || userRating === 0}
                onClick={async () => {
                  try {
                    setSubmittingReview(true);
                    const isFirstRate = userRating > 0 && recipe.user_rating == null;
                    if (userRating > 0) {
                      const res = await rateRecipe(recipe.id, userRating);
                      setRecipe(prev => ({
                        ...prev,
                        avg_rating: res?.avg_rating != null ? res.avg_rating : prev.avg_rating,
                        rating_count: res?.rating_count != null ? res.rating_count : (prev.rating_count || 0) + (isFirstRate ? 1 : 0)
                      }));
                    }
                    if (reviewComment.trim()) {
                      await submitReview(recipe.id, reviewComment.trim());
                      setReviewsList(prev => [{ user: 'You', comment: reviewComment.trim(), created_at: 'Just now', rating: userRating || 5 }, ...prev]);
                      setReviewComment('');
                    }
                    setShowRatingModal(false);
                  } catch (e) {
                    alert(e.message || 'Failed to submit review');
                  } finally {
                    setSubmittingReview(false);
                  }
                }}>
                {submittingReview ? 'Submitting...' : 'Submit Rating & Review'}
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
