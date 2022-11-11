import {
  createQuestion,
  findQuestion,
  deleteQuestion,
  changeDifficulty,
  findAllQuestions,
} from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateQuestion(name, difficulty, body) {
  try {
    const newQuestion = await createQuestion({
      name,
      difficulty,
      body,
    });
    newQuestion.save((err) => {
      if (err) console.log(err);
    });
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new task");
    return { err };
  }
}

export async function ormFindAllQuestions() {
  try {
    const questions = await findAllQuestions();
    return questions;
  } catch (err) {
    console.log("ERROR: Database error");
    return { err };
  }
}

export async function ormFindQuestion(name) {
  try {
    const question = await findQuestion(name);
    return question;
  } catch (err) {
    console.log("ERROR: Database error");
    return { err };
  }
}

export async function ormChangeDifficulty(name, newDifficulty) {
  try {
    const questionUpdated = await changeDifficulty(name, newDifficulty);
    return questionUpdated;
  } catch (err) {
    console.log("ERROR: Could not update grader");
    return { err };
  }
}

export async function ormDeleteQuestion(name) {
  try {
    await deleteQuestion(name);
    return true;
  } catch (err) {
    console.log("ERROR: Could not delete task");
    return { err };
  }
}
