import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockCandidates, mockStats } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { LogOut, TrendingUp, Users, Vote } from 'lucide-react';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Get the candidate data for the logged-in user
  const candidateData = mockCandidates.find((c) => c.name === 'Sarah Johnson') || mockCandidates[0];
  
  // Get competitors in the same position
  const competitors = mockCandidates.filter(
    (c) => c.position === candidateData.position && c.id !== candidateData.id
  );
  
  const totalVotesInPosition = mockCandidates
    .filter((c) => c.position === candidateData.position)
    .reduce((sum, c) => sum + c.voteCount, 0);
  
  const votePercentage = Math.round((candidateData.voteCount / totalVotesInPosition) * 100);
  const isLeading = candidateData.voteCount >= Math.max(...competitors.map((c) => c.voteCount), 0);
  const isElectionOpen = mockStats.electionStatus === 'open';

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
              <p className="text-sm text-muted-foreground">Candidate Portal</p>
            </div>
          </div>
          
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Candidate Profile */}
        <div className="voting-card mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center grayscale">
              <span className="text-3xl font-bold text-muted-foreground">
                {candidateData.name.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{candidateData.name}</h2>
                {isLeading && (
                  <span className="px-2 py-0.5 bg-foreground text-background text-xs font-medium rounded">
                    Leading
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{candidateData.position}</p>
              <p className="text-sm text-muted-foreground">{candidateData.description}</p>
              
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                style={{
                  backgroundColor: isElectionOpen ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--muted))',
                  color: isElectionOpen ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))'
                }}
              >
                <span className={`w-2 h-2 rounded-full ${isElectionOpen ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                {isElectionOpen ? 'Election is Open' : 'Election Closed'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="voting-card text-center">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
              <Vote className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-foreground">{candidateData.voteCount}</p>
            <p className="text-sm text-muted-foreground">Total Votes</p>
          </div>
          
          <div className="voting-card text-center">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-foreground">{votePercentage}%</p>
            <p className="text-sm text-muted-foreground">Vote Share</p>
          </div>
          
          <div className="voting-card text-center">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-foreground">{competitors.length}</p>
            <p className="text-sm text-muted-foreground">Competitors</p>
          </div>
        </div>

        {/* Vote Progress */}
        <div className="voting-card mb-8">
          <h3 className="text-lg font-semibold mb-6">Position Standings</h3>
          
          <div className="space-y-4">
            {[candidateData, ...competitors]
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((candidate, index) => {
                const percentage = Math.round((candidate.voteCount / totalVotesInPosition) * 100);
                const isCurrentUser = candidate.id === candidateData.id;
                
                return (
                  <div key={candidate.id} className="flex items-center gap-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === 0 ? 'bg-foreground text-background' : 'bg-muted'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${isCurrentUser ? 'font-semibold' : 'font-medium'}`}>
                          {candidate.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {candidate.voteCount} votes ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCurrentUser ? 'bg-foreground' : 'bg-muted-foreground/30'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Info */}
        <div className="voting-card bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
            Vote counts update in real-time. Final results will be announced after the election closes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;
