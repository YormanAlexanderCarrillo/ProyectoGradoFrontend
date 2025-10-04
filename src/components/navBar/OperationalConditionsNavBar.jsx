import React from "react";
// import { OperationalConditionsDisplay } from "./OperationalConditionsDisplay";
import {OperationalConditionsDisplay } from "../operationals/OperationalConditionsDisplay";

export const OperationalConditionsNavBar = () => {
  return (
    <div className="flex w-full flex-col pt-1">
      <OperationalConditionsDisplay modelPath="regresion" />

    </div>
  );
};