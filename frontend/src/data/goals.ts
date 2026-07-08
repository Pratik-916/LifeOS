export const shortTermGoals = [
  {
    id: 1,
    title: 'Ship LifeOS MVP',
    category: 'Project',
    progress: 75,
    deadline: 'July 15, 2026',
    color: 'from-blue-500 to-accent',
    milestones: [
      { name: 'Design System', completed: true },
      { name: 'Frontend Implementation', completed: true },
      { name: 'Backend Integration', completed: false },
      { name: 'Beta Launch', completed: false },
    ],
    description: 'Launch the first usable version of the personal productivity dashboard.'
  },
  {
    id: 2,
    title: 'Read "Atomic Habits"',
    category: 'Personal Growth',
    progress: 40,
    deadline: 'July 25, 2026',
    color: 'from-emerald-400 to-emerald-600',
    milestones: [
      { name: 'Part 1: The Fundamentals', completed: true },
      { name: 'Part 2: 1st Law', completed: false },
      { name: 'Part 3: 2nd Law', completed: false },
      { name: 'Part 4: 3rd & 4th Laws', completed: false },
    ],
    description: 'Finish the book and implement 3 new tiny habits into my daily routine.'
  },
  {
    id: 3,
    title: 'Workout Consistency',
    category: 'Health',
    progress: 60,
    deadline: 'July 31, 2026',
    color: 'from-orange-400 to-orange-600',
    milestones: [
      { name: 'Week 1 (4 workouts)', completed: true },
      { name: 'Week 2 (4 workouts)', completed: true },
      { name: 'Week 3 (4 workouts)', completed: false },
      { name: 'Week 4 (4 workouts)', completed: false },
    ],
    description: 'Hit the gym 4 times a week for the entire month without skipping.'
  }
];

export const longTermGoals = [
  {
    id: 1,
    title: 'Financial Independence',
    category: 'Finance',
    progress: 35,
    deadline: 'Dec 31, 2030',
    color: 'from-purple-500 to-pink-500',
    milestones: [
      { name: 'Pay off student loans', completed: true },
      { name: '6 months emergency fund', completed: true },
      { name: 'Max out index funds (Year 1)', completed: false },
      { name: 'Reach $100k net worth', completed: false },
    ],
    description: 'Build a strong financial foundation to have the freedom to work purely on passion projects.'
  },
  {
    id: 2,
    title: 'Master Full-Stack Engineering',
    category: 'Career',
    progress: 65,
    deadline: 'Dec 31, 2027',
    color: 'from-slate-400 to-slate-600',
    milestones: [
      { name: 'Master React & Next.js', completed: true },
      { name: 'Build 3 production APIs', completed: true },
      { name: 'Learn System Design', completed: false },
      { name: 'Open Source Contributions', completed: false },
    ],
    description: 'Become a highly capable, autonomous engineer who can build scalable systems from scratch.'
  }
];

export const visionBoardPhotos = [
  { id: 1, url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=400', title: 'Deep Work Setup' },
  { id: 2, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600&h=400', title: 'Travel More' },
  { id: 3, url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600&h=400', title: 'Fitness' },
  { id: 4, url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=400', title: 'Code Mastery' },
];
