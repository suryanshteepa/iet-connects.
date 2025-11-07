import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Award, Users, BookOpen, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4">About IET DAVV</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              A legacy of excellence in engineering education since 1970
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 hover-lift animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide quality technical education and foster innovation, research, and entrepreneurship 
                among students. We aim to develop competent professionals who contribute significantly to 
                society and industry through their knowledge and skills.
              </p>
            </Card>
            
            <Card className="p-8 hover-lift animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-3xl font-bold mb-4 text-secondary">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be a globally recognized center of excellence in engineering education and research, 
                producing leaders who drive technological advancement and sustainable development. We strive 
                to create an environment that encourages creativity, critical thinking, and lifelong learning.
              </p>
            </Card>
          </div>

          {/* Key Highlights */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">Key Highlights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Award, title: "NAAC A+ Accredited", desc: "Recognized for academic excellence" },
                { icon: Users, title: "Expert Faculty", desc: "200+ experienced professors" },
                { icon: BookOpen, title: "Multiple Programs", desc: "10+ UG & PG courses" },
                { icon: Globe, title: "Global Partnerships", desc: "International collaborations" },
              ].map((item, idx) => (
                <Card key={idx} className="p-6 text-center hover-lift animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <item.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* History */}
          <Card className="p-8 mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-6">Our History</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Institute of Engineering and Technology (IET) was established in 1970 under Devi Ahilya 
                Vishwavidyalaya (DAVV), one of India's premier universities. Starting with just a few 
                undergraduate programs, IET has grown into a comprehensive technical institution offering 
                diverse engineering and technology programs.
              </p>
              <p>
                Over the past five decades, IET DAVV has consistently maintained high academic standards and 
                produced thousands of successful engineers who have made significant contributions to various 
                industries worldwide. Our alumni network spans across continents, with graduates holding 
                leadership positions in top technology companies and research institutions.
              </p>
              <p>
                The institute has been at the forefront of adopting modern teaching methodologies, updating 
                curriculum to match industry requirements, and establishing state-of-the-art laboratories 
                and research facilities. Our commitment to excellence has earned us recognition from various 
                national and international bodies.
              </p>
            </div>
          </Card>

          {/* Facilities */}
          <div>
            <h2 className="text-4xl font-bold text-center mb-12">Campus Facilities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Modern Labs", desc: "State-of-the-art laboratories with latest equipment" },
                { title: "Digital Library", desc: "Extensive collection of books and e-resources" },
                { title: "Sports Complex", desc: "Indoor and outdoor sports facilities" },
                { title: "Hostel", desc: "Comfortable accommodation for students" },
                { title: "Cafeteria", desc: "Hygienic food and beverage services" },
                { title: "Seminar Halls", desc: "Well-equipped auditoriums for events" },
              ].map((facility, idx) => (
                <Card key={idx} className="p-6 hover-lift animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                  <p className="text-muted-foreground">{facility.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
