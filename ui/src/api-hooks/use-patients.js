import { fetchPatientById, fetchPatients } from "@/services/patient/patient";
import { useQuery } from "@tanstack/react-query";

export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    // refetchInterval: 5000,
  });
};

export const usePatient = (id) => {
  return useQuery({
    queryKey: ["patient-id", id],
    queryFn: () => fetchPatientById(id),
    enabled: !!id,
  });
};
