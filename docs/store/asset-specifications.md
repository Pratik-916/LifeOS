# Store Asset Specifications

This document defines the strict dimensions and requirements for all store graphics.

## 1. App Icons
**iOS App Store Icon**
- **Dimensions**: 1024 x 1024 px
- **Format**: PNG (No transparency allowed)
- **Safe Area**: Keep logo centered. Apple automatically rounds the corners; do not submit rounded assets.

**Android Launcher Icon**
- **Dimensions**: 512 x 512 px
- **Format**: PNG (32-bit, with alpha channel for transparency)
- **Note**: Ensure compatibility with Adaptive Icons (requires separate foreground and background layers in the actual codebase).

**Android Monochrome Icon**
- **Dimensions**: 108 x 108 px (Vector/SVG)
- **Purpose**: Used for Android 13+ themed icons.

## 2. Splash Screen Assets
- **Background**: Solid color matching the app's primary background (e.g., `#FFFFFF` for light, `#111827` for dark).
- **Foreground Logo**: Centered, 200x200px or similar safe area. SVG or high-res PNG.
- **Compatibility**: Must be responsive to prevent stretching on iPads and wide Android tablets.

## 3. Store Graphics
**Google Play Feature Graphic**
- **Dimensions**: 1024 x 500 px
- **Format**: JPEG or PNG (No alpha)
- **Purpose**: Appears at the top of the store listing. Should include branding and a brief value proposition. Avoid putting critical text near the edges.

**Promotional Banner (Optional/iOS)**
- **Dimensions**: Custom per store promotional guidelines.

## 4. Web Assets
- **Favicon**: 512x512px PNG for PWA installations and browser tabs.
