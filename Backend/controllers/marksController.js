import MarksDetail from "../Models/MarksSchema.js";
import FacultySchema from "../Models/FacultySchema.js";

export const facultySubjectList = async (req, res) => {
  try {
    let facId = req.user.id;
    let subjectList = await FacultySchema.findById(facId).populate('subjectId', 'subject').select('subjectId');

    res.status(200).json({
      success: true,
      subjectList
    });
  } catch (error) {
    console.log("from facultySubjectList Route:", error);
    res.status(500).json({
      success: false,
      message: "subjects are not found!"
    });
  }
};

export const addMarks = async (req, res) => {
  try {
    const { marksData, subjectId } = req.body;

    if (!marksData || typeof marksData !== 'object' || !subjectId) {
      return res.status(400).json({ success: false, message: "Valid marksData and subjectId are required" });
    }

    for (let studentId in marksData) {
      await MarksDetail.findOneAndUpdate(
        { student: studentId, subjectId: subjectId },
        {
          student: studentId,
          subjectId: subjectId,
          marks: marksData[studentId],
        },
        { upsert: true },
      );
    }

    res.status(201).json({
      success: true,
      message: "Marks Updated successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error"
    });
  }
};

export const getMarks = async (req, res) => {
  try {
    const { subjectId } = req.query;

    const marks = await MarksDetail.find({ subjectId: subjectId });

    let formatted = {};
    marks.forEach((m) => {
      if(req.user && req.user.role === 'Student') {
         formatted[m.subjectId] = m.marks; 
      } else {
         formatted[m.student] = m.marks;
      }
      
    });

    res.json({
      success: true,
      marks: formatted
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching marks"
    });
  }
};
