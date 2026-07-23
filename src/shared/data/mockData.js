const RECIPES = [
  { id: 1, title: 'Butter Chicken Masala', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=420&fit=crop&auto=format', isVeg: false, isPremium: false, time: '45 min', difficulty: 'Medium', rating: 4.9, reviewCount: 2847, calories: 420, protein: 38, carbs: 22, fat: 18, cuisine: 'North Indian', chef: 'Ranveer Brar' },
  { id: 2, title: 'Paneer Tikka Masala', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=420&fit=crop&auto=format', isVeg: true, isPremium: false, time: '35 min', difficulty: 'Easy', rating: 4.7, reviewCount: 1923, calories: 310, protein: 22, carbs: 18, fat: 14, cuisine: 'North Indian', chef: 'Sanjeev Kapoor' },
  { id: 3, title: 'Hyderabadi Dum Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=420&fit=crop&auto=format', isVeg: false, isPremium: true, time: '90 min', difficulty: 'Hard', rating: 4.8, reviewCount: 3421, calories: 580, protein: 42, carbs: 65, fat: 16, cuisine: 'Hyderabadi', chef: 'Kunal Kapur' },
  { id: 4, title: 'Masala Dosa', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&h=420&fit=crop&auto=format', isVeg: true, isPremium: true, time: '30 min', difficulty: 'Medium', rating: 4.6, reviewCount: 1654, calories: 280, protein: 8, carbs: 48, fat: 6, cuisine: 'South Indian', chef: 'Vikas Khanna' },
  { id: 5, title: 'Chicken Tikka', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=420&fit=crop&auto=format', isVeg: false, isPremium: false, time: '25 min', difficulty: 'Easy', rating: 4.8, reviewCount: 2100, calories: 380, protein: 44, carbs: 8, fat: 16, cuisine: 'Mughlai' },
  { id: 6, title: 'Palak Paneer', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=420&fit=crop&auto=format', isVeg: true, isPremium: false, time: '25 min', difficulty: 'Easy', rating: 4.7, reviewCount: 1876, calories: 290, protein: 20, carbs: 16, fat: 15, cuisine: 'North Indian' },
  { id: 7, title: 'Chole Bhature', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=420&fit=crop&auto=format', isVeg: true, isPremium: false, time: '60 min', difficulty: 'Medium', rating: 4.8, reviewCount: 2200, calories: 520, protein: 18, carbs: 72, fat: 18, cuisine: 'Punjabi' },
  { id: 8, title: 'Grilled Chicken Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=420&fit=crop&auto=format', isVeg: false, isPremium: false, time: '20 min', difficulty: 'Easy', rating: 4.5, reviewCount: 980, calories: 250, protein: 40, carbs: 12, fat: 8, cuisine: 'Continental' },
]
const TRENDING = [
  { id: 5, title: 'Dal Makhani', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=280&fit=crop', isVeg: true, isPremium: false, time: '60 min', difficulty: 'Medium', rating: 4.8, reviewCount: 2100, calories: 340, protein: 18, carbs: 42, fat: 10, cuisine: 'North Indian' },
  { id: 9, title: 'Prawn Malai Curry', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=280&fit=crop', isVeg: false, isPremium: true, time: '40 min', difficulty: 'Medium', rating: 4.7, reviewCount: 763, calories: 390, protein: 36, carbs: 10, fat: 20, cuisine: 'Bengali' },
  { id: 6, title: 'Palak Paneer', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=280&fit=crop', isVeg: true, isPremium: false, time: '25 min', difficulty: 'Easy', rating: 4.7, reviewCount: 1876, calories: 290, protein: 20, carbs: 16, fat: 15, cuisine: 'North Indian' },
  { id: 7, title: 'Chicken Chettinad', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=280&fit=crop', isVeg: false, isPremium: true, time: '55 min', difficulty: 'Hard', rating: 4.9, reviewCount: 987, calories: 460, protein: 44, carbs: 14, fat: 22, cuisine: 'Chettinad' },
  { id: 8, title: 'Rajma Chawal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=280&fit=crop', isVeg: true, isPremium: false, time: '70 min', difficulty: 'Easy', rating: 4.6, reviewCount: 2340, calories: 380, protein: 16, carbs: 62, fat: 8, cuisine: 'Punjabi' },
]
const CATEGORIES = [
  { label: 'All', emoji: '🍽️' }, { label: 'Veg', emoji: '🥦' }, { label: 'Non-Veg', emoji: '🍗' },
  { label: 'Breakfast', emoji: '🥞' }, { label: 'Snacks', emoji: '🥨' }, { label: 'Biryani', emoji: '🍛' },
  { label: 'Desserts', emoji: '🍮' }, { label: 'Drinks', emoji: '🥤' }, { label: 'Keto', emoji: '🥑' },
  { label: 'Protein', emoji: '💪' }, { label: 'Quick', emoji: '⚡' },
]
const ALL_SCREENS = [
  { id: 'landing', label: '🏠 Landing' },
  { id: 'auth', label: '🔐 Auth' },
  { id: 'onboarding', label: '🎯 Onboard' },
  { id: 'home', label: '🍽️ Home' },
  { id: 'recipes', label: '📚 Browse' },
  { id: 'recipe-detail', label: '🍛 Detail' },
  { id: 'search', label: '🔍 Ingredient' },
  { id: 'meal-planner', label: '🤖 Planner' },
  { id: 'grocery', label: '🛒 Grocery' },
  { id: 'ai-chat', label: '💬 AI Chat' },
  { id: 'favorites', label: '❤️ Favorites' },
  { id: 'profile', label: '👤 Profile' },
  { id: 'subscription', label: '👑 Premium' },
  { id: 'admin', label: '🛠️ Admin' },
  { id: 'notifications', label: '🔔 Notifs' },
]

export { RECIPES, TRENDING, CATEGORIES, ALL_SCREENS };
