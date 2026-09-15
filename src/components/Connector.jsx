import { useEffect, useRef, useState } from "react";

export default function Connector() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-0.5 py-4">
      <span
        className="h-9 w-px transition-colors duration-700"
        style={{ background: seen ? "#34D399" : "#3A332D" }}
      />
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-colors duration-700"
        style={{ color: seen ? "#34D399" : "#3A332D" }}
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}