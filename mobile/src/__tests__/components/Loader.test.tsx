import React from 'react';
import { render } from '@testing-library/react-native';
import { Loader } from '../../design-system/loaders/Loader';
import { Skeleton } from '../../design-system/loaders/Skeleton';

describe('Loader Components', () => {
  describe('Loader', () => {
    it('renders correctly', () => {
      const { toJSON } = render(<Loader />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Skeleton', () => {
    it('renders rectangular variant by default', () => {
      const { toJSON } = render(<Skeleton width={100} height={20} />);
      expect(toJSON()).toBeTruthy();
    });
    
    it('renders circular variant', () => {
      const { toJSON } = render(<Skeleton variant="circular" width={50} height={50} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
