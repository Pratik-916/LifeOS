import React from 'react';
import { PinnedBadge as DSPinnedBadge } from '../../../design-system';

export const PinnedBadge = ({ pinned }: { pinned: boolean }) => {
  if (!pinned) return null;
  return (
    <DSPinnedBadge label="Pinned" className="mr-2 mb-2" />
  );
};
