import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { mockCandidates } from '@/api/mockData';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  GraduationCap, 
  Calendar,
  Target,
  Award,
  FileText,
  Vote,
  LogOut
} from 'lucide-react';

const CandidateDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();

  const candidate = mockCandidates.find((c) => c.id === id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const hasPhoto = candidate.photo && candidate.photo !== '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Voting
          </button>

          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.studentId}</p>
              </div>
            )}
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="voting-card mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Photo */}
            <div className="flex-shrink-0">
              {hasPhoto ? (
                <img
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-40 h-40 rounded-2xl object-cover border-2 border-border"
                />
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-muted flex items-center justify-center border-2 border-border">
                  <User className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted mb-3">
                {candidate.position}
              </span>
              <h1 className="text-3xl font-bold text-foreground mb-2">{candidate.name}</h1>
              <p className="text-muted-foreground mb-4">{candidate.description}</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                {candidate.major && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {candidate.major}
                  </div>
                )}
                {candidate.year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {candidate.year}
                  </div>
                )}
                {candidate.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {candidate.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Manifesto */}
        {candidate.manifesto && (
          <div className="voting-card mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Manifesto</h2>
            </div>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {candidate.manifesto.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Qualifications */}
          {candidate.qualifications && candidate.qualifications.length > 0 && (
            <div className="voting-card">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Qualifications</h2>
              </div>
              <div className="space-y-4">
                {candidate.qualifications.map((qual, index) => (
                  <div key={index} className="border-l-2 border-border pl-4">
                    <h3 className="font-medium text-foreground">{qual.title}</h3>
                    <p className="text-sm text-muted-foreground">{qual.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          {candidate.goals && candidate.goals.length > 0 && (
            <div className="voting-card">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Goals & Promises</h2>
              </div>
              <div className="space-y-4">
                {candidate.goals.map((goal, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h3 className="font-medium text-foreground">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back to Voting CTA */}
        <div className="mt-8 text-center">
          <Button size="lg" onClick={() => navigate('/student/dashboard')}>
            <Vote className="w-4 h-4 mr-2" />
            Return to Voting
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CandidateDetailPage;
