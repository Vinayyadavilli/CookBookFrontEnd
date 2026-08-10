import { ChefHat, Shield, ArrowRight } from 'lucide-react';
import { C } from '@/shared/theme/tokens';

export function AdminSidebar({ navItems, adminSection, setAdminSection, userProfile, onNavigate }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo-badge">
          <ChefHat size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Cook<span style={{ color: C.primary }}>Book</span>
          </div>
          <div style={{ fontSize: 10, color: C.primary, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ADMIN CONSOLE
          </div>
        </div>
      </div>

      <div className="admin-nav-title">MAIN NAVIGATION</div>

      {navItems.map(item => {
        const isActive = adminSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setAdminSection(item.id)}
            className={`admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span style={{ color: isActive ? C.primary : 'rgba(255,255,255,0.4)' }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        );
      })}

      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #FF9F43)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 13, flexShrink: 0 }}>
            {(userProfile?.full_name || 'A')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userProfile?.full_name || 'System Admin'}
            </div>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={10} /> Super Admin
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
