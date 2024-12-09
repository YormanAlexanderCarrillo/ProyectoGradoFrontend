import React, { useState } from "react";
import {
  FileText,
  Download,
  Filter,
  BarChart2,
  PieChart,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export const Reports = () => {
  const [reportType, setReportType] = useState("Reporte");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const sampleReportData = {
    summary: {
      totalSensorReadings: 5624,
      anomaliesDetected: 237,
      avgBatteryLevel: 68.5,
      avgTemperature: 32.4,
    },
    gases: {
      methane: {
        avgConcentration: 0.8,
        peakConcentration: 1.5,
        anomalies: 42,
      },
      carbonDioxide: {
        avgConcentration: 1.2,
        peakConcentration: 2.3,
        anomalies: 35,
      },
      carbonMonoxide: {
        avgConcentration: 20.5,
        peakConcentration: 45.6,
        anomalies: 28,
      },
    },
    calibration: {
      sensorsCalibrated: 18,
      overdueSensors: 6,
      avgTimeSinceLastCalibration: 87,
    },
  };

  const handleExportReport = () => {
    console.log("Exportando reporte", reportType);
    alert("Reporte exportado exitosamente");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FileText className="mr-4 text-blue-600" size={40} />
            <h1 className="text-3xl font-bold text-blue-800">
              Reportes de Sistema de Monitoreo Minero
            </h1>
          </div>
          <button
            onClick={handleExportReport}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
          >
            <Download className="mr-2" size={20} /> Exportar Reporte
          </button>
        </header>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="mr-3 text-gray-500" />
            <h2 className="text-xl font-semibold">Filtros de Reporte</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Reporte
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="summary">Resumen General</option>
                <option value="gases">Análisis de Gases</option>
                <option value="calibration">Calibración de Sensores</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Inicial
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    start: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Final
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    end: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {reportType === "summary" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BarChart2 className="mr-3 text-blue-500" />
              <h2 className="text-xl font-semibold">Resumen General</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Lecturas de Sensores</h3>
                <p>Total: {sampleReportData.summary.totalSensorReadings}</p>
                <p>Anomalías: {sampleReportData.summary.anomaliesDetected}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Condiciones Operativas</h3>
                <p>
                  Nivel Batería Promedio:{" "}
                  {sampleReportData.summary.avgBatteryLevel}%
                </p>
                <p>
                  Temperatura Promedio:{" "}
                  {sampleReportData.summary.avgTemperature}°C
                </p>
              </div>
            </div>
          </div>
        )}

        {reportType === "gases" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <PieChart className="mr-3 text-red-500" />
              <h2 className="text-xl font-semibold">Análisis de Gases</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(sampleReportData.gases).map(([gas, data]) => (
                <div key={gas} className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-semibold mb-2 capitalize">{gas}</h3>
                  <p>Concentración Promedio: {data.avgConcentration}</p>
                  <p>Concentración Pico: {data.peakConcentration}</p>
                  <p>Anomalías: {data.anomalies}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === "calibration" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="mr-3 text-green-500" />
              <h2 className="text-xl font-semibold">Calibración de Sensores</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Estado de Calibración</h3>
                <p>
                  Sensores Calibrados:{" "}
                  {sampleReportData.calibration.sensorsCalibrated}
                </p>
                <p>
                  Sensores Pendientes:{" "}
                  {sampleReportData.calibration.overdueSensors}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Tiempo de Calibración</h3>
                <p>
                  Promedio Días desde Última Calibración:{" "}
                  {sampleReportData.calibration.avgTimeSinceLastCalibration}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 flex items-center">
          <AlertTriangle className="mr-3 text-yellow-500" />
          <p className="text-yellow-700">
            Nota: Los reportes se basan en datos simulados.
          </p>
        </div>
      </div>
    </div>
  );
};
