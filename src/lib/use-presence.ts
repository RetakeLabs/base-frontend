import { useEffect, useState } from "react";

/**
 * Keeps a node mounted for `duration` ms after `open` turns false, so an
 * exit transition can play instead of the element disappearing instantly.
 */
export function usePresence(open: boolean, duration = 200) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  // Adjust state in response to a prop change during render (React's
  // recommended alternative to a setState-in-effect for this case), so the
  // exit transition starts on the same render `open` flips to false.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setShouldRender(true);
    } else {
      setIsVisible(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (open || !shouldRender) return;
    const timeout = setTimeout(() => setShouldRender(false), duration);
    return () => clearTimeout(timeout);
  }, [open, shouldRender, duration]);

  return { shouldRender, isVisible };
}
