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

export const BatteryImpactAnalysis = ({ modelPath }) => {
  const [batteryData, setBatteryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const URLAPI = process.env.REACT_APP_URLAPI;
  //Impacto de la batería en el nivel de gas
  useEffect(() => {
    const fetchBatteryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URLAPI}/${modelPath}/analysis/battery-impact`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setBatteryData(data.battery_analysis);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching battery impact data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (modelPath) {
      fetchBatteryData();
    }
  }, [modelPath, URLAPI]);

  const prepareChartData = (data) => {
    if (!data || !data.battery_ranges) return [];
    
    return Object.entries(data.battery_ranges).map(([range, values]) => ({
      range,
      gasLevel: Number((values.gas_mean * 100).toFixed(2)),
      stdDev: Number((values.gas_std * 100).toFixed(2)),
      temperature: Number(values.temp_mean.toFixed(1)),
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

  if (error || !batteryData) {
    return (
      <div className="text-center text-red-500 p-4">
        {error || "No se pudieron cargar los datos de impacto de batería"}
      </div>
    );
  }

  const chartData = prepareChartData(batteryData);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex gap-3 justify-between">
          <div>
            <h3 className="text-lg font-bold">Correlación Nivel de Batería - Nivel de Gas</h3>
            <p className="text-sm text-gray-500">
              Coeficiente: {batteryData.correlation.toFixed(3)}
            </p>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded-lg">
            {batteryData.interpretation}
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            Este análisis muestra cómo el nivel de batería del dispositivo afecta 
            las mediciones de gas metano. Una correlación positiva fuerte indica que 
            a menor nivel de batería, menos precisas son las mediciones.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Nivel de Gas por Rango de Batería</h3>
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
                    `${value}${name === "gasLevel" || name === "stdDev" ? "%" : name === "temperature" ? "°C" : name === "humidity" ? "%" : ""}`,
                    name === "gasLevel" ? "Nivel de Gas" : 
                    name === "stdDev" ? "Desviación Estándar" : 
                    name === "temperature" ? "Temperatura" : 
                    name === "humidity" ? "Humedad" : name
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
          <h3 className="text-lg font-bold">Condiciones por Rango de Batería</h3>
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
                    `${value}${name === "temperature" ? "°C" : name === "humidity" ? "%" : ""}`,
                    name === "temperature" ? "Temperatura" : 
                    name === "humidity" ? "Humedad" : name
                  ]}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="temperature" 
                  name="Temperatura" 
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
          <h3 className="text-lg font-bold">Datos Detallados por Rango de Batería</h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rango de Batería
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
                    Temperatura
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
                    <td className="px-4 py-2 whitespace-nowrap">{item.temperature.toFixed(1)}°C</td>
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