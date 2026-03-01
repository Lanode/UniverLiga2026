import React from "react";
import { Card } from "./ui/card";

type Review = {
  label: string;
  value: number;
};

type ReviewChartProps = {
  /** Массив данных для построения столбчатой диаграммы */
    data: Review[];
    header: string;
};

export default function ReviewChart({ data, header }: ReviewChartProps) {
  const max = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--general-border)]">
        <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
          {/* …ваш SVG … */}
        </svg>
        <span className="text-xs text-[var(--general-muted-foreground)]">
          {header}
        </span>
      </div>

      {/* Chart area – фиксированная высота */}
      <div className="flex p-6 gap-4" style={{ height: 280 }}>
        {/* Y‑axis */}
        <div className="flex flex-col justify-between items-end text-xs text-[var(--general-muted-foreground)] shrink-0 w-8">
          {[100, 80, 60, 40, 20, 0].map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>

        {/* Grid + bars */}
        <div className="flex-1 relative" style={{ height: "100%" }}>
          {/* Horizontal grid */}
          {[100, 80, 60, 40, 20, 0].map((v) => (
            <div
              key={v}
              className="border-t border-[var(--unofficial-border-1)] w-full absolute"
              style={{ top: `${100 - v}%` }}
            />
          ))}

          {/* Bars */}
          <div className="flex h-full items-end justify-between mt-2">
            {data.map((d) => (
              <div key={d.label} className="flex flex-col items-center justify-end w-8" style={{height: "100%"}}>
                <div
                  className="bg-blue-500 rounded-t"
                  style={{
                    height: `${(d.value / max) * 100}%`,
                    minHeight: "4px", // гарантирует видимость при 0
                    width: '10px'
                  }}
                />
                <span className="mt-1 text-xs text-[var(--general-muted-foreground)]">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
