import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../Button';

export interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalCount,
  pageSize = 20,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  className = ''
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  if (totalCount === 0) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-secondary">
        Showing page <span className="font-medium text-primary">{currentPage}</span> of{' '}
        <span className="font-medium text-primary">{totalPages}</span>
        {' '}({totalCount} total)
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="px-3"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-3"
          aria-label="Next Page"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
