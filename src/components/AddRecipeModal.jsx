import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AddRecipeModal = ({ onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    food_type: 'veg',
    difficulty: 'medium',
    prep_time_min: 15,
    cook_time_min: 30,
    total_time_min: 45
  });

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/recipes', formData);
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create recipe');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Add New Recipe</h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>Close</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input type="text" className="form-input" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Food Type</label>
              <select className="form-input" value={formData.food_type} onChange={e => setFormData({...formData, food_type: e.target.value})}>
                <option value="veg">Veg</option>
                <option value="non_veg">Non-Veg</option>
                <option value="egg">Egg</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-input" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Prep (min)</label>
              <input type="number" className="form-input" required value={formData.prep_time_min} onChange={e => setFormData({...formData, prep_time_min: parseInt(e.target.value)})} />
            </div>
            <div className="form-group">
              <label className="form-label">Cook (min)</label>
              <input type="number" className="form-input" required value={formData.cook_time_min} onChange={e => setFormData({...formData, cook_time_min: parseInt(e.target.value)})} />
            </div>
            <div className="form-group">
              <label className="form-label">Total (min)</label>
              <input type="number" className="form-input" required value={formData.total_time_min} onChange={e => setFormData({...formData, total_time_min: parseInt(e.target.value)})} />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Recipe</button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;
