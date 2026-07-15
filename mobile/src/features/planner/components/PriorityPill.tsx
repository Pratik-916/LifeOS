import React from 'react';
import { PriorityBadge } from '../../../design-system';

interface PriorityPillProps {
  priority: 'low' | 'medium' | 'high';
}

export const PriorityPill: React.FC<PriorityPillProps> = ({ priority }) => {
  let colorType: 'info' | 'warning' | 'danger' = 'info';
  let label = 'Low';

  if (priority === 'high') {
    colorType = 'danger';
    label = 'High';
  } else if (priority === 'medium') {
    colorType = 'warning';
    label = 'Medium';
  }

  return <PriorityBadge label={label} colorType={colorType} />;
};
