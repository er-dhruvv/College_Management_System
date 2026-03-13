import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubjectSchema"
  },
  date:{
    type :Date
  },
  class: { type: String, trim: true },
  batch: { type: String, trim: true },
  marks: {
    Midsem: { type: Number},
    SEE: { type: Number},
    PracticalExam: { type: Number},
    RegularAssesment: { type: Number}
  }
});

let MarksDetail = mongoose.model("MarksSchema",MarksSchema)

export default MarksDetail