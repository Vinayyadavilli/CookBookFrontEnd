import { useState, useEffect } from 'react';
import {
  LayoutDashboard, UtensilsCrossed, Users, Grid, MapPin, Leaf, BarChart3, Plus, Trash2, Search
} from 'lucide-react';
import { C } from '@/shared/theme/tokens';
import '../admin.css';

import {
  fetchAdminAnalytics,
  fetchAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  fetchAdminRecipes,
  createAdminRecipe,
  updateAdminRecipe,
  deleteAdminRecipe,
  createAdminCategory,
  deleteAdminCategory,
  createAdminState,
  createAdminCuisine
} from '@/features/admin/api';
import { fetchFilterOptions } from '@/features/recipes/api';

import { AdminSidebar } from '../components/AdminSidebar';
import { OverviewSection } from '../components/OverviewSection';
import { UsersTable } from '../components/UsersTable';
import { RecipesTable } from '../components/RecipesTable';
import { RecipeModal } from '../components/RecipeModal';
import { CategoryModal, StateModal, CuisineModal } from '../components/MetadataModals';

export default function AdminDashboard({ onNavigate, userProfile }) {
  const [adminSection, setAdminSection] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Users state
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Recipes state
  const [recipesList, setRecipesList] = useState([]);
  const [recipeTotal, setRecipeTotal] = useState(0);
  const [recipePage, setRecipePage] = useState(1);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // Categories/States/Cuisines
  const [filterOptions, setFilterOptions] = useState({ categories: [], states: [], cuisines: [] });

  // Modals
  const [showCreateRecipeModal, setShowCreateRecipeModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCuisineModal, setShowCuisineModal] = useState(false);

  // Form states
  const [recipeForm, setRecipeForm] = useState({
    title: '',
    slug: '',
    category_id: '',
    food_type: 'veg',
    difficulty: 'medium',
    prep_time_min: 15,
    cook_time_min: 30,
    total_time_min: 45,
    base_servings: 4,
    calories_per_serving: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    description: '',
    cover_image_url: '',
    is_premium: 0,
    is_featured: 0
  });

  const [catForm, setCatForm] = useState({ name: '', slug: '', display_order: 1, icon_url: '' });
  const [stateForm, setStateForm] = useState({ name: '', slug: '', region: 'North' });
  const [cuisineForm, setCuisineForm] = useState({ name: '', slug: '' });

  useEffect(() => {
    loadAnalytics();
    loadFilterOptions();
  }, []);

  useEffect(() => {
    if (adminSection === 'users') loadUsers();
    if (adminSection === 'recipes') loadRecipes();
  }, [adminSection, userPage, userSearch, userRoleFilter, recipePage]);

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await fetchAdminAnalytics();
      setAnalytics(res?.data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const res = await fetchFilterOptions();
      setFilterOptions(res?.data || { categories: [], states: [], cuisines: [] });
    } catch (e) {
      console.error(e);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetchAdminUsers({ page: userPage, limit: 15, search: userSearch, role: userRoleFilter });
      setUsersList(res?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const res = await fetchAdminRecipes({ page: recipePage, limit: 15 });
      setRecipesList(res?.data || []);
      setRecipeTotal(res?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : currentRole === 'user' ? 'premium' : 'admin';
    try {
      await updateAdminUser(userId, { role: nextRole });
      loadUsers();
      loadAnalytics();
    } catch (e) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Deactivate this user account?')) return;
    try {
      await deleteAdminUser(userId);
      loadUsers();
      loadAnalytics();
    } catch (e) {
      alert('Failed to delete user');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Soft delete this recipe?')) return;
    try {
      await deleteAdminRecipe(recipeId);
      loadRecipes();
      loadAnalytics();
    } catch (e) {
      alert('Failed to delete recipe');
    }
  };

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...recipeForm,
        prep_time_min: parseInt(recipeForm.prep_time_min, 10),
        cook_time_min: parseInt(recipeForm.cook_time_min, 10),
        total_time_min: parseInt(recipeForm.prep_time_min, 10) + parseInt(recipeForm.cook_time_min, 10),
        base_servings: parseInt(recipeForm.base_servings, 10),
        calories_per_serving: parseFloat(recipeForm.calories_per_serving),
        protein_g: parseFloat(recipeForm.protein_g),
        carbs_g: parseFloat(recipeForm.carbs_g),
        fat_g: parseFloat(recipeForm.fat_g),
        category_id: recipeForm.category_id || filterOptions.categories[0]?.id
      };
      if (editingRecipe) {
        await updateAdminRecipe(editingRecipe.id, payload);
      } else {
        await createAdminRecipe(payload);
      }
      setShowCreateRecipeModal(false);
      setEditingRecipe(null);
      loadRecipes();
      loadAnalytics();
    } catch (err) {
      alert(err.message || 'Error saving recipe');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      await createAdminCategory(catForm);
      setShowCategoryModal(false);
      setCatForm({ name: '', slug: '', display_order: 1, icon_url: '' });
      loadFilterOptions();
    } catch (err) {
      alert('Error creating category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteAdminCategory(catId);
      loadFilterOptions();
    } catch (e) {
      alert('Failed to delete category');
    }
  };

  const handleSaveState = async (e) => {
    e.preventDefault();
    try {
      await createAdminState(stateForm);
      setShowStateModal(false);
      setStateForm({ name: '', slug: '', region: 'North' });
      loadFilterOptions();
    } catch (err) {
      alert('Error creating state');
    }
  };

  const handleSaveCuisine = async (e) => {
    e.preventDefault();
    try {
      await createAdminCuisine(cuisineForm);
      setShowCuisineModal(false);
      setCuisineForm({ name: '', slug: '' });
      loadFilterOptions();
    } catch (err) {
      alert('Error creating cuisine');
    }
  };

  const openAddRecipe = () => {
    setEditingRecipe(null);
    setRecipeForm({
      title: '', slug: '',
      category_id: filterOptions.categories[0]?.id || '',
      state_id: '',
      cuisine_id: '',
      food_type: 'veg', difficulty: 'medium', prep_time_min: 15, cook_time_min: 30,
      total_time_min: 45, base_servings: 4, calories_per_serving: 0, protein_g: 0,
      carbs_g: 0, fat_g: 0, description: '', cover_image_url: '', is_premium: 0, is_featured: 0,
      ingredients: [
        { name: '', quantity: '250', unit: 'g' }
      ],
      steps: [
        { instruction: '' }
      ],
      chef_tips: ''
    });
    setShowCreateRecipeModal(true);
  };

  const openEditRecipe = (r) => {
    setEditingRecipe(r);
    const existingIngs = r.recipe_ingredients ? r.recipe_ingredients.map(ri => ({
      name: ri.ingredient?.name || ri.notes || '',
      quantity: ri.quantity || 1,
      unit: ri.unit || 'tbsp'
    })) : [];

    const existingSteps = r.steps ? r.steps.map(s => ({
      instruction: s.instruction || ''
    })) : [];

    setRecipeForm({
      title: r.title || '', slug: r.slug || '',
      category_id: r.category_id || filterOptions.categories[0]?.id || '',
      state_id: r.state_id || '',
      cuisine_id: r.cuisine_id || '',
      food_type: r.food_type || 'veg', difficulty: r.difficulty || 'medium',
      prep_time_min: r.prep_time_min || 15, cook_time_min: r.cook_time_min || 30,
      total_time_min: r.total_time_min || 45, base_servings: r.base_servings || 4,
      calories_per_serving: r.calories_per_serving || 450, protein_g: r.protein_g || 20,
      carbs_g: r.carbs_g || 50, fat_g: r.fat_g || 15, description: r.description || '',
      cover_image_url: r.cover_image_url || '', is_premium: r.is_premium || 0, is_featured: r.is_featured || 0,
      ingredients: existingIngs.length ? existingIngs : [{ name: '', quantity: '1', unit: 'tbsp' }],
      steps: existingSteps.length ? existingSteps : [{ instruction: '' }],
      chef_tips: r.chef_tips || ''
    });
    setShowCreateRecipeModal(true);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'recipes', label: 'Recipes Management', icon: <UtensilsCrossed size={16} /> },
    { id: 'users', label: 'User Directory', icon: <Users size={16} /> },
    { id: 'categories', label: 'Categories', icon: <Grid size={16} /> },
    { id: 'states', label: 'States & Regions', icon: <MapPin size={16} /> },
    { id: 'cuisines', label: 'Cuisines', icon: <Leaf size={16} /> },
    { id: 'analytics', label: 'System Analytics', icon: <BarChart3 size={16} /> },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar
        navItems={navItems}
        adminSection={adminSection}
        setAdminSection={setAdminSection}
        userProfile={userProfile}
        onNavigate={onNavigate}
      />

      <main className="admin-main">
        {adminSection === 'dashboard' && (
          <OverviewSection
            analytics={analytics}
            loadingAnalytics={loadingAnalytics}
            loadAnalytics={loadAnalytics}
            filterOptions={filterOptions}
            openAddRecipe={openAddRecipe}
            setShowCategoryModal={setShowCategoryModal}
            setShowStateModal={setShowStateModal}
            setShowCuisineModal={setShowCuisineModal}
          />
        )}

        {adminSection === 'recipes' && (
          <RecipesTable
            recipesList={recipesList}
            recipeTotal={recipeTotal}
            recipePage={recipePage}
            setRecipePage={setRecipePage}
            loadingRecipes={loadingRecipes}
            recipeSearch={recipeSearch}
            setRecipeSearch={setRecipeSearch}
            onSearch={(searchVal) => loadRecipes(searchVal)}
            openAddRecipe={openAddRecipe}
            openEditRecipe={openEditRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
          />
        )}

        {adminSection === 'users' && (
          <UsersTable
            usersList={usersList}
            loadingUsers={loadingUsers}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            handleRoleToggle={handleRoleToggle}
            handleDeleteUser={handleDeleteUser}
          />
        )}

        {adminSection === 'categories' && (
          <div>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-title">Categories Management</h1>
                <p className="admin-subtitle">Manage dish categories used for filtering across the app.</p>
              </div>
              <button onClick={() => setShowCategoryModal(true)} className="admin-btn-primary">
                <Plus size={16} /> Add Category
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {filterOptions.categories.map(c => (
                <div key={c.id} style={{ background: '#121624', borderRadius: 18, padding: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ fontSize: 26 }}>{c.icon_url || '🍛'}</div>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.18)', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Slug: {c.slug}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(adminSection === 'states' || adminSection === 'cuisines') && (
          <div>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-title" style={{ textTransform: 'capitalize' }}>{adminSection} Management</h1>
                <p className="admin-subtitle">Regional metadata for Indian states and culinary cuisines.</p>
              </div>
              <button onClick={() => adminSection === 'states' ? setShowStateModal(true) : setShowCuisineModal(true)} className="admin-btn-primary">
                <Plus size={16} /> Add {adminSection === 'states' ? 'State' : 'Cuisine'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {(adminSection === 'states' ? filterOptions.states : filterOptions.cuisines).map(item => (
                <div key={item.id} style={{ background: '#121624', borderRadius: 16, padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{item.name}</div>
                  {item.region && <div style={{ fontSize: 12, color: C.primary, marginTop: 4 }}>Region: {item.region}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {adminSection === 'analytics' && (
          <div>
            <h1 className="admin-title" style={{ marginBottom: 28 }}>System Analytics</h1>
            <div style={{ background: '#121624', borderRadius: 20, padding: '32px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>User & Revenue Metrics</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Total Platform Users</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 6 }}>{analytics?.total_users || 0}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>PRO Subscriptions</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.gold, marginTop: 6 }}>{analytics?.premium_users || 0}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Total Revenue (INR)</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#22C55E', marginTop: 6 }}>₹{analytics?.total_revenue_inr || 0}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <RecipeModal
        showCreateRecipeModal={showCreateRecipeModal}
        setShowCreateRecipeModal={setShowCreateRecipeModal}
        editingRecipe={editingRecipe}
        recipeForm={recipeForm}
        setRecipeForm={setRecipeForm}
        handleSaveRecipe={handleSaveRecipe}
        filterOptions={filterOptions}
      />

      <CategoryModal
        showCategoryModal={showCategoryModal}
        setShowCategoryModal={setShowCategoryModal}
        catForm={catForm}
        setCatForm={setCatForm}
        handleSaveCategory={handleSaveCategory}
      />

      <StateModal
        showStateModal={showStateModal}
        setShowStateModal={setShowStateModal}
        stateForm={stateForm}
        setStateForm={setStateForm}
        handleSaveState={handleSaveState}
      />

      <CuisineModal
        showCuisineModal={showCuisineModal}
        setShowCuisineModal={setShowCuisineModal}
        cuisineForm={cuisineForm}
        setCuisineForm={setCuisineForm}
        handleSaveCuisine={handleSaveCuisine}
      />
    </div>
  );
}
