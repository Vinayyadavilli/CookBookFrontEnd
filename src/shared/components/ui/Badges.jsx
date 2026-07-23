
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

export function VegBadge({ isVeg }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, backgroundColor: isVeg ? '#E8F9F0' : '#FFF0F1', color: isVeg ? '#276749' : '#C53030', border: `1px solid ${isVeg ? '#C6F6D5' : '#FED7D7'}` }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: isVeg ? '#48BB78' : '#FC5C65', flexShrink: 0 }} />
      {isVeg ? 'VEG' : 'NON-VEG'}
    </span>
  )
}
export function PremiumBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: 'linear-gradient(135deg, #F6C90E 0%, #F59E0B 100%)', color: '#7C5700' }}>
      <Crown size={10} strokeWidth={2.5} />PRO
    </span>
  )
}
export function DifficultyBadge({ level }) {
  const map = { Easy: { bg: '#E8F9F0', color: '#276749' }, Medium: { bg: '#FFF7E6', color: '#92400E' }, Hard: { bg: '#FFF0F1', color: '#C53030' } }
  const s = map[level] || map.Medium
  return <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 6, backgroundColor: s.bg, color: s.color }}>{level}</span>
}
