import { useState, useEffect } from "react";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

const NotesSection = ({ patientId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${patientId}`
      );
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${patientId}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newNote }),
        }
      );
      if (res.ok) {
        fetchNotes();
        setNewNote("");
        toast.success("Note added successfully!");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const editNote = async (index) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${patientId}/notes/${index}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: editText }),
        }
      );
      if (res.ok) {
        fetchNotes();
        setEditingIndex(null);
        toast.success("Note updated successfully!");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (index) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${patientId}/notes/${index}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        fetchNotes();
        toast.success("Note deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <Card className="p-4 border mt-4">
      <h3 className="text-lg font-semibold mb-2">Doctor's Notes</h3>

      {/* Add New Note */}
      <div className="flex gap-2">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          className="flex-1"
        />
        <Button onClick={addNote} className="bg-blue-500 text-white">
          Add
        </Button>
      </div>

      {/* Notes List */}
      <div className="mt-4 space-y-2">
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes available.</p>
        ) : (
          notes.map((note, index) => (
            <Card
              key={index}
              className="p-2 flex justify-between items-center border"
            >
              {editingIndex === index ? (
                <div className="flex gap-2 w-full">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => editNote(index)}
                    className="bg-green-500 text-white"
                  >
                    <Save size={16} />
                  </Button>
                  <Button
                    onClick={() => setEditingIndex(null)}
                    className="bg-gray-500 text-white"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <span>{note.text}</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingIndex(index);
                        setEditText(note.text);
                      }}
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
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};

export default NotesSection;
