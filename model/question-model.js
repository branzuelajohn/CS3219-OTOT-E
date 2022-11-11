import mongoose from "mongoose";
var Schema = mongoose.Schema;
let QuestionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("QuestionModel", QuestionSchema);
