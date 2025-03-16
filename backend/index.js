const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.use(cors());
app.use(express.json());

let vitals = [
  {
    id: 1,
    name: "John Doe",
    heartRate: 75,
    temperature: 36.8,
    spo2: 98,
    history: [],
    notes: [],
  },
  {
    id: 2,
    name: "Jane Smith",
    heartRate: 82,
    temperature: 37.0,
    spo2: 97,
    history: [],
    notes: [],
  },
  {
    id: 3,
    name: "David Johnson",
    heartRate: 90,
    temperature: 37.2,
    spo2: 96,
    history: [],
    notes: [],
  },
];

// Fetch all vitals
app.get("/api/patients/vitals", (req, res) => {
  res.json(vitals);
});

// Fetch a specific patient
app.get("/api/patients/:id", (req, res) => {
  const patient = vitals.find((p) => p.id == req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
});

// Add a note
app.post("/api/patients/:id/notes", (req, res) => {
  const { text } = req.body;
  const patient = vitals.find((p) => p.id == req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  const newNote = { text, timestamp: new Date() };
  patient.notes.push(newNote);
  res.status(201).json({ message: "Note added", note: newNote });
});

// Edit a note
app.put("/api/patients/:id/notes/:noteIndex", (req, res) => {
  const { text } = req.body;
  const { id, noteIndex } = req.params;
  const patient = vitals.find((p) => p.id == id);

  if (!patient || !patient.notes[noteIndex]) {
    return res.status(404).json({ message: "Note not found" });
  }

  patient.notes[noteIndex].text = text;
  res.json({ message: "Note updated", note: patient.notes[noteIndex] });
});

// Delete a note
app.delete("/api/patients/:id/notes/:noteIndex", (req, res) => {
  const { id, noteIndex } = req.params;
  const patient = vitals.find((p) => p.id == id);

  if (!patient || !patient.notes[noteIndex]) {
    return res.status(404).json({ message: "Note not found" });
  }

  patient.notes.splice(noteIndex, 1);
  res.json({ message: "Note deleted" });
});

// Simulate real-time updates every 5 seconds
setInterval(() => {
  vitals = vitals.map((patient) => {
    const newVitals = {
      heartRate: Math.floor(Math.random() * (110 - 55) + 55),
      temperature: (Math.random() * (38.5 - 36) + 36).toFixed(1),
      spo2: Math.floor(Math.random() * (100 - 90) + 90),
    };

    return {
      ...patient,
      ...newVitals,
      history: [...patient.history, { ...newVitals, timestamp: new Date() }],
    };
  });

  io.emit("vitalsUpdate", vitals);
}, 5000);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("vitalsUpdate", vitals);
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
