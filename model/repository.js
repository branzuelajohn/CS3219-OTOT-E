import QuestionModel from "./question-model";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createQuestion(params) {
  return new QuestionModel(params);
}

export async function findAllQuestions() {
  return QuestionModel.find();
}

export async function findQuestion(name) {
  return QuestionModel.findOne({ name });
}

export async function deleteQuestion(name) {
  return QuestionModel.deleteOne({ name });
}

export async function changeDifficulty(name, newDifficulty) {
  return QuestionModel.updateOne(
    {
      name: name,
    },
    {
      $set: {
        difficulty: newDifficulty,
      },
    }
  );
}
