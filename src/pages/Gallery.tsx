import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Gallery = () => {
  // Using educational placeholder images
  const images = [
    {
      title: "Campus Overview",
      description: "Beautiful campus with modern infrastructure",
      url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
    },
    {
      title: "Computer Lab",
      description: "State-of-the-art computer laboratories",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    },
    {
      title: "Engineering Workshop",
      description: "Well-equipped workshops for practical learning",
      url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&h=600&fit=crop",
    },
    {
      title: "Library",
      description: "Extensive collection of books and digital resources",
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop",
    },
    {
      title: "Lecture Hall",
      description: "Modern classrooms with audio-visual facilities",
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop",
    },
    {
      title: "Research Lab",
      description: "Advanced research facilities for innovation",
      url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    },
    {
      title: "Sports Complex",
      description: "Indoor and outdoor sports facilities",
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
    },
    {
      title: "Student Activities",
      description: "Various clubs and extracurricular activities",
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
    },
    {
      title: "Tech Fest",
      description: "Annual technical festival with competitions",
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4">Campus Gallery</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Explore our state-of-the-art facilities and vibrant campus life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, idx) => (
              <Card
                key={idx}
                className="overflow-hidden hover-lift hover-glow animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                  <p className="text-muted-foreground text-sm">{image.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Gallery;
