import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";


export const GaugeChartComponent = () => {
  return (
      <Gauge
        value={75}
        startAngle={-110}
        endAngle={110}
        sx={{
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 25,
            transform: "translate(0px, 0px)",
          },
        }}
        text={({ value, valueMax }) => `${value} / ${valueMax}`}
        width={500}
        height={300}
      />
  );
};
