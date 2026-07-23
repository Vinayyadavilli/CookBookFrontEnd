
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

export default function AIChatPage({ isPremium, onNavigate }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your AI Cook Assistant 🍳 I know your profile — you're aiming for Weight Gain with 2,100 kcal/day. How can I help you today?" },
    { role: 'user', text: 'Suggest a high protein chicken recipe under 30 minutes' },
    { role: 'assistant', text: "Here's a perfect one for you! 🍗\n\n**Spicy Chicken Stir-Fry**\n⏱ 25 min · ⚡ Easy\n🔥 380 kcal · 💪 44g Protein\n\nMarinate chicken with soy sauce, garlic, and chili. Stir-fry on high heat for 8 minutes. Serve with rice. Perfect for post-workout!" },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [sessions] = useState(['High protein dinner ideas', 'Budget meal plan advice', 'Vegetarian alternatives'])
  const endRef = useRef(null)

  const send = () => {
    if (!input.trim()) return
    const msg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'assistant', text: `Great question! Based on your weight gain goal and 2100 kcal target, I'd recommend focusing on high-protein options. Let me suggest some recipes that match your preference...` }])
    }, 1500)
  }

  if (!isPremium) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: C.bg }}>
        <div style={{ background: C.card, borderRadius: 24, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: `1px solid ${C.border}`, zIndex: 10, margin: '0 32px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${C.gold}, #F59E0B)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 8px 24px rgba(246,201,14,0.4)` }}>
            <Bot size={32} color="#fff" />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>PRO Exclusive Feature</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 12 }}>24/7 AI Chef Assistant</h2>
          <p style={{ fontSize: 15, color: C.ink2, lineHeight: 1.6, margin: 0, marginBottom: 28 }}>Get real-time recipe advice, instant ingredient swaps, and personalized cooking guidance powered by AI.</p>
          {['Unlimited AI Chef Conversations', 'Instant Ingredient Substitutions', 'Personalized Macro Advice', 'Custom Meal Alterations'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textAlign: 'left' }}>
              <Check size={16} color={C.green} strokeWidth={2.5} />
              <span style={{ fontSize: 14, color: C.ink2 }}>{f}</span>
            </div>
          ))}
          <Button variant="primary" size="lg" fullWidth icon={<Crown size={16} />} onClick={() => onNavigate && onNavigate('subscription')}>Unlock AI Chef — ₹49/month</Button>
          <div style={{ fontSize: 12, color: C.ink3, marginTop: 10 }}>Cancel anytime · Instant activation</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 72, height: '100vh', display: 'flex', background: C.bg }}>
      {/* Sidebar */}
      <aside style={{ width: 280, flexShrink: 0, background: C.card, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <Button variant="primary" size="md" fullWidth icon={<Plus size={14} />}>New Chat</Button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Today</div>
          {sessions.map((s, i) => (
            <button key={i} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, border: 'none', background: i === 0 ? C.primaryLight : 'none', color: i === 0 ? C.primary : C.ink2, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 4, transition: 'all 0.15s', fontWeight: i === 0 ? 600 : 400 }}
              onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.background = C.muted } }}
              onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.background = 'none' } }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageCircle size={14} />{s}
              </div>
            </button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 10px' }}>Yesterday</div>
          {['Weight loss meal timing', 'Protein shake recipes'].map((s, i) => (
            <button key={i} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'none', color: C.ink2, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 4 }}
              onMouseEnter={e => (e.currentTarget.style.background = C.muted)}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MessageCircle size={14} />{s}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <div style={{ padding: '16px 24px', background: C.card, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>AI Cook Assistant</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: C.primaryLight, borderRadius: 999, fontSize: 11, fontWeight: 700, color: C.primary }}>
                <Crown size={9} color={C.gold} fill={C.gold} />Premium
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }} />
              <span style={{ fontSize: 12, color: C.ink2 }}>Online · Powered by Claude AI</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 20, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={18} color="#fff" />
                </div>
              )}
              <div style={{ maxWidth: '70%', padding: '14px 18px', borderRadius: msg.role === 'user' ? '20px 20px 6px 20px' : '6px 20px 20px 20px', background: msg.role === 'user' ? `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})` : C.card, color: msg.role === 'user' ? '#fff' : C.ink, fontSize: 14, lineHeight: 1.65, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: msg.role === 'assistant' ? `1px solid ${C.border}` : 'none', whiteSpace: 'pre-line' }}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=72&h=72&fit=crop&face" alt="You" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={18} color="#fff" /></div>
              <div style={{ padding: '14px 18px', borderRadius: '6px 20px 20px 20px', background: C.card, border: `1px solid ${C.border}`, display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: C.ink3, animation: `bounce 1s ease infinite ${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', background: C.card, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Ask me anything about cooking, nutrition, recipes..." rows={1} style={{ flex: 1, padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'inherit', resize: 'none', lineHeight: 1.5, transition: 'border-color 0.15s' }} onFocus={e => (e.target.style.borderColor = C.primary)} onBlur={e => (e.target.style.borderColor = C.border)} />
            <button onClick={send} style={{ width: 44, height: 44, borderRadius: 14, background: input.trim() ? C.primary : C.muted, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}>
              <Send size={18} color={input.trim() ? '#fff' : C.ink3} />
            </button>
          </div>
          <div style={{ fontSize: 11, color: C.ink3, marginTop: 8, textAlign: 'center' }}>Press Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }`}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 8 — FAVORITES
// ═══════════════════════════════════════════════════════════════════════════════
