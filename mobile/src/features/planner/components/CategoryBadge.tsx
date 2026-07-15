import React from 'react';
import { CategoryBadge as DSBadge } from '../../../design-system';

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return <DSBadge label={category} />;
};
