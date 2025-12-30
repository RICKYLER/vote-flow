import { Candidate, ElectionStats, Voter } from '@/types/voting';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Student President',
    photo: '/placeholder.svg',
    voteCount: 156,
    description: 'Committed to improving campus life and student welfare.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Student President',
    photo: '/placeholder.svg',
    voteCount: 142,
    description: 'Focused on academic excellence and career opportunities.',
  },
  {
    id: '3',
    name: 'Emily Davis',
    position: 'Vice President',
    photo: '/placeholder.svg',
    voteCount: 189,
    description: 'Dedicated to fostering inclusive campus community.',
  },
  {
    id: '4',
    name: 'James Wilson',
    position: 'Vice President',
    photo: '/placeholder.svg',
    voteCount: 167,
    description: 'Passionate about sustainability and environmental initiatives.',
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    position: 'Secretary',
    photo: '/placeholder.svg',
    voteCount: 201,
    description: 'Experienced in student governance and administration.',
  },
  {
    id: '6',
    name: 'Daniel Brown',
    position: 'Treasurer',
    photo: '/placeholder.svg',
    voteCount: 178,
    description: 'Finance major with budget management experience.',
  },
];

export const mockStats: ElectionStats = {
  totalVoters: 1250,
  totalCandidates: 6,
  votesCast: 847,
  electionStatus: 'open',
};

export const mockVoters: Voter[] = [
  {
    id: '1',
    name: 'John Smith',
    studentId: 'STU2024001',
    email: 'john.smith@student.edu',
    hasVoted: true,
    votedAt: '2024-01-15 14:32',
  },
  {
    id: '2',
    name: 'Emma Wilson',
    studentId: 'STU2024002',
    email: 'emma.wilson@student.edu',
    hasVoted: true,
    votedAt: '2024-01-15 10:15',
  },
  {
    id: '3',
    name: 'Liam Johnson',
    studentId: 'STU2024003',
    email: 'liam.johnson@student.edu',
    hasVoted: false,
  },
  {
    id: '4',
    name: 'Sophia Brown',
    studentId: 'STU2024004',
    email: 'sophia.brown@student.edu',
    hasVoted: true,
    votedAt: '2024-01-15 16:45',
  },
  {
    id: '5',
    name: 'Noah Davis',
    studentId: 'STU2024005',
    email: 'noah.davis@student.edu',
    hasVoted: false,
  },
];
