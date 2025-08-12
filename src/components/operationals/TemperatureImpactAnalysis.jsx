import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";

export const TemperatureImpactAnalysis = ({ modelPath }) => {
  const [temperatureData, setTemperatureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const URLAPI = process.env.REACT_APP_URLAPI;

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URLAPI}/${modelPath}/analysis/temperature_impact`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setTemperatureData(data.temperature_analysis);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching temperature impact data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (modelPath) {
      fetchTemperatureData();
    }
  }, [modelPath, URLAPI]);

  const prepareChartData = (data) => {
    if (!data || !data.temperature_ranges) return [];
    
    return Object.entries(data.temperature_ranges).map(([range, values]) => ({
      range,
      gasLevel: Number((values.gas_mean * 100).toFixed(2)),
      stdDev: Number((values.gas_std * 100).toFixed(2)),
      batteryLevel: Number(values.battery_mean.toFixed(1)),
      humidity: Number(values.humidity_mean.toFixed(1)),
      count: values.count
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  if (error || !temperatureData) {
    return (
      <div className="text-center text-red-500 p-4">
        {error || "No se pudieron cargar los datos de impacto de temperatura"}
      </div>
    );
  }

  const chartData = prepareChartData(temperatureData);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex gap-3 justify-between">
          <div>
            <h3 className="text-lg font-bold">Correlación Temperatura - Nivel de Gas</h3>
            <p className="text-sm text-gray-500">
              Coeficiente: {temperatureData.correlation.toFixed(3)}
            </p>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded-lg">
            {temperatureData.interpretation}
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            Este análisis muestra cómo la temperatura del sensor afecta las mediciones 
            de gas metano. La temperatura puede influir en la sensibilidad y precisión
            de los componentes electrónicos del sistema.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Nivel de Gas por Rango de Temperatura</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis 
                  domain={['auto', 'auto']}
                  label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name === "gasLevel" || name === "stdDev" ? "%" : ""}`,
                    name === "gasLevel" ? "Nivel de Gas" : 
                    name === "stdDev" ? "Desviación Estándar" : name
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="gasLevel" 
                  name="Nivel de Gas" 
                  fill="#8884d8" 
                />
                <Bar 
                  dataKey="stdDev" 
                  name="Desviación Estándar" 
                  fill="#82ca9d" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Condiciones por Rango de Temperatura</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name === "batteryLevel" ? "%" : name === "humidity" ? "%" : ""}`,
                    name === "batteryLevel" ? "Nivel de Batería" : 
                    name === "humidity" ? "Humedad" : name
                  ]}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="batteryLevel" 
                  name="Nivel de Batería" 
                  fill="#ff7300" 
                />
                <Bar 
                  yAxisId="right"
                  dataKey="humidity" 
                  name="Humedad" 
                  fill="#0088fe" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-bold">Distribución de Muestras</h3>
        </CardHeader>
        <CardBody>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis 
                  label={{ value: 'Número de muestras', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    "Número de muestras"
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  name="Número de muestras" 
                  fill="#8884d8" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-bold">Datos Detallados por Rango de Temperatura</h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rango de Temperatura
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Muestras
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel de Gas
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Desviación
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel de Batería
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Humedad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chartData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-2 whitespace-nowrap">{item.range}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.count}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.gasLevel.toFixed(3)}%</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.stdDev.toFixed(4)}%</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.batteryLevel.toFixed(1)}%</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.humidity.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};