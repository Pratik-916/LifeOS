# Asset Validation Strategy

Every graphic asset generated for LifeOS must pass this strict validation checklist before it can be uploaded to the App Store Connect or Google Play Console.

## 1. File Naming Conventions
To prevent deployment chaos, all assets must adhere to:
- `<platform>-<asset-type>-<dimension>.<ext>`
- *Example*: `ios-icon-1024x1024.png`
- *Example*: `android-feature-graphic-1024x500.png`

## 2. Directory Validation
All assets must be cleanly organized within `assets/store/`:
- No raw `.psd` or `.fig` files should be committed to the main repository (keep in Figma or a separate design repo).
- Only the final, exported `.png` or `.svg` files should be placed here.

## 3. Safe Area Validation
- **iOS Icons**: Must have no transparency (no alpha channel). The logo must not exceed 80% of the canvas to avoid getting clipped by Apple's automatic rounding.
- **Android Adaptive Icons**: The foreground SVG must fit entirely within the 72dp safe zone of the 108dp canvas.

## 4. Export Format Verification
- Icons: PNG-24
- iOS Screenshots: PNG (No transparency)
- Android Feature Graphic: PNG or JPEG
- Android Monochrome Icon: strictly SVG
