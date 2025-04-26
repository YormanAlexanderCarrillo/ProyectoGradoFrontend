import React from "react";
import { OperationalConditionsNavBar } from "../components/navBar/OperationalConditionsNavBar";


export const OperationalConditionsPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-md mb-2">
        <h1 className="text-2xl font-bold text-center">
          Análisis de Condiciones Operacionales
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Evaluación de cómo la batería, temperatura y tiempo de calibración afectan la precisión de los sensores
        </p>
      </header>
      
      <div className="flex-1">
        <OperationalConditionsNavBar />
      </div>
    
      <footer className="bg-white p-4 mt-4 text-center text-gray-500 text-sm">
        Sistema de Análisis de Datos para Monitoreo de Gases en Minas Subterráneas
        <br />
        Universidad Pedagógica y Tecnológica de Colombia - 2025
      </footer>
  </div>
  );
};

