# Mobile Troubleshooting Guide

## Caches and Resets
If you encounter unusual behavior, stale references, or strange Metro errors, flush your caches:

### Reset Metro Bundler Cache
```bash
npm start -- --clear
# or
npx expo start -c
```

### Reset Expo Go Cache (Physical Device)
1. Close Expo Go via the OS App Switcher.
2. Long press the Expo Go app icon -> App Info -> Storage -> Clear Cache & Clear Data.
3. Reload from the QR code.

### Secure Store Reset
If you find yourself in an infinite authentication loop (e.g. invalid JWT persisting), the easiest way is to fully uninstall the Expo application from the simulator/device and reinstall it. Secure Store does not clear on regular Javascript reload.

Alternatively, dispatch the logout function programmatically to trigger `SecureStore.deleteItemAsync`.

## Networking (Emulators)
- **Android Emulator**: Uses `10.0.2.2` to refer to the host machine's `localhost`.
- **iOS Simulator**: Uses `127.0.0.1` or `localhost`.
- **Physical Device**: Must be on the exact same Wi-Fi network. Use your machine's local IPv4 address (e.g., `192.168.1.5:8000`).

Ensure `.env` matches your testing target and restart the bundler after changing it.

## Common Errors
- `Network Error (Axios)`: Usually means the API is inaccessible (wrong IP, firewall, or Django isn't running).
- `Property 'className' does not exist`: Ensure `tsc` is running and `nativewind/types` is strictly defined inside `tsconfig.json`.

## Debugging Workflow
Use `console.log` heavily, or utilize React Native Debugger / Flipper to inspect the Redux-like Zustand state and React Query cache.
