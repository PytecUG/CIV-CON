import { ArrowRight, Users, MessageSquare, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Direct Democracy",
      description: "Engage directly with your leaders, journalists, and fellow citizens in meaningful discussions."
    },
    {
      icon: FileText,
      title: "News & Articles",
      description: "Stay informed with the latest news, analysis, and investigative reports from trusted journalists."
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Connect with like-minded Ugandans and participate in building a better future together."
    },
    {
      icon: Shield,
      title: "Verified Voices",
      description: "Interact with verified leaders, journalists, and public figures in a secure environment."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Uganda Connects
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in">
              The premier platform for civic engagement, bringing together citizens, leaders, 
              and journalists to build Uganda's future through meaningful dialogue and collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore Feed
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-soft"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Empowering Ugandan Voices
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A platform designed for transparency, accountability, and meaningful civic participation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">50K+</h3>
              <p className="text-muted-foreground">Active Citizens</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">200+</h3>
              <p className="text-muted-foreground">Verified Leaders</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
              <p className="text-muted-foreground">Daily Discussions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of Ugandans already making a difference through meaningful civic engagement.
            </p>
            <Link to="/signup">
              <Button size="lg" className="shadow-strong">
                Join Uganda Connects Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;