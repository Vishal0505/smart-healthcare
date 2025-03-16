import { usePatient } from "@/api-hooks/use-patients";
import { Card, Heading, Separator, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export function Component() {
  const { id } = useParams();
  const { data: patient, isLoading, refetch } = usePatient(id);

  // Socket.io - Listen for real-time updates
  useEffect(() => {
    socket.on("noteAdded", () => refetch());
    socket.on("noteUpdated", () => refetch());
    socket.on("noteDeleted", () => refetch());

    return () => {
      socket.off("noteAdded");
      socket.off("noteUpdated");
      socket.off("noteDeleted");
    };
  }, [refetch]);

  if (isLoading) return <Text>Loading...</Text>;
  if (!patient) return <Text>Patient not found.</Text>;

  return (
    <>
      {/* Back to Dashboard Button (Moved to Top Left) */}
      <Link to="/" className="block mb-4 text-blue-500">
        ⬅️ Back to Dashboard
      </Link>

      <Heading as="h2" size="6">
        {patient.name}'s Profile
      </Heading>
      <Separator my="2" />

      {/* Current Vitals */}
      <Card className="p-4 shadow-lg">
        <Text>❤️ Heart Rate: {patient.heartRate} bpm</Text>
        <Text>🌡️ Temperature: {patient.temperature}°C</Text>
        <Text>🩸 SpO2: {patient.spo2}%</Text>
      </Card>

      {/* History Section */}
      <Card>
        <Heading as="h3" size="5" my="2">
          Vital History (Last 5 Entries)
        </Heading>
        {Array.isArray(patient.history) && patient.history.length > 0 ? (
          [...patient.history]
            .slice(-5)
            .reverse()
            .map((entry, index) => (
              <Card key={index} p="3" my="2">
                <Text>🕒 {new Date(entry.timestamp).toLocaleString()}</Text>
                <Text>
                  ❤️ {entry.heartRate} bpm | 🌡 {entry.temperature}°C | 🩸{" "}
                  {entry.spo2}%
                </Text>
              </Card>
            ))
        ) : (
          <Text>No history available.</Text>
        )}
      </Card>
    </>
  );
}
