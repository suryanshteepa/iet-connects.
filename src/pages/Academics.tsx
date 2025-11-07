import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Download, BookOpen, FileText, FlaskConical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Academics = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "notes":
        return BookOpen;
      case "pyq":
        return FileText;
      case "practical":
        return FlaskConical;
      case "mst":
        return FileText;
      default:
        return BookOpen;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "notes":
        return "Notes";
      case "pyq":
        return "Previous Year Questions";
      case "practical":
        return "Practicals";
      case "mst":
        return "MST Papers";
      default:
        return category;
    }
  };

  const filterMaterials = (category: string) => {
    if (category === "all") return materials;
    return materials.filter((m) => m.category === category);
  };

  const handleOpen = async (material: any) => {
    if (!material.file_url) {
      toast.error("PDF not available for this item");
      return;
    }
    setSelected(material);
    setPreviewOpen(true);

    // Best-effort: increment downloads (may be restricted by RLS for non-admins)
    try {
      const { data: current } = await supabase
        .from("materials")
        .select("downloads")
        .eq("id", material.id)
        .maybeSingle();

      if (current && typeof current.downloads === "number") {
        await supabase
          .from("materials")
          .update({ downloads: current.downloads + 1 })
          .eq("id", material.id);
      }
    } catch (error) {
      console.error("Error updating downloads:", error);
    }
  };

  const MaterialCard = ({ material }: { material: any }) => {
    const Icon = getCategoryIcon(material.category);
    return (
      <Card className="p-6 hover-lift hover-glow transition-all">
        <div className="flex items-start justify-between mb-4">
          <Icon className="w-10 h-10 text-secondary" />
          <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full">
            {material.semester || "General"}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{material.title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{material.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{material.subject}</span>
            {material.downloads > 0 && (
              <span className="ml-2">• {material.downloads} downloads</span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpen(material)}
            className="group hover-scale"
          >
            <Download className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
            Open PDF
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4">Academic Resources</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Access comprehensive study materials, notes, previous year papers, and practicals
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="pyq">PYQs</TabsTrigger>
              <TabsTrigger value="mst">MST Papers</TabsTrigger>
              <TabsTrigger value="practical">Practicals</TabsTrigger>
            </TabsList>

            {["all", "notes", "pyq", "mst", "practical"].map((category) => (
              <TabsContent key={category} value={category}>
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading materials...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterMaterials(category).map((material, idx) => (
                      <div
                        key={material.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <MaterialCard material={material} />
                      </div>
                    ))}
                    {filterMaterials(category).length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No materials available in this category</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selected?.title || "Preview"}</DialogTitle>
                {selected?.description && (
                  <DialogDescription>{selected.description}</DialogDescription>
                )}
              </DialogHeader>
              <div className="mt-2">
                {selected?.file_url ? (
                  <iframe
                    src={selected.file_url}
                    className="w-full h-[70vh] rounded-md border"
                    title={selected.title}
                  />
                ) : (
                  <div className="text-muted-foreground">PDF not available</div>
                )}
              </div>
              <DialogFooter>
                {selected?.file_url && (
                  <Button asChild>
                    <a href={selected.file_url} target="_blank" rel="noreferrer" download>
                      Download
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Academics;
