import React from 'react';

export const AnalyticsChart = ({ data, color = "#8884d8" }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">No hay datos disponibles</div>;
  }

  const getStatValue = (name) => {
    const item = data.find(d => d.name === name);
    return item ? item.value : 0;
  };

  const min = getStatValue("Mínimo");
  const q1 = getStatValue("Q1 (25%)");
  const median = getStatValue("Mediana");
  const q3 = getStatValue("Q3 (75%)");
  const max = getStatValue("Máximo");
  const mean = getStatValue("Media");

  const range = max - min;
  const padding = range * 0.1; // 10% de padding
  const chartMin = min - padding;
  const chartMax = max + padding;
  const chartRange = chartMax - chartMin;

  // Función para convertir valor a posición X en el SVG (horizontal)
  const valueToX = (value) => {
    return 50 + ((value - chartMin) / chartRange) * 280; // 280 es el ancho útil (330-50)
  };

  // Dimensiones del box plot horizontal
  const boxHeight = 40;
  const centerY = 100;
  const topY = centerY - boxHeight / 2;
  const bottomY = centerY + boxHeight / 2;

  return (
    <div className="flex flex-col items-center w-full">
      <svg width="350" height="200" className="border rounded">
        {/* Líneas de referencia verticales */}
        <defs>
          <pattern id="grid" width="20" height="200" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 0 200 20 200 20 0 0 0" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="350" height="200" fill="url(#grid)" />

        {/* Bigote izquierdo (Min a Q1) */}
        <line
          x1={valueToX(min)}
          y1={centerY}
          x2={valueToX(q1)}
          y2={centerY}
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Línea del mínimo */}
        <line
          x1={valueToX(min)}
          y1={centerY - 15}
          x2={valueToX(min)}
          y2={centerY + 15}
          stroke={color}
          strokeWidth="2"
        />

        {/* Caja (Q1 a Q3) */}
        <rect
          x={valueToX(q1)}
          y={topY}
          width={valueToX(q3) - valueToX(q1)}
          height={boxHeight}
          fill={color}
          fillOpacity="0.3"
          stroke={color}
          strokeWidth="2"
        />

        {/* Línea de la mediana */}
        <line
          x1={valueToX(median)}
          y1={topY}
          x2={valueToX(median)}
          y2={bottomY}
          stroke={color}
          strokeWidth="3"
        />

        {/* Bigote derecho (Q3 a Max) */}
        <line
          x1={valueToX(q3)}
          y1={centerY}
          x2={valueToX(max)}
          y2={centerY}
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Línea del máximo */}
        <line
          x1={valueToX(max)}
          y1={centerY - 15}
          x2={valueToX(max)}
          y2={centerY + 15}
          stroke={color}
          strokeWidth="2"
        />

        {/* Punto de la media */}
        <circle
          cx={valueToX(mean)}
          cy={centerY}
          r="4"
          fill="white"
          stroke={color}
          strokeWidth="2"
        />

        {/* Etiquetas de valores adaptativas */}
        <text x={valueToX(min)} y="20" fontSize="9" fill="#666" textAnchor="middle">
          Min: {min.toFixed(1)}
        </text>
        <text x={valueToX(q1)} y="35" fontSize="9" fill="#666" textAnchor="middle">
          Q1: {q1.toFixed(1)}
        </text>
        <text x={valueToX(median)} y="20" fontSize="9" fill="#666" textAnchor="middle">
          Med: {median.toFixed(1)}
        </text>
        <text x={valueToX(q3)} y="35" fontSize="9" fill="#666" textAnchor="middle">
          Q3: {q3.toFixed(1)}
        </text>
        <text x={valueToX(max)} y="20" fontSize="9" fill="#666" textAnchor="middle">
          Max: {max.toFixed(1)}
        </text>
      </svg>
      
      {/* Leyenda */}
      <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-3 border-2" 
            style={{ backgroundColor: `${color}30`, borderColor: color }}
          ></div>
          <span>Rango intercuartílico (Q1-Q3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-0.5" 
            style={{ backgroundColor: color }}
          ></div>
          <span>Mediana</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full border-2 bg-white" 
            style={{ borderColor: color }}
          ></div>
          <span>Media ({mean.toFixed(1)})</span>
        </div>
      </div>
    </div>
  );
};