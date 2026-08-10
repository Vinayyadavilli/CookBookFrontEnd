import { Plus, Search } from 'lucide-react';
import { C } from '@/shared/theme/tokens';

export function RecipesTable({
  recipesList,
  recipeTotal,
  recipePage,
  setRecipePage,
  loadingRecipes,
  recipeSearch,
  setRecipeSearch,
  onSearch,
  openAddRecipe,
  openEditRecipe,
  handleDeleteRecipe
}) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-title">Recipe Management</h1>
          <p className="admin-subtitle">Create, edit, feature, or soft-delete recipes in the platform.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={recipeSearch || ''}
              onChange={e => {
                setRecipeSearch(e.target.value);
                onSearch && onSearch(e.target.value);
              }}
              placeholder="Search by title, description..."
              className="admin-input"
              style={{ paddingLeft: 40, fontSize: 13 }}
            />
          </div>
          <button onClick={openAddRecipe} className="admin-btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={16} /> Create Recipe
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{recipeTotal} Recipes Found</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button disabled={recipePage <= 1} onClick={() => setRecipePage(p => p - 1)} className="admin-btn-secondary" style={{ padding: '6px 14px', fontSize: 12, opacity: recipePage <= 1 ? 0.4 : 1 }}>Prev</button>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center' }}>Page {recipePage}</span>
            <button onClick={() => setRecipePage(p => p + 1)} className="admin-btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>Next</button>
          </div>
        </div>

        {loadingRecipes ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading recipes...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Recipe Title</th>
                <th>Status</th>
                <th>Food Type</th>
                <th>Difficulty</th>
                <th>Servings</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipesList.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{r.title}</td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: r.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r.is_active ? '#22C55E' : '#EF4444' }}>
                      {r.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.7)' }}>{r.food_type || '—'}</td>
                  <td style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.7)' }}>{r.difficulty || 'medium'}</td>
                  <td style={{ color: 'rgba(255,255,255,0.7)' }}>{r.base_servings || 2} pers</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditRecipe(r)} className="admin-btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteRecipe(r.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                        Delete
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
