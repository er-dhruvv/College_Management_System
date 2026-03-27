import express from "express";
import cors from "cors";
import connectDB from "./config/dbconnection.js";
import cookieParser from "cookie-parser";

// ROUTES / FUNCTIONS
import { login } from "./authentication/login.js";
import logout from "./authentication/logout.js";
import { Isloggedin } from "./authentication/Isloggedin.js";

import { getInfo } from "./getInfo.js";
import { LeaveForm } from "./LeaveForm.js";
import { getLeaveDetailStudent } from "./getLeaveDetailStudent.js";
import { getAllStudentLeave } from "./getAllStudentLeave.js";

import { ProfileStudent } from "./ProfileDetails.js";
import { UpdateuserData } from "./UpdateuserData.js";

import { Attendance } from "./Attendance.js";
import { subjects } from "./Subjects.js";

import studentRoutes from "./routes/studentRoutes.js";
import marksRoutes from "./routes/marksRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;


// ✅ CORS CONFIG (FINAL FIX 🔥)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://college-management-system-jw7x.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔥 IMPORTANT: HANDLE PREFLIGHT REQUESTS
app.options("*", cors());


// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// STATIC FOLDER
app.use("/ProfilePicture", express.static("ProfilePicture"));

// CONNECT DATABASE
connectDB();


// ROUTES / APIs
login(app);
logout(app);
Isloggedin(app);

getInfo(app);
LeaveForm(app);
getLeaveDetailStudent(app);
getAllStudentLeave(app);

ProfileStudent(app);
UpdateuserData(app);

Attendance(app);
subjects(app);

// ROUTER FILES
app.use("/api/students", studentRoutes);
app.use("/api/marks", marksRoutes);


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});