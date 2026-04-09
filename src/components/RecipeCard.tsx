import { useState } from "react";
import { Heart, Clock, Users } from "lucide-react";

interface RecipeCardProps {
  title: string;
  author: string;
  image: string;
  cookTime: string;
  servings: number;
  tags: string[];
  likes: number;
}

const RecipeCard = ({ title, author, image, cookTime, servings, tags, likes }: RecipeCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="group rounded-xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-card/80 backdrop-blur-sm text-foreground"
            >
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
            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              {cookTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={15} />
              {servings}
            </span>
          </div>

          <button
            onClick={toggleLike}
            className="flex items-center gap-1.5 text-sm transition-colors duration-200 group/like"
            aria-label={liked ? "Unlike recipe" : "Like recipe"}
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ${
                liked
                  ? "fill-primary text-primary scale-110"
                  : "text-muted-foreground group-hover/like:text-primary"
              }`}
            />
            <span className={liked ? "text-primary font-medium" : "text-muted-foreground"}>
              {likeCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
