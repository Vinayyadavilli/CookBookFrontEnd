
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

export default function AdminDashboard() {
  const [adminSection, setAdminSection] = useState('dashboard')
  const [showCreateRecipe, setShowCreateRecipe] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'users', label: 'Users', icon: <Users size={15} /> },
    { id: 'recipes', label: 'Recipes', icon: <UtensilsCrossed size={15} /> },
    { id: 'categories', label: 'Categories', icon: <Grid size={15} /> },
    { id: 'states', label: 'States', icon: <MapPin size={15} /> },
    { id: 'cuisines', label: 'Cuisines', icon: <Leaf size={15} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={15} /> },
  ]

  const statsData = [
    { label: 'Total Users', value: '5,240', change: '+12%', icon: <Users size={20} color="#3182CE" />, bg: '#EBF8FF', color: '#3182CE' },
    { label: 'Premium Users', value: '324', change: '+8%', icon: <Crown size={20} color={C.gold} />, bg: '#FFFAE6', color: C.gold },
    { label: 'Active Subs', value: '310', change: '+5%', icon: <Activity size={20} color={C.green} />, bg: '#E8F9F0', color: C.green },
    { label: 'Revenue', value: '₹15,190', change: '+15%', icon: <ShoppingCart size={20} color={C.primary} />, bg: C.primaryLight, color: C.primary },
  ]

  return (
    <div style={{ paddingTop: 72, background: '#0F1117', minHeight: '100vh', display: 'flex' }}>
      {/* Admin Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: '#1A1D27', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, padding: '0 8px' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChefHat size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Cook<span style={{ color: C.primary }}>Book</span> <span style={{ fontSize: 11, color: '#4A5568', fontWeight: 500 }}>Admin</span></span>
        </div>

        {navItems.map(item => (
          <button key={item.id} onClick={() => setAdminSection(item.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: adminSection === item.id ? 'rgba(255,107,53,0.15)' : 'none', color: adminSection === item.id ? C.primary : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: adminSection === item.id ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 2, transition: 'all 0.15s', textAlign: 'left', width: '100%' }}>
            {item.icon}{item.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #9F7AEA, #805AD5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>VA</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Vinay Admin</div>
              <div style={{ fontSize: 11, color: '#4A5568' }}>Super Admin</div>
            </div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', width: '100%', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = C.red)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
            <LogOut size={15} />Log Out
          </button>
        </div>
      </aside>

      {/* Admin Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {adminSection === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 28 }}>Dashboard Overview</h1>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {statsData.map(s => (
                <div key={s.label} style={{ background: '#1A1D27', borderRadius: 16, padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.green, background: 'rgba(72,187,120,0.12)', padding: '3px 8px', borderRadius: 6 }}>{s.change}</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Users Table */}
            <div style={{ background: '#1A1D27', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Recent Users</h3>
                <button style={{ fontSize: 13, color: C.primary, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Name', 'Email', 'Role', 'Active', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'premium', active: true, joined: 'Jul 20' },
                    { name: 'Priya Singh', email: 'priya@gmail.com', role: 'free', active: true, joined: 'Jul 19' },
                    { name: 'Arun Kumar', email: 'arun@gmail.com', role: 'premium', active: false, joined: 'Jul 18' },
                    { name: 'Divya Patel', email: 'divya@gmail.com', role: 'free', active: true, joined: 'Jul 17' },
                  ].map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 24px', fontSize: 14, color: '#fff', fontWeight: 500 }}>{u.name}</td>
                      <td style={{ padding: '14px 24px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{u.email}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: u.role === 'premium' ? 'rgba(246,201,14,0.15)' : 'rgba(255,255,255,0.08)', color: u.role === 'premium' ? C.gold : 'rgba(255,255,255,0.5)' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.active ? C.green : C.ink3 }} />
                      </td>
                      <td style={{ padding: '14px 24px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminSection === 'recipes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0 }}>Recipe Management</h1>
              <button onClick={() => setShowCreateRecipe(!showCreateRecipe)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Plus size={16} />{showCreateRecipe ? 'Cancel' : 'Create Recipe'}
              </button>
            </div>

            {showCreateRecipe && (
              <div style={{ background: '#1A1D27', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', padding: '28px', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 24 }}>Create New Recipe</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[['Title', 'text', 'Butter Chicken Masala'], ['Slug', 'text', 'butter-chicken-masala'], ['Category', 'text', 'North Indian'], ['Difficulty', 'text', 'Medium'], ['Prep Time (min)', 'number', '15'], ['Cook Time (min)', 'number', '30'], ['Total Time (min)', 'number', '45'], ['Base Servings', 'number', '2']].map(([l, t, p]) => (
                    <div key={l}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</label>
                      <input type={t} placeholder={p} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.06)', outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                    <textarea rows={3} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.06)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Food Type</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {['Veg', 'Non-Veg', 'Egg'].map(t => (
                        <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                          <input type="radio" name="foodType" style={{ accentColor: C.primary }} />{t}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature Flags</label>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {['Premium', 'Weight Gain', 'Weight Loss', 'Featured', 'Trending'].map(flag => (
                        <label key={flag} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                          <input type="checkbox" style={{ accentColor: C.primary }} />{flag}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cover Image</label>
                    <div style={{ border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 12, padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Drag & drop image here, or <span style={{ color: C.primary }}>browse files</span></div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>PNG, JPG up to 5MB</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button style={{ flex: 1, padding: '12px', background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Create Recipe</button>
                  <button onClick={() => setShowCreateRecipe(false)} style={{ padding: '12px 20px', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 10, background: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Recipes Table */}
            <div style={{ background: '#1A1D27', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                    {['Title', 'Category', 'Food Type', 'Active', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECIPES.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: '#fff', fontWeight: 500 }}>{r.title}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{r.cuisine}</td>
                      <td style={{ padding: '14px 20px' }}><VegBadge isVeg={r.isVeg} /></td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                          <button style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(255,80,80,0.3)', background: 'none', color: 'rgba(255,80,80,0.7)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(adminSection === 'users' || adminSection === 'categories' || adminSection === 'states' || adminSection === 'cuisines' || adminSection === 'analytics') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{adminSection.charAt(0).toUpperCase() + adminSection.slice(1)} Management</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>This section is ready to be populated with data.</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 12 — NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
