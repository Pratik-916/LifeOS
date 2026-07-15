# E2E Testing (Maestro)

## Framework
- `maestro` (https://maestro.mobile.dev)

## Folder Structure
```
mobile/.maestro/
  01_login.yaml
  02_planner.yaml
  03_habits.yaml
  04_goals.yaml
  05_journal.yaml
  06_journey.yaml
  07_search_logout.yaml
```

## Running Tests
Maestro tests require a running emulator/simulator and the compiled app bundle.

```bash
# Start Maestro against the emulator
maestro test .maestro/
```

## Best Practices
- Keep flows deterministic by asserting elements before tapping them.
- Use explicit accessibility IDs (`id: "element_id"`) where text labels may change dynamically.
