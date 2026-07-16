# Icon Design System

## Core Specifications
- **Grid Size**: 24x24 pixel bounding box.
- **Stroke Width**: Strictly 2px (Vector stroke, non-scaling where possible).
- **Corner Radius**: 2px rounding on all exterior paths to match the typography's friendly aesthetic.

## Style Rules
- **Outline Icons (Default)**: Used for inactive states, navigation bars, and standard UI elements.
- **Filled Icons (Active)**: Used exclusively to denote active states (e.g., the current tab in the bottom navigation).

## Animation & Scaling
- **Animation**: Micro-interactions (like checking a habit) may use subtle scale-up/scale-down spring animations. Avoid complex morphing SVG animations to preserve performance.
- **Scaling**: If an icon must be scaled down (e.g., to 16x16px), the stroke width must visually align with the surrounding typography weight to prevent it from looking too thick.

## Contribution Rules
- All new icons must be sourced from the exact same library (e.g., Lucide or Heroicons) to ensure exact geometric consistency. Do not mix and match libraries.
