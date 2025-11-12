// Dashboard.tsx page
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { GraduationCap, Search, Filter, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"
import { getScholarships, Scholarship } from "@/api/scholarships";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const { user } = useAuth();
  const first = user?.user_metadata?.first_name || "";
  const last = user?.user_metadata?.last_name || "";
  const user_name = `${first} ${last}`.trim();
  const id = user?.user_metadata?.id || user?.id;


  const [isLoading, setIsLoading] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  useEffect(() =>{
    async function loadData(){
      const data = await getScholarships(id);
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
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Scholarship AI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/saved">
                <Button variant="ghost">Saved</Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Welcome back, {user_name}👋
          </h1>
          <p className="text-muted-foreground">
            We found <span className="font-semibold text-foreground">{scholarships.length}</span> scholarships that match your profile
          </p>
        </div>

        {/* Recommended Section */}
        <div className="mb-8 rounded-2xl bg-gradient-primary p-6 text-primary-foreground animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              ✨
            </div>
            <h2 className="text-lg font-semibold">Top Match for You</h2>
          </div>
          <p className="mb-4 text-primary-foreground/90">
            Based on your profile, this scholarship is a 92% match!
          </p>
          <div className="bg-background/10 backdrop-blur-sm rounded-xl p-4">
            <h3 className="font-semibold mb-1">Global Excellence Scholarship</h3>
            <p className="text-sm text-primary-foreground/80 mb-3">International Education Fund • $25,000</p>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Scholarship Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((scholarship, index) => (
            <div 
              key={scholarship.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ScholarshipCard scholarship={scholarship} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Scholarships
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
