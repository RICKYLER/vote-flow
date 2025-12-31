import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, Upload, X } from 'lucide-react';
import { Candidate } from '@/@types';

interface CandidateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate?: Candidate | null;
  onSave: (candidate: Omit<Candidate, 'id' | 'voteCount'> & { id?: string }) => void;
  positions: string[];
}

const CandidateFormDialog = ({
  open,
  onOpenChange,
  candidate,
  onSave,
  positions,
}: CandidateFormDialogProps) => {
  const isEditing = !!candidate;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: candidate?.name || '',
    position: candidate?.position || '',
    description: candidate?.description || '',
    photo: candidate?.photo || '',
  });

  const [customPosition, setCustomPosition] = useState('');
  const [isCustomPosition, setIsCustomPosition] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPosition = isCustomPosition ? customPosition : formData.position;
    
    onSave({
      ...(candidate?.id ? { id: candidate.id } : {}),
      name: formData.name,
      position: finalPosition,
      description: formData.description,
      photo: formData.photo || '/placeholder.svg',
    });
    
    // Reset form
    setFormData({ name: '', position: '', description: '', photo: '' });
    setCustomPosition('');
    setIsCustomPosition(false);
    onOpenChange(false);
  };

  const handlePositionChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomPosition(true);
      setFormData((prev) => ({ ...prev, position: '' }));
    } else {
      setIsCustomPosition(false);
      setFormData((prev) => ({ ...prev, position: value }));
    }
  };

  // Reset form when dialog opens with new candidate data
  const handleOpenChange = (open: boolean) => {
    if (open && candidate) {
      setFormData({
        name: candidate.name,
        position: candidate.position,
        description: candidate.description || '',
        photo: candidate.photo,
      });
      setIsCustomPosition(!positions.includes(candidate.position));
      if (!positions.includes(candidate.position)) {
        setCustomPosition(candidate.position);
      }
    } else if (open && !candidate) {
      setFormData({ name: '', position: '', description: '', photo: '' });
      setCustomPosition('');
      setIsCustomPosition(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the candidate information below.'
              : 'Fill in the details to add a new candidate.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {formData.photo ? (
                <div className="relative">
                  <img
                    src={formData.photo}
                    alt="Candidate photo"
                    className="w-24 h-24 rounded-full object-cover border-2 border-border"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {formData.photo ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter candidate name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={isCustomPosition ? 'custom' : formData.position}
              onValueChange={handlePositionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
                <SelectItem value="custom">+ Add Custom Position</SelectItem>
              </SelectContent>
            </Select>
            
            {isCustomPosition && (
              <Input
                placeholder="Enter custom position"
                value={customPosition}
                onChange={(e) => setCustomPosition(e.target.value)}
                required
              />
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description / Platform</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the candidate's platform..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Add Candidate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateFormDialog;
