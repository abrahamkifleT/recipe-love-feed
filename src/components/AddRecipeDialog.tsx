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

interface AddRecipeDialogProps {
  trigger: React.ReactNode;
}

const AddRecipeDialog = ({ trigger }: AddRecipeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([""]);

  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const removeIngredient = (index: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) =>
    setIngredients((prev) => prev.map((item, i) => (i === index ? value : item)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder – would save to DB
    setOpen(false);
    setIngredients([""]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Recipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input placeholder="e.g. Creamy Garlic Pasta" required />
          </div>

          {/* Image upload placeholder */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Image</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
              <ImagePlus size={32} />
              <span className="text-sm">Click to upload a photo</span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Ingredients</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder={`Ingredient ${i + 1}`}
                    value={ing}
                    onChange={(e) => updateIngredient(i, e.target.value)}
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(i)}
                    >
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

          {/* Instructions */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Instructions</label>
            <Textarea placeholder="Describe the steps..." rows={4} />
          </div>

          {/* Cooking time */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Cooking Time</label>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <Input placeholder="e.g. 25 min" className="w-40" />
            </div>
          </div>

          <Button type="submit" className="w-full">Publish Recipe</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeDialog;
