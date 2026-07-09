import type { GoalDTO, MilestoneDTO } from './goals.types';
import type { Goal, Milestone } from '../../../types';

export const mapMilestoneFromDTO = (dto: MilestoneDTO): Milestone => ({
  id: dto.id,
  title: dto.title,
  description: dto.description || '',
  completed: dto.is_completed,
  completedAt: dto.completed_at,
  dueDate: dto.due_date,
});

export const mapPaginatedGoalsFromDTO = (dto: any) => {
  if (Array.isArray(dto)) {
    return {
      count: dto.length,
      next: null,
      previous: null,
      results: dto.map(mapGoalFromDTO)
    };
  }
  return {
    count: dto.count || 0,
    next: dto.next || null,
    previous: dto.previous || null,
    results: (dto.results || []).map(mapGoalFromDTO)
  };
};

export const mapGoalFromDTO = (dto: GoalDTO): Goal => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  category: dto.category,
  priority: dto.priority,
  status: dto.status,
  targetDate: dto.target_date,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  completedAt: dto.completed_at,
  progress: dto.progress,
  milestones: (dto.milestones || []).map(mapMilestoneFromDTO),
  tags: (dto.tags_detail || []).map(t => t.name),
  notes: '',
  color: dto.color,
  icon: dto.icon,
  favorite: dto.is_favorite,
  estimatedHours: dto.estimated_hours,
  actualHours: dto.actual_hours,
});
