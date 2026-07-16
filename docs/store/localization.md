# Localization Readiness

## Primary Language
- **Default Locale**: English (en-US)
- **Store Listings**: English (en-US)

## Future Language Targets
- Spanish (es-ES, es-MX)
- French (fr-FR)
- German (de-DE)
- Japanese (ja-JP)

## Text Expansion Considerations
- German and French can expand text length by up to 30%.
- **Strategy**: 
  - UI components (buttons, badges) must use flexible widths (`flex-1`, `flex-wrap`).
  - Store Screenshot captions must be written strictly under 40 characters to allow for safe translation expansion in the graphic frames.

## Font Compatibility
- Our primary font is **Inter** (or system default).
- For CJK (Chinese, Japanese, Korean) languages, we will fall back gracefully to native system fonts (e.g., Noto Sans CJK, Hiragino) to ensure optimal rendering and legibility.

## RTL (Right-to-Left) Readiness
- Currently, LifeOS does not explicitly support RTL (Arabic, Hebrew).
- When targeting RTL in the future, Tailwind's logical properties (e.g., `ms-4` instead of `ml-4`) must be audited across all React Native UI components.
