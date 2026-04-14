import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface RecipeWithAuthor {
  id: string;
  title: string;
  image_url: string | null;
  cook_time: string | null;
  servings: number | null;
  tags: string[];
  ingredients: string[];
  instructions: string | null;
  user_id: string;
  created_at: string;
  author_name: string | null;
  like_count: number;
  liked_by_me: boolean;
}

export const useRecipes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recipes", user?.id],
    queryFn: async (): Promise<RecipeWithAuthor[]> => {
      const { data: recipes, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const userIds = [...new Set(recipes.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const { data: likes } = await supabase.from("recipe_likes").select("recipe_id, user_id");

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.display_name]) ?? []);

      return recipes.map((r) => {
        const recipeLikes = likes?.filter((l) => l.recipe_id === r.id) ?? [];
        return {
          ...r,
          author_name: profileMap.get(r.user_id) ?? "Unknown",
          like_count: recipeLikes.length,
          liked_by_me: user ? recipeLikes.some((l) => l.user_id === user.id) : false,
        };
      });
    },
  });
};

export const useRecipeById = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recipe", id, user?.id],
    queryFn: async (): Promise<RecipeWithAuthor | null> => {
      const { data: recipe, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!recipe) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", recipe.user_id)
        .maybeSingle();

      const { data: likes } = await supabase
        .from("recipe_likes")
        .select("user_id")
        .eq("recipe_id", id);

      return {
        ...recipe,
        author_name: profile?.display_name ?? "Unknown",
        like_count: likes?.length ?? 0,
        liked_by_me: user ? (likes ?? []).some((l) => l.user_id === user.id) : false,
      };
    },
  });
};

export const useToggleLike = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipeId, liked }: { recipeId: string; liked: boolean }) => {
      if (!user) throw new Error("Must be logged in");
      if (liked) {
        await supabase.from("recipe_likes").delete().eq("recipe_id", recipeId).eq("user_id", user.id);
      } else {
        await supabase.from("recipe_likes").insert({ recipe_id: recipeId, user_id: user.id });
      }
    },
    onMutate: async ({ recipeId, liked }) => {
      await queryClient.cancelQueries({ queryKey: ["recipes"] });
      const previous = queryClient.getQueryData<RecipeWithAuthor[]>(["recipes", user?.id]);
      queryClient.setQueryData<RecipeWithAuthor[]>(["recipes", user?.id], (old) =>
        old?.map((r) =>
          r.id === recipeId
            ? { ...r, liked_by_me: !liked, like_count: liked ? r.like_count - 1 : r.like_count + 1 }
            : r
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["recipes", user?.id], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipe: {
      title: string;
      image_url?: string;
      ingredients: string[];
      instructions: string;
      cook_time: string;
      servings: number;
      tags: string[];
      user_id: string;
    }) => {
      const { error } = await supabase.from("recipes").insert(recipe);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
};
