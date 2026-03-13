import express from "express";
import { getStudents, getStudentByEnrollno, createStudent, updateStudent, deleteStudent } from "../controllers/studentController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

// Route: /api/students
router.route("/")
  .get(verifyToken, getStudents)
  .post(verifyToken, createStudent);

// Route: /api/students/:Enrollno
router.route("/:Enrollno")
  .get(verifyToken, getStudentByEnrollno)
  .put(verifyToken, updateStudent)
  .delete(verifyToken, deleteStudent);

export default router;
