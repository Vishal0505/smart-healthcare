const express = require("express");
const router = express.Router();

let patientVitals = [
  { id: 1, name: "John Doe", heartRate: 72, spo2: 98, temperature: 36.8, notes: [] },
  { id: 2, name: "Jane Smith", heartRate: 85, spo2: 95, temperature: 37.1, notes: [] },
  { id: 3, name: "Alice Brown", heartRate: 90, spo2: 92, temperature: 37.5, notes: [] },
];

// Get vitals
router.get("/vitals", (req, res) => {
  res.json(patientVitals);
});

// Get a specific patient's notes
router.get("/patients/:id/notes", (req, res) => {
  const patient = patientVitals.find((p) => p.id == req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  res.json(patient.notes);
});

// Add a note to a patient
router.post("/patients/:id/notes", (req, res) => {
  const { text } = req.body;
  const patient = patientVitals.find((p) => p.id == req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  const newNote = { text, timestamp: new Date() };
  patient.notes.push(newNote);
  res.status(201).json({ message: "Note added", note: newNote });
});

module.exports = router;
