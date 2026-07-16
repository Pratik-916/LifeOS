# Accessibility Branding Audit

LifeOS believes productivity must be accessible to everyone. Our visual identity strictly adheres to accessibility standards.

## Contrast Ratios
- **Text**: Primary text (`#1F2937`) on standard backgrounds (`#FFFFFF`) easily exceeds the **WCAG AAA** standard (7:1).
- **Accents**: Our Indigo (`#4F46E5`) and Emerald (`#10B981`) accents provide clear visual distinction. Buttons using white text on Indigo backgrounds pass **WCAG AA** standards for large text.

## Theme Compatibility
- **Dark Mode / Light Mode**: The UI is designed to toggle seamlessly. Dark mode uses deep grays (`#111827`) rather than absolute black (`#000000`) to reduce contrast halation and eye strain.
- **Color Blindness**: State changes (like task completion or habit streaks) never rely exclusively on color. We always pair color changes with iconography (e.g., a checkmark for success) or structural changes (e.g., strikethrough text).

## Typography
- **Dynamic Type**: We fully support iOS Dynamic Type and Android font scaling.
- **Large Text Optimization**: When system font sizes increase, our Tailwind layouts (`flex-wrap`) ensure text wraps gracefully rather than truncating.
