import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
  studentName: String,
  id: {
    type: String,
    unique: true,
  },
});

export const StudentModel = mongoose.model("StudentModel", studentSchema);
