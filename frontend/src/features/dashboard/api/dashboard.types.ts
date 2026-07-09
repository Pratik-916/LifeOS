export interface ActivityDTO {
  id: string;
  action: string;
  metadata: Record<string, any>;
  created_at: string;
  content_type: string;
  object_id: string;
}

export interface ActivityModel {
  id: string;
  action: string;
  metadata: Record<string, any>;
  createdAt: string;
  contentType: string;
  objectId: string;
}

export interface QuickActionConfig {
  id: string;
  label: string;
  icon: string;
  path: string;
  color: string;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: string;
  order: number;
  isVisible: boolean;
  size: 'small' | 'medium' | 'large';
}
