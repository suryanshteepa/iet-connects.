import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const Notices = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "normal":
        return "secondary";
      default:
        return "default";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "exam":
        return "Examination";
      case "event":
        return "Event";
      case "holiday":
        return "Holiday";
      default:
        return "General";
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4">Notice Board</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Stay updated with the latest announcements and circulars
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading notices...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {notices.map((notice, idx) => (
                <Card
                  key={notice.id}
                  className="p-6 hover-lift hover-glow animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-secondary flex-shrink-0" />
                      <h2 className="text-2xl font-bold">{notice.title}</h2>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(notice.priority)}>
                        {notice.priority}
                      </Badge>
                      <Badge variant="outline">{getCategoryLabel(notice.category)}</Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">{notice.content}</p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Published on {format(new Date(notice.published_at), "MMMM dd, yyyy")}
                  </div>
                </Card>
              ))}

              {notices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No notices available at the moment</p>
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

export default Notices;
