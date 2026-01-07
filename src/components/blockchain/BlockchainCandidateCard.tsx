import { DbCandidate } from '@/@types/blockchain';
import { Button } from '@/components/ui/button';
import { User, CheckCircle2 } from 'lucide-react';

interface BlockchainCandidateCardProps {
  candidate: DbCandidate;
  onVote: (candidateId: string) => void;
  hasVotedForPosition: boolean;
  isVotedFor: boolean;
  disabled?: boolean;
}

export function BlockchainCandidateCard({
  candidate,
  onVote,
  hasVotedForPosition,
  isVotedFor,
  disabled,
}: BlockchainCandidateCardProps) {
  return (
    <div
      className={`voting-card relative transition-all duration-200 ${
        isVotedFor ? 'ring-2 ring-success ring-offset-2' : ''
      } ${hasVotedForPosition && !isVotedFor ? 'opacity-50' : ''}`}
    >
      {isVotedFor && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-success-foreground" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          {candidate.photo_url ? (
            <img
              src={candidate.photo_url}
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{candidate.name}</h4>
          <p className="text-sm text-muted-foreground">
            {candidate.department}
            {candidate.year_level && ` • ${candidate.year_level}`}
          </p>
          {candidate.manifesto && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {candidate.manifesto}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {hasVotedForPosition ? (
          isVotedFor ? (
            <div className="flex items-center justify-center gap-2 py-2 text-success text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              You voted for this candidate
            </div>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              Vote Submitted
            </Button>
          )
        ) : (
          <Button
            className="w-full"
            onClick={() => onVote(candidate.id)}
            disabled={disabled}
          >
            Vote for {candidate.name}
          </Button>
        )}
      </div>
    </div>
  );
}
