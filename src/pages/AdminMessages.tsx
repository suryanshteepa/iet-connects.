import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Check current user and role
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);
        const admin = (roles || []).some((r) => r.role === "admin");
        setIsAdmin(admin);
        if (!admin) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("contacts")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setMessages(data || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-2">Contact Messages</h1>
            <p className="text-muted-foreground">View submissions from the contact page</p>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : isAdmin ? (
            messages.length === 0 ? (
              <div className="text-center text-muted-foreground">No messages yet</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {messages.map((m) => (
                  <Card key={m.id} className="p-6 animate-fade-in">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{m.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(m.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{m.status || "new"}</Badge>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">From:</span> {m.name} ({m.email})</p>
                      <p className="whitespace-pre-wrap text-foreground mt-2">{m.message}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="text-center text-muted-foreground">Admins only. Please log in with an admin account.</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminMessages;
