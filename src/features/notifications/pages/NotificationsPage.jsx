
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'new_recipe', title: 'New Recipe Alert! 🍗', body: 'Check out 8 new high protein recipes added this week. Perfect for your weight gain goal.', time: '2m ago', read: false, color: C.green },
    { id: 2, type: 'premium_offer', title: 'Premium Offer 🎁', body: 'Get 50% off on your first month! Use code COOK50 before it expires.', time: '1h ago', read: false, color: C.gold },
    { id: 3, type: 'festival', title: 'Festival Special 🪔', body: 'Ganesh Chaturthi special! Explore 50+ Modak and traditional recipes added just for you.', time: '3h ago', read: false, color: C.primary },
    { id: 4, type: 'meal_plan', title: 'Weekly Meal Plan Ready ✅', body: 'Your new weekly meal plan is ready. 7 days of balanced nutrition tailored to your goals.', time: '1d ago', read: true, color: '#3182CE' },
    { id: 5, type: 'new_recipe', title: 'New South Indian Recipes 🍛', body: 'We\'ve added 15 authentic Andhra and Karnataka recipes to our collection.', time: '2d ago', read: true, color: C.green },
  ])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const clearAll = () => setNotifications([])
  const unread = notifications.filter(n => !n.read).length

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 800, color: C.ink, margin: 0 }}>Notifications</h1>
            {unread > 0 && <div style={{ fontSize: 13, color: C.ink2, marginTop: 4 }}><strong style={{ color: C.primary }}>{unread} unread</strong> notifications</div>}
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={markAllRead} style={{ fontSize: 13, color: C.primary, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Mark all as read</button>
            <button onClick={clearAll} style={{ fontSize: 13, color: C.red, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Clear all</button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 32px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔔</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.ink, margin: 0, marginBottom: 8 }}>All caught up!</h3>
            <p style={{ fontSize: 14, color: C.ink2, margin: 0 }}>No notifications to show right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map(notif => (
              <div key={notif.id}
                onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                style={{ background: notif.read ? C.card : '#FAFFFE', borderRadius: 16, border: `1px solid ${C.border}`, borderLeft: `4px solid ${notif.color}`, padding: '18px 20px', cursor: 'pointer', display: 'flex', gap: 14, transition: 'all 0.15s', boxShadow: notif.read ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${notif.color}15`, border: `1.5px solid ${notif.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
                  {notif.type === 'new_recipe' ? '🍽️' : notif.type === 'premium_offer' ? '👑' : notif.type === 'festival' ? '🪔' : '📋'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: notif.read ? 600 : 700, color: C.ink }}>{notif.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                      <span style={{ fontSize: 12, color: C.ink3, whiteSpace: 'nowrap' }}>{notif.time}</span>
                      {!notif.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: notif.color, flexShrink: 0 }} />}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: C.ink2, lineHeight: 1.55 }}>{notif.body}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 13 — LANDING PAGE (Guest)
// ═══════════════════════════════════════════════════════════════════════════════
