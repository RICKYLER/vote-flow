import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, GraduationCap, Target, Award, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockCandidates } from '@/api/mockData';
import { Candidate } from '@/@types';

const CandidateComparePage = () => {
  const navigate = useNavigate();
  const [leftCandidateId, setLeftCandidateId] = useState<string>('');
  const [rightCandidateId, setRightCandidateId] = useState<string>('');

  const positions = useMemo(() => [...new Set(mockCandidates.map(c => c.position))], []);
  
  const leftCandidate = mockCandidates.find(c => c.id === leftCandidateId);
  const rightCandidate = mockCandidates.find(c => c.id === rightCandidateId);

  const CandidateColumn = ({ 
    candidate, 
    onClear, 
    onSelect, 
    selectedId,
    excludeId 
  }: { 
    candidate?: Candidate; 
    onClear: () => void;
    onSelect: (id: string) => void;
    selectedId: string;
    excludeId: string;
  }) => {
    if (!candidate) {
      return (
        <div className="flex-1 border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
          <User className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-4">Select a candidate to compare</p>
          <Select value={selectedId} onValueChange={onSelect}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Choose a candidate" />
            </SelectTrigger>
            <SelectContent>
              {positions.map(position => (
                <div key={position}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{position}</div>
                  {mockCandidates
                    .filter(c => c.position === position && c.id !== excludeId)
                    .map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="aspect-[3/2] bg-muted flex items-center justify-center">
            {candidate.photo && candidate.photo !== '/placeholder.svg' ? (
              <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-20 h-20 text-muted-foreground/40" />
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground">{candidate.name}</h3>
            <Badge variant="secondary" className="mt-2">{candidate.position}</Badge>
            {candidate.major && candidate.year && (
              <p className="text-sm text-muted-foreground mt-2">
                {candidate.major} • {candidate.year}
              </p>
            )}
          </div>

          {candidate.description && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground text-center">{candidate.description}</p>
            </div>
          )}

          {candidate.manifesto && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">Manifesto</h4>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-4">{candidate.manifesto}</p>
            </div>
          )}

          {candidate.qualifications && candidate.qualifications.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">Qualifications</h4>
              </div>
              <ul className="space-y-2">
                {candidate.qualifications.slice(0, 3).map((qual, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">{qual.title}</span>
                    <p className="text-muted-foreground text-xs">{qual.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {candidate.goals && candidate.goals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">Goals</h4>
              </div>
              <ul className="space-y-2">
                {candidate.goals.slice(0, 3).map((goal, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <p className="text-muted-foreground text-xs">{goal.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/student/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compare Candidates</h1>
          <p className="text-muted-foreground">
            Select two candidates to compare their qualifications, goals, and platforms side by side.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <CandidateColumn
            candidate={leftCandidate}
            selectedId={leftCandidateId}
            excludeId={rightCandidateId}
            onSelect={setLeftCandidateId}
            onClear={() => setLeftCandidateId('')}
          />
          
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-px h-full bg-border" />
            <span className="absolute bg-background px-2 text-muted-foreground text-sm font-medium">VS</span>
          </div>
          
          <div className="lg:hidden flex items-center justify-center py-4">
            <div className="h-px flex-1 bg-border" />
            <span className="px-4 text-muted-foreground text-sm font-medium">VS</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <CandidateColumn
            candidate={rightCandidate}
            selectedId={rightCandidateId}
            excludeId={leftCandidateId}
            onSelect={setRightCandidateId}
            onClear={() => setRightCandidateId('')}
          />
        </div>
      </main>
    </div>
  );
};

export default CandidateComparePage;
