import { Search } from 'lucide-react';
import { C } from '@/shared/theme/tokens';

export function UsersTable({
  usersList,
  loadingUsers,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  handleRoleToggle,
  handleDeleteUser
}) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-title">User Directory</h1>
          <p className="admin-subtitle">Manage registered users, upgrade user roles, and monitor status.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search users by name or email..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            className="admin-input"
            style={{ paddingLeft: 42 }}
          />
        </div>
        <select
          value={userRoleFilter}
          onChange={e => setUserRoleFilter(e.target.value)}
          className="admin-input"
          style={{ width: 'auto', minWidth: 160 }}
        >
          <option value="">All Roles</option>
          <option value="user">Free User</option>
          <option value="premium">Premium</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="admin-table-container">
        {loadingUsers ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading user directory...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{u.full_name || 'User'}</td>
                  <td style={{ color: 'rgba(255,255,255,0.7)' }}>{u.email}</td>
                  <td>
                    <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: u.role === 'admin' ? 'rgba(168,85,247,0.2)' : u.role === 'premium' ? 'rgba(246,201,14,0.2)' : 'rgba(255,255,255,0.1)', color: u.role === 'admin' ? '#A855F7' : u.role === 'premium' ? C.gold : 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: u.is_active ? '#22C55E' : '#EF4444', fontWeight: 600 }}>
                      {u.is_active ? '✓ Active' : '✕ Suspended'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => handleRoleToggle(u.id, u.role)} className="admin-btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                        Change Role
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
