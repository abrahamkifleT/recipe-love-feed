import { useState } from "react";
import { Search, Plus } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import RecipeSidebar from "@/components/RecipeSidebar";
import AddRecipeDialog from "@/components/AddRecipeDialog";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import pastaImg from "@/assets/pasta.jpg";
import avocadoImg from "@/assets/avocado-toast.jpg";
import buddhaImg from "@/assets/buddha-bowl.jpg";
import lavaImg from "@/assets/lava-cake.jpg";
import salmonImg from "@/assets/salmon.jpg";
import pizzaImg from "@/assets/pizza.jpg";

const recipes = [
  {
    title: "Classic Basil & Parmesan Pasta",
    author: "Maria Rossi",
    image: pastaImg,
    cookTime: "25 min",
    servings: 4,
    tags: ["Italian", "Quick Meals"],
    likes: 234,
  },
  {
    title: "Avocado Toast with Poached Eggs",
    author: "James Chen",
    image: avocadoImg,
    cookTime: "15 min",
    servings: 2,
    tags: ["Breakfast", "Quick Meals"],
    likes: 189,
  },
  {
    title: "Nourishing Buddha Bowl",
    author: "Priya Sharma",
    image: buddhaImg,
    cookTime: "35 min",
    servings: 2,
    tags: ["Vegan", "Lunch"],
    likes: 312,
  },
  {
    title: "Chocolate Lava Cake",
    author: "Sophie Laurent",
    image: lavaImg,
    cookTime: "30 min",
    servings: 4,
    tags: ["Desserts"],
    likes: 478,
  },
  {
    title: "Grilled Lemon Herb Salmon",
    author: "Tom Fischer",
    image: salmonImg,
    cookTime: "20 min",
    servings: 2,
    tags: ["Seafood", "Dinner"],
    likes: 256,
  },
  {
    title: "Margherita Pizza",
    author: "Luca Bianchi",
    image: pizzaImg,
    cookTime: "45 min",
    servings: 4,
    tags: ["Italian", "Dinner"],
    likes: 567,
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = recipes.filter((r) => {
    const matchesCategory = !selectedCategory || r.tags.includes(selectedCategory);
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-2xl text-foreground whitespace-nowrap">Recipe Hub</h1>

          {/* Search */}
          <div className="relative flex-1 max-w-md mx-auto hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <AddRecipeDialog
              trigger={
                <Button size="sm" className="gap-1.5">
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Recipe</span>
                </Button>
              }
            />
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 pt-8 pb-16 flex gap-8 flex-1">
        <RecipeSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <main className="flex-1 min-w-0">
          {/* Mobile search */}
          <div className="sm:hidden mb-4 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No recipes found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((recipe) => (
                <RecipeCard key={recipe.title} {...recipe} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
