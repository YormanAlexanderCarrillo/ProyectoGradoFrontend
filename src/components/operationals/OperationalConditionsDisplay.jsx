import React from "react";
import { BatteryImpactAnalysis } from "./BatteryImpactAnalysis";
import { TemperatureImpactAnalysis } from "./TemperatureImpactAnalysis";
import { TemporalDegradationAnalysis } from "./TemporalDegradationAnalysis";

export const OperationalConditionsDisplay = ({ modelPath }) => {
  return (
    <div className="w-full">
      {/* Sección de impacto de batería */}
      <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Impacto del Nivel de Batería</h2>
        <BatteryImpactAnalysis modelPath={modelPath} />
      </div>

      {/* Sección de impacto de temperatura */}
      <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Impacto de la Temperatura</h2>
        <TemperatureImpactAnalysis modelPath={modelPath} />
      </div>

      {/* Sección de degradación temporal */}
      <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Degradación Temporal</h2>
        <TemporalDegradationAnalysis modelPath={modelPath} />
      </div>
    </div>
  );
};