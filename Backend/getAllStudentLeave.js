import { verifyToken } from "./middleware/middleware.js";
import LeaveFormSchema from "./Models/LeaveFormSchema.js";


export let getAllStudentLeave = (app) => {
  app.get("/getAllStudentLeave", verifyToken, async (req, res) => {
    let leaveInfo = await LeaveFormSchema.find({})
      .populate("userId", "username fullname Enrollno role")
      .select("userId TypeOfLeave DayDuration FromDate ToDate Remarks status");

    // console.log(leaveInfo);

    res.status(200).json({
      info: leaveInfo,
      success: true,
    });
  });

  app.put("/UpdateLeaveStatus", verifyToken, async (req, res) => {
    let { leaveId, status, facultyRemark } = req.body;

    if (!leaveId || !status) {
        return res.status(400).json({ success: false, message: "leaveId and status are required to update leave request" });
    }

    // console.log('remark:',facultyRemark)

    try {
      let updatedLeave = await LeaveFormSchema.findByIdAndUpdate(
      leaveId,
      {$set: {status ,facultyRemark}},
      { new: true },
    ).select("status facultyRemark");
    // console.log(updatedLeave);

    if (!updatedLeave) {
      res.status(404).json({
        message: "Leave is not found",
        success: false,
      });
    }

    res.status(200).json({
      info: updatedLeave,
      success: true,
      message: "Leave Updated successfully",
    });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message:"server error",
        success:false
      })
    }

    
  });

  
};
