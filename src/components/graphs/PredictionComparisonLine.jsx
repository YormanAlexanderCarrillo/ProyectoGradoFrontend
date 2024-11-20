import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button, Spinner } from "@nextui-org/react";

export const PredictionComparisonLine = ({ data, colorPredict, colorReal }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 100;

  if (!data || !data.prediction_data) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner size="md" color="success" />
      </div>
    );
  }

  const chartData = data.prediction_data.predicted_values.map(
    (pred, index) => ({
      index: index,
      Predicho: Number(pred.toFixed(3)),
      Real: Number(data.prediction_data.real_values[index].toFixed(3)),
    })
  );

 
  const totalPages = Math.ceil(chartData.length / itemsPerPage);

  
  const paginatedData = chartData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="w-full space-y-4">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={paginatedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Predicho"
              stroke={colorPredict}
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Real"
              stroke={colorReal}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="text-sm text-gray-600">
          Página {currentPage + 1} de {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            variant="outline"
          >
            Anterior
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            variant="outline"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};
