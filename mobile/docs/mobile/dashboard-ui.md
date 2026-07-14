# Dashboard UI Architecture

## Overview

The LifeOS mobile Dashboard has been redesigned to provide a premium, modern productivity experience utilizing an 8dp grid, Material Design 3 cards, and a sophisticated color palette. The backend Django APIs remain the exclusive source of truth, and no business logic is duplicated on the mobile client.

## Component Tree

The dashboard is structured into several modular, reusable components located in `src/features/dashboard/components/`:

- `DashboardScreen.tsx`
  - `DashboardHeader.tsx`: Time-aware greeting, current date, quote, and profile avatar.
  - `HeroProductivityCard.tsx`: Displays the main productivity score and a circular progress ring.
  - `OverviewCard.tsx` (TodayOverview): Horizontal list of summary metrics across all 5 modules (Tasks, Habits, Goals, Journal, Journey).
  - `QuickActions.tsx`: Actionable round buttons navigating directly to creation flows (`+ Task`, `+ Habit`, etc).
  - `AgendaCard.tsx`: Vertical timeline displaying upcoming deadlines.
  - `InsightCarousel.tsx`: Horizontal scrolling list utilizing existing `InsightCard` components to show dynamic trends.
  - `WeeklyProgressSection.tsx`: Placeholder card for the analytics chart.
  - `DashboardSkeleton.tsx`: Custom skeleton layout shown during the `isLoading` state.
  - `DashboardEmptyState.tsx`: Reusable empty state with Lucide icons.

## Design Principles

- **Minimalist Aesthetics**: Soft elevation, border lines, and ample whitespace to reduce cognitive load.
- **Color System**:
  - Tasks: `#2563EB` (Blue)
  - Habits: `#10B981` (Green)
  - Goals: `#F59E0B` (Orange)
  - Journal: `#8B5CF6` (Purple)
  - Journey: `#14B8A6` (Teal)
- **Rounded Corners**: Core cards utilize a `24dp` border radius. Smaller elements use `12dp` or `full` border radius.

## Accessibility
Every component utilizes standard React Native accessibility features:
- Interactive cards use `accessibilityRole="button"`.
- Meaningful ARIA labels (e.g. `accessibilityLabel={'Productivity Score ' + score}`).
- Minimal `44dp` touch targets on all interactive elements.

## Performance
- Heavy use of `React.memo()` around static child components to prevent re-renders when dashboard queries refetch.
- Fast `useNavigation` calls avoiding unnecessary state overhead.
- No local aggregation or `.reduce()` calls. Data is passed directly from the `DashboardSummaryDTO`.

## Navigation Changes
- The `Logout` button has been removed from the Dashboard.
- A new `ProfileScreen.tsx` was created within `src/features/profile/screens/` and added to the `MainStack`.
- The Bottom Navigation layer was redesigned to use larger icons (`size={26}`), thicker active strokes, and a cleaner `backgroundColor: '#FFFFFF'` with active tints mapped to Slate `#0F172A`.
