import { useEffect } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { C } from '@/shared/theme/tokens';

const NUTRITION_DATABASE = {
  'chicken': { protein: 27, carbs: 0, fat: 3.6, kcal: 165 },
  'mutton': { protein: 25, carbs: 0, fat: 21, kcal: 294 },
  'paneer': { protein: 18, carbs: 6, fat: 20, kcal: 265 },
  'egg': { protein: 6, carbs: 0.6, fat: 5, kcal: 72, isPerPiece: true },
  'eggs': { protein: 6, carbs: 0.6, fat: 5, kcal: 72, isPerPiece: true },
  'fish': { protein: 20, carbs: 0, fat: 5, kcal: 120 },
  'prawns': { protein: 24, carbs: 0.2, fat: 0.3, kcal: 99 },
  'tofu': { protein: 8, carbs: 2, fat: 4.8, kcal: 76 },
  'curd': { protein: 3.5, carbs: 4.7, fat: 4, kcal: 98 },
  'dahi': { protein: 3.5, carbs: 4.7, fat: 4, kcal: 98 },
  'yogurt': { protein: 3.5, carbs: 4.7, fat: 4, kcal: 98 },
  'milk': { protein: 3.2, carbs: 4.8, fat: 3.6, kcal: 60 },
  'cheese': { protein: 25, carbs: 1.3, fat: 33, kcal: 402 },
  'rice': { protein: 2.7, carbs: 28, fat: 0.3, kcal: 130 },
  'dal': { protein: 9, carbs: 20, fat: 0.4, kcal: 116 },
  'moong dal': { protein: 9.5, carbs: 19, fat: 0.4, kcal: 118 },
  'chana dal': { protein: 8.9, carbs: 18.5, fat: 1.5, kcal: 125 },
  'rajma': { protein: 8.7, carbs: 22.8, fat: 0.5, kcal: 127 },
  'chole': { protein: 8.9, carbs: 27, fat: 2.6, kcal: 164 },
  'chickpeas': { protein: 8.9, carbs: 27, fat: 2.6, kcal: 164 },
  'atta': { protein: 13, carbs: 71, fat: 2.5, kcal: 340 },
  'flour': { protein: 10, carbs: 76, fat: 1, kcal: 364 },
  'oats': { protein: 16.9, carbs: 66, fat: 6.9, kcal: 389 },
  'ghee': { protein: 0, carbs: 0, fat: 99.5, kcal: 900 },
  'oil': { protein: 0, carbs: 0, fat: 100, kcal: 884 },
  'butter': { protein: 0.9, carbs: 0.1, fat: 81, kcal: 717 },
  'potato': { protein: 2, carbs: 17, fat: 0.1, kcal: 77 },
  'aloo': { protein: 2, carbs: 17, fat: 0.1, kcal: 77 },
  'onion': { protein: 1.1, carbs: 9.3, fat: 0.1, kcal: 40 },
  'tomato': { protein: 0.9, carbs: 3.9, fat: 0.2, kcal: 18 },
  'cashew': { protein: 18, carbs: 30, fat: 44, kcal: 553 },
  'cashews': { protein: 18, carbs: 30, fat: 44, kcal: 553 },
  'badam': { protein: 21, carbs: 22, fat: 49, kcal: 579 },
  'almonds': { protein: 21, carbs: 22, fat: 49, kcal: 579 },
  'peanuts': { protein: 26, carbs: 16, fat: 49, kcal: 567 }
};

