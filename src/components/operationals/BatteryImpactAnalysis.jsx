import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList 
} from "recharts";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
// import { Outliers } from "../predictError/Outliers";

const OutliersLazy = lazy(() => 
  import('../predictError/Outliers').then(module => ({ 
    default: module.Outliers 
  }))
);

// ===== COMPONENTE DE LOADING PERSONALIZADO =====
const OutliersLoader = ({ delay = 0 }) => {
  const [showLoader, setShowLoader] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShowLoader(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!showLoader) return null;

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <h3 className="text-lg font-bold">Análisis de Dispersión</h3>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <Spinner color="primary" size="lg" />
          <div className="text-center">
            <p className="text-lg text-gray-600">Cargando visualización de datos...</p>
            <p className="text-sm text-gray-400">
              Procesando miles de puntos de datos en segundo plano
            </p>
          </div>
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// ===== WRAPPER CON CARGA ASÍNCRONA =====
export const AsyncOutliers = ({ 
  loadDelay = 1000,  // Delay antes de empezar a cargar
  priority = "low"  // Prioridad de carga
}) => {
  const [startLoading, setStartLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Esperar a que otros componentes se carguen primero
    const timer = setTimeout(() => {
      setStartLoading(true);
    }, loadDelay);

    return () => clearTimeout(timer);
  }, [loadDelay]);

  // Intersection Observer para cargar solo cuando sea visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Empezar a cargar 100px antes de ser visible
      }
    );

    const element = document.getElementById('outliers-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Solo cargar cuando sea visible Y haya pasado el delay
  const shouldLoad = startLoading && isVisible;

  return (
    <div id="outliers-container" className="col-span-1 lg:col-span-2">
      {shouldLoad ? (
        <Suspense fallback={<OutliersLoader />}>
          <OutliersLazy />
        </Suspense>
      ) : (
        <OutliersLoader delay={loadDelay} />
      )}
    </div>
  );
};

export const BatteryImpactAnalysis = ({ modelPath }) => {
  const [batteryData, setBatteryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainContentLoaded, setMainContentLoaded] = useState(false);
  
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
      gasLevel: Number((values.gas_mean ).toFixed(5)),
      stdDev: Number((values.gas_std ).toFixed(5)),
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
            {/* Este análisis muestra cómo el nivel de batería del dispositivo afecta 
            las mediciones de gas metano. Una correlación positiva fuerte indica que 
            a menor nivel de batería, menos precisas son las mediciones. */}
          </p>
        </CardBody>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-bold">Nivel de Gas por Rango de Batería</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis 
                  domain={['auto', 'auto']}
                  label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
                />
                <Legend />
                <Bar 
                  dataKey="gasLevel" 
                  name="Nivel de Gas" 
                  fill="#8884d8"
                >
                  <LabelList 
                    dataKey="gasLevel" 
                    position="top" 
                    formatter={(value) => `${value.toFixed(5)}%`}
                    style={{ fontSize: '12px', fill: '#333' }}
                  />
                </Bar>
                <Bar 
                  dataKey="stdDev" 
                  name="Error de medición" 
                  fill="#82ca9d"
                >
                  <LabelList 
                    dataKey="stdDev" 
                    position="top" 
                    formatter={(value) => `${value.toFixed(4)}%`}
                    style={{ fontSize: '12px', fill: '#333' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* <Card className="col-span-1 lg:col-span-2">
        <Outliers/>
      </Card> */}

      <AsyncOutliers 
        loadDelay={mainContentLoaded ? 1000 : 2000} 
        priority="low"
      />

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
                    Error de medición
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
                    <td className="px-4 py-2 whitespace-nowrap">{item.gasLevel.toFixed(4)}%</td>
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