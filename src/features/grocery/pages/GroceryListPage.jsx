import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  Plus, Check, Trash2, Printer, Share2, ShoppingCart,
  Search, Bookmark, BookOpen, Users, Sparkles, ChefHat, ChevronRight, X, Crown, FileText, Send
} from 'lucide-react';
import { C } from '@/shared/theme/tokens';
import { Button } from '@/shared/components/ui/Button';
import { fetchRecipes, fetchRecipeDetails } from '@/features/recipes/api';
import { fetchFavorites } from '@/features/recipes/api/engagement';

const CATEGORY_OPTIONS = [
  { name: 'Vegetables 🥦', color: '#48BB78' },
  { name: 'Proteins 🍗', color: '#FC5C65' },
  { name: 'Dairy 🥛', color: '#4299E1' },
  { name: 'Spices 🌶️', color: '#F6C90E' },
  { name: 'Grains & Staples 🌾', color: '#ED8936' },
  { name: 'Other 🛒', color: '#A0AEC0' },
];

const autoCategorizeIngredient = (name) => {
  if (!name) return 'Other 🛒';
  const l = name.toLowerCase();

  if (l.includes('paneer') || l.includes('chicken') || l.includes('mutton') || l.includes('egg') || l.includes('fish') || l.includes('tofu') || l.includes('prawn') || l.includes('keema') || l.includes('meat')) {
    return 'Proteins 🍗';
  }
  if (l.includes('curd') || l.includes('dahi') || l.includes('milk') || l.includes('ghee') || l.includes('butter') || l.includes('cheese') || l.includes('cream') || l.includes('yogurt')) {
    return 'Dairy 🥛';
  }
  if (l.includes('chili') || l.includes('mirchi') || l.includes('turmeric') || l.includes('haldi') || l.includes('cumin') || l.includes('jeera') || l.includes('garam masala') || l.includes('pepper') || l.includes('cardamom') || l.includes('clove') || l.includes('cinnamon') || l.includes('salt') || l.includes('hing') || l.includes('kasuri')) {
    return 'Spices 🌶️';
  }
  if (l.includes('rice') || l.includes('chawal') || l.includes('atta') || l.includes('flour') || l.includes('dal') || l.includes('moong') || l.includes('chana') || l.includes('rajma') || l.includes('oats') || l.includes('rava') || l.includes('bread') || l.includes('noodle') || l.includes('poha')) {
    return 'Grains & Staples 🌾';
  }
  if (l.includes('tomato') || l.includes('onion') || l.includes('potato') || l.includes('aloo') || l.includes('ginger') || l.includes('adrak') || l.includes('garlic') || l.includes('lahsun') || l.includes('capsicum') || l.includes('coriander') || l.includes('dhaniya') || l.includes('palak') || l.includes('spinach') || l.includes('lemon') || l.includes('nimbu') || l.includes('carrot') || l.includes('pea') || l.includes('matar') || l.includes('gobi') || l.includes('cauliflower') || l.includes('brinjal') || l.includes('mint') || l.includes('pudina')) {
    return 'Vegetables 🥦';
  }
  return 'Other 🛒';
};

