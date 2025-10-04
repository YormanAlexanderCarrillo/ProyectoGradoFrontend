// components/navBar/ErrorPredictNavBar.jsx
import { Tab, Tabs } from "@nextui-org/react";
import { BarChart, LineChart, ActivitySquare, TrendingUp } from "lucide-react";
import React from "react";
import { ErrorPredict } from "../predictError/ErrorPredict";

export const ErrorPredictNavBar = () => {
  return (
    <div className="flex w-full flex-col pt-1">
      <Tabs
        aria-label="Modelos de Predicción de Errores"
        color="primary"
        variant="bordered"
        radius="none"
        fullWidth={true}
      >
        <Tab
          key="regresion"
          title={
            <div className="flex items-center space-x-2">
              <LineChart size={20} />
              <span>Regresión Lineal</span>
            </div>
          }
        >
          <ErrorPredict modelPath="regresion" />
        </Tab>
        <Tab
          key="random_forest"
          title={
            <div className="flex items-center space-x-2">
              <BarChart size={20} />
              <span>Random Forest</span>
            </div>
          }
        >
          <ErrorPredict modelPath="random_forest" />
        </Tab>
        <Tab
          key="gradient_boosting"
          title={
            <div className="flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Gradient Boosting</span>
            </div>
          }
        >
          <ErrorPredict modelPath="gradient_boosting" />
        </Tab>
        <Tab
          key="prophet"
          title={
            <div className="flex items-center space-x-2">
              <ActivitySquare size={20} />
              <span>Prophet</span>
            </div>
          }
        >
          <ErrorPredict modelPath="prophet" />
        </Tab>
      </Tabs>
    </div>
  );
};