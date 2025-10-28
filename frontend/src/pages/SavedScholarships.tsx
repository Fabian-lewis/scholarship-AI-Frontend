import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { GraduationCap, Download } from "lucide-react";
import { Link } from "react-router-dom";

const SavedScholarships = () => {
  const savedScholarships = [
    {
      id: 1,
      title: "Global Excellence Scholarship",
      provider: "International Education Fund",
      amount: "$25,000",
      deadline: "2025-03-15",
      matchScore: 92,
      description: "For outstanding students pursuing STEM degrees worldwide",
      eligibility: "Undergraduate, GPA 3.5+",
    },
  ];

  const appliedScholarships = [
    {
      id: 2,
      title: "Future Leaders Program",
      provider: "Tech Innovation Foundation",
      amount: "$15,000",
      deadline: "2025-04-01",
      matchScore: 87,
      description: "Supporting the next generation of tech innovators",
      eligibility: "Computer Science majors",
    },
  ];

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
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">My Scholarships</h1>
            <p className="text-muted-foreground">Track and manage your scholarship applications</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export List
          </Button>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="saved">Saved ({savedScholarships.length})</TabsTrigger>
            <TabsTrigger value="applied">Applied ({appliedScholarships.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-8">
            {savedScholarships.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedScholarships.map((scholarship) => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <GraduationCap className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No saved scholarships yet</h3>
                <p className="mb-6 text-muted-foreground">
                  Start saving scholarships from the dashboard to track them here
                </p>
                <Link to="/dashboard">
                  <Button>Browse Scholarships</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applied" className="mt-8">
            {appliedScholarships.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {appliedScholarships.map((scholarship) => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <GraduationCap className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No applications yet</h3>
                <p className="mb-6 text-muted-foreground">
                  Mark scholarships as applied to track your progress
                </p>
                <Link to="/dashboard">
                  <Button>Browse Scholarships</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="expired" className="mt-8">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <GraduationCap className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">No expired scholarships</h3>
              <p className="text-muted-foreground">
                Scholarships past their deadline will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SavedScholarships;
