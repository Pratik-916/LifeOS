import type { GoalDTO, MilestoneDTO, Goal, Milestone } from './goals.types';

export const mapMilestoneFromDTO = (dto: MilestoneDTO): Milestone => ({
  id: dto.id,
  title: dto.title,
  description: dto.description || '',
  completed: dto.is_completed,
  completedAt: dto.completed_at,
  dueDate: dto.due_date,
});

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
  tags: (dto.tags_detail || []).map((t: unknown) => (t as { name: string }).name),
  notes: '',
  color: dto.color,
  icon: dto.icon,
  favorite: dto.is_favorite,
  estimatedHours: dto.estimated_hours,
  actualHours: dto.actual_hours,
});
