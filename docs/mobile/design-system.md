# Design System

LifeOS mobile utilizes NativeWind v2 for atomic CSS styling, combining the DX of Tailwind CSS with React Native primitives.

## Components
We utilize a core set of custom reusable components housed in `src/components/ui`:
- `Button`: Standard touchable area with primary/secondary/ghost variants.
- `Input`: Text input with built-in validation error styling.
- `Card`: A bordered, shadow-enabled container.
- `Typography`: Centralized text component mapping to standard `h1`, `h2`, `body`, and `caption` scales.

These components ensure UI consistency and prevent inline style bloat across feature screens.
