// src/app/demo/page.tsx

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Сам HTML-код таблицы — вставляем как строку (можно хранить в БД)
const demoText = `
# Пример задачи с таблицей

Ниже приведена таблица расстояний между пунктами:

<div className="flex flex-row flex-wrap gap-6 items-start md:flex-nowrap md:gap-8">
  <div>
  <style>
    table, td, th {
      border: 1px solid #444;
      border-collapse: collapse;
    }
    td, th {
      padding: 6px;
      text-align: center;
    }
    /* Пример заливки secondary, если переменная не определена */
    .bg-\[hsl\(var\(--secondary\)\)\] {
      background: #eee;
    }
  </style>

  <!-- таблица расстояний -->
  <table>
    <tbody>
      <tr>
        <td rowspan="2" colspan="2"></td>
        <td colspan="7">Номер пункта</td>
      </tr>
      <tr>
        <td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td>
      </tr>
      <tr>
        <td rowspan="7" style="writing-mode:vertical-lr;transform:rotate(180deg);">Номер пункта</td>
        <td>1</td><td class="bg-[hsl(var(--secondary))]"></td><td></td><td></td><td>30</td><td>3</td><td></td><td>5</td>
      </tr>
      <tr>
        <td>2</td><td></td><td class="bg-[hsl(var(--secondary))]"></td><td></td><td>21</td><td></td><td>13</td><td></td>
      </tr>
      <tr>
        <td>3</td><td></td><td></td><td class="bg-[hsl(var(--secondary))]"></td><td></td><td>39</td><td>53</td><td>2</td>
      </tr>
      <tr>
        <td>4</td><td>30</td><td>21</td><td></td><td class="bg-[hsl(var(--secondary))]"></td><td></td><td></td><td></td>
      </tr>
      <tr>
        <td>5</td><td>3</td><td></td><td>39</td><td></td><td class="bg-[hsl(var(--secondary))]"></td><td>8</td><td></td>
      </tr>
      <tr>
        <td>6</td><td></td><td>13</td><td>53</td><td></td><td>8</td><td class="bg-[hsl(var(--secondary))]"></td><td></td>
      </tr>
      <tr>
        <td>7</td><td>5</td><td></td><td>2</td><td></td><td></td><td></td><td class="bg-[hsl(var(--secondary))]"></td>
      </tr>
    </tbody>
  </table>
</div>

  <div>
    <div style="background: hsl(var(--background)); border-radius: 18px; margin: 16px 0; display: inline-block;">
  <svg width="350" height="320" viewBox="0 0 350 320">
    <!-- рёбра графа -->
    <g stroke="hsl(var(--foreground))" stroke-width="3" stroke-linecap="round">
      <line x1="300" y1="150" x2="240" y2="50"  /> <!-- A-D -->
      <line x1="240" y1="50"  x2="140" y2="60"  /> <!-- D-B -->
      <line x1="140" y1="60"  x2="60"  y2="150" /> <!-- B-F -->
      <line x1="60"  y1="150" x2="100" y2="230" /> <!-- F-G -->
      <line x1="100" y1="230" x2="180" y2="270" /> <!-- G-C -->
      <line x1="180" y1="270" x2="270" y2="210" /> <!-- C-E -->
      <line x1="270" y1="210" x2="300" y2="150" /> <!-- E-A -->
      <line x1="60"  y1="150" x2="240" y2="50"  /> <!-- F-D -->
      <line x1="100" y1="230" x2="270" y2="210" /> <!-- G-E -->
    </g>
    <!-- вершины -->
    <g fill="hsl(var(--foreground))" stroke="hsl(var(--foreground))">
      <circle cx="300" cy="150" r="6"/>
      <circle cx="240" cy="50"  r="6"/>
      <circle cx="140" cy="60"  r="6"/>
      <circle cx="60"  cy="150" r="6"/>
      <circle cx="100" cy="230" r="6"/>
      <circle cx="180" cy="270" r="6"/>
      <circle cx="270" cy="210" r="6"/>
    </g>
    <!-- подписи -->
    <g fill="hsl(var(--foreground))">
      <text x="308" y="155">A</text>
      <text x="242" y="40">D</text>
      <text x="127" y="55">B</text>
      <text x="38"  y="155">F</text>
      <text x="79"  y="238">G</text>
      <text x="175" y="292">C</text>
      <text x="278" y="218">E</text>
    </g>
  </svg>
</div>

  </div>
</div>
`;

export default function DemoPage() {
  return (
    <div className="prose max-w-2xl m-auto p-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {demoText}
      </ReactMarkdown>
    </div>
  );
}
