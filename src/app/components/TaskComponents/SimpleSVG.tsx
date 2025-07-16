// src/app/components/TaskComponents/SimpleSVG.tsx
import React from "react";

type Base = { stroke?: string; strokeWidth?: number; fill?: string };
type Line    = { type: "line";    x1: number; y1: number; x2: number; y2: number } & Base & { strokeDasharray?: string };
type Circle  = { type: "circle";  cx: number; cy: number; r: number } & Base;
type Ellipse = { type: "ellipse"; cx: number; cy: number; rx: number; ry: number } & Base;
type Polygon = { type: "polygon"; points: [number, number][] } & Base & { fillOpacity?: number };
type Text    = { type: "text";    x: number; y: number; text: string; fontSize?: number; textAnchor?: string; dominantBaseline?: string; } & Base;

export type SvgElement = Line | Circle | Ellipse | Polygon | Text;

export function SimpleSVG(
  { width, height, elements, defaultColor = "currentColor" }:
  { width: number; height: number; elements: SvgElement[]; defaultColor?: string }
) {
  /** маленький хелпер, чтобы не повторяться */
  const withColor = <T extends { stroke?: string; fill?: string }>(el: T) => ({
    ...el,
    stroke: el.stroke ?? defaultColor,
    fill:   // текст и многоугольники обычно заполняются, линии — нет
      ("fill" in el && el.fill !== undefined) ? el.fill : undefined,
  });

  return (
    <svg width={width} height={height} className="overflow-visible">
      {elements.map((el, i) => {
        switch (el.type) {
          case "line":
            return <line   key={i} {...withColor(el)} />;
          case "circle":
            return <circle key={i} {...withColor(el)} />;
          case "ellipse":
            return <ellipse key={i} {...withColor(el)} />;
        case "polygon": {
  const { points, ...other } = el;
  return (
    <polygon
      key={i}
      points={points.map(p => p.join(",")).join(" ")}
      {...other}
    />
  );
}
          case "text": {
  const { x, y, text, fontSize, textAnchor, dominantBaseline, fill } = withColor(el);
  return (
    <text
      key={i}
      x={x}
      y={y}
      fontSize={fontSize ?? 14}
      textAnchor={textAnchor ?? "middle"}
      dominantBaseline={dominantBaseline ?? "middle"}
      fill={fill}
    >
      {text}
    </text>
  );
}

          default:
            return null;
        }
      })}
    </svg>
  );
}
