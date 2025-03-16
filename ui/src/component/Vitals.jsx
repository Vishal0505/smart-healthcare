import React, { useEffect, useState } from "react";
import { fetchVitals } from "../services/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Vitals = () => {
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    const getVitals = async () => {
      const data = await fetchVitals();
      setVitals(data);
    };
    getVitals();

    // Listen for real-time updates
    socket.on("vitalsUpdate", (updatedVitals) => {
      setVitals(updatedVitals);
    });

    return () => socket.off("vitalsUpdate");
  }, []);

  const checkAbnormal = (vital, min, max) => {
    return vital < min || vital > max ? "text-red-500 font-bold" : "";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Patient Vitals (Live Updates)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vitals.map((patient) => (
          <div key={patient.id} className="p-4 border rounded-lg shadow">
            <h3 className="text-lg font-semibold">{patient.name}</h3>
            <p className={checkAbnormal(patient.heartRate, 60, 100)}>
              ❤️ Heart Rate: {patient.heartRate} bpm
            </p>
            <p className={checkAbnormal(patient.temperature, 36.5, 37.5)}>
              🌡️ Temperature: {patient.temperature}°C
            </p>
            <p className={checkAbnormal(patient.spo2, 95, 100)}>
              🩸 SpO2: {patient.spo2}%
            </p>
            {(patient.heartRate < 60 || patient.heartRate > 100 ||
              patient.temperature < 36.5 || patient.temperature > 37.5 ||
              patient.spo2 < 95) && (
              <p className="text-red-600 font-bold mt-2">
                ⚠️ Abnormal vitals detected!
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vitals;
