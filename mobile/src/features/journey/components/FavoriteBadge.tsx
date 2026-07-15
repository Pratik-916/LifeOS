import React from 'react';
import { FavoriteBadge as DSFavoriteBadge } from '../../../design-system';

export const FavoriteBadge = ({ favorite }: { favorite: boolean }) => {
  if (!favorite) return null;
  return (
    <DSFavoriteBadge label="Favorite" className="mr-2 mb-2" />
  );
};
