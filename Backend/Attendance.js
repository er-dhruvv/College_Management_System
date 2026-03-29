import user from "./Models/UserSchema.js";
import AttendanceSchema from "./Models/AttendanceSchema.js";
import TimeTableSchema from "./Models/TimetableSchema.js";
import subjectDetails from "./Models/SubjectSchema.js";
import { verifyToken } from "./middleware/middleware.js";
import Faculty from "./Models/FacultySchema.js";

export let Attendance = (app) => {
  app.get("/timetable", async (req, res) => {
    try {
      let { sem, studentClass } = req.query;
      let query = {};
      if (sem) query.sem = Number(sem);
      if (studentClass && studentClass.trim() !== "") query.class = studentClass;

      let Info = await TimeTableSchema.find(query)
        .sort({ weekday: 1, slot: 1 })
        .select({});

      res.status(200).json({
        Info: Info,
        Success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });

  app.get("/studentTimetable", verifyToken, async (req, res) => {
    try {
      const studentId = req.user.id;
      const studentInfo = await user.findById(studentId).select("sem class batch");
      if (!studentInfo) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      let query = {
        sem: studentInfo.sem,
        class: studentInfo.class
      };

      let Info = await TimeTableSchema.find(query)
        .sort({ weekday: 1, slot: 1 })
        .select({});

      res.status(200).json({
        Info: Info,
        Success: true,
        studentInfo: {
          sem: studentInfo.sem,
          class: studentInfo.class,
          batch: studentInfo.batch
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });

  app.post("/AddTimetable", verifyToken, async (req, res) => {
  try {

    const formData = req.body;

    if (
      !formData.weekday ||
      formData.slot === undefined ||
      !formData.subject ||
      !formData.location ||
      !formData.studentClass ||
      !formData.batch ||
      !formData.sem
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields (weekday, slot, subject, location, class, batch, sem)",
      });
    }

    // Lab must start from odd slot
    if (formData.IsLab === true && formData.slot % 2 === 0) {
      return res.status(422).json({
        success: false,
        message: "Lab can only start on slot 1,3,5",
      });
    }

    // If even slot check previous lab
    if (formData.slot % 2 === 0) {
      const prevslot = await TimeTableSchema.findOne({
        weekday: formData.weekday,
        slot: formData.slot - 1,
        class: formData.studentClass,
        sem: formData.sem,
      }).select("IsLab");

      if (prevslot && prevslot.IsLab === true) {
        return res.status(422).json({
          success: false,
          message: `Slot ${formData.slot - 1} is Lab session`,
        });
      }
    }

    
    
    if (formData.slot % 2 === 1) {
      const nextslot = await TimeTableSchema.findOne({
        weekday: formData.weekday,
        slot: formData.slot + 1,
        class: formData.studentClass,
        sem: formData.sem,
      });

      if (formData.IsLab && nextslot) {
        return res.status(422).json({
          success: false,
          message: `Slot ${formData.slot + 1} already occupied`,
        });
      }
    }

    // Lookup faculty corresponding to the subject
    const subjectDoc = await subjectDetails.findOne({ subject: formData.subject });
    let facultyId = null;
    if (subjectDoc) {
      const facultyDoc = await Faculty.findOne({ subjectId: subjectDoc._id, role: "faculty" });
      if (facultyDoc) {
        facultyId = facultyDoc._id;
      }
    }

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "No faculty found assigned to this subject. Please assign a faculty to this subject first.",
      });
    }

    await TimeTableSchema.findOneAndUpdate(
      {
        weekday: formData.weekday,
        slot: formData.slot,
        class: formData.studentClass,
        sem: formData.sem,
      },
      {
        $set: {
          subject: formData.subject,
          location: formData.location,
          IsLab: formData.IsLab,
          class: formData.studentClass,
          batch: formData.batch,
          sem: formData.sem,
          facultyId: facultyId,
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

  app.get("/getsubjectList",verifyToken,async(req,res)=>{
    try {
      let Info = await subjectDetails.find({}).select('subject')

      res.status(201).json({
        success:true,
        Info
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success:false
      })
    }
  })
  app.get("/facultySlots", verifyToken, async (req, res) => {
    try {
    let facultyId = req.user.id
    let { AttendanceDate } = req.query;

    const day = new Date(AttendanceDate).getDay();

    const timetable = await TimeTableSchema.find({
      facultyId,
      weekday: day,
    }).select("slot subject class batch sem");



    const uniqueMap = new Map();

    timetable.forEach((t) => {
      uniqueMap.set(t.slot, {
        slot: t.slot,
        subject: t.subject,
        class: t.class,
        batch: t.batch,
        sem: t.sem,
      });
    });

    const slotsWithSubjects = [...uniqueMap.values()];

    res.status(200).json({
      success: true,
      slotsWithSubjects,
    });
    } catch (error) {
      console.log(error)
      res.status(500).json({
      success: false,
    });
    }
    
  });

    app.post("/FillAttendance", verifyToken, async (req, res) => {
      try {
        let { AbsentStudents, slot, AttendanceDate } = req.body;

        if (!slot || !AttendanceDate || !Array.isArray(AbsentStudents)) {
          return res.status(400).json({ success: false, message: "Missing required fields or invalid data format for attendance" });
        }

        const presentStudents = await user.find({
          _id: { $nin: AbsentStudents },
        });

        const bulkOps = [];

        presentStudents.forEach((sid) => {
          bulkOps.push({
            updateOne: {
              filter: {
                date: AttendanceDate,
                slot,
                studentId: sid._id,
                facultyId: req.user.id,
              },
              update: { $set: { status: "Present" } },
              upsert: true,
            },
          });
        });

        AbsentStudents.forEach((u) => {
          bulkOps.push({
            updateOne: {
              filter: {
                date: AttendanceDate,
                slot,
                studentId: u,
                facultyId: req.user.id,
              },
              update: { $set: { status: "Absent" } },
              upsert: true,
            },
          });
        });

        await AttendanceSchema.bulkWrite(bulkOps);

        res.status(200).json({
          message: "Attendance Filled successfully",
          success: true,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Server error",
          success: false,
        });
      }
    });

    app.get("/AttendanceData", verifyToken, async (req, res) => {
      try {
        const { slot, date, sem } = req.query;

        let query = { role: "Student" };
        if (sem && sem !== "All") query.sem = sem;

        const students = await user.find(query).select({});

        const attendance = await AttendanceSchema.find({
          date: new Date(date),
          slot: slot,
          facultyId: req.user.id,
          status: "Present",
        });
        const absentattendance = await AttendanceSchema.find({
          date: new Date(date),
          slot: slot,
          facultyId: req.user.id,
          status: "Absent",
        });

        const presentStudents = attendance.map((a) => a.studentId.toString());
        const AbsentStudents = absentattendance.map((a) => a.studentId.toString());

        res.status(200).json({
          success: true,
          students,
          presentStudents,
          AbsentStudents
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    });

  app.get("/ViewAttendanceStudent",verifyToken,async(req,res)=>{
    try {
      
      let userId = req.user.id
      let Info = await AttendanceSchema.find({studentId : userId})
      .sort({ date :1 , slot: 1 })
      .select({});

      // console.log("mai yaha hoo")

      res.status(200).json({
        success :true,
        Info
      })

    } catch (error) {
      console.log(error)
      res.status(500).json({
        success :true,
        
      })
    }
  })
};
