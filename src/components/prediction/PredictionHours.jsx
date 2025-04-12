import React, { useState } from "react";
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import {
  AlarmClock,
  Activity,
  Battery,
  Clock,
  Thermometer,
} from "lucide-react";
import axios from "axios";
import { SparkLineComponent } from "../graphs/SparkLineComponent";

export const PredictionHours = ({ pathAPI, title }) => {
  const URLAPI = process.env.REACT_APP_URLAPI;
  const [hour, setHour] = useState(5);
  const [temperature, setTempetature] = useState(50);
  const [humedity, setHumedity] = useState(50);
  const [calibrationTime, setCalibrationTime] = useState(200);
  const [batteryLevel, setBatteryLevel] = useState(90);
  const [prediction, setPrediction] = useState({});

  const getPredictionHour = async (event) => {
    event.preventDefault();
    try {
      const data = {
        hours: Number(hour),
        temperatura: Number(temperature),
        humedad: Number(humedity),
        tiempo_calibracion: Number(calibrationTime),
        nivel_bateria: Number(batteryLevel),
      };
      console.log(data);
      axios
        .post(`${URLAPI}/${pathAPI}/predict/prediction_future`, data)
        .then((res) => {
          setPrediction(res.data.prediction.predictions);
          console.log(res.data.prediction.predictions);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold"> predicion por hora: {title}</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={getPredictionHour}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
              <Thermometer className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Horas</div>
                <Input
                  isRequired
                  id="hour"
                  label="Horas"
                  size="sm"
                  className="font-semibold"
                  type="number"
                  variant="bordered"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                />
              </div>
            </div>
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

        <div className="h-full w-full pt-5">
          <SparkLineComponent data={prediction} />
        </div>
      </CardBody>
    </Card>
  );
};
