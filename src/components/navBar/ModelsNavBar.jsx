import { Tab, Tabs } from "@nextui-org/react";
import { ChartColumnIncreasing, ChartLine, ChartSpline } from "lucide-react";
import React from "react";
import { LinearRegresionComponent } from "../models/linearRegression/LinearRegresionComponent";
import { RandomForestComponent } from "../models/randomForest/RandomForestComponent";
import { GradientBoostingComponent } from "../models/gradientBoosting/GradientBoostingComponent";

export const ModelsNavBar = () => {
  return (
    <div className="flex w-full flex-col pt-1">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        radius="none"
        fullWidth={true}
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <ChartLine />
              <span>Regresion Lineal</span>
            </div>
          }
        >
          <LinearRegresionComponent />
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <ChartColumnIncreasing />
              <span>Random Forest</span>
            </div>
          }
        >
          <RandomForestComponent />
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <ChartSpline />
              <span>Gradient Boosting</span>
            </div>
          }
        >
          <GradientBoostingComponent />
        </Tab>
      </Tabs>
    </div>
  );
};
