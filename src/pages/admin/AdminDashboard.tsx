import { Users, UserCheck, Vote, Activity } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatCard from '@/components/admin/StatCard';
import ElectionTimeline from '@/components/admin/ElectionTimeline';
import { mockStats, mockCandidates } from '@/api/mockData';

const AdminDashboard = () => {
  const votingPercentage = Math.round((mockStats.votesCast / mockStats.totalVoters) * 100);
  const electionStartDate = new Date(mockStats.startDate);
  const electionEndDate = new Date(mockStats.endDate);

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of the current election</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Voters"
            value={mockStats.totalVoters.toLocaleString()}
            icon={Users}
            subtitle="Registered students"
          />
          <StatCard
            title="Total Candidates"
            value={mockStats.totalCandidates}
            icon={UserCheck}
            subtitle="Active candidates"
          />
          <StatCard
            title="Votes Cast"
            value={mockStats.votesCast.toLocaleString()}
            icon={Vote}
            subtitle={`${votingPercentage}% turnout`}
            variant="success"
          />
          <StatCard
            title="Election Status"
            value={mockStats.electionStatus === 'open' ? 'Open' : 'Closed'}
            icon={Activity}
            subtitle={mockStats.electionStatus === 'open' ? 'Voting in progress' : 'Voting ended'}
            variant={mockStats.electionStatus === 'open' ? 'success' : 'warning'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ElectionTimeline 
            startDate={electionStartDate} 
            endDate={electionEndDate} 
            status={mockStats.electionStatus} 
          />
          <div className="voting-card">
            <h2 className="text-lg font-semibold mb-4">Candidate Rankings</h2>
            <div className="space-y-4">
              {mockCandidates
                .sort((a, b) => b.voteCount - a.voteCount)
                .slice(0, 5)
                .map((candidate, index) => {
                  const maxVotes = Math.max(...mockCandidates.map(c => c.voteCount));
                  const percentage = Math.round((candidate.voteCount / maxVotes) * 100);
                  
                  return (
                    <div key={candidate.id} className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{candidate.name}</span>
                          <span className="text-sm text-muted-foreground">{candidate.voteCount} votes</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-foreground rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="voting-card">
            <h2 className="text-lg font-semibold mb-4">Voting Progress</h2>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="12"
                    strokeDasharray={`${votingPercentage * 5.53} 553`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{votingPercentage}%</span>
                  <span className="text-sm text-muted-foreground">Turnout</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <p className="text-2xl font-bold">{mockStats.votesCast}</p>
                <p className="text-sm text-muted-foreground">Voted</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.totalVoters - mockStats.votesCast}</p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
