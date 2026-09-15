import { useEffect, useRef } from "react";

export default function NetworkBackground({
  className = "",
  density = 1 / 6700,
  linkDistance = 100,
  dotColor = "rgba(241, 240, 236, 0.35)",
  lineColorRgb = "255, 106, 69",
  lineAlpha = 0.09,
  maxNodes = 260,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width, height, dpr, nodes, raf;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      const count = Math.min(maxNodes, Math.round(width * height * density));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        r: Math.random() * 1.3 + 0.8,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDistance) {
            ctx.strokeStyle = `rgba(${lineColorRgb}, ${
              lineAlpha * (1 - dist / linkDistance)
            })`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    resize();
    initNodes();

    if (prefersReducedMotion) {
      step();
      cancelAnimationFrame(raf); // draw a single static frame only
    } else {
      raf = requestAnimationFrame(step);
    }

    const ro = new ResizeObserver(() => {
      resize();
      initNodes();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, linkDistance, dotColor, lineColorRgb, lineAlpha, maxNodes]);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}