import { usePatients } from "@/api-hooks/use-patients";
import { Loading } from "@/component/loading";
import { Show } from "@/component/show";
import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Link,
  ScrollArea,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";

const socket = io("http://localhost:5000");

export function Component() {
  const queryClient = useQueryClient();
  const { data, isLoading } = usePatients();
  console.log("data", data);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("vitalsUpdate", (updatedPatients) => {
      queryClient.invalidateQueries(["patients"]);

      updatedPatients.forEach((patient) => {
        let alerts = [];

        if (patient.heartRate < 60 || patient.heartRate > 100) {
          alerts.push(`Heart Rate: ${patient.heartRate} bpm`);
        }
        if (patient.temperature < 36 || patient.temperature > 38) {
          alerts.push(`Temperature: ${patient.temperature}°C`);
        }
        if (patient.spo2 < 92) {
          alerts.push(`Low SpO2: ${patient.spo2}%`);
        }

        if (alerts.length > 0) {
          const message = `${patient.name} - ${alerts.join(", ")}`;
          toast.error(message);

          setNotifications((prev) => [
            ...prev,
            { id: Date.now(), patient: patient.name, message },
          ]);
        }
      });
    });

    return () => {
      socket.off("vitalsUpdate");
    };
  }, [queryClient]);

  return (
    <Box p="4">
      <Heading as="h1" size="8">
        Doctor's Dashboard
      </Heading>

      {/* Notifications Panel */}
      <Card bg="red" variant="soft" p="4" mt="4">
        <Heading as="h2" size="6" color="red">
          Critical Alerts
        </Heading>
        <Separator my="2" />
        <Show
          when={notifications.length > 0}
          fallback={
            <Text size="3" color="gray">
              No critical alerts
            </Text>
          }
        >
          <ScrollArea style={{ height: 150 }}>
            <Grid columns="4" gap="4">
              {notifications.slice(-5)?.map((notif) => (
                <Text key={notif.id} size="3" color="red">
                  {notif.message}
                </Text>
              ))}
            </Grid>
          </ScrollArea>
        </Show>
      </Card>

      {/* Patients Grid */}
      <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="4" mt="4">
        <Loading when={isLoading}>
          <Show
            when={data && data?.length > 0}
            fallback={<Text>No patient data available</Text>}
          >
            {data &&
              data?.map((patient) => (
                <Card key={patient.id} p="4" shadow="md">
                  <Heading as="h3" size="5">
                    <Link asChild>
                      <RouterLink
                        to={`/patients/${patient.id}`}
                        className="text-blue-500"
                      >
                        {patient.name}
                      </RouterLink>
                    </Link>
                  </Heading>
                  <Separator my="2" />
                  <Flex align="center" justify="between" gap="4">
                    <Text size="3">❤️ {patient.heartRate} bpm</Text>
                    <Separator orientation="vertical" />
                    <Text size="3">🌡 {patient.temperature}°C</Text>
                    <Separator orientation="vertical" />
                    <Text size="3">🩸 {patient.spo2}%</Text>
                  </Flex>
                </Card>
              ))}
          </Show>
        </Loading>
      </Grid>
    </Box>
  );
}
