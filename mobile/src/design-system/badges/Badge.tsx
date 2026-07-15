import React from 'react';
import { View, ViewProps } from 'react-native';
import { BodySM, Caption } from '../text/Typography';
import { Icon } from '../icons/IconProvider';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'status' | 'priority' | 'category' | 'pinned' | 'favorite' | 'progress';
  colorType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  icon?: string;
  className?: string;
}

const getBadgeColorClasses = (colorType: BadgeProps['colorType']) => {
  switch (colorType) {
    case 'primary': return 'bg-primary-100 dark:bg-primary-900';
    case 'success': return 'bg-success/20';
    case 'warning': return 'bg-warning/20';
    case 'danger': return 'bg-danger/20';
    case 'info': return 'bg-info/20';
    default: return 'bg-secondary-100 dark:bg-secondary-900';
  }
};

const getTextColor = (colorType: BadgeProps['colorType']) => {
  switch (colorType) {
    case 'primary': return 'text-primary-900 dark:text-primary-100';
    case 'success': return 'text-success';
    case 'warning': return 'text-warning';
    case 'danger': return 'text-danger';
    case 'info': return 'text-info';
    default: return 'text-text-muted';
  }
};

export const Badge = React.forwardRef<View, BadgeProps>(
  ({ label, variant = 'status', colorType = 'default', icon, className = '', ...props }, ref) => {
    const bgClass = getBadgeColorClasses(colorType);
    const textColorClass = getTextColor(colorType);
    
    // Some logic based on variant could be added, e.g. different shapes.
    // Pinned or Favorite might just mean specific default icons.
    
    const iconName = variant === 'pinned' ? 'Pin' : variant === 'favorite' ? 'Heart' : icon;

    return (
      <View
        ref={ref}
        className={`flex-row items-center justify-center self-start px-2 py-0.5 rounded-full ${bgClass} ${className}`}
        {...props}
      >
        {iconName && (
          <Icon
            name={iconName}
            size={12}
            className="mr-1"
            // we'd ideally pass the color directly if we parsed the hex, but for now we rely on the parent text color if possible, or omit color
          />
        )}
        <Caption className={`font-semibold ${textColorClass}`}>
          {label}
        </Caption>
      </View>
    );
  }
);

Badge.displayName = 'Badge';

export const StatusBadge = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="status" {...props} />;
export const PriorityBadge = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="priority" {...props} />;
export const CategoryBadge = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="category" {...props} />;
export const PinnedBadge = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="pinned" colorType="warning" {...props} />;
export const FavoriteBadge = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="favorite" colorType="danger" {...props} />;
export const ProgressBadge = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="progress" colorType="info" {...props} />;
