"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `children` (a dynamically-imported map) only once the placeholder
 * scrolls near the viewport. This keeps the MapLibre chunk out of the initial
 * load and off the network entirely until the section is actually approached —
 * important on slow mobile connections. A fixed-height fallback prevents layout
 * shift before the map mounts.
 */
export function InViewLazy({
  children,
  fallback,
  rootMargin = "300px",
  className,
}: {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {inView ? children : fallback}
    </div>
  );
}
