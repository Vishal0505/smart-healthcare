import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  Heading,
  Text,
  Separator,
  Badge,
  ScrollArea,
  Button,
} from "@radix-ui/themes";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [vitals, setVitals] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/patients/vitals")
      .then((res) => res.json())
      .then((data) => setVitals(data))
      .catch((err) => console.error("Error fetching vitals:", err));

    socket.on("vitalsUpdate", (updatedVitals) => {
      setVitals(updatedVitals);

      updatedVitals.forEach((patient) => {
        let message = null;
        let severity = "warning"; // Default severity

        if (patient.heartRate < 50 || patient.heartRate > 120) {
          message = `🆘 CRITICAL: ${patient.name} has dangerous Heart Rate: ${patient.heartRate} bpm`;
          severity = "critical";
        } else if (patient.heartRate < 60 || patient.heartRate > 100) {
          message = `⚠️ WARNING: ${patient.name} has abnormal Heart Rate: ${patient.heartRate} bpm`;
        }

        if (patient.temperature < 35 || patient.temperature > 39) {
          message = `🔥 CRITICAL: ${patient.name} has dangerous Temperature: ${patient.temperature}°C`;
          severity = "critical";
        } else if (patient.temperature < 36 || patient.temperature > 38) {
          message = `⚠️ WARNING: ${patient.name} has abnormal Temperature: ${patient.temperature}°C`;
        }

        if (patient.spo2 < 85) {
          message = `🆘 CRITICAL: ${patient.name} has very low SpO2: ${patient.spo2}%`;
          severity = "critical";
        } else if (patient.spo2 < 90) {
          message = `⚠️ WARNING: ${patient.name} has low SpO2: ${patient.spo2}%`;
        }

        if (message) {
          toast.warning(message);
          setNotifications((prev) => [
            { message, severity, time: new Date() },
            ...prev.slice(0, 19), // Keep only last 20 notifications
          ]);
        }
      });
    });

    return () => socket.off("vitalsUpdate");
  }, []);

  const getVitalColor = (value, min, max) => {
    return value < min || value > max ? "text-red-500" : "text-green-600";
  };

  const getTimeAgo = (time) => {
    const diff = Math.floor((new Date() - time) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return `${Math.floor(diff / 3600)} hrs ago`;
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Dashboard */}
      <div className="lg:col-span-3">
        <Heading as="h2" size="6" className="mb-4">
          Doctor's Dashboard
        </Heading>
        <ScrollArea className="max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitals.length > 0 ? (
              vitals.map((patient) => {
                const isCritical =
                  patient.heartRate < 60 ||
                  patient.heartRate > 100 ||
                  patient.temperature < 36 ||
                  patient.temperature > 38 ||
                  patient.spo2 < 90;

                return (
                  <Card key={patient.id} className="p-4 shadow-lg">
                    <Heading as="h3" size="5">
                      <Link
                        to={`/patient/${patient.id}`}
                        className="text-blue-500"
                      >
                        {patient.name}
                      </Link>
                    </Heading>
                    <Separator className="my-2" />
                    <Text className={getVitalColor(patient.heartRate, 60, 100)}>
                      ❤️ Heart Rate: {patient.heartRate} bpm
                    </Text>
                    <Text
                      className={getVitalColor(patient.temperature, 36, 38)}
                    >
                      🌡️ Temperature: {patient.temperature}°C
                    </Text>
                    <Text className={getVitalColor(patient.spo2, 90, 100)}>
                      🩸 SpO2: {patient.spo2}%
                    </Text>
                    <Separator className="my-2" />
                    <Badge color={isCritical ? "red" : "green"} variant="solid">
                      {isCritical ? "Critical Condition" : "Stable"}
                    </Badge>
                  </Card>
                );
              })
            ) : (
              <Text>No patient data available.</Text>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Notifications Log */}
      <div className="lg:col-span-1 bg-gray-100 p-4 rounded-lg shadow-md">
        <Heading as="h3" size="5" className="mb-2">
          Notifications Log
        </Heading>
        <Button onClick={() => setNotifications([])} className="mb-2">
          Clear All
        </Button>
        <ScrollArea className="max-h-[70vh]">
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <div
                key={index}
                className={`p-2 border-b ${
                  notif.severity === "critical" ? "bg-red-100" : "bg-yellow-100"
                }`}
              >
                <Text
                  className={`text-sm ${
                    notif.severity === "critical"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {notif.message}
                </Text>
                <Text className="text-xs text-gray-500">
                  {getTimeAgo(notif.time)}
                </Text>
              </div>
            ))
          ) : (
            <Text>No alerts yet.</Text>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Dashboard;
