import "dotenv/config";
import express from "express";
import cors from "cors";
import redis from "redis";
import {
  createQuestion,
  changeDifficulty,
  findQuestion,
  findAllQuestions,
  deleteQuestion,
  clearCache,
} from "./controller/question-controller";

const EXPRESS_PORT = Number(process.env.EXPRESS_PORT) || 8080;

const app = express();
// Setting up redis
const redisClient = redis.createClient(6379);

redisClient.on("error", (err) => {
  console.log("Redis client connection error", err);
});

redisClient.on("ready", () => {
  console.log("Redis is set up");
});

await redisClient.connect();
await redisClient.ping();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
const router = express.Router();
router.get("/", findQuestion);
router.post("/", createQuestion);
router.delete("/", deleteQuestion);
router.put("/", changeDifficulty);
router.get("/all", findAllQuestions);
router.get("/clear", clearCache);

app.use("/api/v1", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(EXPRESS_PORT, () => {
  console.log(`[server] is running on http://localhost:${EXPRESS_PORT}`);
});

export default redisClient;
