import { InsightEngineContext, Insight, InsightProvider } from '../insights.types';
import { RuleProvider } from './providers/RuleProvider';

class InsightEngine {
  private providers: InsightProvider[] = [];

  constructor() {
    // Register default providers
    this.registerProvider(new RuleProvider());
  }

  registerProvider(provider: InsightProvider) {
    this.providers.push(provider);
  }

  evaluate(context: InsightEngineContext): Insight[] {
    const allInsights: Insight[] = [];
    
    for (const provider of this.providers) {
      const insights = provider.generateInsights(context);
      allInsights.push(...insights);
    }
    
    // Sort or filter if necessary, e.g., by severity
    const severityWeight = { high: 3, medium: 2, low: 1 };
    
    return allInsights.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);
  }
}

export const insightEngine = new InsightEngine();
