import { Users, Crown, UtensilsCrossed, ShoppingCart } from 'lucide-react';
import { C } from '@/shared/theme/tokens';

export function AdminStatCards({ analytics }) {
  const cards = [
    { label: 'Total Registered Users', val: analytics?.total_users ?? '—', icon: <Users size={20} color="#3B82F6" />, bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)' },
    { label: 'Premium Subscriptions', val: analytics?.premium_users ?? '—', icon: <Crown size={20} color={C.gold} />, bg: 'rgba(246,201,14,0.12)', border: 'rgba(246,201,14,0.2)' },
    { label: 'Total Database Recipes', val: analytics?.total_recipes ?? '—', icon: <UtensilsCrossed size={20} color={C.primary} />, bg: 'rgba(255,107,53,0.12)', border: 'rgba(255,107,53,0.2)' },
    { label: 'Total Platform Revenue', val: `₹${(analytics?.total_revenue_inr || 0).toLocaleString('en-IN')}`, icon: <ShoppingCart size={20} color="#22C55E" />, bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.2)' },
  ];

  return (
    <div className="admin-stats-grid">
      {cards.map((s, i) => (
        <div key={i} className="admin-stat-card" style={{ borderColor: s.border }}>
          <div className="admin-stat-header">
            <span className="admin-stat-label">{s.label}</span>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.icon}
            </div>
          </div>
          <div className="admin-stat-value">{s.val}</div>
        </div>
      ))}
    </div>
  );
}
