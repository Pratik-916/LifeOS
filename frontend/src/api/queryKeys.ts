export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  planner: {
    all: ['planner'] as const,
    detail: (id: string) => ['planner', id] as const,
  },
  goals: {
    all: ['goals'] as const,
    detail: (id: string) => ['goals', id] as const,
  },
  habits: {
    today: ['habits', 'today'] as const,
    all: ['habits'] as const,
    detail: (id: string) => ['habits', id] as const,
  },
  journal: {
    all: ['journal'] as const,
    detail: (id: string) => ['journal', id] as const,
  },
  journey: {
    timeline: ['journey', 'timeline'] as const,
  },
  analytics: {
    dashboard: ['analytics', 'dashboard'] as const,
  },
  blog: {
    all: ['blog'] as const,
    detail: (slug: string) => ['blog', slug] as const,
  },
  activities: {
    all: ['activities'] as const,
  },
};
