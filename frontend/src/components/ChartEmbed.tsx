// src/components/ChartEmbed.tsx
import React, { useState, useRef, useEffect } from 'react';

interface ChartEmbedProps {
  symbol: string;
  interval: string;
  containerId: string;
  showCompression?: boolean;
  showOrderBlock?: boolean;
  showLiquidityTrap?: boolean;
}

export const ChartEmbed: React.FC<ChartEmbedProps> = ({
  symbol,
  interval,
  containerId,
  showCompression = false,
  showOrderBlock = false,
  showLiquidityTrap = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(400);
  const resizing = useRef(false);

  // Load TradingView widget
  useEffect(() => {
    if ((window as any).TradingView && containerRef.current) {
      // clear existing
      containerRef.current.innerHTML = '';
      new (window as any).TradingView.widget({
        container_id: containerId,
        symbol,
        interval,
        width: '100%',
        height,
        // inject flags for overlays
        overrides: {
          'paneProperties.background': '#ffffff',
          'paneProperties.legendProperties.showLegend': true,
        },
      });
    }
  }, [symbol, interval, height, showCompression, showOrderBlock, showLiquidityTrap]);

  // Drag-to-resize handling
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizing.current || !containerRef.current) return;
      const top = containerRef.current.getBoundingClientRect().top;
      const newHeight = e.clientY - top;
      if (newHeight >= 200 && newHeight <= 800) {
        setHeight(newHeight);
      }
    };
    const onMouseUp = () => { resizing.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{ height }}
    >
      <div id={containerId} className="w-full h-full" />
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize hover:bg-gray-300"
        onMouseDown={onMouseDown}
      />
    </div>
  );
};