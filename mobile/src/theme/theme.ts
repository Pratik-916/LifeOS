import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
  // Add dark mode variants here when needed
};

export type Theme = typeof theme;
