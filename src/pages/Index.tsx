import { Search } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
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
    tags: ["Italian", "Quick"],
    likes: 234,
  },
  {
    title: "Avocado Toast with Poached Eggs",
    author: "James Chen",
    image: avocadoImg,
    cookTime: "15 min",
    servings: 2,
    tags: ["Breakfast", "Healthy"],
    likes: 189,
  },
  {
    title: "Nourishing Buddha Bowl",
    author: "Priya Sharma",
    image: buddhaImg,
    cookTime: "35 min",
    servings: 2,
    tags: ["Vegan", "Bowl"],
    likes: 312,
  },
  {
    title: "Chocolate Lava Cake",
    author: "Sophie Laurent",
    image: lavaImg,
    cookTime: "30 min",
    servings: 4,
    tags: ["Dessert", "Indulgent"],
    likes: 478,
  },
  {
    title: "Grilled Lemon Herb Salmon",
    author: "Tom Fischer",
    image: salmonImg,
    cookTime: "20 min",
    servings: 2,
    tags: ["Seafood", "Healthy"],
    likes: 256,
  },
  {
    title: "Margherita Pizza",
    author: "Luca Bianchi",
    image: pizzaImg,
    cookTime: "45 min",
    servings: 4,
    tags: ["Italian", "Classic"],
    likes: 567,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl text-foreground">tastebud</h1>
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="pl-9 pr-4 py-2 rounded-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring w-56 transition-all focus:w-72"
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 pt-12 pb-8">
        <h2 className="text-4xl sm:text-5xl text-foreground leading-tight max-w-lg">
          Discover & share<br />
          <span className="text-primary">delicious recipes</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-md">
          Explore community-curated meals, from quick weekday dinners to show-stopping desserts.
        </p>
      </section>

      {/* Feed */}
      <main className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.title} {...recipe} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
