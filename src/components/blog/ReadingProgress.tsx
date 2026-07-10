"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    let current = 0;

    const update = () => {
      const article = document.getElementById("article-content");
      if (!article) {
        rafId = requestAnimationFrame(update);
        return;
      }

      const rect = article.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const articleHeight = rect.height;

      // Progress from when article top hits viewport top to when article bottom leaves viewport
      const scrollable = articleHeight - viewportHeight;
      const progress =
        scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 1;

      current += (progress - current) * 0.12;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(0, Math.min(1, current))})`;
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-primary origin-left"
    />
  );
}