export function RecipeModal({
  showCreateRecipeModal,
  setShowCreateRecipeModal,
  editingRecipe,
  recipeForm,
  setRecipeForm,
  handleSaveRecipe,
  filterOptions
}) {
  if (!showCreateRecipeModal) return null;

  const ingredients = recipeForm.ingredients || [];
  const steps = recipeForm.steps || [];

  const autoCalculateNutrition = () => {
    const servings = parseInt(recipeForm.base_servings, 10) || 1;
    let totalProt = 0;
    let totalCarb = 0;
    let totalFat = 0;
    let totalKcal = 0;

    (ingredients || []).forEach(ing => {
      if (!ing.name) return;
      const cleanName = ing.name.toLowerCase().trim();
      const qty = parseFloat(ing.quantity) || 1;

      let match = null;
      for (const [key, val] of Object.entries(NUTRITION_DATABASE)) {
        if (cleanName.includes(key)) {
          match = val;
          break;
        }
      }

      if (match) {
        let multiplier = qty / 100;
        if (match.isPerPiece || ing.unit?.toLowerCase().includes('pc') || ing.unit?.toLowerCase().includes('piece') || ing.unit?.toLowerCase().includes('egg')) {
          multiplier = qty;
        } else if (ing.unit?.toLowerCase().includes('kg')) {
          multiplier = (qty * 1000) / 100;
        } else if (ing.unit?.toLowerCase().includes('tbsp') || ing.unit?.toLowerCase().includes('spoon')) {
          multiplier = (qty * 15) / 100;
        } else if (ing.unit?.toLowerCase().includes('tsp')) {
          multiplier = (qty * 5) / 100;
        } else if (ing.unit?.toLowerCase().includes('cup')) {
          multiplier = (qty * 150) / 100;
        }

        totalProt += match.protein * multiplier;
        totalCarb += match.carbs * multiplier;
        totalFat += match.fat * multiplier;
        totalKcal += match.kcal * multiplier;
      }
    });

    const protPerServing = Math.round((totalProt / servings) * 10) / 10;
    const carbPerServing = Math.round((totalCarb / servings) * 10) / 10;
    const fatPerServing = Math.round((totalFat / servings) * 10) / 10;
    const kcalPerServing = Math.round(totalKcal / servings) || Math.round((protPerServing * 4) + (carbPerServing * 4) + (fatPerServing * 9));

    setRecipeForm(prev => ({
      ...prev,
      protein_g: protPerServing,
      carbs_g: carbPerServing,
      fat_g: fatPerServing,
      calories_per_serving: kcalPerServing
    }));
  };

  useEffect(() => {
    autoCalculateNutrition();
  }, [JSON.stringify(ingredients), recipeForm.base_servings]);

  const addIngredientRow = () => {
    const updated = [...ingredients, { name: '', quantity: '1', unit: 'tbsp' }];
    setRecipeForm({ ...recipeForm, ingredients: updated });
  };

  const removeIngredientRow = (idx) => {
    const updated = ingredients.filter((_, i) => i !== idx);
    setRecipeForm({ ...recipeForm, ingredients: updated });
  };

  const updateIngredientRow = (idx, field, val) => {
    const updated = ingredients.map((item, i) => i === idx ? { ...item, [field]: val } : item);
    setRecipeForm({ ...recipeForm, ingredients: updated });
  };

  const addStepRow = () => {
    const updated = [...steps, { instruction: '' }];
    setRecipeForm({ ...recipeForm, steps: updated });
  };

  const removeStepRow = (idx) => {
    const updated = steps.filter((_, i) => i !== idx);
    setRecipeForm({ ...recipeForm, steps: updated });
  };

  const updateStepRow = (idx, val) => {
    const updated = steps.map((item, i) => i === idx ? { ...item, instruction: val } : item);
    setRecipeForm({ ...recipeForm, steps: updated });
  };

  return (
    <div className="admin-modal-overlay" onClick={() => setShowCreateRecipeModal(false)}>
      <div className="admin-modal-card" style={{ maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 20px' }}>
          {editingRecipe ? 'Edit Recipe Details' : 'Create Complete Recipe'}
        </h3>
        <form onSubmit={handleSaveRecipe} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Recipe Title</label>
            <input
              required
              value={recipeForm.title}
              onChange={e => setRecipeForm({ ...recipeForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              placeholder="e.g. Hyderabadi Mutton Biryani"
              className="admin-input"
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Category Mapping</label>
            <select
              required
              value={recipeForm.category_id}
              onChange={e => setRecipeForm({ ...recipeForm, category_id: e.target.value })}
              className="admin-input"
              style={{ background: '#1A1D27' }}
            >
              <option value="">Select Category...</option>
              {filterOptions?.categories?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>State / Region</label>
            <select
              value={recipeForm.state_id || ''}
              onChange={e => setRecipeForm({ ...recipeForm, state_id: e.target.value })}
              className="admin-input"
              style={{ background: '#1A1D27' }}
            >
              <option value="">None / All India</option>
              {filterOptions?.states?.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Cuisine</label>
            <select
              value={recipeForm.cuisine_id || ''}
              onChange={e => setRecipeForm({ ...recipeForm, cuisine_id: e.target.value })}
              className="admin-input"
              style={{ background: '#1A1D27' }}
            >
              <option value="">None / General</option>
              {filterOptions?.cuisines?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Food Type</label>
            <select
              value={recipeForm.food_type}
              onChange={e => setRecipeForm({ ...recipeForm, food_type: e.target.value })}
              className="admin-input"
              style={{ background: '#1A1D27' }}
            >
              <option value="veg">Vegetarian</option>
              <option value="non_veg">Non-Veg</option>
              <option value="egg">Egg</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Difficulty</label>
            <select
              value={recipeForm.difficulty}
              onChange={e => setRecipeForm({ ...recipeForm, difficulty: e.target.value })}
              className="admin-input"
              style={{ background: '#1A1D27' }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Prep Time (mins)</label>
            <input
              type="number"
              value={recipeForm.prep_time_min}
              onChange={e => setRecipeForm({ ...recipeForm, prep_time_min: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Cook Time (mins)</label>
            <input
              type="number"
              value={recipeForm.cook_time_min}
              onChange={e => setRecipeForm({ ...recipeForm, cook_time_min: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Base Servings</label>
            <input
              type="number"
              value={recipeForm.base_servings}
              onChange={e => setRecipeForm({ ...recipeForm, base_servings: e.target.value })}
              className="admin-input"
            />
          </div>

          {/* AUTO-CALCULATED NUTRITION PREVIEW */}
          <div style={{ gridColumn: 'span 2', background: 'rgba(255,107,53,0.08)', borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} color={C.primary} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Auto-Calculated Nutrition (per serving):</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span>🥩 {recipeForm.protein_g || 0}g Protein</span>
              <span>🍚 {recipeForm.carbs_g || 0}g Carbs</span>
              <span>🧈 {recipeForm.fat_g || 0}g Fat</span>
              <span>🔥 {recipeForm.calories_per_serving || 0} kcal</span>
            </div>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Cover Image URL</label>
            <input
              value={recipeForm.cover_image_url}
              onChange={e => setRecipeForm({ ...recipeForm, cover_image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="admin-input"
            />
          </div>

          {/* DYNAMIC INGREDIENTS BUILDER */}
          <div style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>Ingredients List ({ingredients.length})</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={autoCalculateNutrition}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(246,201,14,0.4)', background: 'rgba(246,201,14,0.15)', color: C.gold, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Sparkles size={13} /> Auto-Calculate Protein & Macros
                </button>
                <button
                  type="button"
                  onClick={addIngredientRow}
                  style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={14} /> Add Ingredient
                </button>
              </div>
            </div>
            {ingredients.length === 0 ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', italic: 'true' }}>No ingredients added yet. Click 'Add Ingredient' to list ingredients.</div>
            ) : (
              ingredients.map((ing, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 36px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input
                    value={ing.name}
                    onChange={e => updateIngredientRow(idx, 'name', e.target.value)}
                    placeholder="Ingredient Name (e.g. Paneer)"
                    className="admin-input"
                    style={{ fontSize: 13 }}
                  />
                  <input
                    value={ing.quantity}
                    onChange={e => updateIngredientRow(idx, 'quantity', e.target.value)}
                    placeholder="Qty (250)"
                    className="admin-input"
                    style={{ fontSize: 13 }}
                  />
                  <input
                    value={ing.unit}
                    onChange={e => updateIngredientRow(idx, 'unit', e.target.value)}
                    placeholder="Unit (g/tbsp/cup)"
                    className="admin-input"
                    style={{ fontSize: 13 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(idx)}
                    style={{ height: 38, width: 36, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* DYNAMIC MAKING PROCESS / STEPS BUILDER */}
          <div style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: C.green }}>Step-by-Step Making Process ({steps.length})</label>
              <button
                type="button"
                onClick={addStepRow}
                style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: C.green, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={14} /> Add Step
              </button>
            </div>
            {steps.length === 0 ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', italic: 'true' }}>No cooking steps added yet. Click 'Add Step' to write step-by-step instructions.</div>
            ) : (
              steps.map((st, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginTop: 10, minWidth: 50 }}>Step {idx + 1}:</span>
                  <textarea
                    rows={2}
                    value={st.instruction}
                    onChange={e => updateStepRow(idx, e.target.value)}
                    placeholder={`Describe Step ${idx + 1} (e.g. Sauté onions in ghee until golden brown...)`}
                    className="admin-input"
                    style={{ flex: 1, fontSize: 13, resize: 'vertical' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeStepRow(idx)}
                    style={{ height: 38, width: 36, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 4 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Chef Tips</label>
            <textarea
              rows={2}
              value={recipeForm.chef_tips || ''}
              onChange={e => setRecipeForm({ ...recipeForm, chef_tips: e.target.value })}
              placeholder="Pro chef secrets for perfect flavor..."
              className="admin-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea
              rows={3}
              value={recipeForm.description}
              onChange={e => setRecipeForm({ ...recipeForm, description: e.target.value })}
              placeholder="Rich description of the recipe..."
              className="admin-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="submit" className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Save Complete Recipe
            </button>
            <button type="button" onClick={() => setShowCreateRecipeModal(false)} className="admin-btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
