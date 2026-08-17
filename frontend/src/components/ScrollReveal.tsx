"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const variantClass =
    variant === "scale"
      ? "scroll-reveal-scale"
      : variant === "left"
      ? "scroll-reveal-left"
      : variant === "right"
      ? "scroll-reveal-right"
      : "scroll-reveal";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${variantClass} ${isVisible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
