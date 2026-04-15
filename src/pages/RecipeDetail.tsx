import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, Heart, X, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecipeById } from "@/hooks/useRecipes";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleLike } from "@/hooks/useRecipes";
import demoVideo from "@/assets/demo-recipe-video.mp4.asset.json";
import { useState, useRef, useCallback } from "react";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: recipe, isLoading } = useRecipeById(id!);
  const toggleLike = useToggleLike();
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (recipe) {
      toggleLike.mutate({ recipeId: recipe.id, liked: recipe.liked_by_me });
    }
  };

  const handleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const instructionSteps = recipe.instructions
    ?.split("\n")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

  const videoSrc = recipe.video_url || demoVideo.url;

  return (
    <div className="min-h-screen bg-background">
      {/* Video Overlay */}
      {showVideo && videoSrc && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-white font-semibold text-lg">Recipe Video</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVideo(false)}
                className="text-white hover:bg-white/20"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
          <div className="flex-1 flex items-start justify-center px-4 pb-4">
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              autoPlay
              className="w-full max-w-4xl rounded-2xl max-h-[80vh]"
            />
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-foreground truncate">{recipe.title}</h1>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero image */}
        {recipe.image_url && (
          <div className="rounded-2xl overflow-hidden aspect-video">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & meta */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">{recipe.title}</h2>
          <p className="text-muted-foreground">by {recipe.author_name ?? "Unknown"}</p>

          <div className="flex items-center gap-6 flex-wrap">
            {recipe.cook_time && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock size={16} /> {recipe.cook_time}
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users size={16} /> {recipe.servings} servings
              </span>
            )}
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-sm transition-colors"
            >
              <Heart
                size={18}
                className={recipe.liked_by_me ? "fill-[hsl(var(--like-active))] text-[hsl(var(--like-active))]" : "text-muted-foreground hover:text-[hsl(var(--like-active))]"}
              />
              <span className={recipe.liked_by_me ? "text-[hsl(var(--like-active))] font-medium" : "text-muted-foreground"}>
                {recipe.like_count}
              </span>
            </button>
          </div>

          {recipe.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {recipe.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Watch Video Link */}
        {videoSrc && (
          <div>
            <button
              onClick={() => setShowVideo(true)}
              className="text-accent font-semibold text-lg underline underline-offset-4 decoration-2 hover:opacity-80 transition-opacity"
            >
              ▶ Watch Recipe Video
            </button>
          </div>
        )}

        {/* Ingredients */}
        {recipe.ingredients.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {instructionSteps.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Instructions</h3>
            <ol className="space-y-4">
              {instructionSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-foreground pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
