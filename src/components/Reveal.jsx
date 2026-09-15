import { useEffect, useRef, useState } from "react";

/**
 * Wraps content in a scale + fade "pop" that plays once, the first time it
 * scrolls into view (also fires immediately for anything already on screen
 * on load, e.g. the hero). `as` lets you keep correct semantics (h1, p, etc)
 * since Reveal renders as that element directly rather than adding a
 * wrapper div around it.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion || visible) return;
    const el = ref.current;
    if (!el) return;

    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [reducedMotion, visible, delay]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.85) translateY(12px)",
        transition: reducedMotion
          ? "none"
          : "opacity 0.5s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {children}
    </Tag>
  );
}