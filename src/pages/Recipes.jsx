import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import AddRecipeModal from '../components/AddRecipeModal';
import ImageUploadModal from '../components/ImageUploadModal';
import { Plus, Image as ImageIcon } from 'lucide-react';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadRecipeId, setUploadRecipeId] = useState(null);

  const fetchRecipes = () => {
    api.get('/admin/recipes').then(res => setRecipes(res.data.data)).catch(console.error);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Recipe Management</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> Add Recipe
        </button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(recipe => (
              <tr key={recipe.id}>
                <td>{recipe.title}</td>
                <td>
                  <span className={`badge ${recipe.is_active ? 'badge-success' : 'badge-warning'}`}>
                    {recipe.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setUploadRecipeId(recipe.id)}>
                    <ImageIcon size={16} /> Upload Image
                  </button>
                </td>
              </tr>
            ))}
            {recipes.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No recipes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddRecipeModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => { setShowAddModal(false); fetchRecipes(); }} 
        />
      )}
      
      {uploadRecipeId && (
        <ImageUploadModal 
          recipeId={uploadRecipeId} 
          onClose={() => setUploadRecipeId(null)} 
          onSuccess={() => { setUploadRecipeId(null); fetchRecipes(); alert('Image Uploaded!'); }} 
        />
      )}
    </div>
  );
};

export default Recipes;
