import mongoose from "mongoose";
import { catType } from "../Src/utils/category-types.js";
//================================================
const categorySchema = new mongoose.Schema(
  {
    categoryType: {
      type: String,
      required: true,
      enum: [catType.TODO, catType.INPROGRESS, catType.DONE],
      default: catType.TODO,
    },
    name: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtual populate for tasks model
categorySchema.virtual("Tasks", {
  ref: "task",
  localField: "_id",
  foreignField: "categoryId",
});
//================================================
const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
