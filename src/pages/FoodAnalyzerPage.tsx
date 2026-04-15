import { useNavigate } from "react-router-dom";
import { ArrowLeft, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import FoodAnalyzer from "@/components/FoodAnalyzer";

const FoodAnalyzerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <ScanSearch size={20} className="text-accent" />
            <h1 className="text-lg font-semibold text-foreground">Food Analyzer</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-lg mx-auto px-4 py-6">
        <p className="text-muted-foreground text-sm mb-6">
          Snap a photo of any food and instantly get calorie counts, macros, and nutritional insights powered by AI.
        </p>
        <FoodAnalyzer />
      </div>
    </div>
  );
};

export default FoodAnalyzerPage;
