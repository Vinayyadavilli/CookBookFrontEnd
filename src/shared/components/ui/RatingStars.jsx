
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

export function RatingStars({ rating, count }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ display: 'inline-flex', gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} fill={i < full ? '#F6C90E' : i === full && hasHalf ? '#F6C90E' : 'none'} color={i < full || (i === full && hasHalf) ? '#F6C90E' : '#D1D5DB'} strokeWidth={1.5} />
        ))}
      </span>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{rating.toFixed(1)}</span>
      {count !== undefined && <span style={{ fontSize: 11, color: C.ink3 }}>({count.toLocaleString()})</span>}
    </span>
  )
}
