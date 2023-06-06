const { validationResult } = require("express-validator");
const Tutor = require("../models/tutorModel");
const Classroom = require("../models/classroomModel");
const { v4: uuidv4 } = require("uuid");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { name, email, password } = req.body;
    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      const error = new Error("A tutor with this email already exists");
      error.statusCode = 409;
      error.type = "email";
      throw error;
    }
    const tutor = new Tutor({
      name,
      email,
      password,
    });
    const newTutor = await tutor.save();
    res.status(201).json({ message: "Success Creating tutor", tutor });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createClassroom = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { tutorId, name, description } = req.body;
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      const error = new Error("Invalid tutor Id");
      error.statusCode = 401;
      throw error;
    }
    const code = uuidv4().replace(/-/g, "").substring(0, 8);
    let classroom = new Classroom({
      name,
      description,
      code,
      tutorId,
    });
    await classroom.save();
    tutor.classrooms.push(classroom);
    await tutor.save();
    res.status(201).json({
      message: "Classroom created successfully!",
      classroom,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getClassrooms = async (req, res, next) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId).populate(
      "classrooms"
    );

    if (!tutor) {
      const error = new Error("Could not find tutor.");
      error.statusCode = 404;
      throw error;
    }
    res.json(tutor.classrooms);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateClassroom = async (req, res, next) => {
  try {
    const { classroomId } = req.params;
    const { tutorId, name, description } = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      const error = new Error("Could not find classroom.");
      error.statusCode = 404;
      throw error;
    }
    if (classroom.tutorId.toString() !== tutorId) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    classroom.name = name;
    classroom.description = description;
    await classroom.save();
    res.status(200).json({ message: "Classroom updated!", classroom });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchClassroom = async (req, res, next) => {
  try {
    const { classroomId } = req.params;
    const { tutorId, name, description } = req.body;
    const classroom = await Classroom.findOne({
      _id: classroomId,
      tutorId,
    });
    if (!classroom) {
      const error = new Error("Could not find classroom.");
      error.statusCode = 404;
      throw error;
    }
    if (classroom.tutorId.toString() !== tutorId) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    if (name) {
      classroom.name = name;
    }
    if (description) {
      classroom.description = description;
    }
    await classroom.save();
    res.status(200).json({ message: "Classroom updated!", classroom });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteClassroom = async (req, res, next) => {
  try {
    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      const error = new Error("Could not find classroom.");
      error.statusCode = 404;
      throw error;
    }
    const tutorId = classroom.tutorId.toString();
    await Classroom.findByIdAndDelete(classroomId);
    const tutor = await Tutor.findById(tutorId);
    tutor.classrooms.pull(classroomId);
    await tutor.save();
    res.status(200).json({ message: "Classroom deleted!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
