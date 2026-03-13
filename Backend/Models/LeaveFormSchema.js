import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  TypeOfLeave: {
    type: String,
    required: true,
  },
  DayDuration: {
    type: String,
    required: true,
  },
  FromDate: {
    type: Date,
    required: true,
  },
  ToDate: {
    type: Date,
    required: true,
  },
  Remarks: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  facultyRemark: {
    type: String,
    default: "",
  },
});

const LeaveFormSchema = mongoose.model("LeaveForm", leaveSchema);

export default LeaveFormSchema;
