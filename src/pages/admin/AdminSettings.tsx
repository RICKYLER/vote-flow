import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { mockStats } from '@/api/mockData';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  const [electionName, setElectionName] = useState('Student Council Election 2024');
  const [isElectionOpen, setIsElectionOpen] = useState(mockStats.electionStatus === 'open');

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Election settings have been updated successfully.',
    });
  };

  const handleToggleElection = (checked: boolean) => {
    setIsElectionOpen(checked);
    toast({
      title: checked ? 'Election opened' : 'Election closed',
      description: checked 
        ? 'Students can now cast their votes.' 
        : 'Voting has been closed.',
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure election parameters</p>
        </header>

        <div className="max-w-2xl space-y-6">
          <div className="voting-card">
            <h2 className="text-lg font-semibold mb-6">Election Details</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="electionName">Election Name</Label>
                <Input
                  id="electionName"
                  value={electionName}
                  onChange={(e) => setElectionName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  defaultValue="2024-01-15"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  defaultValue="2024-01-20"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="mt-6">
              Save Changes
            </Button>
          </div>

          <div className="voting-card">
            <h2 className="text-lg font-semibold mb-6">Election Control</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Election Status</p>
                <p className="text-sm text-muted-foreground">
                  {isElectionOpen 
                    ? 'Voting is currently open for all eligible students' 
                    : 'Voting is closed. Students cannot cast votes'}
                </p>
              </div>
              <Switch
                checked={isElectionOpen}
                onCheckedChange={handleToggleElection}
              />
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Closing the election will prevent any new votes from being cast. 
                This action can be reversed by opening the election again.
              </p>
            </div>
          </div>

          <div className="voting-card border-destructive/20">
            <h2 className="text-lg font-semibold mb-6 text-destructive">Danger Zone</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reset Election</p>
                <p className="text-sm text-muted-foreground">
                  Clear all votes and reset the election. This action cannot be undone.
                </p>
              </div>
              <Button variant="destructive">
                Reset Election
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
