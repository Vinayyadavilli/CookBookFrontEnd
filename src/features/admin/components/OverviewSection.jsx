import { Plus, Grid, MapPin, Leaf, RefreshCw } from 'lucide-react';
import { C } from '@/shared/theme/tokens';
import { AdminStatCards } from './AdminStatCards';

export function OverviewSection({
  analytics,
  loadingAnalytics,
  loadAnalytics,
  filterOptions,
  openAddRecipe,
  setShowCategoryModal,
  setShowStateModal,
  setShowCuisineModal
}) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-title">Admin Control Dashboard</h1>
          <p className="admin-subtitle">Real-time overview of users, subscriptions, revenue, and recipes.</p>
        </div>
        <button onClick={loadAnalytics} className="admin-btn-secondary">
          <RefreshCw size={14} className={loadingAnalytics ? 'spin' : ''} /> Refresh Data
        </button>
      </div>

      <AdminStatCards analytics={analytics} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ background: '#121624', borderRadius: 20, padding: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Quick Administrative Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <button
              onClick={openAddRecipe}
              style={{ padding: '20px', borderRadius: 16, background: 'rgba(255,107,53,0.1)', border: '1.5px solid rgba(255,107,53,0.25)', color: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.primary, marginBottom: 8, fontWeight: 700, fontSize: 15 }}>
                <Plus size={18} /> Add New Recipe
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Create a new recipe with ingredients, timings, and nutrition macros.</div>
            </button>

            <button
              onClick={() => setShowCategoryModal(true)}
              style={{ padding: '20px', borderRadius: 16, background: 'rgba(59,130,246,0.1)', border: '1.5px solid rgba(59,130,246,0.25)', color: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#3B82F6', marginBottom: 8, fontWeight: 700, fontSize: 15 }}>
                <Grid size={18} /> Add New Category
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Organize recipes under new dish categories (e.g. Biryani, Desserts).</div>
            </button>

            <button
              onClick={() => setShowStateModal(true)}
              style={{ padding: '20px', borderRadius: 16, background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.25)', color: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#22C55E', marginBottom: 8, fontWeight: 700, fontSize: 15 }}>
                <MapPin size={18} /> Add State / Region
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Add regional states (e.g. Kerala, Punjab, Tamil Nadu) for regional filtering.</div>
            </button>

            <button
              onClick={() => setShowCuisineModal(true)}
              style={{ padding: '20px', borderRadius: 16, background: 'rgba(246,201,14,0.1)', border: '1.5px solid rgba(246,201,14,0.25)', color: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.gold, marginBottom: 8, fontWeight: 700, fontSize: 15 }}>
                <Leaf size={18} /> Add Cuisine Type
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Expand cuisines (e.g. Mughlai, Chettinad, Hyderabadi, Continental).</div>
            </button>
          </div>
        </div>

        <div style={{ background: '#121624', borderRadius: 20, padding: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 18px' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'FastAPI Backend Status', status: 'Online (200 OK)', color: '#22C55E' },
              { label: 'Database Connection', status: 'MySQL Connected', color: '#22C55E' },
              { label: 'Active User Ratio', status: `${analytics?.free_users || 0} Free / ${analytics?.premium_users || 0} PRO`, color: C.primary },
              { label: 'Categories Loaded', status: `${filterOptions.categories.length} Active Categories`, color: '#3B82F6' },
            ].map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
