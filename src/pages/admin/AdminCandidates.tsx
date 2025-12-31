import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, User } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CandidateFormDialog from '@/components/admin/CandidateFormDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCandidates as initialCandidates } from '@/api/mockData';
import { Candidate } from '@/@types';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminCandidates = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  
  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Get unique positions for the form
  const positions = [...new Set(candidates.map((c) => c.position))];

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCandidate = () => {
    setSelectedCandidate(null);
    setFormDialogOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDeleteDialogOpen(true);
  };

  const handleSaveCandidate = (
    candidateData: Omit<Candidate, 'id' | 'voteCount'> & { id?: string }
  ) => {
    if (candidateData.id) {
      // Edit existing candidate
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateData.id
            ? { ...c, ...candidateData }
            : c
        )
      );
      toast({
        title: 'Candidate updated',
        description: `${candidateData.name} has been updated successfully.`,
      });
    } else {
      // Add new candidate
      const newCandidate: Candidate = {
        id: `candidate_${Date.now()}`,
        name: candidateData.name,
        position: candidateData.position,
        description: candidateData.description,
        photo: candidateData.photo,
        voteCount: 0,
      };
      setCandidates((prev) => [...prev, newCandidate]);
      toast({
        title: 'Candidate added',
        description: `${candidateData.name} has been added as a candidate.`,
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedCandidate) {
      setCandidates((prev) => prev.filter((c) => c.id !== selectedCandidate.id));
      toast({
        title: 'Candidate deleted',
        description: `${selectedCandidate.name} has been removed.`,
      });
      setSelectedCandidate(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground">Manage election candidates</p>
          </div>
          <Button onClick={handleAddCandidate}>
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </header>

        <div className="voting-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    {candidate.photo && candidate.photo !== '/placeholder.svg' ? (
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {candidate.description || 'No description'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                      {candidate.position}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{candidate.voteCount}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCandidate(candidate)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(candidate)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredCandidates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <User className="w-12 h-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No candidates found</p>
                      <Button variant="outline" size="sm" onClick={handleAddCandidate}>
                        Add your first candidate
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <CandidateFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        candidate={selectedCandidate}
        onSave={handleSaveCandidate}
        positions={positions}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Candidate"
        description={`Are you sure you want to delete ${selectedCandidate?.name}? This action cannot be undone and will remove all associated votes.`}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminCandidates;
