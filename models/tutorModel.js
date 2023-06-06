// Import mongoose
const mongoose = require("mongoose");

// Define tutor schema
const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  classrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
  ],
});

module.exports = mongoose.model("Tutor", tutorSchema);
