// src/app/components/TaskComponents/SimpleSVG.tsx

import React from "react";

type SVGPrimitive =
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; stroke?: string; strokeWidth?: number }
  | { type: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; strokeWidth?: number }
  | { type: "text"; x: number; y: number; text: string; fontSize?: number; fill?: string; anchor?: string };

interface SimpleSVGProps {
  width?: number;
  height?: number;
  primitives: SVGPrimitive[];
  // Можешь добавить еще любые дополнительные пропсы
}

export function SimpleSVG({ width = 200, height = 200, primitives }: SimpleSVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="border rounded bg-background"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      {primitives.map((p, i) => {
        if (p.type === "line") {
          return (
            <line
              key={i}
              x1={p.x1}
              y1={p.y1}
              x2={p.x2}
              y2={p.y2}
              stroke={p.stroke ?? "black"}
              strokeWidth={p.strokeWidth ?? 2}
            />
          );
        }
        if (p.type === "circle") {
          return (
            <circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={p.fill ?? "white"}
              stroke={p.stroke ?? "black"}
              strokeWidth={p.strokeWidth ?? 2}
            />
          );
        }
        if (p.type === "text") {
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              fontSize={p.fontSize ?? 14}
              fill={p.fill ?? "black"}
              textAnchor={p.anchor ?? "middle"}
              alignmentBaseline="middle"
            >
              {p.text}
            </text>
          );
        }
        return null;
      })}
    </svg>
  );
}

export default SimpleSVG;
