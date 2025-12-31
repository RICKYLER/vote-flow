import { Candidate } from '@/@types';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (candidateId: string) => void;
  hasVoted: boolean;
  votedFor?: string;
  disabled?: boolean;
}

const CandidateCard = ({ 
  candidate, 
  onVote, 
  hasVoted, 
  votedFor,
  disabled 
}: CandidateCardProps) => {
  const isVotedFor = votedFor === candidate.id;

  return (
    <div className={`voting-card transition-all ${isVotedFor ? 'ring-2 ring-foreground' : ''}`}>
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 grayscale">
          <span className="text-2xl font-bold text-muted-foreground">
            {candidate.name.charAt(0)}
          </span>
        </div>
        
        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{candidate.position}</p>
        
        {candidate.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {candidate.description}
          </p>
        )}

        {isVotedFor ? (
          <Button disabled className="w-full" variant="secondary">
            <Check className="w-4 h-4" />
            Voted
          </Button>
        ) : (
          <Button 
            onClick={() => onVote(candidate.id)}
            disabled={hasVoted || disabled}
            className="w-full"
            variant={hasVoted ? "secondary" : "default"}
          >
            {hasVoted ? 'Already Voted' : 'Vote'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
