// frontend/src/pages/Landing.tsx
import { useEffect, useState } from "react";
import { getRecentScholarships, Scholarship } from "@/api/scholarships";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Search, Sparkles, CheckCircle, ArrowRight, BookOpen, Globe, Award } from "lucide-react";
import { ScholarshipCard } from "@/components/ScholarshipCard";

const Landing = () => {

  // Mock scholarship data

  const [featuredScholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    async function loadData(){
      setIsLoading(true)
      const data = await getRecentScholarships(6);
      setScholarships(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Scholarship AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Scholarship Matching
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Discover scholarships that{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              fit you
            </span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Let AI find the perfect scholarships tailored to your education level, field of interest, and location.
            Start your journey to funded education today.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Find Scholarships
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Three simple steps to find your perfect scholarship match
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group text-center animate-fade-in-up">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">1. Create Your Profile</h3>
              <p className="text-muted-foreground">
                Tell us about your education, interests, and goals in just a few minutes
              </p>
            </div>
            <div className="group text-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">2. Get AI-Matched</h3>
              <p className="text-muted-foreground">
                Our AI analyzes thousands of scholarships to find your best matches
              </p>
            </div>
            <div className="group text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success transition-all group-hover:scale-110 group-hover:bg-success group-hover:text-success-foreground">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">3. Apply with Confidence</h3>
              <p className="text-muted-foreground">
                Access detailed information and apply to scholarships that truly fit you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Featured Scholarships
            </h2>
            <p className="text-muted-foreground">
              Discover opportunities from around the world
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredScholarships.map((scholarship, index) => (
              <div 
                key={scholarship.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ScholarshipCard scholarship={scholarship} />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="gap-2">
                View All Scholarships <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Scholarships Available</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-accent">$50M+</div>
              <div className="text-muted-foreground">Total Funding</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-success">95%</div>
              <div className="text-muted-foreground">Match Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">Scholarship AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering students worldwide with AI-powered scholarship discovery.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/dashboard" className="hover:text-primary transition-colors">
                    Find Scholarships
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Scholarship AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
