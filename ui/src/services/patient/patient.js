import { uri } from "../uri";

export const fetchPatients = async () => {
  const response = await fetch(`${uri.BASE}${uri.PATIENTS}`);
  if (!response.ok) throw new Error("Failed to fetch patients");
  return response.json();
};

export const fetchPatientById = async (id) => {
  const response = await fetch(`${uri.BASE}${uri.PATIENT(id)}`);
  if (!response.ok) throw new Error("Failed to fetch patient");
  return response.json();
};