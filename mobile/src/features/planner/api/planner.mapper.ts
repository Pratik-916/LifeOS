import type { Task, TaskDTO, Subtask, SubtaskDTO, Tag, TagDTO, PlannerStats, PlannerStatsDTO } from './planner.types';

export const mapSubtaskDTO = (dto: SubtaskDTO): Subtask => ({
  id: String(dto.id),
  title: dto.title,
  completed: dto.is_completed,
  order: dto.order,
});

export const mapTagDTO = (dto: TagDTO): Tag => ({
  id: String(dto.id),
  name: dto.name,
  color: dto.color,
});

export const mapTaskDTO = (dto: TaskDTO): Task => ({
  id: String(dto.id),
  title: dto.title,
  description: dto.description || '',
  status: dto.status,
  priority: dto.priority,
  category: dto.category || 'General',
  dueDate: dto.due_date,
  dueTime: dto.due_time,
  estimatedMinutes: dto.estimated_minutes || 0,
  actualMinutes: dto.actual_minutes || 0,
  notes: dto.notes || '',
  tags: dto.tags ? dto.tags.map(String) : [],
  tagsDetail: dto.tags_detail ? dto.tags_detail.map(mapTagDTO) : [],
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  completedAt: dto.completed_at,
  recurring: dto.is_recurring,
  recurringType: dto.recurring_type || null,
  isArchived: dto.is_archived || false,
  isPinned: dto.is_pinned || false,
  subtasks: dto.subtasks ? dto.subtasks.map(mapSubtaskDTO) : [],
});

export const mapPlannerStatsDTO = (dto: PlannerStatsDTO): PlannerStats => ({
  totalTasks: dto.total_tasks,
  completed: dto.completed,
  pending: dto.pending,
  overdue: dto.overdue,
  dueToday: dto.due_today,
  dueThisWeek: dto.due_this_week,
  archived: dto.archived,
  pinned: dto.pinned,
  estimatedHours: dto.estimated_hours,
  actualHours: dto.actual_hours,
  highPriority: dto.high_priority,
  completionRate: dto.completion_rate,
  averageCompletionDays: dto.average_completion_days,
  productivityScore: dto.productivity_score,
});

export const mapTaskToDTO = (task: Partial<Task>): Partial<TaskDTO> => {
  const dto: Partial<TaskDTO> = {};
  
  if (task.title !== undefined) dto.title = task.title;
  if (task.description !== undefined) dto.description = task.description;
  if (task.status !== undefined) dto.status = task.status;
  if (task.priority !== undefined) dto.priority = task.priority;
  if (task.category !== undefined) dto.category = task.category;
  if (task.dueDate !== undefined) dto.due_date = task.dueDate;
  if (task.dueTime !== undefined) dto.due_time = task.dueTime;
  if (task.estimatedMinutes !== undefined) dto.estimated_minutes = task.estimatedMinutes;
  if (task.actualMinutes !== undefined) dto.actual_minutes = task.actualMinutes;
  if (task.notes !== undefined) dto.notes = task.notes;
  if (task.tags !== undefined) dto.tags = task.tags.map(Number).filter(n => !isNaN(n));
  if (task.recurring !== undefined) dto.is_recurring = task.recurring;
  if (task.recurringType !== undefined) dto.recurring_type = task.recurringType || '';
  if (task.isArchived !== undefined) dto.is_archived = task.isArchived;
  if (task.isPinned !== undefined) dto.is_pinned = task.isPinned;
  
  return dto;
};
