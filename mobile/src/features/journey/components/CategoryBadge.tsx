import React from 'react';
import { CategoryBadge as DSCategoryBadge } from '../../../design-system';

export const CategoryBadge = ({ category }: { category: string }) => {
  if (!category) return null;
  return (
    <DSCategoryBadge label={category} className="mr-2 mb-2" />
  );
};
