import mongoose from "mongoose";
import taskAccessSpecifiers from "../Src/utils/task.access-specifier.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    textBody: {
      type: String,
      required: true,
    },
    listBody: {
      type: [String], // Assuming it's an array of strings
      required: true,
    },
    accessSpecifier: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
//================================================================
const taskModel = mongoose.model("Task", taskSchema);
export default taskModel;
