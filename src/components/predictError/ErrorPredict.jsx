// components/predictError/ErrorPredictDisplay.jsx
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Tabs, Tab } from '@nextui-org/react';
import { AlertTriangle, Activity, TrendingUp } from 'lucide-react';

export const ErrorPredict = ({ modelPath }) => {
  const [formData, setFormData] = useState({
    temperatura: 25,
    humedad: 65,
    tiempo_calibracion: 48,
    nivel_bateria: 80
  });
  const [loading, setLoading] = useState(false);
  const [calibrationError, setCalibrationError] = useState(null);
  const [uncertaintyData, setUncertaintyData] = useState(null);
  const [errorSummary, setErrorSummary] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const predictCalibrationError = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/${modelPath}/predict/calibration_error`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setCalibrationError(data.error_calibration_prediction);
      }
    } catch (error) {
      console.error('Error predicting calibration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const predictReadingUncertainty = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/${modelPath}/predict/reading_uncertainty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setUncertaintyData(data.uncertainty_prediction);
      }
    } catch (error) {
      console.error('Error predicting uncertainty:', error);
    } finally {
      setLoading(false);
    }
  };

  const getErrorSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/${modelPath}/analysis/error_summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setErrorSummary(data.error_analysis_summary);
      }
    } catch (error) {
      console.error('Error getting error summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Bajo': 'success',
      'Moderado': 'warning',
      'Alto': 'danger',
      'Crítico': 'danger'
    };
    return colors[severity] || 'default';
  };

  const getConfidenceColor = (level) => {
    const colors = {
      'Muy Alta': 'success',
      'Alta': 'success',
      'Media': 'warning',
      'Baja': 'danger',
      'Muy Baja': 'danger'
    };
    return colors[level] || 'default';
  };

  const getModelName = () => {
    const modelNames = {
      'regresion': 'Regresión Lineal',
      'random_forest': 'Random Forest',
      'gradient_boosting': 'Gradient Boosting',
      'prophet': 'Prophet'
    };
    return modelNames[modelPath] || modelPath;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Predicción de Errores - {getModelName()}
        </h2>
        <p className="text-gray-600">
          Análisis de deriva de calibración e incertidumbre de lecturas usando {getModelName()}
        </p>
      </div>

      {/* Formulario de Condiciones */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Condiciones Operacionales</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="number"
              label="Temperatura (°C)"
              value={formData.temperatura.toString()}
              onValueChange={(value) => handleInputChange('temperatura', value)}
              min="0"
              max="50"
              step="0.1"
            />
            <Input
              type="number"
              label="Humedad (%)"
              value={formData.humedad.toString()}
              onValueChange={(value) => handleInputChange('humedad', value)}
              min="0"
              max="100"
              step="0.1"
            />
            <Input
              type="number"
              label="Tiempo Calibración (hrs)"
              value={formData.tiempo_calibracion.toString()}
              onValueChange={(value) => handleInputChange('tiempo_calibracion', value)}
              min="0"
              max="720"
              step="1"
            />
            <Input
              type="number"
              label="Nivel Batería (%)"
              value={formData.nivel_bateria.toString()}
              onValueChange={(value) => handleInputChange('nivel_bateria', value)}
              min="0"
              max="100"
              step="1"
            />
          </div>
        </CardBody>
      </Card>

      {/* Botones de Análisis */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          color="primary"
          onPress={predictCalibrationError}
          isLoading={loading}
          startContent={<AlertTriangle className="h-4 w-4" />}
        >
          Predecir Error de Lectura
        </Button>
        <Button
          color="secondary"
          onPress={predictReadingUncertainty}
          isLoading={loading}
          startContent={<Activity className="h-4 w-4" />}
        >
          Analizar Incertidumbre
        </Button>
        <Button
          color="default"
          variant="bordered"
          onPress={getErrorSummary}
          isLoading={loading}
          startContent={<TrendingUp className="h-4 w-4" />}
        >
          Resumen del Sistema
        </Button>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Error de Calibración */}
        {calibrationError && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Error de Calibración
              </h4>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Error Absoluto:</span>
                  <span className="font-semibold">{calibrationError.error_calibracion_absoluto}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Error Porcentual:</span>
                  <span className="font-semibold">{calibrationError.error_calibracion_porcentaje}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Severidad:</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold bg-${getSeverityColor(calibrationError.severidad_error.nivel)}-100 text-${getSeverityColor(calibrationError.severidad_error.nivel)}-800`}>
                    {calibrationError.severidad_error.nivel}
                  </span>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Factores Contribuyentes:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Deriva Temporal:</span>
                      <span>{calibrationError.factores_contribuyentes.deriva_temporal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deriva Temperatura:</span>
                      <span>{calibrationError.factores_contribuyentes.deriva_temperatura}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deriva Humedad:</span>
                      <span>{calibrationError.factores_contribuyentes.deriva_humedad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deriva Batería:</span>
                      <span>{calibrationError.factores_contribuyentes.deriva_bateria}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Recomendación:</strong> {calibrationError.recomendacion_calibracion}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Incertidumbre de Lectura */}
        {uncertaintyData && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Incertidumbre de Lectura
              </h4>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Incertidumbre Total:</span>
                  <span className="font-semibold">{uncertaintyData.incertidumbre_total}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Confianza:</span>
                  <span className="font-semibold">{uncertaintyData.confianza_porcentaje}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Clasificación:</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold bg-${getConfidenceColor(uncertaintyData.clasificacion_confianza.nivel)}-100 text-${getConfidenceColor(uncertaintyData.clasificacion_confianza.nivel)}-800`}>
                    {uncertaintyData.clasificacion_confianza.nivel}
                  </span>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Rango de Lectura:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Valor Central:</span>
                      <span>{uncertaintyData.rango_lectura.valor_central}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Límite Inferior:</span>
                      <span>{uncertaintyData.rango_lectura.limite_inferior}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Límite Superior:</span>
                      <span>{uncertaintyData.rango_lectura.limite_superior}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amplitud:</span>
                      <span>{uncertaintyData.rango_lectura.amplitud_rango}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Fuentes de Incertidumbre:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Calibración:</span>
                      <span>{uncertaintyData.fuentes_incertidumbre.calibracion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ambiental:</span>
                      <span>{uncertaintyData.fuentes_incertidumbre.ambiental}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hardware:</span>
                      <span>{uncertaintyData.fuentes_incertidumbre.hardware}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <h5 className="font-semibold text-purple-800 mb-2">Recomendaciones:</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    {uncertaintyData.recomendaciones.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Resumen del Sistema */}
      {errorSummary && (
        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumen del Sistema de Análisis de Errores
            </h4>
          </CardHeader>
          <CardBody>
            <Tabs aria-label="Resumen del sistema">
              <Tab key="capacidades" title="Capacidades">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold mb-2">Modelo: {errorSummary.modelo_tipo}</h5>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Capacidades de Error:</h5>
                    <ul className="space-y-1">
                      {Object.entries(errorSummary.capacidades_error).map(([key, value]) => (
                        <li key={key} className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Tab>
              
              <Tab key="factores" title="Factores Evaluados">
                <div className="space-y-3">
                  {Object.entries(errorSummary.factores_evaluados).map(([factor, descripcion]) => (
                    <div key={factor} className="border-l-4 border-blue-500 pl-4">
                      <h6 className="font-semibold capitalize">{factor.replace(/_/g, ' ')}</h6>
                      <p className="text-sm text-gray-600">{descripcion}</p>
                    </div>
                  ))}
                </div>
              </Tab>
              
              <Tab key="rangos" title="Rangos Recomendados">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(errorSummary.rangos_recomendados).map(([parametro, valor]) => (
                    <div key={parametro} className="p-3 bg-green-50 rounded-lg">
                      <h6 className="font-semibold text-green-800 capitalize">
                        {parametro.replace(/_/g, ' ')}
                      </h6>
                      <p className="text-green-700">{valor}</p>
                    </div>
                  ))}
                </div>
              </Tab>
              
              <Tab key="interpretacion" title="Interpretación de Severidad">
                <div className="space-y-3">
                  {Object.entries(errorSummary.interpretacion_severidad).map(([nivel, descripcion]) => (
                    <div key={nivel} className={`p-3 rounded-lg border-l-4 ${
                      nivel === 'bajo' ? 'bg-green-50 border-green-500' :
                      nivel === 'moderado' ? 'bg-yellow-50 border-yellow-500' :
                      nivel === 'alto' ? 'bg-orange-50 border-orange-500' :
                      'bg-red-50 border-red-500'
                    }`}>
                      <h6 className="font-semibold capitalize">{nivel}</h6>
                      <p className="text-sm">{descripcion}</p>
                    </div>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      )}
    </div>
  );
};