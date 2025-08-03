// Componente para visualización de comparaciones de modelos
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Card, CardBody, CardHeader, Spinner, Tabs, Tab } from "@nextui-org/react";
import { BarChart3, Activity, Award } from "lucide-react";

export const ModelsComparisonChart = () => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const URLAPI = process.env.REACT_APP_URLAPI;

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URLAPI}/comparative_models/models_comparison`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setComparisonData(data.comparison_results);
        } else {
          throw new Error(data.error || 'Error desconocido');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [URLAPI]);

  // Función para formatear nombres de modelos
  const formatModelName = (modelName) => {
    return modelName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Función para determinar color según rendimiento
  const getPerformanceColor = (value, metric) => {
    if (metric === 'r2' || metric === 'robustness') {
      // Para R² y robustez, valores más altos son mejores
      if (value >= 0.8) return "#22c55e"; // Verde
      if (value >= 0.6) return "#f59e0b"; // Amarillo
      return "#ef4444"; // Rojo
    } else {
      // Para MSE y MAE, valores más bajos son mejores
      if (value <= 0.01) return "#22c55e"; // Verde
      if (value <= 0.05) return "#f59e0b"; // Amarillo
      return "#ef4444"; // Rojo
    }
  };

  // Tooltip personalizado para gráficos
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-medium text-gray-800">{`Modelo: ${label}`}</p>
          <p className="text-sm text-blue-600">{data.label}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error cargando datos de comparación: {error}
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="text-gray-500 text-center p-4">
        No hay datos de comparación disponibles
      </div>
    );
  }

  // Preparar datos para el gráfico radar
  const radarData = Object.keys(comparisonData.models_performance).map(modelName => {
    const modelData = comparisonData.models_performance[modelName];
    if (modelData.error) return null;
    
    return {
      model: formatModelName(modelName),
      mse: Math.max(0, 1 - (modelData.mse * 10)), // Invertir para que más alto sea mejor
      mae: Math.max(0, 1 - (modelData.mae * 10)), // Invertir para que más alto sea mejor
      r2: Math.max(0, modelData.r2),
      robustness: Math.max(0, modelData.robustness_score)
    };
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Tarjeta de resumen */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Mejores Modelos por Métrica</h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Mejor MSE</p>
              <p className="font-semibold text-green-600">
                {formatModelName(comparisonData.summary_metrics?.best_mse_model || 'N/A')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Mejor MAE</p>
              <p className="font-semibold text-blue-600">
                {formatModelName(comparisonData.summary_metrics?.best_mae_model || 'N/A')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Mejor R²</p>
              <p className="font-semibold text-purple-600">
                {formatModelName(comparisonData.summary_metrics?.best_r2_model || 'N/A')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Más Robusto</p>
              <p className="font-semibold text-orange-600">
                {formatModelName(comparisonData.summary_metrics?.best_robustness_model || 'N/A')}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Gráficos de comparación */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Comparación de Métricas</h3>
          </div>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="Métricas de comparación" className="w-full">
            {/* Pestaña MSE */}
            <Tab key="mse" title="Error Cuadrático Medio (MSE)">
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.chart_data.mse_comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#3b82f6"
                      name="MSE"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Tab>

            {/* Pestaña MAE */}
            <Tab key="mae" title="Error Absoluto Medio (MAE)">
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.chart_data.mae_comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#10b981"
                      name="MAE"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Tab>

            {/* Pestaña R² */}
            <Tab key="r2" title="Coeficiente de Determinación (R²)">
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.chart_data.r2_comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#8b5cf6"
                      name="R²"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Tab>

            {/* Pestaña Robustez */}
            <Tab key="robustness" title="Robustez ante Datos Anómalos">
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.chart_data.robustness_comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#f59e0b"
                      name="Robustez"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Tab>

            {/* Pestaña Radar */}
            <Tab key="radar" title="Comparación General">
              <div className="h-96 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="model" tick={{ fontSize: 15 }} />
                    <PolarRadiusAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                    <Radar
                      dataKey="mse"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                      name="MSE (Invertido)"
                    />
                    <Radar
                      dataKey="mae"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                      name="MAE (Invertido)"
                    />
                    <Radar
                      dataKey="r2"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.1}
                      name="R²"
                    />
                    <Radar
                      dataKey="robustness"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.1}
                      name="Robustez"
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Información del Conjunto de Prueba</h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total de muestras:</span>
              <span className="ml-2 font-medium">{comparisonData.test_data_info?.total_samples}</span>
            </div>
            <div>
              <span className="text-gray-600">Muestras de entrenamiento:</span>
              <span className="ml-2 font-medium">{comparisonData.test_data_info?.train_samples}</span>
            </div>
            <div>
              <span className="text-gray-600">Muestras de prueba:</span>
              <span className="ml-2 font-medium">{comparisonData.test_data_info?.test_samples}</span>
            </div>
            <div>
              <span className="text-gray-600">Características:</span>
              <span className="ml-2 font-medium">{comparisonData.test_data_info?.features?.length}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

