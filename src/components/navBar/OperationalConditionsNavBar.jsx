import { Tab, Tabs } from "@nextui-org/react";
import { BarChart, LineChart, ActivitySquare, TrendingUp } from "lucide-react";
import React from "react";
// import { OperationalConditionsDisplay } from "./OperationalConditionsDisplay";
import {OperationalConditionsDisplay } from "../operationals/OperationalConditionsDisplay";

export const OperationalConditionsNavBar = () => {
  return (
    <div className="flex w-full flex-col pt-1">
      <Tabs
        aria-label="Modelos"
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
          <OperationalConditionsDisplay modelPath="regresion" />
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
          <OperationalConditionsDisplay modelPath="random_forest" />
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
          <OperationalConditionsDisplay modelPath="gradient_boosting" />
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
          <OperationalConditionsDisplay modelPath="prophet" />
        </Tab>
      </Tabs>
    </div>
  );
};