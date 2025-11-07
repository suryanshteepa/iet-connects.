import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const Bulletin = () => {
  const [bulletinItems, setBulletinItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBulletinItems();
  }, []);

  const fetchBulletinItems = async () => {
    try {
      const { data, error } = await supabase
        .from("bulletin_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBulletinItems(data || []);
    } catch (error) {
      console.error("Error fetching bulletin items:", error);
      toast.error("Failed to load bulletin items");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "schedule":
        return "default";
      case "exam":
        return "destructive";
      case "holiday":
        return "secondary";
      case "event":
        return "outline";
      default:
        return "default";
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4">Bulletin Board</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Class timings, exam schedules, holidays, and important dates
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading bulletin items...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bulletinItems.map((item, idx) => (
                <Card
                  key={item.id}
                  className="p-6 hover-lift hover-glow animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="mb-4">
                    <Badge variant={getCategoryColor(item.category)} className="mb-3">
                      {getCategoryLabel(item.category)}
                    </Badge>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{item.content}</p>

                  {item.start_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {item.end_date
                        ? `${format(new Date(item.start_date), "MMM dd")} - ${format(new Date(item.end_date), "MMM dd, yyyy")}`
                        : format(new Date(item.start_date), "MMMM dd, yyyy")}
                    </div>
                  )}
                </Card>
              ))}

              {bulletinItems.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No bulletin items available at the moment</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Bulletin;
