import React from 'react'
import { 
    Gauge, 
    Battery, 
    Thermometer, 
    Clock, 
    AlertTriangle 
  } from 'lucide-react';

export const DescriptionHome = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-blue-800 mb-4">
                Análisis de Condiciones Operacionales en Sistemas Embebidos Mineros
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Monitoreo y análisis de las condiciones críticas que afectan la precisión de los sensores en minas subterráneas
              </p>
            </header>
    
            <section className="grid md:grid-cols-3 gap-6">
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <Battery className="mx-auto mb-4 text-blue-600" size={48} />
                <h2 className="font-semibold text-xl mb-2">Nivel de Batería</h2>
                <p className="text-gray-600">
                  Monitoreo del estado de batería que afecta la confiabilidad de los sensores
                </p>
              </div>
    
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <Thermometer className="mx-auto mb-4 text-red-600" size={48} />
                <h2 className="font-semibold text-xl mb-2">Temperatura Interna</h2>
                <p className="text-gray-600">
                  Análisis del impacto de la temperatura en el rendimiento de los sensores
                </p>
              </div>
    
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <Clock className="mx-auto mb-4 text-green-600" size={48} />
                <h2 className="font-semibold text-xl mb-2">Tiempo de Calibración</h2>
                <p className="text-gray-600">
                  Seguimiento del tiempo transcurrido desde la última calibración
                </p>
              </div>
            </section>
    
            <section className="mt-12 bg-white shadow-md rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">Objetivo Principal</h2>
              <p className="text-gray-700 mb-4">
                Desarrollar una aplicación que determine cómo las condiciones de funcionamiento 
                afectan negativamente la toma de datos en sistemas embebidos de minería subterránea.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Gauge className="mr-3 text-blue-500" />
                  <span>Categorización de datos</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="mr-3 text-red-500" />
                  <span>Evaluación de modelos predictivos</span>
                </div>
              </div>
            </section>
    
            <section className="mt-12 text-center">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">Gases Monitoreados</h2>
              <div className="flex justify-center space-x-6">
                <div className="bg-gray-200 rounded-full px-4 py-2">Metano (CH4)</div>
              </div>
            </section>
    
            <footer className="mt-12 text-center text-gray-500">
              <p>© 2024 Sistema de Monitoreo Minero - UPTC</p>
            </footer>
          </div>
        </div>
      );
}
