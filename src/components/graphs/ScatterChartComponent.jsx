import { ScatterChart } from "@mui/x-charts";
import React from "react";

export const ScatterChartComponent = () => {
  const data = [
    { id: 1, x1: 10, y1: 20, y2: 25 },
    { id: 2, x1: 20, y1: 30, y2: 35 },
    { id: 3, x1: 30, y1: 25, y2: 30 },
    { id: 4, x1: 40, y1: 35, y2: 40 },
    { id: 5, x1: 50, y1: 40, y2: 45 },
    { id: 6, x1: 60, y1: 50, y2: 55 },
  ];

  return (
    <div>
      <ScatterChart

        series={[
          {
            label: "Series A",
            data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          },
          {
            label: "Series B",
            data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
            color: "#ffaaaa",
          },
        ]}
        width={500}
        height={300}
      />
    </div>
  );
};
