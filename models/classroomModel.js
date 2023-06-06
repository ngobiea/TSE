const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
});
classroomSchema.index({ name: 1, tutorId: 1 }, { unique: true });

module.exports = mongoose.model("Classroom", classroomSchema);
