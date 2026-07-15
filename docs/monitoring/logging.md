# Structured Logging

All components must use the centralized logger utility.
- logger.debug: Verbose dev only.
- logger.info: Application lifecycle events.
- logger.warn: Handled errors or unexpected state.
- logger.error: Unhandled exceptions.
- logger.critical: Fatal crashes.
