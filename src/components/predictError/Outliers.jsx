import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ===== CACHE GLOBAL SINGLETON =====
let globalBatteryGasData = null;
let isDataLoaded = false;
let loadingPromise = null;
let subscribers = new Set();

// Función para suscribirse a cambios de estado
const subscribe = (callback) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

// Notificar a todos los componentes suscritos
const notifySubscribers = (data) => {
  subscribers.forEach(callback => callback(data));
};

// Función principal para obtener datos (singleton pattern)
const getBatteryGasData = async () => {
  // Si ya tenemos los datos, devolverlos inmediatamente
  if (isDataLoaded && globalBatteryGasData) {
    return { data: globalBatteryGasData, fromCache: true };
  }

  // Si ya hay una petición en curso, esperamos a que termine
  if (loadingPromise) {
    return loadingPromise;
  }

  console.log('🔄 Cargando datos desde API (solo una vez)...');
  
  // Crear nueva petición
  loadingPromise = fetch('http://127.0.0.1:5000/regresion/data/battery-gas')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      globalBatteryGasData = data;
      isDataLoaded = true;
      loadingPromise = null;
      
      // Notificar a todos los componentes
      notifySubscribers({ data, fromCache: false });
      
      console.log('✅ Datos cargados y almacenados en cache global');
      return { data, fromCache: false };
    })
    .catch(error => {
      loadingPromise = null;
      console.error('❌ Error cargando datos:', error);
      throw error;
    });

  return loadingPromise;
};

// Función para limpiar cache (útil para development)
const clearCache = () => {
  globalBatteryGasData = null;
  isDataLoaded = false;
  loadingPromise = null;
  console.log('🧹 Cache limpiado');
};

