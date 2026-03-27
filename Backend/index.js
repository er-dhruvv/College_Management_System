import express from "express";
import cors from "cors";
import connectDB from "./config/dbconnection.js";
import { login } from "./authentication/login.js";
import { LeaveForm } from "./LeaveForm.js";
import cookieParser from "cookie-parser";
import logout from "./authentication/logout.js";
import { getInfo } from "./getInfo.js";
import { Isloggedin } from "./authentication/Isloggedin.js";
import { getLeaveDetailStudent } from "./getLeaveDetailStudent.js";
import { ProfileStudent } from "./ProfileDetails.js";
import { UpdateuserData } from "./UpdateuserData.js";
import { getAllStudentLeave } from "./getAllStudentLeave.js";
import studentRoutes from "./routes/studentRoutes.js";
import marksRoutes from "./routes/marksRoutes.js";
import { Attendance } from "./Attendance.js";
import { subjects } from "./Subjects.js";

const app = express();
let Port = process.env.PORT || 5000;

import cors from "cors";

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(cookieParser());
app.use("/ProfilePicture", express.static("ProfilePicture"));

connectDB();

login(app);

Isloggedin(app);

getInfo(app);

getLeaveDetailStudent(app);
LeaveForm(app);
getAllStudentLeave(app);

app.use("/api/students", studentRoutes);
app.use("/api/marks", marksRoutes);

subjects(app);

UpdateuserData(app);
ProfileStudent(app);
Attendance(app);
logout(app);

app.listen(Port, () => {
  console.log(`port ${Port} is listening`);
});
