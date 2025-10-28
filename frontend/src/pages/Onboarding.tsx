import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    educationLevel: "",
    fieldsOfInterest: [] as string[],
    country: "",
    goals: "",
  });

  const educationLevels = ["High School", "Undergraduate", "Postgraduate", "PhD"];
  const fields = [
    "Computer Science",
    "Engineering",
    "Medicine",
    "Business",
    "Arts",
    "Sciences",
    "Law",
    "Education",
  ];

  const toggleField = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      fieldsOfInterest: prev.fieldsOfInterest.includes(field)
        ? prev.fieldsOfInterest.filter((f) => f !== field)
        : [...prev.fieldsOfInterest, field],
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile and navigate to dashboard
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground">Scholarship AI</span>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className="animate-fade-in">
            {currentStep === 1 && (
              <>
                <CardHeader>
                  <CardTitle>What's your education level?</CardTitle>
                  <CardDescription>
                    This helps us find scholarships that match your current academic stage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {educationLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({ ...formData, educationLevel: level })}
                        className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
                          formData.educationLevel === level
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="font-medium text-foreground">{level}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </>
            )}

            {currentStep === 2 && (
              <>
                <CardHeader>
                  <CardTitle>What are your fields of interest?</CardTitle>
                  <CardDescription>
                    Select all that apply. We'll match you with relevant scholarships.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {fields.map((field) => (
                      <Badge
                        key={field}
                        variant={formData.fieldsOfInterest.includes(field) ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleField(field)}
                      >
                        {field}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </>
            )}

            {currentStep === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Where are you located?</CardTitle>
                  <CardDescription>
                    This helps us find scholarships available in your region
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country or Region</Label>
                    <Input
                      id="country"
                      placeholder="e.g., United States, United Kingdom, etc."
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {currentStep === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Tell us about your goals</CardTitle>
                  <CardDescription>
                    Share your academic or career aspirations (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goals">Academic or Career Goals</Label>
                    <Textarea
                      id="goals"
                      placeholder="e.g., I want to pursue a career in software engineering and contribute to open source projects..."
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      rows={5}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between p-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} className="gap-2">
                {currentStep === totalSteps ? "Complete" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
