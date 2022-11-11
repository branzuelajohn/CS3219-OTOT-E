import {
  ormChangeDifficulty as _changeDifficulty,
  ormDeleteQuestion as _deleteQuestion,
  ormFindQuestion as _findQuestion,
  ormFindAllQuestions as _findAllQuestions,
  ormCreateQuestion as _createQuestion,
} from "../model/question-orm";
import redisClient from "../index";

export async function createQuestion(req, res) {
  try {
    const { name, difficulty, body } = req.body;
    if (name && difficulty && body) {
      const existingQuestion = await _findQuestion(name);

      //check if database have existing name
      if (existingQuestion) {
        return res.status(409).json({ message: "Existing question!" });
      }

      const resp = await _createQuestion(name, difficulty, body);
      if (resp.err) {
        return res
          .status(400)
          .json({ message: "Could not create a new question!" });
      } else {
        return res.status(201).json({
          message: `Created new question ${name} successfully!`,
        });
      }
    } else {
      return res.status(400).json({ message: "Incomplete fields" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when creating new question!" });
  }
}

export async function clearCache(req, res) {
  try {
    const _allQuestions = await redisClient.get("allQuestions");
    if (!_allQuestions) {
      return res.status(200).json({ message: "Cache is empty" });
    } else {
      redisClient.flushDb();
      return res.status(200).json({ message: "Cache is flushed" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error connecting with redis" });
  }
}

export async function findAllQuestions(req, res) {
  try {
    const _allQuestions = await redisClient.get("allQuestions");

    if (!_allQuestions) {
      console.log("Not in redis cache");
      const allQuestions = await _findAllQuestions();
      if (!allQuestions) {
        return res.status(400).json({ message: "No questions found" });
      }
      redisClient.setEx("allQuestions", 200, JSON.stringify(allQuestions));
      return res
        .status(200)
        .json({ _size: allQuestions.length, allQuestions: allQuestions });
    } else {
      console.log("Is cached");
      const allQuestions = await redisClient.get("allQuestions");
      return res.status(200).json({
        _size: JSON.parse(allQuestions).length,
        allQuestions: JSON.parse(allQuestions),
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting questions from database" });
  }
}

export async function findQuestion(req, res) {
  try {
    const { name } = req.query;
    if (name) {
      const question = await _findQuestion(name);
      // check if name exists
      if (!question) {
        return res.status(400).json({ message: "Question does not exist" });
      }
      return res.status(200).json({
        question: question,
        message: `Found question ${name} succesfully`,
      });
    } else {
      return res.status(400).json({ message: "Incomplete fields" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error in finding the question" });
  }
}

export async function changeDifficulty(req, res) {
  try {
    const { name, newDifficulty } = req.body;
    if (name && newDifficulty) {
      const question = await _findQuestion(name);

      // check if name exists
      if (!question) {
        return res.status(400).json({ message: "Question does not exist" });
      }

      const resp = await changeDifficulty(name, newDifficulty);
      if (resp.err) {
        return res
          .status(400)
          .json({ message: "Could not update difficulty!" });
      } else {
        return res.status(200).json({
          message: `Successfully updated grader for question ${name}!`,
        });
      }
    } else {
      return res.status(400).json({
        message: "Incomplete Fields!",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error when updating difficulty!" });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const { name } = req.query;
    if (name) {
      const question = await _findQuestion(name);
      if (!question) {
        return res.status(406).json({ message: "Question does not exist" });
      }

      const resp = await _deleteQuestion(name);
      if (resp.err) {
        return res
          .status(400)
          .json({ message: "Could not delete the question!" });
      } else {
        return res.status(200).json({
          message: `Deleted question ${name} successfully!`,
        });
      }
    } else {
      return res.status(400).json({ message: "name missing!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when deleting the question!" });
  }
}
