# Release Assets Architecture

This document tracks the physical location of store assets once they are generated.

## Folder Structure
```text
assets/store/
├── android/
│   ├── icon-512x512.png
│   ├── feature-graphic-1024x500.png
│   └── screenshots/
│       ├── 1-dashboard.png
│       ├── 2-planner.png
│       └── ...
├── ios/
│   ├── icon-1024x1024.png
│   └── screenshots/
│       ├── 6.7-inch/
│       └── 5.5-inch/
├── branding/
│   ├── logo-vector.svg
│   ├── palette.md
│   └── fonts/
└── splash/
    ├── splash-light.png
    └── splash-dark.png
```

## Generation Protocol
All screenshots and icons MUST be placed in these directories prior to final release engineering (Phase 28C/D). These folders are tracked by Git LFS if they become too large.
