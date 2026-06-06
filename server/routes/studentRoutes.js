const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Add Student
router.post("/add", async (req, res) => {
  try {
    const { name, sgpas } = req.body;

    const cgpa =
      sgpas.reduce((sum, sgpa) => sum + sgpa, 0) /
      sgpas.length;

    const student = await Student.create({
      name,
      sgpas,
      cgpa,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;