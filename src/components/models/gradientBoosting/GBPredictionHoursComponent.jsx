import { Card, CardBody, CardHeader } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import { PredictionHours } from "../../prediction/PredictionHours";

export const GBPredictionHoursComponent = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <div>
        <PredictionHours
          pathAPI="regresion"
          title="regresion"
        />
      </div>
      <div>
        <PredictionHours
          pathAPI="random_forest"
          title="random_forest"
        />
      </div>
      <div>
        <PredictionHours
          pathAPI="gradient_boosting"
          title="gradient_boosting"
        />
      </div>
      <div>
        <PredictionHours
          pathAPI="otro"
          title="otro"
        />
      </div>
    </div>
  );
};
