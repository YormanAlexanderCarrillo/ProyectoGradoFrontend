import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const SparkLineComponent = ({ data }) => {
  if (!data) {
    <div>
      <h2>Grafica</h2>
    </div>;
  }

  const formatDateTime = (datetime) => {
    return datetime.split(" ")[1].substring(0, 5);
  };

  return (
    <div className=" w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="datetime" tickFormatter={formatDateTime} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            labelFormatter={(value) => `Hora: ${formatDateTime(value)}`}
            formatter={(value, name) => {
              switch (name) {
                case "humedad_ambiente":
                  return [`${value}%`, "Humedad"];
                case "temperatura_sensor":
                  return [`${value}°C`, "Temperatura"];
                case "nivel_bateria":
                  return [`${value}%`, "Batería"];
                case "predicted_gas_level":
                  return [`${value}`, "Nivel Gas"];
                default:
                  return [value, name];
              }
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="humedad_ambiente"
            stroke="#8884d8"
            name="Humedad"
            strokeWidth={3}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperatura_sensor"
            stroke="#82ca9d"
            name="Temperatura"
            strokeWidth={3}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="nivel_bateria"
            stroke="#ffc658"
            name="Batería"
            strokeWidth={3}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="predicted_gas_level"
            stroke="#ff7300"
            name="Nivel Gas"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
