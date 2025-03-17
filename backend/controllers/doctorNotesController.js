// backend/controllers/doctorNotesController.js - Doctor's Notes Controller

const DoctorNotes = require("../models/DoctorNotes");

// Get doctor's notes for a specific patient
const getDoctorNotes = async (req, res) => {
  try {
    const notes = await DoctorNotes.find({
      patient: req.params.patientId,
    }).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new doctor's note
const addDoctorNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ message: "Note content is required" });
    }
    const newNote = new DoctorNotes({
      patient: req.params.patientId,
      doctor: req.user.id,
      note,
    });
    await newNote.save();
    res
      .status(201)
      .json({ message: "Doctor's note added successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDoctorNotes, addDoctorNote };
