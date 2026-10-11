'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export default function KaTeXRenderer({ math, block = false, className = '' }: KaTeXRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (e) {
        if (containerRef.current) {
          containerRef.current.innerText = math;
        }
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className={className} />;
}
