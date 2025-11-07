import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-campus.jpg";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Academic Excellence",
      description: "Access comprehensive study materials, notes, and previous year papers for all subjects.",
    },
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Learn from experienced professors dedicated to your success and growth.",
    },
    {
      icon: Award,
      title: "Industry Recognition",
      description: "Our graduates are placed in top companies worldwide with excellent packages.",
    },
    {
      icon: Sparkles,
      title: "IET Bot Assistant",
      description: "Get instant answers to your queries with our AI-powered chatbot available 24/7.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        </div>

        <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Institute of Engineering<br />& Technology
            <span className="block text-secondary mt-2">DAVV</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Empowering minds, shaping futures through excellence in engineering education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/academics">
              <Button size="lg" variant="secondary" className="group">
                Explore Academics
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/bot">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Try IET Bot
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">Why Choose IET DAVV?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what makes us one of the leading engineering institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover-lift hover-glow transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-white/80">Years of Excellence</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="text-5xl font-bold mb-2">5000+</div>
              <div className="text-white/80">Students</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="text-5xl font-bold mb-2">200+</div>
              <div className="text-white/80">Faculty Members</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-white/80">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of students who have transformed their careers through quality education at IET DAVV
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="default">
                Get In Touch
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
