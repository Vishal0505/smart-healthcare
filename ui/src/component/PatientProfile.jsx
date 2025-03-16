import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Card,
  Heading,
  Text,
  Separator,
  ScrollArea,
  TextArea,
  Button,
} from "@radix-ui/themes";
import { Pencil, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

const socket = io("http://localhost:5000");

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/patients/${id}`);
        const data = await res.json();
        setPatient(data);
        setHistory(data.history || []);
        setNotes(data.notes || []);
      } catch {
        toast.error("Failed to fetch patient data.");
      }
    };

    fetchPatient();

    socket.on("vitalsUpdate", (updatedVitals) => {
      const updatedPatient = updatedVitals.find((p) => p.id == id);
      if (updatedPatient) {
        setPatient(updatedPatient);
        setHistory((prev) => [...prev, updatedPatient]);
      }
    });

    return () => socket.off("vitalsUpdate");
  }, [id]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    const newNoteObj = { text: newNote, timestamp: new Date().toISOString() };

    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${id}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNoteObj),
        }
      );

      if (res.ok) {
        setNotes([...notes, newNoteObj]);
        setNewNote("");
        toast.success("Note added successfully!");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to add note.");
    }
  };

  const editNote = async (index) => {
    const updatedText = prompt("Edit your note:", notes[index].text);
    if (updatedText === null || !updatedText.trim()) return;

    const updatedNotes = [...notes];
    updatedNotes[index] = { ...updatedNotes[index], text: updatedText };

    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${id}/notes/${index}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: updatedText }),
        }
      );

      if (res.ok) {
        setNotes(updatedNotes);
        toast.success("Note updated successfully!");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to update note.");
    }
  };

  const deleteNote = async (index) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${id}/notes/${index}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
        toast.success("Note deleted successfully!");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete note.");
    }
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <Heading as="h2" size="6">
        {patient.name}'s Profile
      </Heading>
      <Separator className="my-2" />

      <Card className="p-4 shadow-lg">
        <Text>❤️ Heart Rate: {patient.heartRate} bpm</Text>
        <Text>🌡️ Temperature: {patient.temperature}°C</Text>
        <Text>🩸 SpO2: {patient.spo2}%</Text>
      </Card>

      <Heading as="h3" size="5" className="mt-6">
        Vitals History
      </Heading>
      <ScrollArea className="max-h-60 border rounded-lg p-2 mt-2">
        {patient.history.slice(-5).map((entry, index) => (
          <Card key={index} className="p-2 border-b">
            <Text>🕒 {new Date(entry.timestamp).toLocaleTimeString()}</Text>
            <Text>
              ❤️ {entry.heartRate} bpm | 🌡️ {entry.temperature}°C | 🩸{" "}
              {entry.spo2}% | 🔵 {entry.bloodPressure} mmHg | 💨{" "}
              {entry.respirationRate} breaths/min
            </Text>
          </Card>
        ))}
      </ScrollArea>

      <Heading as="h3" size="5" className="mt-6">
        Doctor's Notes & Recommendations
      </Heading>
      <ScrollArea className="max-h-60 border rounded-lg p-2 mt-2">
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <Card key={index} className="p-2 border-b flex justify-between">
              <div>
                <Text>🕒 {new Date(note.timestamp).toLocaleString()}</Text>
                <Text>{note.text}</Text>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => editNote(index)}
                  className="bg-yellow-500 text-white"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  onClick={() => deleteNote(index)}
                  className="bg-red-500 text-white"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Text>No notes available.</Text>
        )}
      </ScrollArea>

      <div className="mt-4">
        <TextArea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="w-full p-2 border rounded-md"
        />
        <Button onClick={addNote} className="mt-2 bg-blue-500 text-white">
          ➕ Add Note
        </Button>
      </div>

      <Heading as="h3" size="5" className="mt-6">
        Vitals Over Time
      </Heading>
      <ScrollArea className="max-h-[250px] border rounded-md p-2 mt-2">
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#ff0000"
                name="Heart Rate"
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ff7300"
                name="Temperature"
              />
              <Line
                type="monotone"
                dataKey="spo2"
                stroke="#007bff"
                name="SpO2"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Text>No historical data available.</Text>
        )}
      </ScrollArea>

      <Link to="/" className="block mt-4 text-blue-500">
        ⬅️ Back to Dashboard
      </Link>
    </div>
  );
};

export default PatientProfile;
