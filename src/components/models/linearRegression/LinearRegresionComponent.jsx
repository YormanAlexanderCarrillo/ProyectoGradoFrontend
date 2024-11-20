import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnalyticsChart } from "../../graphs/AnalyticsChart";
import {CorrelationMatrix} from "../../graphs/CorrelationsMatrixComponent"
import {PredictionComparisonLine} from "../../graphs/PredictionComparisonLine"


export const LinearRegresionComponent = () => {

  
  const URLAPI = process.env.REACT_APP_URLAPI;
  const [correlations, setCorrelations] = useState({});
  const [prediction, setPrediction] = useState({});

  const [basicStats, setBasicStats] = useState({});
  const [ambientHumidity, setAmbientHumidity] = useState([]);
  const [batteryData, setBatteryData] = useState([]);
  const [methaneGasLevel, setMethaneGasLevel] = useState([]);
  const [sensorTemperature, setSensorTemperture] = useState([]);

  useEffect(() => {
    getCorrelations();
    getPredictions();
    getBasicStats();
  }, []);

  const getCorrelations = async () => {
    try {
      const res = await axios.get(`${URLAPI}/regresion/analysis/correlations`);
      setCorrelations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getPredictions = async () => {
    try {
      const res = await axios.get(
        `${URLAPI}/regresion/model_metrics/prediction_data`
      );
      setPrediction(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getBasicStats = async () => {
    try {
      const res = await axios.get(`${URLAPI}/regresion/analysis/basic_stats`);
      setBasicStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const prepareChartData = (metric) => {
    const stats = basicStats?.basic_stats?.descriptive_stats?.[metric];
    if (!stats) {
      console.error(`Métrica ${metric} no encontrada`);
      return [];
    }
    return [
      { name: "Mínimo", value: stats.min },
      { name: "Q1 (25%)", value: stats["25%"] },
      { name: "Mediana", value: stats["50%"] },
      { name: "Q3 (75%)", value: stats["75%"] },
      { name: "Máximo", value: stats.max },
      { name: "Media", value: stats.mean },
    ];
  };

  useEffect(() => {
    if (basicStats && basicStats.basic_stats) {
      setAmbientHumidity(prepareChartData("humedad_ambiente"));
      setBatteryData(prepareChartData("nivel_bateria"));
      setMethaneGasLevel(prepareChartData("nivel_gas_metano"));
      setSensorTemperture(prepareChartData("temperatura_sensor"));
    }
  }, [basicStats]);


  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-4 p-3">
      <div className="col-span-4 flex flex-col items-center border-2 border-black">
        <h3>Predicciones y valores reales</h3>
        <PredictionComparisonLine data={prediction} colorPredict="#faaaaa" colorReal="#8884d8" />
    
      </div>
      <div className="col-span-2 row-start-2 flex flex-col items-center border-2 border-black">
        <h3 className="mb-2">Batería</h3>
        {batteryData.length > 0 && (
          <AnalyticsChart color="#f72460" data={batteryData} />
        )}
      </div>
      <div className="col-span-2 col-start-3 row-start-2 flex flex-col items-center border-2 border-black">
        <h5 className="mb-2">Temperatura</h5>
        <AnalyticsChart color="#069da4" data={sensorTemperature} />
      </div>
      <div className="col-span-2 row-start-3 flex flex-col items-center border-2 border-black">
        <h3 className="mb-2">Gas</h3>
        <AnalyticsChart color="#aab500" data={methaneGasLevel} />
      </div>

      <div className="col-span-2 col-start-3 row-start-3 flex flex-col items-center border-2 border-black">
        <h5 className="mb-2">Humedad ambiente</h5>
        <AnalyticsChart color="#098ed0" data={ambientHumidity} />
      </div>

      <div className="col-span-4 row-start-4 flex flex-col items-center border-2 border-black">
        <h5>Correlaciones</h5>
        <CorrelationMatrix data={correlations} />
      </div>
    </div>
  );
};
