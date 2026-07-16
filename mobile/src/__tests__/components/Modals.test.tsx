import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { BottomSheet } from '../../design-system/modals/BottomSheet';
import { ConfirmationDialog } from '../../design-system/modals/Dialog';
import { Text } from 'react-native';

describe('Modal Components', () => {
  it('renders BottomSheet correctly when visible', async () => {
    await render(
      <BottomSheet visible={true} onClose={() => {}}>
        <Text>Sheet Content</Text>
      </BottomSheet>
    );
    expect(screen.getByText('Sheet Content')).toBeTruthy();
  });

  it('renders Dialog correctly when visible', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    await render(
      <ConfirmationDialog 
        visible={true} 
        title="Dialog Title" 
        description="Dialog message"
        onConfirm={onConfirm}
        onClose={onCancel}
        confirmText="Yes"
        cancelText="No"
      />
    );
    
    expect(screen.getByText('Dialog Title')).toBeTruthy();
    expect(true).toBe(true);
  });
});
