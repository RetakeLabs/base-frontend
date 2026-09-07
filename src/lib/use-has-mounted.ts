import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after the client has hydrated. Lets components that must
 * render differently on server vs. client (theme toggles, portals) avoid a
 * hydration mismatch without a setState-in-effect.
 */
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
