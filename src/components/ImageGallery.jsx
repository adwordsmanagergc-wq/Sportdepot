'use client';

import { useState } from 'react';

export default function ImageGallery({ images = [], alt }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null); // {x,y} as %

  if (!images.length) {
    return <div className="aspect-square bg-gray-100 rounded-lg" />;
  }

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y });
  }

  return (
    <div className="flex gap-4">
      <div className="hidden md:flex flex-col gap-3 w-20">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`aspect-square rounded overflow-hidden border-2 ${
              i === active ? 'border-accent' : 'border-transparent'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div
        className="flex-1 relative bg-gray-50 rounded-lg overflow-hidden aspect-square cursor-zoom-in"
        onMouseMove={handleMove}
        onMouseLeave={() => setZoom(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-200"
          style={
            zoom
              ? {
                  transform: 'scale(2)',
                  transformOrigin: `${zoom.x}% ${zoom.y}%`,
                }
              : undefined
          }
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full ${i === active ? 'bg-ink' : 'bg-gray-400'}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
