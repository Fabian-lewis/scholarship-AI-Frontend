import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Bookmark } from "lucide-react";

interface Scholarship {
  id: number;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  matchScore: number;
  description: string;
  eligibility: string;
}

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onSave?: () => void;
  onViewDetails?: () => void;
}

export const ScholarshipCard = ({ scholarship, onSave, onViewDetails }: ScholarshipCardProps) => {
  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-accent";
    return "text-primary";
  };

  return (
    <Card className="group h-full transition-all hover:shadow-card hover:-translate-y-1">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {scholarship.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{scholarship.provider}</p>
          </div>
          <Badge 
            variant="outline" 
            className={`${getMatchScoreColor(scholarship.matchScore)} border-current shrink-0`}
          >
            {scholarship.matchScore}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {scholarship.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="font-semibold text-success">{scholarship.amount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDeadline(scholarship.deadline)}</span>
          </div>
        </div>
        <div className="pt-2">
          <Badge variant="secondary" className="text-xs">
            {scholarship.eligibility}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 gap-2"
          onClick={onSave}
        >
          <Bookmark className="h-4 w-4" />
          Save
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
