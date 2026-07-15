import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextField, Switch, Checkbox } from '../../design-system/inputs/Input';

describe('Input Components', () => {
  describe('TextField', () => {
    it('renders label and placeholder', () => {
      const { getByText, getByPlaceholderText } = render(
        <TextField label="Username" placeholder="Enter username" />
      );
      expect(getByText('Username')).toBeTruthy();
      expect(getByPlaceholderText('Enter username')).toBeTruthy();
    });

    it('displays error message', () => {
      const { getByText } = render(
        <TextField error="Invalid input" />
      );
      expect(getByText('Invalid input')).toBeTruthy();
    });

    it('handles text change', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(
        <TextField placeholder="Type here" onChangeText={onChangeTextMock} />
      );
      
      fireEvent.changeText(getByPlaceholderText('Type here'), 'new text');
      expect(onChangeTextMock).toHaveBeenCalledWith('new text');
    });
  });

  describe('Switch', () => {
    it('renders with label and toggles', () => {
      const onValueChangeMock = jest.fn();
      const { getByText, getByRole } = render(
        <Switch label="Enable notifications" value={false} onValueChange={onValueChangeMock} />
      );
      
      expect(getByText('Enable notifications')).toBeTruthy();
      fireEvent(getByRole('switch'), 'onValueChange', true);
      expect(onValueChangeMock).toHaveBeenCalledWith(true);
    });
  });

  describe('Checkbox', () => {
    it('renders correctly and responds to press', () => {
      const onChangeMock = jest.fn();
      const { getByText } = render(
        <Checkbox label="Accept Terms" checked={false} onChange={onChangeMock} />
      );
      
      fireEvent.press(getByText('Accept Terms'));
      expect(onChangeMock).toHaveBeenCalledWith(true);
    });
  });
});
