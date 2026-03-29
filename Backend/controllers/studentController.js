import user from "../Models/UserSchema.js";
import bcrypt from "bcryptjs";

export const getStudents = async (req, res) => {
  try {
    const { sem, studentClass, searchTerm } = req.query;
    let query = { role: "Student" };

    if (sem) query.sem = sem;
    if (studentClass) query.class = studentClass;
    
    if (searchTerm) {
      query.$or = [
        { fullname: { $regex: searchTerm, $options: "i" } },
        { $expr: { $regexMatch: { input: { $toString: "$Enrollno" }, regex: searchTerm } } }
      ];
    }

    const students = await user.find(query).select("-password");
    res.status(200).json({ success: true, Info: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getStudentByEnrollno = async (req, res) => {
  try {
    const { Enrollno } = req.params;
    const student = await user.findOne({ Enrollno, role: "Student" }).select("-password");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, Info: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createStudent = async (req, res) => {
  try {
    const {
      fullname, Enrollno, rollno, DOB, Category, Address, email, 
      sem, studentClass, username, password, Aadhar, MONOstd, MONOsparent
    } = req.body;

    if (!fullname || !Enrollno || !email || !username || !password || !sem || !studentClass || !Aadhar) {
      return res.status(400).json({ success: false, message: "Please provide all required fields (fullname, Enrollno, email, username, password, sem, class, Aadhar)" });
    }

    const existingUser = await user.findOne({ $or: [{ email }, { username }, { Enrollno }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this Email, Username, or Enrollment No already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new user({
      fullname, Enrollno, rollno, DOB, Category, Address, email,
      sem, class: studentClass, username, password: hashedPassword, role: "Student",
      Aadhar, MONOstd, MONOsparent
    });

    await newStudent.save();
    res.status(201).json({ success: true, message: "Student created successfully", Info: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { Enrollno } = req.params;
    const { formData } = req.body;

    if (!formData || typeof formData !== "object" || Object.keys(formData).length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or empty formData provided" });
    }

    const updatedStudent = await user.findOneAndUpdate(
      { Enrollno, role: "Student" },
      { $set: formData },
      { new: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student updated successfully", Info: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { Enrollno } = req.params;
    const deletedStudent = await user.findOneAndDelete({ Enrollno, role: "Student" });

    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
