import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema(
  {
    profilePic :{
      type: String,
      default :""
    },
    fullname: {
      type: String,
      trim: true,
    },

    FacultyId: {
      type: Number,
      unique: true,
    },


    DOB: Date,

    Category: String,

    Address: String,

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["faculty", "Student"],
    },

     subjectId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubjectSchema" 
  }],
    Aadhar: {
      type: Number,
      unique: true,
    },

    MONOstd: Number,

  },
  { timestamps: true }
);

const Faculty = mongoose.model("FacultySchema", FacultySchema);

export default Faculty;
