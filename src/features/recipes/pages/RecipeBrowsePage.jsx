
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChefHat, Search, ChevronRight, ChevronDown, ChevronLeft, Filter, X
} from 'lucide-react';
import { C } from '@/shared/theme/tokens';
import { DifficultyBadge } from '@/shared/components/ui/Badges';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { NavBar } from '@/shared/components/navigation/NavBar';
import { fetchRecipes, fetchFilterOptions } from '@/features/recipes/api';

const COOK_TIME_OPTIONS = [
  { value: 'any', label: 'Any time', min: null, max: null },
  { value: 'lt30', label: '< 30 min', min: null, max: 30 },
  { value: '30-60', label: '30–60 min', min: 30, max: 60 },
  { value: 'gt60', label: '> 60 min', min: 60, max: null },
]

const getInitialFilter = (key, defaultVal) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(key)) {
      const val = urlParams.get(key);
      if (key === 'difficulty') return val ? val.split(',') : [];
      if (key === 'page') return parseInt(val, 10) || 1;
      return val;
    }
    const saved = sessionStorage.getItem(`cb_filter_${key}`);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return defaultVal;
};

export default function RecipeBrowsePage({ onNavigate }) {
  // Filter state (persisted across navigation)
  const [search, setSearch] = useState(() => getInitialFilter('search', ''))
  const [selectedCategory, setSelectedCategory] = useState(() => getInitialFilter('category_id', null))
  const [selectedCuisine, setSelectedCuisine] = useState(() => getInitialFilter('cuisine_id', null))
  const [selectedState, setSelectedState] = useState(() => getInitialFilter('state_id', null))
  const [foodType, setFoodType] = useState(() => getInitialFilter('food_type', 'all'))
  const [difficulty, setDifficulty] = useState(() => getInitialFilter('difficulty', []))
  const [cookTime, setCookTime] = useState(() => getInitialFilter('cookTime', 'any'))
  const [sortBy, setSortBy] = useState('popular')

  // Accordion open states
  const [catOpen, setCatOpen] = useState(true)
  const [cuisineOpen, setCuisineOpen] = useState(true)
  const [stateOpen, setStateOpen] = useState(false)

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({ categories: [], states: [], cuisines: [] })

  // Results
  const [page, setPage] = useState(() => getInitialFilter('page', 1))
  const [recipes, setRecipes] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const searchTimeout = useRef(null)
  const LIMIT = 12

  // Sync state to sessionStorage and URL
  useEffect(() => {
    try {
      sessionStorage.setItem('cb_filter_search', JSON.stringify(search));
      sessionStorage.setItem('cb_filter_category_id', JSON.stringify(selectedCategory));
      sessionStorage.setItem('cb_filter_cuisine_id', JSON.stringify(selectedCuisine));
      sessionStorage.setItem('cb_filter_state_id', JSON.stringify(selectedState));
      sessionStorage.setItem('cb_filter_food_type', JSON.stringify(foodType));
      sessionStorage.setItem('cb_filter_difficulty', JSON.stringify(difficulty));
      sessionStorage.setItem('cb_filter_cookTime', JSON.stringify(cookTime));
      sessionStorage.setItem('cb_filter_page', JSON.stringify(page));

      const url = new URL(window.location);
      if (search) url.searchParams.set('search', search); else url.searchParams.delete('search');
      if (selectedCategory) url.searchParams.set('category_id', selectedCategory); else url.searchParams.delete('category_id');
      if (selectedCuisine) url.searchParams.set('cuisine_id', selectedCuisine); else url.searchParams.delete('cuisine_id');
      if (selectedState) url.searchParams.set('state_id', selectedState); else url.searchParams.delete('state_id');
      if (foodType !== 'all') url.searchParams.set('food_type', foodType); else url.searchParams.delete('food_type');
      if (difficulty.length > 0) url.searchParams.set('difficulty', difficulty.join(',')); else url.searchParams.delete('difficulty');
      if (cookTime !== 'any') url.searchParams.set('cookTime', cookTime); else url.searchParams.delete('cookTime');
      if (page > 1) url.searchParams.set('page', page); else url.searchParams.delete('page');

      window.history.replaceState(window.history.state, '', url.toString());
    } catch (e) {}
  }, [search, selectedCategory, selectedCuisine, selectedState, foodType, difficulty, cookTime, page]);

  // Load filter options on mount
  useEffect(() => {
    fetchFilterOptions()
      .then(res => setFilterOptions(res.data || { categories: [], states: [], cuisines: [] }))
      .catch(() => {})
  }, [])

  const buildParams = useCallback(() => {
    const timeOpt = COOK_TIME_OPTIONS.find(o => o.value === cookTime) || {}
    return {
      page,
      limit: LIMIT,
      ...(search ? { search } : {}),
      ...(selectedCategory ? { category_id: selectedCategory } : {}),
      ...(selectedCuisine ? { cuisine_id: selectedCuisine } : {}),
      ...(selectedState ? { state_id: selectedState } : {}),
      ...(foodType !== 'all' ? { food_type: foodType } : {}),
      ...(difficulty.length > 0 ? { difficulty: difficulty.map(d => d.toLowerCase()).join(',') } : {}),
      ...(timeOpt.max != null ? { max_time: timeOpt.max } : {}),
      ...(timeOpt.min != null ? { min_time: timeOpt.min } : {}),
    }
  }, [page, search, selectedCategory, selectedCuisine, selectedState, foodType, difficulty, cookTime])

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchRecipes(buildParams())
      setRecipes(res.data || [])
      setTotal(res.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  // Fetch whenever page or filters change
  useEffect(() => { loadRecipes() }, [page, selectedCategory, selectedCuisine, selectedState, foodType, difficulty, cookTime])

  const handleClear = () => {
    setSearch(''); setSelectedCategory(null); setSelectedCuisine(null)
    setSelectedState(null); setFoodType('all'); setDifficulty([]); setCookTime('any')
    setPage(1)
    try {
      sessionStorage.removeItem('cb_filter_search');
      sessionStorage.removeItem('cb_filter_category_id');
      sessionStorage.removeItem('cb_filter_cuisine_id');
      sessionStorage.removeItem('cb_filter_state_id');
      sessionStorage.removeItem('cb_filter_food_type');
      sessionStorage.removeItem('cb_filter_difficulty');
      sessionStorage.removeItem('cb_filter_cookTime');
      sessionStorage.removeItem('cb_filter_page');
    } catch (e) {}
  }

  const handleSearchChange = (val) => {
    setSearch(val)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => { setPage(1); loadRecipes() }, 500)
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))
  const activeFilterCount = [
    selectedCategory, selectedCuisine, selectedState,
    foodType !== 'all' ? foodType : null,
    ...difficulty,
    cookTime !== 'any' ? cookTime : null,
    search || null
  ].filter(Boolean).length

  const SectionHeader = ({ label, open, onToggle }) => (
    <button onClick={onToggle}
      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', borderBottom: `1px solid ${C.border}`, marginBottom: 10, fontFamily: 'inherit' }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      {open ? <ChevronDown size={14} color={C.ink3} /> : <ChevronRight size={14} color={C.ink3} />}
    </button>
  )

  return (
    <div style={{ paddingTop: 72, background: C.bg, minHeight: '100vh', display: 'flex' }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 248, flexShrink: 0, background: C.card, borderRight: `1px solid ${C.border}`, padding: '20px 16px', position: 'sticky', top: 72, height: 'calc(100vh - 72px)', overflowY: 'auto' }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={15} color={C.ink3} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search recipes..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            style={{ width: '100%', padding: '9px 32px 9px 34px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
          {search && (
            <button onClick={() => handleSearchChange('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={14} color={C.ink3} />
            </button>
          )}
        </div>

        {/* Food Type */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Food Type</div>
          {[['all', '🍽️ All'], ['veg', '🥦 Vegetarian'], ['non_veg', '🍗 Non-Veg'], ['egg', '🥚 Eggetarian']].map(([v, l]) => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: foodType === v ? C.primary : C.ink2, fontWeight: foodType === v ? 600 : 400 }}>
              <input type="radio" name="foodType" checked={foodType === v} onChange={() => setFoodType(v)} style={{ accentColor: C.primary }} />{l}
            </label>
          ))}
        </div>

        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader label="Category" open={catOpen} onToggle={() => setCatOpen(!catOpen)} />
          {catOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => setSelectedCategory(null)}
                style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: 'none', background: selectedCategory === null ? C.primaryLight : 'none', cursor: 'pointer', fontSize: 13, color: selectedCategory === null ? C.primary : C.ink2, fontFamily: 'inherit', fontWeight: selectedCategory === null ? 600 : 400 }}>
                All Categories
              </button>
              {filterOptions.categories.map(c => {
                const getCategoryEmoji = (name) => {
                  const lower = name.toLowerCase();
                  if (lower.includes('rice') || lower.includes('biryani')) return '🍚 ';
                  if (lower.includes('breakfast')) return '🍳 ';
                  if (lower.includes('lunch')) return '🍲 ';
                  if (lower.includes('dinner')) return '🍛 ';
                  if (lower.includes('dessert')) return '🍰 ';
                  if (lower.includes('snack')) return '🍿 ';
                  if (lower.includes('beverage')) return '🍹 ';
                  if (lower.includes('soup')) return '🥣 ';
                  if (lower.includes('salad')) return '🥗 ';
                  if (lower.includes('side')) return '🍟 ';
                  if (lower.includes('appetizer')) return '🥟 ';
                  return '🍽️ ';
                };
                return (
                  <button key={c.id} onClick={() => setSelectedCategory(c.id)}
                    style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: 'none', background: selectedCategory === c.id ? C.primaryLight : 'none', cursor: 'pointer', fontSize: 13, color: selectedCategory === c.id ? C.primary : C.ink2, fontFamily: 'inherit', fontWeight: selectedCategory === c.id ? 600 : 400 }}>
                    {getCategoryEmoji(c.name)}{c.name}
                  </button>
                );
              })}
              {filterOptions.categories.length === 0 && (
                <span style={{ fontSize: 12, color: C.ink3, padding: '4px 10px' }}>Loading...</span>
              )}
            </div>
          )}
        </div>

        {/* Cuisine */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader label="Cuisine" open={cuisineOpen} onToggle={() => setCuisineOpen(!cuisineOpen)} />
          {cuisineOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => setSelectedCuisine(null)}
                style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: 'none', background: selectedCuisine === null ? C.primaryLight : 'none', cursor: 'pointer', fontSize: 13, color: selectedCuisine === null ? C.primary : C.ink2, fontFamily: 'inherit', fontWeight: selectedCuisine === null ? 600 : 400 }}>
                All Cuisines
              </button>
              {filterOptions.cuisines.map(c => (
                <button key={c.id} onClick={() => setSelectedCuisine(c.id)}
                  style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: 'none', background: selectedCuisine === c.id ? C.primaryLight : 'none', cursor: 'pointer', fontSize: 13, color: selectedCuisine === c.id ? C.primary : C.ink2, fontFamily: 'inherit', fontWeight: selectedCuisine === c.id ? 600 : 400 }}>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Difficulty</div>
          {['Easy', 'Medium', 'Hard'].map(d => (
            <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: C.ink2 }}>
              <input type="checkbox" checked={difficulty.includes(d)} onChange={e => setDifficulty(prev => e.target.checked ? [...prev, d] : prev.filter(x => x !== d))} style={{ accentColor: C.primary }} />
              <DifficultyBadge level={d.toLowerCase()} />
            </label>
          ))}
        </div>

        {/* Cook Time */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Cooking Time</div>
          {COOK_TIME_OPTIONS.map(({ value, label }) => (
            <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: cookTime === value ? C.primary : C.ink2, fontWeight: cookTime === value ? 600 : 400 }}>
              <input type="radio" name="cookTime" checked={cookTime === value} onChange={() => setCookTime(value)} style={{ accentColor: C.primary }} />{label}
            </label>
          ))}
        </div>

        {/* Region / State */}
        <div style={{ marginBottom: 24 }}>
          <SectionHeader label="Region / State" open={stateOpen} onToggle={() => setStateOpen(!stateOpen)} />
          {stateOpen && (
            <select
              value={selectedState || ''}
              onChange={e => setSelectedState(e.target.value || null)}
              style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="">All States</option>
              {filterOptions.states.map(s => (
                <option key={s.id} value={s.id}>{s.name}{s.region ? ` (${s.region})` : ''}</option>
              ))}
            </select>
          )}
        </div>

        {/* Actions */}
        {activeFilterCount > 0 && (
          <button onClick={handleClear}
            style={{ width: '100%', padding: '9px', border: `1.5px solid ${C.border}`, borderRadius: 10, background: 'none', fontSize: 13, color: C.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>
            Clear filters ({activeFilterCount})
          </button>
        )}
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '28px 32px' }}>
        {/* Sort bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '12px 16px', background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 14, color: C.ink2 }}>
            <strong style={{ color: C.ink }}>{total} recipes</strong> found
            {activeFilterCount > 0 && <span style={{ marginLeft: 8, fontSize: 12, color: C.primary, fontWeight: 600 }}>· {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: C.ink2 }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: '6px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.ink, background: C.muted, outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <option value="popular">Popular</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
              <option value="quick">Quick</option>
            </select>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <ChefHat size={40} color={C.primary} style={{ animation: 'spin 2s linear infinite', opacity: 0.5 }} />
          </div>
        ) : recipes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: C.ink2 }}>
            <ChefHat size={48} color={C.border} style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 18, fontWeight: 600, color: C.ink, marginBottom: 8 }}>No recipes found</div>
            <div style={{ fontSize: 14 }}>Try adjusting your filters or search term</div>
            <button onClick={handleClear} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
            {recipes.map(r => <RecipeCard key={r.id} recipe={r} onClick={() => onNavigate && onNavigate('recipe-detail', { recipeId: r.id })} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: page === 1 ? C.border : C.ink2, opacity: page === 1 ? 0.5 : 1 }}>
              <ChevronLeft size={14} />Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2
              if (p < 1 || p > totalPages) return null
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${p === page ? C.primary : C.border}`, background: p === page ? C.primary : C.card, color: p === page ? '#fff' : C.ink2, fontSize: 13, fontWeight: p === page ? 700 : 400, cursor: 'pointer' }}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, cursor: page >= totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: page >= totalPages ? C.border : C.ink2, opacity: page >= totalPages ? 0.5 : 1 }}>
              Next<ChevronRight size={14} />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
