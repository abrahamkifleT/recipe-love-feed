import { useState, useMemo } from "react";
import { Search, Plus, LogIn, ChevronLeft, ChevronRight } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import RecipeSidebar from "@/components/RecipeSidebar";
import AddRecipeDialog from "@/components/AddRecipeDialog";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipes } from "@/hooks/useRecipes";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const { data: recipes, isLoading } = useRecipes();
  const navigate = useNavigate();

  const filtered = (recipes ?? []).filter((r) => {
    const matchesCategory = !selectedCategory || r.tags.includes(selectedCategory);
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.author_name ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getInitials = () => {
    if (!user) return "?";
    const name = user.user_metadata?.full_name || user.email || "";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-2xl text-foreground whitespace-nowrap">Recipe Hub</h1>

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
            {user ? (
              <>
                <AddRecipeDialog
                  trigger={
                    <Button size="sm" className="gap-1.5">
                      <Plus size={16} />
                      <span className="hidden sm:inline">Add Recipe</span>
                    </Button>
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-muted-foreground text-xs" disabled>
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => navigate("/auth")}>
                <LogIn size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 pt-10 pb-16 flex gap-8 flex-1">
        <RecipeSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <main className="flex-1 min-w-0">
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

          {!user && (
            <div className="mb-6 p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-foreground font-medium mb-2">Want to share your own recipes?</p>
              <p className="text-sm text-muted-foreground mb-4">Sign in to add, like, and share recipes with the community.</p>
              <Button onClick={() => navigate("/auth")} className="gap-1.5">
                <LogIn size={16} /> Sign In to Add Recipes
              </Button>
            </div>
          )}

          {isLoading ? (
            <p className="text-center text-muted-foreground py-12">Loading recipes...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No recipes found. Be the first to add one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  author={recipe.author_name ?? "Unknown"}
                  image={recipe.image_url}
                  cookTime={recipe.cook_time}
                  servings={recipe.servings}
                  tags={recipe.tags}
                  likeCount={recipe.like_count}
                  likedByMe={recipe.liked_by_me}
                />
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
