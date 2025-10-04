// pages/ErrorPredictPage.jsx
import React from "react";
import { ErrorPredictNavBar } from "../components/navBar/ErrorPredictNavBar";

export const ErrorPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-md mb-2">
        <h1 className="text-2xl font-bold text-center">
          Predicción de Errores del Sensor
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Análisis de deriva de calibración e incertidumbre de lecturas usando diferentes modelos predictivos
        </p>
      </header>
      
      <div className="flex-1">
        <ErrorPredictNavBar />
      </div>
    
      <footer className="bg-white p-4 mt-4 text-center text-gray-500 text-sm">
        Sistema de Análisis de Datos para Monitoreo de Gases en Minas Subterráneas
        <br />
        Universidad Pedagógica y Tecnológica de Colombia - 2025
      </footer>
    </div>
  );
};