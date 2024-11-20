import { Tab, Tabs } from "@nextui-org/react";
import { CircleArrowOutUpLeft, TrendingUpDown } from "lucide-react";
import React from "react";
import PredictionDisplay from "../prediction/PredictionDisplay";

export const PredictionNavBar = () => {
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
              <CircleArrowOutUpLeft />
              <span>Analisis predictivo</span>
            </div>
          }
        >
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            <div>
              <PredictionDisplay pathAPI="regresion" title="regresion" />
            </div>
            <div>
              <PredictionDisplay
                pathAPI="random_forest"
                title="random_forest"
              />
            </div>
            <div>
              <PredictionDisplay
                pathAPI="gradient_boosting"
                title="grandient_boosting"
              />
            </div>
            <div>
              <PredictionDisplay pathAPI="otro" title="otro" />
            </div>
          </div>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <TrendingUpDown />
              <span>Analisis Predictivo Horas</span>
            </div>
          }
        >
            
        </Tab>
      </Tabs>
    </div>
  );
};
