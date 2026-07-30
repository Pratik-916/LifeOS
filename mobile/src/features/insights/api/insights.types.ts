export type InsightCategory = 'momentum' | 'focus' | 'goals' | 'habits' | 'reflection' | 'balance';

export type InsightSeverity = 'high' | 'medium' | 'low';

export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  relatedGoalId?: string;
  data: Record<string, unknown>; // The structured payload that the presentation layer will translate
}

export interface InsightEngineContext {
  tasks: Record<string, unknown>[];
  habits: Record<string, unknown>[];
  goals: Record<string, unknown>[];
  journalEntries: Record<string, unknown>[];
}

export interface InsightProvider {
  name: string;
  generateInsights(context: InsightEngineContext): Insight[];
}
