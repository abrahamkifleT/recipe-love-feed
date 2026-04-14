import { Heart, Clock, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleLike } from "@/hooks/useRecipes";
import { useNavigate } from "react-router-dom";

interface RecipeCardProps {
  id: string;
  title: string;
  author: string;
  image: string | null;
  cookTime: string | null;
  servings: number | null;
  tags: string[];
  likeCount: number;
  likedByMe: boolean;
}

const RecipeCard = ({ id, title, author, image, cookTime, servings, tags, likeCount, likedByMe }: RecipeCardProps) => {
  const { user } = useAuth();
  const toggleLike = useToggleLike();
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    toggleLike.mutate({ recipeId: id, liked: likedByMe });
  };

  return (
    <div className="group rounded-xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer" onClick={() => navigate(`/recipe/${id}`)}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-card/80 backdrop-blur-sm text-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg leading-snug text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">by {author}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {cookTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> {cookTime}
              </span>
            )}
            {servings && (
              <span className="flex items-center gap-1.5">
                <Users size={15} /> {servings}
              </span>
            )}
          </div>

          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-sm transition-colors duration-200 group/like"
            aria-label={likedByMe ? "Unlike recipe" : "Like recipe"}
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ${
                likedByMe
                  ? "fill-accent text-accent scale-110"
                  : "text-muted-foreground group-hover/like:text-accent"
              }`}
            />
            <span className={likedByMe ? "text-accent font-medium" : "text-muted-foreground"}>
              {likeCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
