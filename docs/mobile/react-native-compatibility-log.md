# React Native Compatibility Log

This document tracks nuances discovered in the backend or frontend architecture that should be considered when implementing the React Native application.

| Date | Component | Nuance | Recommendation for React Native |
|---|---|---|---|
| 2026-07-12 | Error Handling | Web app interceptor expects flat error responses for `non_field_errors`. | Ensure the RN interceptor rigidly parses the standardized `errors` object block rather than relying on the compatibility shim. |
| 2026-07-12 | Auth Context | Web auth stores tokens in `localStorage`. | RN must use `AsyncStorage` or preferably `SecureStore` (Expo) / `react-native-keychain` for JWT storage. |
| 2026-07-12 | Media Uploads | Blog and Journal rely on `multipart/form-data`. | Ensure the RN `FormData` implementation correctly appends the local file URI, name, and MIME type, which can sometimes be finicky on Android. |
| 2026-07-12 | Deep Linking | Web relies on React Router paths (e.g. `/journal/entry/:id`). | Map these exact paths directly to React Navigation deep linking configs to ensure emails or push notifications route gracefully on native. |
