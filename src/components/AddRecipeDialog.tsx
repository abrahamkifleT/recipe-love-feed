import { useState } from "react";
import { Plus, X, Clock, ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateRecipe } from "@/hooks/useRecipes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddRecipeDialogProps {
  trigger: React.ReactNode;
}

const availableTags = ["Breakfast", "Lunch", "Dinner", "Vegan", "Desserts", "Seafood", "Italian", "Quick Meals"];

const AddRecipeDialog = ({ trigger }: AddRecipeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("2");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const createRecipe = useCreateRecipe();
  const { toast } = useToast();

  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const removeIngredient = (index: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) =>
    setIngredients((prev) => prev.map((item, i) => (i === index ? value : item)));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetForm = () => {
    setTitle("");
    setIngredients([""]);
    setInstructions("");
    setCookTime("");
    setServings("2");
    setSelectedTags([]);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to add recipes.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let image_url: string | undefined;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("recipe-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("recipe-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      await createRecipe.mutateAsync({
        title,
        image_url,
        ingredients: ingredients.filter((i) => i.trim()),
        instructions,
        cook_time: cookTime,
        servings: parseInt(servings) || 2,
        tags: selectedTags,
        user_id: user.id,
      });

      toast({ title: "Recipe published!" });
      resetForm();
      setOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Recipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input placeholder="e.g. Creamy Garlic Pasta" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Image</label>
            <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <>
                  <ImagePlus size={32} />
                  <span className="text-sm">Click to upload a photo</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Ingredients</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={`Ingredient ${i + 1}`} value={ing} onChange={(e) => updateIngredient(i, e.target.value)} />
                  {ingredients.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(i)}>
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus size={14} className="mr-1" /> Add Ingredient
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Instructions</label>
            <Textarea placeholder="Describe the steps..." rows={4} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Cooking Time</label>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <Input placeholder="e.g. 25 min" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Servings</label>
              <Input type="number" min={1} value={servings} onChange={(e) => setServings(e.target.value)} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Recipe"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeDialog;
