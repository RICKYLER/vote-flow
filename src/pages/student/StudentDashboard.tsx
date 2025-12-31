import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { mockCandidates, mockStats } from '@/api/mockData';
import CandidateCard from '@/components/student/CandidateCard';
import { Button } from '@/components/ui/button';
import { LogOut, CheckCircle2, Vote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [votedCandidates, setVotedCandidates] = useState<Record<string, string>>({});
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    candidateId: string;
    candidateName: string;
    position: string;
  }>({ open: false, candidateId: '', candidateName: '', position: '' });

  const positions = [...new Set(mockCandidates.map((c) => c.position))];
  const isElectionOpen = mockStats.electionStatus === 'open';

  const handleVoteClick = (candidateId: string) => {
    const candidate = mockCandidates.find((c) => c.id === candidateId);
    if (candidate) {
      setConfirmDialog({
        open: true,
        candidateId,
        candidateName: candidate.name,
        position: candidate.position,
      });
    }
  };

  const confirmVote = () => {
    setVotedCandidates((prev) => ({
      ...prev,
      [confirmDialog.position]: confirmDialog.candidateId,
    }));

    toast({
      title: 'Vote recorded',
      description: `Your vote for ${confirmDialog.candidateName} has been submitted.`,
    });

    setConfirmDialog({ open: false, candidateId: '', candidateName: '', position: '' });

    // Check if voted for all positions
    const newVotedPositions = { ...votedCandidates, [confirmDialog.position]: confirmDialog.candidateId };
    if (Object.keys(newVotedPositions).length === positions.length) {
      setHasVoted(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Vote className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Online Voting System</h1>
              <p className="text-sm text-muted-foreground">Student Election Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.studentId}</p>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isElectionOpen ? (
          <div className="voting-card text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Election Closed</h2>
            <p className="text-muted-foreground">
              The election is currently closed. Please check back later.
            </p>
          </div>
        ) : hasVoted ? (
          <div className="voting-card text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Thank You for Voting!</h2>
            <p className="text-muted-foreground">
              Your votes have been successfully recorded. Results will be announced after the election ends.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome, {user?.name}
              </h2>
              <p className="text-muted-foreground">
                Cast your vote for each position. You can only vote once per position.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Election is Open
              </div>
            </div>

            {positions.map((position) => {
              const candidates = mockCandidates.filter((c) => c.position === position);
              const hasVotedForPosition = !!votedCandidates[position];

              return (
                <section key={position} className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{position}</h3>
                    {hasVotedForPosition && (
                      <span className="text-sm text-success flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Vote submitted
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onVote={handleVoteClick}
                        hasVoted={hasVotedForPosition}
                        votedFor={votedCandidates[position]}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to vote for <strong>{confirmDialog.candidateName}</strong> for the position of <strong>{confirmDialog.position}</strong>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmVote}>Confirm Vote</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentDashboard;
