import React from "react";
import { LineChartComponent } from "../components/graphs/LineChartComponent";
import { ScatterChartComponent } from "../components/graphs/ScatterChartComponent";
import { GaugeChartComponent } from "../components/graphs/GaugeChartComponent";
import { SparkLineComponent } from "../components/graphs/SparkLineComponent";

export const DashboardPage = () => {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-4 p-3">
      <div className="col-span-4 flex flex-col items-center border-2 border-black">
        <h3>Estado general de sistema</h3>
        <SparkLineComponent/>
      </div>
      <div className="col-span-2 row-start-2 flex flex-col items-center border-2 border-black">
        <h3 className="mb-2">Nivel de bateria</h3>
        <GaugeChartComponent />
      </div>
      <div className="col-span-2 col-start-3 row-start-2 flex flex-col items-center border-2 border-black">
        <h5 className="mb-2">Temperatura Interna</h5>
        <LineChartComponent />
      </div>
      <div className="col-span-2 row-start-3 flex flex-col items-center border-2 border-black">
        <h3 className="mb-2">Nivel de Gas</h3>
        <ScatterChartComponent />
      </div>
      <div className="col-span-2 col-start-3 row-start-3 flex flex-col items-center border-2 border-black">
        <h5 className="mb-2">Humedad ambiente</h5>
        <LineChartComponent />
      </div>

      <div className="col-span-4 row-start-4 flex flex-col items-center border-2 border-black">
        <h5>Analisis de datos</h5>
        <SparkLineComponent/>
      </div>
    </div>
  );
};
