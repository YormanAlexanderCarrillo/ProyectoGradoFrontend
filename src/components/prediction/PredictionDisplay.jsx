import React, { useState } from "react";
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import { Activity, Battery, Clock, Thermometer } from "lucide-react";
import axios from "axios";

const PredictionDisplay = () => {
  const URLAPI = process.env.REACT_APP_URLAPI;
  const [temperature, setTempetature] = useState(50);
  const [humedity, setHumedity] = useState(50);
  const [calibrationTime, setCalibrationTime] = useState(200);
  const [batteryLevel, setBatteryLevel] = useState(90);
  const [prediction, setPrediction] = useState(0.0);

  const getPredictionColor = (value) => {
    if (value < 0.4) return "text-green-500";
    if (value < 0.7) return "text-yellow-500";
    return "text-red-500";
  };

  const getPrediction = async (event) => {
    event.preventDefault();
    try {
      const data = {
        temperatura: temperature,
        humedad: humedity,
        tiempo_calibracion: calibrationTime,
        nivel_bateria: batteryLevel,
      };
      axios
        .post(`${URLAPI}/regresion/predict`, data)
        .then((res) => {
          setPrediction(res.data.prediction);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const predictionToPercentage = (value) => Math.round(value * 100);

  const gaugeAngle = prediction * 180 - 90;

  return (
    <Card className="w-1/2 h-5/6" radius="none">
      <CardHeader>
        <h2 className="text-xl font-bold">Predicción de nivel de Gas</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={getPrediction}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
              <Thermometer className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Temperatura</div>
                <Input
                  isRequired
                  id="temperature"
                  label="Temperatura"
                  size="sm"
                  className="font-semibold"
                  type="number"
                  variant="bordered"
                  value={temperature}
                  onChange={(e) => setTempetature(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Humedad</div>
                <Input
                  isRequired
                  id="humedity"
                  label="Humedad"
                  size="sm"
                  className="font-semibold"
                  type="number"
                  variant="bordered"
                  value={humedity}
                  onChange={(e) => setHumedity(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Tiempo Calibración</div>
                <Input
                  isRequired
                  id="calibrationTime"
                  label="Tiempo Calibración"
                  size="sm"
                  className="font-semibold"
                  type="number"
                  variant="bordered"
                  value={calibrationTime}
                  onChange={(e) => setCalibrationTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
              <Battery className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Nivel Batería</div>
                <Input
                  isRequired
                  id="batteryLevel"
                  label="Nivel Batería"
                  size="sm"
                  className="font-semibold"
                  type="number"
                  variant="bordered"
                  value={batteryLevel}
                  onChange={(e) => setBatteryLevel(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button type="submit" color="success">
            Calcular Predicción
          </Button>
        </form>

        {/* Sección de predicción */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-24 mb-4">
            <div className="absolute w-full h-full border-t-[12px] rounded-t-full border-gray-200"></div>
            <div
              className="absolute w-full h-full border-t-[12px] rounded-t-full transition-all duration-1000"
              style={{
                borderColor:
                  prediction < 0.4
                    ? "#22c55e"
                    : prediction < 0.7
                    ? "#eab308"
                    : "#ef4444",
                transform: `rotate(${gaugeAngle}deg)`,
                transformOrigin: "bottom center",
              }}
            ></div>
          </div>

          <div
            className={`text-4xl font-bold mb-2 ${getPredictionColor(
              prediction
            )}`}
          >
            {predictionToPercentage(prediction)}%
          </div>

          <div className="text-gray-600 text-center mt-10">
            Nivel de Gas Predicho
          </div>

          <div className="flex justify-between w-full mt-10 px-4">
            <span className="text-green-500 font-medium">Bajo</span>
            <span className="text-yellow-500 font-medium">Medio</span>
            <span className="text-red-500 font-medium">Alto</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PredictionDisplay;
