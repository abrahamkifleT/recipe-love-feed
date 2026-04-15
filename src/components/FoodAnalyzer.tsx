import { useState, useRef } from "react";
import { Camera, Upload, X, Flame, Beef, Wheat, Droplets, Leaf, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NutritionResult {
  food_name: string;
  estimated_calories: number;
  confidence: string;
  macros: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  };
  vitamins_minerals: string[];
  health_notes: string;
  serving_size: string;
}

const FoodAnalyzer = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image under 10MB.", variant: "destructive" });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analyzeFood = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { imageBase64: base64, mimeType: imageFile.type },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Could not analyze the image.", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const totalMacroG = result ? result.macros.protein_g + result.macros.carbs_g + result.macros.fat_g : 0;

  return (
    <div className="space-y-6">
      {/* Upload area */}
      {!imagePreview ? (
        <label className="group cursor-pointer block">
          <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center gap-3 text-muted-foreground transition-all group-hover:border-accent/60 group-hover:bg-accent/5">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Camera size={28} className="text-accent" />
            </div>
            <p className="text-base font-medium text-foreground">Upload a food photo</p>
            <p className="text-sm">Take a picture or choose from gallery</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={imagePreview} alt="Food" className="w-full max-h-72 object-cover" />
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {!result && (
            <Button onClick={analyzeFood} disabled={analyzing} className="w-full gap-2 h-12 text-base">
              {analyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Nutrition
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">{result.food_name}</h3>
              <p className="text-sm text-muted-foreground">{result.serving_size}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              result.confidence === "high" ? "bg-green-100 text-green-700" :
              result.confidence === "medium" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>
              {result.confidence} confidence
            </span>
          </div>

          {/* Calorie card */}
          <div className="bg-gradient-to-br from-accent/15 to-accent/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
              <Flame size={28} className="text-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{result.estimated_calories}</p>
              <p className="text-sm text-muted-foreground font-medium">Calories</p>
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Protein", value: result.macros.protein_g, icon: Beef, color: "text-red-500", bg: "bg-red-50" },
              { label: "Carbs", value: result.macros.carbs_g, icon: Wheat, color: "text-amber-500", bg: "bg-amber-50" },
              { label: "Fat", value: result.macros.fat_g, icon: Droplets, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Fiber", value: result.macros.fiber_g, icon: Leaf, color: "text-green-500", bg: "bg-green-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3.5 flex items-center gap-3`}>
                <Icon size={20} className={color} />
                <div>
                  <p className="text-lg font-bold text-foreground">{value}g</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Macro bar */}
          {totalMacroG > 0 && (
            <div className="h-3 rounded-full overflow-hidden flex bg-muted">
              <div className="bg-red-400 transition-all" style={{ width: `${(result.macros.protein_g / totalMacroG) * 100}%` }} />
              <div className="bg-amber-400 transition-all" style={{ width: `${(result.macros.carbs_g / totalMacroG) * 100}%` }} />
              <div className="bg-blue-400 transition-all" style={{ width: `${(result.macros.fat_g / totalMacroG) * 100}%` }} />
            </div>
          )}

          {/* Vitamins */}
          {result.vitamins_minerals.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Key Nutrients</p>
              <div className="flex flex-wrap gap-2">
                {result.vitamins_minerals.map((v) => (
                  <span key={v} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{v}</span>
                ))}
              </div>
            </div>
          )}

          {/* Health note */}
          {result.health_notes && (
            <div className="bg-card rounded-xl p-4 border">
              <p className="text-sm text-muted-foreground leading-relaxed">{result.health_notes}</p>
            </div>
          )}

          <Button variant="outline" onClick={clearImage} className="w-full">
            Analyze Another Food
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodAnalyzer;
