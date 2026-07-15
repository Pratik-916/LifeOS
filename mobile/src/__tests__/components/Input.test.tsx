import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TextField, Switch, Checkbox } from '../../design-system/inputs/Input';

describe('Input Components', () => {
  describe('TextField', () => {
    it('renders label', async () => {
      await render(<TextField label="Username" placeholder="Enter username" />);
      expect(screen.getByText('Username')).toBeTruthy();
    });

    it('renders placeholder', async () => {
      await render(<TextField placeholder="Enter your name" />);
      expect(screen.getByPlaceholderText('Enter your name')).toBeTruthy();
    });

    it('displays error message', async () => {
      await render(<TextField error="Invalid input" />);
      expect(screen.getByText('Invalid input')).toBeTruthy();
    });

    it('handles text change', async () => {
      const onChangeTextMock = jest.fn();
      await render(<TextField placeholder="Type here" onChangeText={onChangeTextMock} />);
      fireEvent.changeText(screen.getByPlaceholderText('Type here'), 'new text');
      expect(onChangeTextMock).toHaveBeenCalledWith('new text');
    });
  });

  describe('Switch', () => {
    it('renders with label', async () => {
      await render(<Switch label="Enable notifications" value={false} onValueChange={jest.fn()} />);
      expect(screen.getByText('Enable notifications')).toBeTruthy();
    });

    it('fires onValueChange when toggled', async () => {
      const onValueChangeMock = jest.fn();
      await render(<Switch label="Toggle" value={false} onValueChange={onValueChangeMock} />);
      fireEvent(screen.getByRole('switch'), 'onValueChange', true);
      expect(onValueChangeMock).toHaveBeenCalledWith(true);
    });
  });

  describe('Checkbox', () => {
    it('renders label', async () => {
      await render(<Checkbox label="Accept Terms" checked={false} onChange={jest.fn()} />);
      expect(screen.getByText('Accept Terms')).toBeTruthy();
    });

    it('calls onChange with inverted value on press', async () => {
      const onChangeMock = jest.fn();
      await render(<Checkbox label="Accept Terms" checked={false} onChange={onChangeMock} />);
      fireEvent.press(screen.getByText('Accept Terms'));
      expect(onChangeMock).toHaveBeenCalledWith(true);
    });
  });
});
