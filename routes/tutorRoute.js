// Import required modules
const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const tutorController = require("../controllers/tutorController");

// Create a new tutor account
router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password is too short"),
  ],
  tutorController.signup
);

// Create a new classroom
router.post(
  "/classroom",
  [
    body("name").trim().notEmpty().withMessage("Classroom name is require"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Classroom description is require"),
  ],
  tutorController.createClassroom
);

// Get all classrooms for a tutor
router.get("/classrooms/:tutorId", tutorController.getClassrooms);


// Replace a classroom
router.put(
  "/classroom/:classroomId",
  [body("name").trim(), body("description").trim()],
  tutorController.updateClassroom
);

// Update a classroom
router.patch(
  "/classroom/:classroomId",
  [body("name").trim(), body("description").trim()],
  tutorController.patchClassroom
);

// Delete a classroom
router.delete("/classroom/:classroomId", tutorController.deleteClassroom);
module.exports = router;
