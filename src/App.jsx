import { useState, useEffect } from 'react';
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
import { ALL_SCREENS, RECIPES, CATEGORIES } from '@/shared/data/mockData';
import { VegBadge } from '@/shared/components/ui/Badges';
import { RatingStars } from '@/shared/components/ui/RatingStars';
import { Button } from '@/shared/components/ui/Button';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import HomeDashboard from '@/features/home/pages/HomeDashboard';
import RecipeBrowsePage from '@/features/recipes/pages/RecipeBrowsePage';
import RecipeDetailPage from '@/features/recipes/pages/RecipeDetailPage';
import IngredientSearchPage from '@/features/ai/pages/IngredientSearchPage';
import MealPlannerPage from '@/features/meal-planner/pages/MealPlannerPage';
import GroceryListPage from '@/features/grocery/pages/GroceryListPage';
import AIChatPage from '@/features/ai/pages/AIChatPage';
import FavoritesPage from '@/features/user/pages/FavoritesPage';
import ProfilePage from '@/features/user/pages/ProfilePage';
import SubscriptionPage from '@/features/user/pages/SubscriptionPage';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import NotificationsPage from '@/features/notifications/pages/NotificationsPage';
import AuthScreen from '@/features/auth/pages/AuthScreen';
import OnboardingScreen from '@/features/auth/pages/OnboardingScreen';
import { NavBar } from '@/shared/components/navigation/NavBar';
import { LandingNavBar } from '@/shared/components/navigation/LandingNavBar';
import { fetchUserProfile } from '@/features/user/api';

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [navState, setNavState] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('cookbook_token')
    let initialScreen = 'landing'
    let initialNavState = {}
    
    if (token) {
      setIsAuthenticated(true)
      fetchUserProfile()
        .then(res => {
          if (res?.data) setUserProfile(res.data)
        })
        .catch(err => {
          if (err.message && err.message.includes('401')) {
            setIsAuthenticated(false)
            setUserProfile(null)
            localStorage.removeItem('cookbook_token')
          }
        })
      initialScreen = localStorage.getItem('cookbook_screen') || 'home'
      const savedNavState = localStorage.getItem('cookbook_navState')
      if (savedNavState) {
        try { initialNavState = JSON.parse(savedNavState) } catch (e) {}
      }
    } else {
      setIsAuthenticated(false)
      setUserProfile(null)
      initialScreen = 'landing'
    }

    setScreen(initialScreen)
    setNavState(initialNavState)

    // Set initial history state if empty
    const url = new URL(window.location)
    url.searchParams.set('screen', initialScreen)
    if (initialNavState.recipeId) {
      url.searchParams.set('recipeId', initialNavState.recipeId)
    }
    window.history.replaceState({ screen: initialScreen, params: initialNavState }, '', url.toString())

    const handlePopState = (event) => {
      if (event.state && event.state.screen) {
        setScreen(event.state.screen)
        setNavState(event.state.params || {})
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsPremium(false)
    setUserProfile(null)
    setScreen('landing')
    localStorage.removeItem('cookbook_token')
    localStorage.removeItem('cookbook_screen')
    localStorage.removeItem('cookbook_navState')
  }

  const handleAuthSuccess = (mode) => {
    setIsAuthenticated(true)
    fetchUserProfile()
      .then(res => {
        if (res?.data) setUserProfile(res.data)
      })
      .catch(() => {})
    if (mode === 'register') {
      navigate('onboarding')
    } else {
      navigate('home')
    }
  }

  const navigate = (s, params = {}) => {
    if (!isAuthenticated && s !== 'landing' && s !== 'auth' && s !== 'onboarding') {
      setShowLoginModal(true)
      return
    }
    if (s === 'categories') {
      s = 'recipes'
      params = { focus: 'category', ...params }
    }
    if ((s === 'ai-chat' || s === 'meal-planner') && !isPremium) {
      setScreen('subscription')
      window.history.pushState({ screen: 'subscription', params: {} }, '')
      return
    }
    setScreen(s)
    setNavState(params)
    
    const url = new URL(window.location)
    url.searchParams.set('screen', s)
    if (params.recipeId) {
      url.searchParams.set('recipeId', params.recipeId)
    } else {
      url.searchParams.delete('recipeId')
    }
    window.history.pushState({ screen: s, params }, '', url.toString())
    
    if (s !== 'landing' && s !== 'auth' && s !== 'onboarding') {
      localStorage.setItem('cookbook_screen', s)
      if (Object.keys(params).length > 0) {
        localStorage.setItem('cookbook_navState', JSON.stringify(params))
      } else {
        localStorage.removeItem('cookbook_navState')
      }
    }
  }

  const handleLandingRecipeClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    navigate('recipe-detail')
  }

  const renderScreen = () => {
    switch (screen) {
      case 'auth': return <AuthScreen onComplete={handleAuthSuccess} />
      case 'onboarding': return <OnboardingScreen onComplete={() => { setIsAuthenticated(true); navigate('home'); }} />
      case 'home': return <HomeDashboard onNavigate={navigate} isPremium={isPremium} isAuthenticated={isAuthenticated} userProfile={userProfile} />
      case 'recipes': return <RecipeBrowsePage onNavigate={navigate} isPremium={isPremium} navState={navState} />
      case 'recipe-detail': return <RecipeDetailPage onNavigate={navigate} isPremium={isPremium} recipeId={navState?.recipeId} />
      case 'search': return <IngredientSearchPage />
      case 'meal-planner': return <MealPlannerPage isPremium={isPremium} onNavigate={navigate} />
      case 'grocery': return <GroceryListPage />
      case 'ai-chat': return <AIChatPage isPremium={isPremium} onNavigate={navigate} />
      case 'favorites': return <FavoritesPage onNavigate={navigate} />
      case 'profile': return <ProfilePage onNavigate={navigate} onLogout={handleLogout} isPremium={isPremium} />
      case 'subscription': return <SubscriptionPage isPremium={isPremium} setIsPremium={setIsPremium} onNavigate={navigate} />
      case 'admin': return <AdminDashboard />
      case 'notifications': return <NotificationsPage />
      default: return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', background: C.bg }}>
          <LandingNavBar onNavigate={navigate} />
          <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: 72, background: 'linear-gradient(135deg, #FFF0EA 0%, #FFF8F3 45%, #FAFAF8 100%)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -120, right: -120, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '55% 45%', gap: 48, alignItems: 'center', width: '100%' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,53,0.1)', borderRadius: 999, padding: '6px 14px 6px 8px', marginBottom: 24, border: '1px solid rgba(255,107,53,0.2)' }}>
                  <span style={{ fontSize: 12, background: C.primary, color: '#fff', borderRadius: 999, padding: '2px 8px', fontWeight: 700 }}>NEW</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.primaryDark }}>10,000+ Indian Recipes</span>
                  <ChevronRight size={14} color={C.primaryDark} />
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 800, color: C.ink, lineHeight: 1.12, margin: 0, marginBottom: 20, letterSpacing: '-0.02em' }}>
                  Discover Recipes{' '}
                  <span style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Built for</span>
                  <br />Your Body
                </h1>
                <p style={{ fontSize: 17, color: C.ink2, lineHeight: 1.65, margin: 0, marginBottom: 36, maxWidth: 480 }}>
                  AI-powered meal plans tailored to your nutrition goals — with real-time macro tracking, personalized Indian recipes, and weekly grocery lists.
                </p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 44, flexWrap: 'wrap' }}>
                  <Button variant="primary" size="lg" icon={<Zap size={16} />} onClick={() => navigate('auth')}>Start Free — It's Free</Button>
                  <Button variant="ghost" size="lg" icon={<ArrowRight size={16} />} onClick={handleLandingRecipeClick}>Explore Recipes</Button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex' }}>
                      {['photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d', 'photo-1438761681033-6461ffad8d80'].map((id, i) => (
                        <img key={id} src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop`} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #fff', marginLeft: i > 0 ? -10 : 0, objectFit: 'cover' }} />
                      ))}
                    </div>
                    <div><div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>2.4M+ Users</div><div style={{ fontSize: 11, color: C.ink3 }}>active this month</div></div>
                  </div>
                  <div style={{ width: 1, height: 32, background: C.border }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={C.gold} color={C.gold} />)}
                    </div>
                    <div><div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>4.9 Rating</div><div style={{ fontSize: 11, color: C.ink3 }}>18K reviews</div></div>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', height: 500 }}>
                <div onClick={handleLandingRecipeClick} style={{ position: 'absolute', width: 260, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-2deg)', background: '#fff', zIndex: 3, cursor: 'pointer' }}>
                  <img src={RECIPES[0].image} alt="" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ marginBottom: 8 }}><VegBadge isVeg={false} /></div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Butter Chicken Masala</div>
                    <RatingStars rating={4.9} count={2847} />
                  </div>
                </div>
                <div onClick={handleLandingRecipeClick} style={{ position: 'absolute', width: 180, borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', top: 28, right: 0, transform: 'rotate(4deg)', background: '#fff', zIndex: 2, cursor: 'pointer' }}>
                  <img src={RECIPES[1].image} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                  <div style={{ padding: '10px 12px 12px' }}>
                    <div style={{ marginBottom: 5 }}><VegBadge isVeg={true} /></div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Paneer Tikka Masala</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', right: -16, bottom: 80, zIndex: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', display: 'flex', gap: 16, alignItems: 'center', border: '1px solid rgba(235,235,235,0.8)' }}>
                    {[{ label: 'kcal', val: 420, color: C.primary }, { label: 'Protein', val: '38g', color: C.green }, { label: 'Carbs', val: '22g', color: C.gold }].map(n => (
                      <div key={n.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: n.color }}>{n.val}</div>
                        <div style={{ fontSize: 10, color: C.ink3, marginTop: 2 }}>{n.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Category Bar */}
          <section style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}`, padding: '0 32px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 6, overflowX: 'auto', padding: '14px 0' }}>
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={handleLandingRecipeClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, borderRadius: 999, padding: '8px 16px', border: `2px solid ${C.border}`, background: '#fff', color: C.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.primaryLight; e.currentTarget.style.color = C.primary }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.ink2 }}>
                  <span style={{ fontSize: 15 }}>{cat.emoji}</span>{cat.label}
                </button>
              ))}
            </div>
          </section>

          {/* Featured section */}
          <section style={{ padding: '72px 32px', maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Award size={16} color={C.primary} /><span style={{ fontSize: 13, fontWeight: 600, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Editor's Pick</span></div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, color: C.ink, margin: 0 }}>Featured This Week</h2>
              </div>
              <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />} onClick={handleLandingRecipeClick}>View all recipes</Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {RECIPES.map(r => <RecipeCard key={r.id} recipe={r} onClick={handleLandingRecipeClick} />)}
            </div>
          </section>

          {/* Value Props */}
          <section style={{ background: '#F7F4F1', padding: '80px 32px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Why CookBook</span>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: C.ink, marginTop: 10, marginBottom: 0 }}>Everything Your Kitchen Needs</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {[
                  { icon: '🤖', iconBg: 'linear-gradient(135deg, #FF6B35, #E55A2B)', title: 'AI Meal Planner', desc: 'Get a personalized 7-day meal plan built around your goals — updated weekly.', pts: ['Customized macro targets', 'Dietary preference filters', 'Auto-adjust based on feedback'] },
                  { icon: '📊', iconBg: 'linear-gradient(135deg, #48BB78, #38A169)', title: 'Nutrition Tracking', desc: 'Track every meal with real Indian food data. Calories, protein, micronutrients, and more.', pts: ['Indian food nutrition database', 'Visual macro breakdown', 'Meal-by-meal logging'] },
                  { icon: '🛒', iconBg: 'linear-gradient(135deg, #4A5568, #2D3748)', title: 'Smart Grocery Lists', desc: 'Your weekly plan auto-generates a smart shopping list, grouped by category.', pts: ['Auto-sorted by category', 'Local price estimates', 'Share with family'] },
                ].map(vp => (
                  <div key={vp.title} style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: vp.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 24 }}>{vp.icon}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: 0, marginBottom: 12 }}>{vp.title}</h3>
                    <p style={{ fontSize: 14, color: C.ink2, lineHeight: 1.65, margin: 0, marginBottom: 20 }}>{vp.desc}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {vp.pts.map(p => (
                        <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4A5568', fontWeight: 500 }}>
                          <span style={{ width: 18, height: 18, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Check size={11} color={C.primary} strokeWidth={2.5} />
                          </span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ background: C.ink, color: '#fff', padding: '60px 32px 0' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChefHat size={20} color="#fff" /></div>
                    <span style={{ fontSize: 20, fontWeight: 800 }}>Cook<span style={{ color: C.primary }}>Book</span></span>
                  </div>
                  <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.7, margin: 0, marginBottom: 16, maxWidth: 280 }}>India's most loved recipe platform, helping 2.4M+ home cooks eat healthier every day.</p>
                </div>
                {[['Explore', ['All Recipes', 'Categories', 'Trending Now', 'New This Week']], ['Company', ['About Us', 'Blog', 'Careers', 'Contact']], ['Support', ['Help Center', 'Privacy Policy', 'Terms of Service']]].map(([title, links]) => (
                  <div key={title}>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, marginBottom: 16 }}>{title}</h4>
                    {links.map(l => <div key={l} style={{ fontSize: 14, color: '#718096', marginBottom: 10, cursor: 'pointer' }}>{l}</div>)}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#4A5568' }}>© 2026 CookBook Technologies Pvt. Ltd. Made with ♥ in Hyderabad.</span>
                <div style={{ display: 'flex', gap: 16 }}>
                  {['Privacy', 'Terms', 'Cookies'].map(l => <span key={l} style={{ fontSize: 13, color: '#4A5568', cursor: 'pointer' }}>{l}</span>)}
                </div>
              </div>
            </div>
          </footer>
        </div>
      )
    }
  }

  const isAuthScreen = screen === 'auth' || screen === 'onboarding'
  const isAdminScreen = screen === 'admin'
  const isLanding = screen === 'landing'
  const showNav = !isAuthScreen && !isAdminScreen && !isLanding

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {showNav && <NavBar onNavigate={navigate} currentScreen={screen} isPremium={isPremium} isAuthenticated={isAuthenticated} userProfile={userProfile} onLogout={handleLogout} />}

      {renderScreen()}

      {/* Login Required Modal for Unauthenticated Visitors */}
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowLoginModal(false) }}>
          <div style={{ background: C.card, borderRadius: 24, padding: '36px', maxWidth: 420, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: `1px solid ${C.border}` }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 6px 20px rgba(255,107,53,0.35)' }}>
              <Users size={28} color="#fff" />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 800, color: C.ink, margin: '0 0 10px' }}>Registration Required 🔒</h3>
            <p style={{ fontSize: 14, color: C.ink2, lineHeight: 1.6, margin: '0 0 24px' }}>
              Only registered users can access and view recipes. Create a free account or sign in to explore thousands of delicious Indian recipes! 🍳
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button variant="primary" size="lg" fullWidth onClick={() => { setShowLoginModal(false); navigate('auth'); }}>
                Log In / Register Now
              </Button>
              <Button variant="ghost" size="md" fullWidth onClick={() => setShowLoginModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

