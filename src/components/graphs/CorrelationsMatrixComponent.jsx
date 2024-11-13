import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

export const CorrelationMatrix = ({ data }) => {
  if (!data || !data.correlations || !data.correlations.correlations) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        Cargando datos ...
      </div>
    );
  }

  const correlations = data.correlations.correlations;

  return (
    <Card className="w-full">
      <CardHeader>
        <h1>Sensor Correlation Matrix</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {Object.keys(correlations).map((sensor) => (
                <TableCell key={sensor} className="font-medium">
                  {sensor}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(correlations).map(([sensor, values]) => (
              <TableRow key={sensor}>
                <TableCell className="font-medium">{sensor}</TableCell>
                {Object.values(values).map((value, index) => (
                  <TableCell
                    key={`${sensor}-${index}`}
                    className={`text-center ${
                      value === 1 ? "bg-green-400" : "bg-red-300"
                    }`}
                  >
                    {value.toFixed(3)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
