import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from "recharts";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";

export const TemporalDegradationAnalysis = ({ modelPath }) => {
  const [temporalData, setTemporalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const URLAPI = process.env.REACT_APP_URLAPI;

  useEffect(() => {
    const fetchTemporalData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URLAPI}/${modelPath}/analysis/temporal_analysis`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setTemporalData(data.temporal_analysis);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching temporal degradation data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (modelPath) {
      fetchTemporalData();
    }
  }, [modelPath, URLAPI]);

  const prepareDegradationData = (data) => {
    if (!data || !data.days || !data.mean) return [];
    
    return data.days.map((day, index) => ({
      day: (day * 24).toFixed(2), // Convertir a horas
      meanGas: data.mean[index] ? data.mean[index] / 10000 : null, // Convertir a porcentaje
      stdDev: data.std_dev && data.std_dev[index] ? data.std_dev[index] / 10000 : null,
      count: data.count && data.count[index] ? data.count[index] : null,
      trend: data.degradation_analysis && 
             data.degradation_analysis.trend_values && 
             index < data.degradation_analysis.trend_values.length ? 
             data.degradation_analysis.trend_values[index] / 10000 : null
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  if (error || !temporalData) {
    return (
      <div className="text-center text-red-500 p-4">
        {error || "No se pudieron cargar los datos de degradación temporal"}
      </div>
    );
  }

  const chartData = prepareDegradationData(temporalData);
  
  // Calcular el valor promedio para la línea de referencia
  const meanValue = temporalData.mean && temporalData.mean.length > 0 
    ? temporalData.mean.reduce((sum, val) => sum + (val || 0), 0) / 
      temporalData.mean.filter(val => val !== undefined && val !== null).length / 10000
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex gap-3 justify-between">
          <div>
            <h3 className="text-lg font-bold">Análisis de Degradación Temporal</h3>
            <p className="text-sm text-gray-500">
              Efecto del tiempo desde calibración
            </p>
          </div>
          {temporalData.degradation_analysis && (
            <div className="bg-blue-100 px-3 py-1 rounded-lg">
              Tasa de degradación: {temporalData.degradation_analysis.degradation_rate_per_day?.toFixed(2)} ppm/día
            </div>
          )}
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            {/* Este análisis muestra cómo el tiempo transcurrido desde la última calibración 
            afecta la precisión de las mediciones. Una tendencia decreciente indica que 
            la precisión del sensor disminuye con el tiempo. */}
          </p>
        </CardBody>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-bold">Evolución del Nivel de Gas con el Tiempo</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  label={{ value: 'Horas desde calibración', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Nivel de Gas (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value ? `${(value ).toFixed(3)}%` : "N/A",
                    name === "meanGas" ? "Nivel de Gas" : 
                    name === "trend" ? "Tendencia" : name
                  ]}
                  labelFormatter={(value) => `Tiempo: ${value} horas`}
                />
                <Legend />
                {meanValue !== null && (
                  <ReferenceLine 
                    y={meanValue} 
                    stroke="red" 
                    strokeDasharray="3 3" 
                    label={{ value: "Media", position: "right" }}
                  />
                )}
                <Line 
                  type="monotone" 
                  dataKey="meanGas" 
                  name="Nivel de Gas" 
                  stroke="#8884d8" 
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="trend" 
                  name="Tendencia" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Variabilidad de Mediciones</h3>
        </CardHeader>
        <CardBody>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  label={{ value: 'Horas desde calibración', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Desviación Estándar (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value ? `${(value * 100).toFixed(4)}%` : "N/A",
                    "Desviación Estándar"
                  ]}
                  labelFormatter={(value) => `Tiempo: ${value} horas`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="stdDev" 
                  name="Desviación Estándar" 
                  stroke="#82ca9d" 
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card> */}

      {/* <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Cantidad de Muestras</h3>
        </CardHeader>
        <CardBody>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  label={{ value: 'Horas desde calibración', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Número de muestras', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value || "N/A",
                    "Número de muestras"
                  ]}
                  labelFormatter={(value) => `Tiempo: ${value} horas`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Número de muestras" 
                  fill="#8884d8" 
                  stroke="#8884d8" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card> */}
    </div>
  );
};