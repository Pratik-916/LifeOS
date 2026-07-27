import { Platform } from 'react-native';
import { colors } from './colors';

export const elevation = {
  none: Platform.select({
    ios: { shadowColor: 'transparent', shadowOpacity: 0, shadowOffset: { width: 0, height: 0 }, shadowRadius: 0 },
    android: { elevation: 0 }
  }),
  sm: Platform.select({
    ios: { shadowColor: colors.text.light, shadowOpacity: 0.02, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
    android: { elevation: 2 }
  }),
  md: Platform.select({
    ios: { shadowColor: colors.text.light, shadowOpacity: 0.04, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
    android: { elevation: 4 }
  }),
  lg: Platform.select({
    ios: { shadowColor: colors.text.light, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16 },
    android: { elevation: 8 }
  }),
  xl: Platform.select({
    ios: { shadowColor: colors.text.light, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 12 }, shadowRadius: 24 },
    android: { elevation: 12 }
  })
};