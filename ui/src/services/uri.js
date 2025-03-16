export const uri = {
  BASE: "http://127.0.0.1:5000/api/", // Backend URL

  // Patients
  PATIENTS: "patients/",
  PATIENT: (id) => `patients/${id}`,

  // Vitals
  VITALS: "patients/vitals",
};