// Hook personalizado para usar los datos
const useBatteryGasData = () => {
  const [state, setState] = useState({
    data: globalBatteryGasData,
    loading: !isDataLoaded,
    error: null,
    fromCache: false
  });

  useEffect(() => {
    // Suscribirse a actualizaciones
    const unsubscribe = subscribe((result) => {
      setState(prev => ({
        ...prev,
        data: result.data,
        loading: false,
        fromCache: result.fromCache
      }));
    });

    // Si ya tenemos datos, actualizar estado inmediatamente
    if (isDataLoaded && globalBatteryGasData) {
      setState(prev => ({
        ...prev,
        data: globalBatteryGasData,
        loading: false,
        fromCache: true
      }));
      return unsubscribe;
    }

    // Cargar datos si no los tenemos
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const result = await getBatteryGasData();
        setState(prev => ({
          ...prev,
          data: result.data,
          loading: false,
          error: null,
          fromCache: result.fromCache
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    loadData();
    return unsubscribe;
  }, []);

  return state;
};

// ===== COMPONENTE PRINCIPAL =====
export const Outliers = React.memo(() => {
  const { data: batteryGasData, loading, error, fromCache } = useBatteryGasData();

  // Función para determinar el color del punto basado en el nivel de batería
  const getBatteryColor = React.useCallback((batteryLevel) => {
    if (batteryLevel <= 20) return '#ef4444'; // Rojo - Crítico
    if (batteryLevel <= 40) return '#f97316'; // Naranja - Bajo
    if (batteryLevel <= 70) return '#eab308'; // Amarillo - Medio
    return '#22c55e'; // Verde - Alto
  }, []);

  // Función para categorizar el nivel de batería
  const getBatteryCategory = React.useCallback((batteryLevel) => {
    if (batteryLevel <= 20) return 'Crítico (0-20%)';
    if (batteryLevel <= 40) return 'Bajo (20-40%)';
    if (batteryLevel <= 70) return 'Medio (40-70%)';
    return 'Alto (70-100%)';
  }, []);

  // Tooltip personalizado
  const CustomTooltip = React.useCallback(({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Muestra #${data.index}`}</p>
          <p className="text-blue-600">{`Nivel de Batería: ${data.battery_level.toFixed(1)}%`}</p>
          <p className="text-orange-600">{`Nivel de Gas: ${data.gas_level.toFixed(1)} ppm`}</p>
          <p className="text-gray-600 text-sm">{`Categoría: ${getBatteryCategory(data.battery_level)}`}</p>
        </div>
      );
    }
    return null;
  }, [getBatteryCategory]);

  // Memoizar estadísticas por categoría
  const categoryStats = React.useMemo(() => {
    if (!batteryGasData?.data) return [];
    
    const categories = {
      'Crítico (0-20%)': [],
      'Bajo (20-40%)': [],
      'Medio (40-70%)': [],
      'Alto (70-100%)': []
    };

    batteryGasData.data.forEach(point => {
      const category = getBatteryCategory(point.battery_level);
      categories[category].push(point);
    });

    return Object.entries(categories).map(([category, points]) => ({
      category,
      count: points.length,
      percentage: ((points.length / batteryGasData.data.length) * 100).toFixed(1),
      avgGas: points.length > 0 ? (points.reduce((sum, p) => sum + p.gas_level, 0) / points.length).toFixed(1) : 0,
      avgBattery: points.length > 0 ? (points.reduce((sum, p) => sum + p.battery_level, 0) / points.length).toFixed(1) : 0,
      color: points.length > 0 ? getBatteryColor(points[0].battery_level) : '#gray'
    }));
  }, [batteryGasData, getBatteryCategory, getBatteryColor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-600">
          {fromCache ? 'Renderizando desde caché...' : 'Cargando datos de batería y gas...'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <div className="flex items-center">
          <div className="text-red-500 mr-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 font-medium">Error al cargar los datos</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              onClick={() => {
                clearCache();
                window.location.reload();
              }}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!batteryGasData?.data || batteryGasData.data.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 m-4 text-center">
        <h3 className="text-gray-600 font-medium text-lg">No se encontraron datos</h3>
        <p className="text-gray-500 mt-2">No hay datos de batería y gas disponibles.</p>
      </div>
    );
  }

  const scatterData = batteryGasData.data;

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Relación entre Nivel de Batería y Nivel de Gas Metano
        </h2>
        <p className="text-gray-600">
          Análisis de <span className="font-semibold text-blue-600">{batteryGasData.total_records.toLocaleString()}</span> muestras del sensor
          {fromCache && <span className="ml-2 text-green-600 text-sm font-medium"></span>}
          {!fromCache && isDataLoaded && <span className="ml-2 text-blue-600 text-sm font-medium">🆕 Recién cargado</span>}
        </p>
      </div>

      {/* Estadísticas por categoría de batería */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {categoryStats.map((stat) => (
          <div key={stat.category} className="p-4 rounded-lg border bg-gray-50">
            <div className="flex items-center mb-2">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: stat.color }}
              ></div>
              <h3 className="font-semibold text-gray-800 text-sm">
                {stat.category}
              </h3>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-gray-700">
                {stat.count} muestras ({stat.percentage}%)
              </p>
              <p className="text-gray-600">
                Batería promedio: {stat.avgBattery}%
              </p>
              <p className="text-gray-600">
                Gas promedio: {stat.avgGas} ppm
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Información de rangos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Rango de Batería</h3>
          <p className="text-blue-700">
            <span className="font-mono">{batteryGasData.battery_range.min.toFixed(1)}%</span> - 
            <span className="font-mono"> {batteryGasData.battery_range.max.toFixed(1)}%</span>
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-2">Rango de Gas Metano</h3>
          <p className="text-orange-700">
            <span className="font-mono">{batteryGasData.gas_range.min.toFixed(1)} ppm</span> - 
            <span className="font-mono"> {batteryGasData.gas_range.max.toFixed(1)} ppm</span>
          </p>
        </div>
      </div>

      {/* Gráfica de dispersión */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Gráfica de Dispersión: Nivel de Batería vs Nivel de Gas Metano
        </h3>
        
        <ResponsiveContainer width="100%" height={600}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 80,
              left: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="battery_level" 
              domain={[0, 100]}
              name="Nivel de Batería (%)"
              label={{ 
                value: 'Nivel de Batería (%)', 
                position: 'insideBottom', 
                offset: -20,
                style: { textAnchor: 'middle' }
              }}
              stroke="#666"
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="number" 
              dataKey="gas_level" 
              name="Nivel de Gas (ppm)"
              label={{ 
                value: 'Nivel de Gas Metano (ppm)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
              stroke="#666"
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Scatter
              name="Datos del Sensor"
              data={scatterData}
              fill="#8884d8"
              fillOpacity={0.6}
              // stroke="#8884d8"
              // strokeWidth={1}
            >
              {scatterData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBatteryColor(entry.battery_level)}
                  fillOpacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Leyenda personalizada */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-700">Crítico (0-20%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm text-gray-700">Bajo (20-40%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-700">Medio (40-70%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-700">Alto (70-100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
});

Outliers.displayName = 'Outliers';

// Exportar función para desarrollo/debugging
export { clearCache };