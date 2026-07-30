import { InsightProvider, InsightEngineContext, Insight } from '../../insights.types';

export class RuleProvider implements InsightProvider {
  name = 'RuleProvider';

  generateInsights(context: InsightEngineContext): Insight[] {
    const insights: Insight[] = [];
    const { goals, habits, tasks, journalEntries } = context;

    // 1. GoalNeglectedRule
    const inProgressGoals = goals.filter(g => g.status === 'in_progress');
    
    // Find a goal with no tasks or habits linked to it
    for (const goal of inProgressGoals) {
      const hasTasks = tasks.some(t => t.linkedGoalId === goal.id);
      const hasHabits = habits.some(h => h.linkedGoalId === goal.id);
      
      if (!hasTasks && !hasHabits) {
        insights.push({
          id: `goal-neglected-${goal.id}`,
          category: 'focus',
          severity: 'medium',
          relatedGoalId: goal.id,
          data: {
            rule: 'GoalNeglectedRule',
            goalTitle: goal.title
          }
        });
      }
    }

    // 2. HabitMomentumRule
    // Check if any habit with a linked goal has a good streak (> 3)
    for (const habit of habits) {
      if (habit.linkedGoalId && habit.currentCount >= habit.targetCount) {
        // Find if this habit was consistently done recently (just a simplistic check for this rule)
        if (habit.currentCount >= 3) {
           insights.push({
             id: `habit-momentum-${habit.id}`,
             category: 'momentum',
             severity: 'low',
             relatedGoalId: habit.linkedGoalId,
             data: {
               rule: 'HabitMomentumRule',
               habitTitle: habit.title
             }
           });
        }
      }
    }

    // 3. MorningPlanningRule
    // Just an example showing we can derive insights based on presence of tasks and reflection
    if (tasks.length > 5 && journalEntries.length > 0) {
       insights.push({
         id: `morning-planning`,
         category: 'reflection',
         severity: 'low',
         data: {
           rule: 'MorningPlanningRule',
           taskCount: tasks.length
         }
       });
    }

    // Returning unique insights or limit to a reasonable number
    return insights;
  }
}
