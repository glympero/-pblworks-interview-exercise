# ADR-0002: Implement Debounced Auto-save with Global Navigation Handler

## Status

Accepted

## Context

The application requirements specify:

1. Remove the "Save Project" button entirely
2. Implement auto-save as users type
3. Handle edge cases:
   - Users navigating away before debounce timer completes
   - Browser back/forward navigation losing unsaved changes

Traditional `useEffect` cleanup approaches failed to reliably flush pending saves during Next.js client-side navigation (Link clicks) and browser history navigation (back/forward buttons).

## Decision

Implement a **Global Navigation Handler** pattern with event-driven flush registration.

### Architecture

#### 1. Global Navigation Listener (`GlobalNavigationHandler`)

Wraps the entire application in `app/layout.tsx` to intercept:

- **Link clicks**: Captures all `<a>` tag clicks via `capture: true`
- **Browser navigation**: Listens to `popstate` events (back/forward buttons)
- **Flush callback registration**: Components register their flush logic via custom events

#### 2. Component Hierarchy

EditProjectWrapper (State + Debounce Logic)
└─ AutosaveBoundary (Flush Registration)
└─ EditProjectForm (Pure Presentation)
Í

- **`EditProjectWrapper`**: Manages form state and debounced save (700ms)
- **`AutosaveBoundary`**: Registers the `debouncedSave.flush` callback with the global handler
- **`EditProjectForm`**: Presentation-only component for maintainability

#### 3. Event-Driven Communication

```
// Component registers its flush callback
window.dispatchEvent(new CustomEvent('register-flush', {
  detail: debouncedSave.flush
}))
```

```
// GlobalNavigationHandler calls the registered callback on navigation
flushCallbackRef.current()
```

## Consequences

### Positive

- **Reliable flush on all navigation types**: Handles Link clicks, back/forward, and unmounts
- **Separation of concerns**: Form logic separated from navigation logic
- **Testable**: Each component has a single responsibility
- **Scalable**: Multiple forms can register their own flush callbacks (future-proof)
- **No race conditions**: Single global handler prevents competing event listeners

### Negative

- **Global state via events**: Custom events add a layer of indirection
- **Wrapper components**: Adds one extra layer in the component tree

### Technical Details

- **Debounce timing**: 700ms chosen to balance responsiveness and database load
- **Flush mechanism**: `use-debounce`'s `.flush()` immediately invokes the pending callback
- **Capture phase**: `{ capture: true }` ensures the handler runs before Link's default behavior
- **Router refresh**: `router.refresh()` after `popstate` ensures the UI reflects saved data

### Why Not Alternatives?

#### `useEffect` cleanup only

```
useEffect(() => {
  return () => debouncedSave.flush()
}, [])
```

**Problem**: Next.js unmounts components before the Promise completes, causing request cancellation.

#### `beforeunload` event

**Problem**: Only fires on full page navigations (refresh, close tab), not Next.js `<Link>` clicks.

#### `startTransition` with flush

**Problem**: React discards state updates during unmount, and `startTransition` doesn't guarantee network completion.

## Implementation Notes

### State Management Strategy

```
const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
```

Visual feedback to replace the removed "Save" button, addressing user anxiety about data persistence.

### Router Integration

The `router.refresh()` after back/forward ensures the Header (Parallel Route `@header`) displays the correct saved title without manual cache invalidation.

## References

- [use-debounce documentation](https://github.com/xnimorz/use-debounce)
- [Next.js navigation events discussion](https://github.com/vercel/next.js/discussions/41934)