export default function GroceryListPage({ onNavigate, isPremium }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cookbook_grocery_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [addMode, setAddMode] = useState('manual'); // 'manual' | 'recipe'
  const [recipeTab, setRecipeTab] = useState('favorites'); // 'favorites' | 'search'

  // Manual Add Form States
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [itemCategory, setItemCategory] = useState(CATEGORY_OPTIONS[0].name);

  // Recipe Import States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [peopleCount, setPeopleCount] = useState(4);
  const [notification, setNotification] = useState('');

  // PRO Lock States
  const [showProModal, setShowProModal] = useState(false);
  const [selectedProRecipe, setSelectedProRecipe] = useState(null);

  // Sync items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cookbook_grocery_items', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  // Load Saved/Favorite Recipes
  useEffect(() => {
    if (addMode === 'recipe' && recipeTab === 'favorites') {
      loadFavorites();
    }
  }, [addMode, recipeTab]);

  const loadFavorites = async () => {
    try {
      setLoadingRecipes(true);
      const res = await fetchFavorites();
      if (res?.data && Array.isArray(res.data)) {
        setFavoritesList(res.data.map(item => item.recipe || item));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleSearchRecipes = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoadingRecipes(true);
      const res = await fetchRecipes({ search: query, limit: 10 });
      if (res?.data) {
        setSearchResults(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const isProRecipe = (rec) => {
    if (!rec) return false;
    return rec.is_premium === 1 || rec.is_premium === true || rec.is_locked === true;
  };

  const handleSelectRecipe = async (rec) => {
    // Frontend-first PRO recipe restriction check
    if (isProRecipe(rec) && !isPremium) {
      setSelectedRecipe(null);
      setRecipeDetails(null);
      setSelectedProRecipe(rec);
      setShowProModal(true);
      return;
    }

    setSelectedRecipe(rec);
    try {
      setLoadingDetails(true);
      const res = await fetchRecipeDetails(rec.id);
      if (res?.data) {
        // Server-side double-check: if server says locked, block immediately
        if (isProRecipe(res.data) && !isPremium) {
          setSelectedRecipe(null);
          setRecipeDetails(null);
          setSelectedProRecipe(res.data);
          setShowProModal(true);
          return;
        }
        setRecipeDetails(res.data);
        setPeopleCount(res.data.base_servings || 4);
      }
    } catch (e) {
      console.error(e);
      // If server returns 403 (PRO locked), show PRO modal
      if (e.message && e.message.includes('403')) {
        setSelectedRecipe(null);
        setRecipeDetails(null);
        setSelectedProRecipe(rec);
        setShowProModal(true);
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleImportIngredients = () => {
    if (!recipeDetails) return;
    // Final guard: never allow importing PRO recipe ingredients
    if ((isProRecipe(recipeDetails) || isProRecipe(selectedRecipe)) && !isPremium) {
      setSelectedProRecipe(recipeDetails || selectedRecipe);
      setShowProModal(true);
      return;
    }
    const baseServings = recipeDetails.base_servings || 1;
    const ratio = peopleCount / baseServings;
    const rawIngs = recipeDetails.recipe_ingredients || [];

    if (rawIngs.length === 0) {
      alert('No ingredients listed for this recipe.');
      return;
    }

    const newItems = rawIngs.map((ing, i) => {
      const ingName = ing.ingredient?.name || ing.notes || ing.name || 'Ingredient';
      const baseQty = ing.quantity != null ? ing.quantity : 1;
      const scaledQty = Math.round((baseQty * ratio) * 10) / 10;
      const unitStr = ing.unit && ing.unit.toLowerCase() !== 'unit' ? ing.unit : 'pc';
      const catName = autoCategorizeIngredient(ingName);
      const catObj = CATEGORY_OPTIONS.find(c => c.name === catName) || CATEGORY_OPTIONS[5];

      return {
        id: 'g_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 4),
        name: ingName,
        qty: `${scaledQty} ${unitStr}`,
        category: catObj.name,
        color: catObj.color,
        isPurchased: false,
        sourceRecipe: recipeDetails.title,
        createdAt: new Date().toISOString(),
      };
    });

    setItems(prev => [...newItems, ...prev]);
    setNotification(`Successfully added ${newItems.length} ingredients from "${recipeDetails.title}" for ${peopleCount} ${peopleCount === 1 ? 'person' : 'people'}! 🎉`);
    setSelectedRecipe(null);
    setRecipeDetails(null);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const catObj = CATEGORY_OPTIONS.find(c => c.name === itemCategory) || CATEGORY_OPTIONS[0];

    const newItem = {
      id: 'g_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: itemName.trim(),
      qty: itemQty.trim() || '1 item',
      category: catObj.name,
      color: catObj.color,
      isPurchased: false,
      createdAt: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);
    setItemName('');
    setItemQty('');
  };

  const togglePurchased = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, isPurchased: !item.isPurchased } : item));
  };

  const deleteItem = (id, e) => {
    e.stopPropagation();
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all grocery items?')) {
      setItems([]);
    }
  };

  const clearPurchased = () => {
    setItems(prev => prev.filter(item => !item.isPurchased));
  };

  const cleanTextForPDF = (str) => {
    if (!str) return '';
    return str
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .replace(/[^\x00-\x7F]/g, '')
      .trim();
  };

  // Direct PDF Download Handler
  const handleExportPDF = () => {
    if (items.length === 0) {
      alert('Your grocery list is empty!');
      return;
    }

    try {
      const doc = new jsPDF();
      const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      // Header Banner Background
      doc.setFillColor(255, 107, 53); // #FF6B35 Orange
      doc.rect(0, 0, 210, 28, 'F');
      
      // Header Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('CookBook Grocery List', 14, 18);

      // Date Text right aligned
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(dateStr, 196, 18, { align: 'right' });

      // Overview Info Bar
      doc.setFillColor(247, 244, 241);
      doc.roundedRect(14, 34, 182, 12, 3, 3, 'F');
      doc.setTextColor(45, 55, 72);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const completed = items.filter(i => i.isPurchased).length;
      doc.text(`Total Items: ${items.length}   |   Completed: ${completed} of ${items.length}`, 20, 42);

      let y = 56;

      groupedCategories.forEach((cat) => {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }

        // Clean category title
        const catTitle = cleanTextForPDF(cat.name).toUpperCase();

        // Category Header Strip
        doc.setFillColor(235, 248, 255);
        doc.rect(14, y, 182, 8, 'F');
        doc.setTextColor(43, 108, 176);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(catTitle, 18, y + 5.8);

        y += 13;

        cat.items.forEach((item) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }

          // Checkbox square
          doc.setDrawColor(160, 174, 192);
          doc.rect(18, y - 3.5, 4, 4);

          if (item.isPurchased) {
            doc.setFillColor(72, 187, 120);
            doc.rect(18.5, y - 3, 3, 3, 'F');
          }

          // Clean Item Name & Source
          doc.setTextColor(26, 32, 44);
          doc.setFontSize(10);
          doc.setFont('helvetica', item.isPurchased ? 'italic' : 'normal');
          
          let itemLine = cleanTextForPDF(item.name);
          if (item.sourceRecipe) {
            itemLine += `  (from ${cleanTextForPDF(item.sourceRecipe)})`;
          }
          doc.text(itemLine, 26, y);

          // Clean Item Qty
          const qtyText = cleanTextForPDF(item.qty) || item.qty;
          doc.setTextColor(255, 107, 53);
          doc.setFont('helvetica', 'bold');
          doc.text(qtyText, 192, y, { align: 'right' });

          // Light line divider
          doc.setDrawColor(237, 242, 247);
          doc.line(18, y + 2.5, 192, y + 2.5);

          y += 8;
        });

        y += 4;
      });

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(160, 174, 192);
      doc.setFont('helvetica', 'italic');
      doc.text('Happy Cooking! Created with CookBook App', 105, 287, { align: 'center' });

      // Trigger automatic direct file download!
      doc.save(`CookBook_Grocery_List_${new Date().toISOString().slice(0, 10)}.pdf`);

      setNotification('Grocery List PDF downloaded directly! 📄');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // WhatsApp / Copy Text Share Handler
  const handleShareWhatsApp = () => {
    if (items.length === 0) {
      alert('Your grocery list is empty!');
      return;
    }

    let text = `🛒 *My CookBook Grocery List* (${items.length} items)\n📅 ${new Date().toLocaleDateString()}\n\n`;

    groupedCategories.forEach(cat => {
      text += `*${cat.name}*\n`;
      cat.items.forEach(i => {
        text += `${i.isPurchased ? '✅' : '▫️'} ${i.name} - *${i.qty}*${i.sourceRecipe ? ` _(${i.sourceRecipe})_` : ''}\n`;
      });
      text += `\n`;
    });

    text += `🍳 _Created with CookBook App_`;

    navigator.clipboard?.writeText(text);
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setNotification('Grocery list copied to clipboard & opened in WhatsApp! 📲');
    setTimeout(() => setNotification(''), 4000);
  };

  // Group items by category
  const groupedCategories = CATEGORY_OPTIONS.map(cat => {
    const catItems = items.filter(i => i.category === cat.name);
    return {
      ...cat,
      items: catItems,
    };
  }).filter(cat => cat.items.length > 0);

  const totalCount = items.length;
  const purchasedCount = items.filter(i => i.isPurchased).length;

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 800, color: C.ink, margin: 0 }}>Grocery List</h1>
            <p style={{ fontSize: 14, color: C.ink2, margin: '4px 0 0' }}>
              {totalCount > 0 ? `${purchasedCount} of ${totalCount} items completed` : 'Add items manually or import directly from recipes!'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {totalCount > 0 && (
              <>
                <button onClick={handleExportPDF} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 700, color: C.ink, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <FileText size={14} color={C.primary} /> Download PDF 📄
                </button>
                <button onClick={handleShareWhatsApp} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: 'none', background: '#25D366', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(37,211,102,0.3)' }}>
                  <Share2 size={14} /> Share on WhatsApp
                </button>
                {purchasedCount > 0 && (
                  <button onClick={clearPurchased} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 600, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Clear Purchased
                  </button>
                )}
                <button onClick={clearAll} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 600, color: C.red, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Trash2 size={13} /> Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Success Banner */}
        {notification && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 18px', borderRadius: 14, fontSize: 13, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{notification}</span>
            <button onClick={() => setNotification('')} style={{ background: 'none', border: 'none', color: '#065F46', cursor: 'pointer' }}><X size={16} /></button>
          </div>
        )}

        {/* Progress bar */}
        {totalCount > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ height: 6, borderRadius: 3, background: C.muted }}>
              <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, #38A169)`, width: `${(purchasedCount / totalCount) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}

        {/* ADD PANEL WITH TABS */}
        <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: '20px', marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          
          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: C.muted, borderRadius: 12, padding: 4, marginBottom: 20 }}>
            <button
              onClick={() => setAddMode('manual')}
              style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: addMode === 'manual' ? C.card : 'transparent', color: addMode === 'manual' ? C.ink : C.ink2, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: addMode === 'manual' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.15s' }}
            >
              ➕ Manual Item Add
            </button>
            <button
              onClick={() => setAddMode('recipe')}
              style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: addMode === 'recipe' ? C.card : 'transparent', color: addMode === 'recipe' ? C.primary : C.ink2, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: addMode === 'recipe' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              📖 Import Ingredients from Recipe ✨
            </button>
          </div>

          {/* MODE 1: MANUAL ADD FORM */}
          {addMode === 'manual' && (
            <form onSubmit={handleAddItem}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr auto', gap: 10, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Item name (e.g. Paneer, Tomatoes)"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', fontFamily: 'inherit' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Qty (e.g. 500g, 1kg)"
                  value={itemQty}
                  onChange={e => setItemQty(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', fontFamily: 'inherit' }}
                />
                <select
                  value={itemCategory}
                  onChange={e => setItemCategory(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
                >
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <Button variant="primary" size="md" icon={<Plus size={16} />} type="submit">
                  Add
                </Button>
              </div>
            </form>
          )}

          {/* MODE 2: IMPORT INGREDIENTS FROM RECIPE */}
          {addMode === 'recipe' && (
            <div>
              {/* Sub-Tabs: Saved / Search */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
                <button
                  onClick={() => { setRecipeTab('favorites'); setSelectedRecipe(null); setRecipeDetails(null); }}
                  style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: recipeTab === 'favorites' ? C.primary : C.ink3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, borderBottom: recipeTab === 'favorites' ? `2px solid ${C.primary}` : 'none', paddingBottom: 6 }}
                >
                  <Bookmark size={14} /> My Saved Recipes
                </button>
                <button
                  onClick={() => { setRecipeTab('search'); setSelectedRecipe(null); setRecipeDetails(null); }}
                  style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: recipeTab === 'search' ? C.primary : C.ink3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, borderBottom: recipeTab === 'search' ? `2px solid ${C.primary}` : 'none', paddingBottom: 6 }}
                >
                  <Search size={14} /> Search Any Recipe
                </button>
              </div>

              {!selectedRecipe ? (
                <div>
                  {recipeTab === 'search' && (
                    <div style={{ position: 'relative', marginBottom: 16 }}>
                      <Search size={16} color={C.ink3} style={{ position: 'absolute', left: 14, top: 12 }} />
                      <input
                        type="text"
                        placeholder="Search recipe by name (e.g. Biryani, Paneer, Dosa)..."
                        value={searchQuery}
                        onChange={e => handleSearchRecipes(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  {loadingRecipes ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: C.ink3, fontSize: 13 }}>
                      Loading recipes...
                    </div>
                  ) : recipeTab === 'favorites' ? (
                    favoritesList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: C.ink3, fontSize: 13 }}>
                        No saved recipes found. Try switching to <strong>Search Any Recipe</strong> above!
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                        {favoritesList.map(rec => {
                          const isPro = rec.is_premium === 1 || rec.is_premium === true;
                          return (
                            <div
                              key={rec.id}
                              onClick={() => handleSelectRecipe(rec)}
                              style={{ background: C.muted, borderRadius: 12, border: `1px solid ${isPro ? 'rgba(246,201,14,0.4)' : C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10, padding: 8, position: 'relative' }}
                            >
                              <img src={rec.cover_image_url || rec.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'} alt={rec.title} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                              <div style={{ overflow: 'hidden', flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  {rec.title}
                                </div>
                                <div style={{ fontSize: 11, color: isPro ? C.gold : C.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                                  {isPro ? <><Crown size={11} fill={C.gold} /> PRO Recipe</> : 'Select Recipe →'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    searchResults.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: C.ink3, fontSize: 13 }}>
                        {searchQuery ? 'No recipes found for this search.' : 'Type a recipe name above to search!'}
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                        {searchResults.map(rec => {
                          const isPro = rec.is_premium === 1 || rec.is_premium === true;
                          return (
                            <div
                              key={rec.id}
                              onClick={() => handleSelectRecipe(rec)}
                              style={{ background: C.muted, borderRadius: 12, border: `1px solid ${isPro ? 'rgba(246,201,14,0.4)' : C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10, padding: 8, position: 'relative' }}
                            >
                              <img src={rec.cover_image_url || rec.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'} alt={rec.title} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                              <div style={{ overflow: 'hidden', flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rec.title}</div>
                                <div style={{ fontSize: 11, color: isPro ? C.gold : C.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                                  {isPro ? <><Crown size={11} fill={C.gold} /> PRO Recipe</> : 'Select Recipe →'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              ) : (
                /* SELECTED RECIPE INGREDIENT SCALER PANEL */
                <div style={{ background: C.muted, borderRadius: 16, border: `1.5px solid ${C.primary}`, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={selectedRecipe.cover_image_url || selectedRecipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'} alt={selectedRecipe.title} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: C.ink, margin: 0 }}>{selectedRecipe.title}</h4>
                        <div style={{ fontSize: 12, color: C.ink2, marginTop: 2 }}>Base Servings: <strong>{selectedRecipe.base_servings || 4} people</strong></div>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedRecipe(null); setRecipeDetails(null); }} style={{ background: 'none', border: 'none', color: C.ink3, cursor: 'pointer' }}><X size={20} /></button>
                  </div>

                  {/* SERVINGS / NUMBER OF PEOPLE SELECTOR */}
                  <div style={{ background: C.card, borderRadius: 14, padding: '14px 18px', border: `1px solid ${C.border}`, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={18} color={C.primary} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Number of People / Servings:</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {[1, 2, 4, 6, 8].map(n => (
                          <button
                            key={n}
                            onClick={() => setPeopleCount(n)}
                            style={{ width: 36, height: 36, borderRadius: 10, border: `2px solid ${peopleCount === n ? C.primary : C.border}`, background: peopleCount === n ? C.primary : C.card, color: peopleCount === n ? '#fff' : C.ink, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW INGREDIENTS */}
                  {loadingDetails ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: C.ink3, fontSize: 13 }}>Loading recipe ingredients...</div>
                  ) : ((selectedRecipe?.is_premium === 1 || selectedRecipe?.is_premium === true || recipeDetails?.is_locked) && !isPremium) ? (
                    <div style={{ background: C.card, borderRadius: 14, padding: '24px', textAlign: 'center', border: `1px solid rgba(246,201,14,0.4)` }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #F6C90E, #FF9F1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <Crown size={24} color="#1A1D27" />
                      </div>
                      <h5 style={{ fontSize: 16, fontWeight: 800, color: C.ink, margin: '0 0 6px' }}>PRO Recipe Ingredients Locked 🔒</h5>
                      <p style={{ fontSize: 13, color: C.ink2, margin: '0 0 16px', lineHeight: 1.5 }}>
                        Importing ingredients for <strong>{selectedRecipe.title}</strong> is exclusively available for CookBook PRO members.
                      </p>
                      <button
                        onClick={() => onNavigate && onNavigate('subscription')}
                        style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #F6C90E, #FF9F1C)', color: '#1A1D27', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <Crown size={15} fill="#1A1D27" /> Upgrade to PRO 👑
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                        Ingredients to Import ({recipeDetails?.recipe_ingredients?.length || 0}):
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8, maxHeight: 200, overflowY: 'auto', marginBottom: 20, paddingRight: 4 }}>
                        {(recipeDetails?.recipe_ingredients || []).map((ing, idx) => {
                          const base = recipeDetails.base_servings || 1;
                          const ratio = peopleCount / base;
                          const name = ing.ingredient?.name || ing.notes || ing.name || 'Ingredient';
                          const baseQty = ing.quantity != null ? ing.quantity : 1;
                          const scaled = Math.round((baseQty * ratio) * 10) / 10;
                          const unit = ing.unit && ing.unit.toLowerCase() !== 'unit' ? ing.unit : 'pc';
                          return (
                            <div key={idx} style={{ background: C.card, padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                              <span style={{ fontWeight: 600, color: C.ink }}>{name}</span>
                              <span style={{ fontWeight: 700, color: C.primary }}>{scaled} {unit}</span>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleImportIngredients}
                        style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #FF6B35, #E55A2B)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,107,53,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                      >
                        <Sparkles size={16} /> Import All Ingredients for {peopleCount} {peopleCount === 1 ? 'Person' : 'People'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Grouped Category Lists */}
        {groupedCategories.length > 0 ? (
          groupedCategories.map(cat => (
            <div key={cat.name} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ padding: '14px 20px', borderLeft: `4px solid ${cat.color}`, background: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{cat.name}</span>
                <span style={{ fontSize: 12, color: C.ink3, fontWeight: 600 }}>
                  {cat.items.filter(i => i.isPurchased).length} / {cat.items.length} items
                </span>
              </div>
              {cat.items.map((item, i) => {
                const done = item.isPurchased;
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i > 0 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => togglePurchased(item.id)}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? cat.color : C.border}`, background: done ? cat.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {done && <Check size={13} color="#fff" strokeWidth={3} />}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, color: done ? C.ink3 : C.ink, textDecoration: done ? 'line-through' : 'none', fontWeight: 500 }}>
                        {item.name}
                      </span>
                      {item.sourceRecipe && (
                        <span style={{ fontSize: 11, color: C.primary, fontWeight: 600, marginLeft: 8, background: C.primaryLight, padding: '2px 8px', borderRadius: 6 }}>
                          from {item.sourceRecipe}
                        </span>
                      )}
                    </div>
                    
                    <span style={{ fontSize: 13, fontWeight: 600, color: done ? C.ink3 : cat.color }}>
                      {item.qty}
                    </span>

                    <button
                      onClick={(e) => deleteItem(item.id, e)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, color: C.ink3, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.red)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.ink3)}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div style={{ background: C.card, borderRadius: 20, border: `1.5px dashed ${C.border}`, padding: '56px 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShoppingCart size={32} color={C.primary} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 800, color: C.ink, margin: '0 0 8px' }}>
              Your Grocery List is Empty
            </h3>
            <p style={{ fontSize: 14, color: C.ink2, maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.6 }}>
              No pre-filled items. Use <strong>Manual Add</strong> or click <strong>Import Ingredients from Recipe 📖</strong> above to auto-generate your shopping list!
            </p>
          </div>
        )}

      </div>

      {/* PRO RECIPE LOCKED MODAL (FOR FREE USERS) */}
      {showProModal && selectedProRecipe && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,12,20,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setShowProModal(false)}>
          <div style={{ background: '#1A1D27', border: '1px solid rgba(246,201,14,0.4)', borderRadius: 24, padding: '36px 32px', maxWidth: 460, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', position: 'relative' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowProModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#8E8EA0', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #F6C90E, #FF9F1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(246,201,14,0.35)' }}>
              <Crown size={32} color="#1A1D27" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>PRO Recipe Locked 👑</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 24px' }}>
              <strong style={{ color: '#F6C90E' }}>{selectedProRecipe.title}</strong> is an exclusive Masterchef PRO recipe reserved for Premium members.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '16px 20px', textAlign: 'left', marginBottom: 24, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#fff' }}>
                <Sparkles size={16} color="#F6C90E" /> Import ingredient lists from all PRO recipes
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#fff' }}>
                <Sparkles size={16} color="#F6C90E" /> Automatic serving size ingredient scaling
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => { setShowProModal(false); onNavigate && onNavigate('subscription'); }}
                style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #F6C90E, #FF9F1C)', color: '#1A1D27', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(246,201,14,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Crown size={18} fill="#1A1D27" /> Upgrade to CookBook PRO 👑
              </button>
              <button
                onClick={() => setShowProModal(false)}
                style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
