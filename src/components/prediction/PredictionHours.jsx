import React, { useState } from "react";
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import { AlarmClock } from "lucide-react";
import axios from "axios";
import { SparkLineComponent } from "../graphs/SparkLineComponent";

export const PredictionHours = ({ pathAPI, title }) => {
  const URLAPI = process.env.REACT_APP_URLAPI;
  const [hour, setHour] = useState(5);
  const [prediction, setPrediction] = useState({});

  const getPredictionHour = async (event) => {
    event.preventDefault();
    try {
      const data = {
        hours: Number(hour),
      };
      console.log(data)
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
          <div className="grid grid-cols-1 grid-rows-1 gap-4 mb-2">
            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
              <AlarmClock className="w-6 h-6 text-blue-500" />
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
