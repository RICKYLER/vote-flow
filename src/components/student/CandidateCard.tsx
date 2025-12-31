import { useState } from 'react';
import { Candidate } from '@/@types';
import { Button } from '@/components/ui/button';
import { Check, User, ZoomIn } from 'lucide-react';
import PhotoPreviewDialog from './PhotoPreviewDialog';

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
  disabled,
}: CandidateCardProps) => {
  const isVotedFor = votedFor === candidate.id;
  const [previewOpen, setPreviewOpen] = useState(false);
  const hasPhoto = candidate.photo && candidate.photo !== '/placeholder.svg';

  return (
    <>
      <div
        className={`voting-card transition-all ${isVotedFor ? 'ring-2 ring-foreground' : ''}`}
      >
        <div className="flex flex-col items-center text-center">
          {/* Clickable Photo */}
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="relative group mb-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
          >
            {hasPhoto ? (
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-border transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border transition-transform group-hover:scale-105">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

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
              variant={hasVoted ? 'secondary' : 'default'}
            >
              {hasVoted ? 'Already Voted' : 'Vote'}
            </Button>
          )}
        </div>
      </div>

      {/* Photo Preview Dialog */}
      <PhotoPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        imageSrc={candidate.photo}
        name={candidate.name}
        position={candidate.position}
      />
    </>
  );
};

export default CandidateCard;
