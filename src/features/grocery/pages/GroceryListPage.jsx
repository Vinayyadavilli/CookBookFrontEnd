
import { useState, useEffect } from 'react';
import {
  Plus, Check, Trash2, Printer, Share2, ShoppingCart
} from 'lucide-react';
import { C } from '@/shared/theme/tokens';
import { Button } from '@/shared/components/ui/Button';

const CATEGORY_OPTIONS = [
  { name: 'Vegetables 🥦', color: '#48BB78' },
  { name: 'Proteins 🍗', color: '#FC5C65' },
  { name: 'Dairy 🥛', color: '#4299E1' },
  { name: 'Spices 🌶️', color: '#F6C90E' },
  { name: 'Grains & Staples 🌾', color: '#ED8936' },
  { name: 'Other 🛒', color: '#A0AEC0' },
];

export default function GroceryListPage() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cookbook_grocery_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [itemCategory, setItemCategory] = useState(CATEGORY_OPTIONS[0].name);

  // Sync to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('cookbook_grocery_items', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 800, color: C.ink, margin: 0 }}>Grocery List</h1>
            <p style={{ fontSize: 14, color: C.ink2, margin: '4px 0 0' }}>
              {totalCount > 0 ? `${purchasedCount} of ${totalCount} items completed` : 'Add items manually to manage your shopping list'}
            </p>
          </div>
          {totalCount > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {purchasedCount > 0 && (
                <button onClick={clearPurchased} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 600, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Clear Purchased
                </button>
              )}
              <button onClick={clearAll} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 600, color: C.red, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Trash2 size={13} /> Clear All
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ height: 6, borderRadius: 3, background: C.muted }}>
              <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, #38A169)`, width: `${(purchasedCount / totalCount) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: '16px 20px', marginBottom: 32, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ➕ Add New Grocery Item
          </div>
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
                    
                    <span style={{ flex: 1, fontSize: 14, color: done ? C.ink3 : C.ink, textDecoration: done ? 'line-through' : 'none', fontWeight: 500 }}>
                      {item.name}
                    </span>
                    
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
              No pre-filled items. Use the input form above to manually add ingredients and groceries for your shopping list!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 7 — AI COOK ASSISTANT CHAT
// ═══════════════════════════════════════════════════════════════════════════════
