import express from "express";
import { addMarks, getMarks, facultySubjectList } from "../controllers/marksController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

router.get("/facultySubjectList", verifyToken, facultySubjectList);
router.post("/addMarks", verifyToken, addMarks);
router.get("/getMarks", verifyToken, getMarks);

export default router;
