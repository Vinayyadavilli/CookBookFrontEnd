import { C } from '@/shared/theme/tokens';

export function CategoryModal({ showCategoryModal, setShowCategoryModal, catForm, setCatForm, handleSaveCategory }) {
  if (!showCategoryModal) return null;
  return (
    <div className="admin-modal-overlay" onClick={() => setShowCategoryModal(false)}>
      <div className="admin-modal-card" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 20px' }}>Add Category</h3>
        <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="Category Name (e.g. Biryani)" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="admin-input" />
          <input placeholder="Emoji / Icon (e.g. 🍛)" value={catForm.icon_url} onChange={e => setCatForm({ ...catForm, icon_url: e.target.value })} className="admin-input" />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Category</button>
            <button type="button" onClick={() => setShowCategoryModal(false)} className="admin-btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function StateModal({ showStateModal, setShowStateModal, stateForm, setStateForm, handleSaveState }) {
  if (!showStateModal) return null;
  return (
    <div className="admin-modal-overlay" onClick={() => setShowStateModal(false)}>
      <div className="admin-modal-card" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 20px' }}>Add State</h3>
        <form onSubmit={handleSaveState} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="State Name (e.g. Telangana)" value={stateForm.name} onChange={e => setStateForm({ ...stateForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="admin-input" />
          <select value={stateForm.region} onChange={e => setStateForm({ ...stateForm, region: e.target.value })} className="admin-input" style={{ background: '#1A1D27' }}>
            <option value="South">South India</option>
            <option value="North">North India</option>
            <option value="East">East India</option>
            <option value="West">West India</option>
          </select>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save State</button>
            <button type="button" onClick={() => setShowStateModal(false)} className="admin-btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CuisineModal({ showCuisineModal, setShowCuisineModal, cuisineForm, setCuisineForm, handleSaveCuisine }) {
  if (!showCuisineModal) return null;
  return (
    <div className="admin-modal-overlay" onClick={() => setShowCuisineModal(false)}>
      <div className="admin-modal-card" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 20px' }}>Add Cuisine</h3>
        <form onSubmit={handleSaveCuisine} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="Cuisine Name (e.g. Chettinad)" value={cuisineForm.name} onChange={e => setCuisineForm({ ...cuisineForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="admin-input" />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Cuisine</button>
            <button type="button" onClick={() => setShowCuisineModal(false)} className="admin-btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
