import { Flame, UtensilsCrossed } from "lucide-react";

const categories = [
  { name: "Breakfast", emoji: "🌅" },
  { name: "Lunch", emoji: "🥗" },
  { name: "Dinner", emoji: "🍽️" },
  { name: "Vegan", emoji: "🌿" },
  { name: "Desserts", emoji: "🍰" },
  { name: "Seafood", emoji: "🐟" },
  { name: "Italian", emoji: "🍝" },
  { name: "Quick Meals", emoji: "⚡" },
];

const trending = [
  { title: "Spicy Thai Noodles", likes: 1243 },
  { title: "Blueberry Pancakes", likes: 987 },
  { title: "Caesar Salad", likes: 856 },
  { title: "Tiramisu", likes: 742 },
];

interface RecipeSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

const RecipeSidebar = ({ selectedCategory, onSelectCategory }: RecipeSidebarProps) => {
  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-8">
      {/* Categories */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="flex items-center gap-2 text-card-foreground text-base mb-4">
          <UtensilsCrossed size={18} className="text-primary" />
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === null
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              All Recipes
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                onClick={() => onSelectCategory(cat.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Trending */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="flex items-center gap-2 text-card-foreground text-base mb-4">
          <Flame size={18} className="text-primary" />
          Trending
        </h3>
        <ul className="space-y-3">
          {trending.map((item, i) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="text-xs font-bold text-primary mt-0.5">#{i + 1}</span>
              <div>
                <p className="text-sm text-card-foreground leading-snug">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.likes.toLocaleString()} likes</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default RecipeSidebar;
