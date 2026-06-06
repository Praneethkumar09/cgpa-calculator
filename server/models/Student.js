const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sgpas: {
    type: [Number],
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);