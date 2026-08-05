import express from "express";
import { taskRouter } from "./routes/task.routes.js";

export const app = express();

app.use(express.json());

app.use("/api/v1/tasks", taskRouter);

app.get("/", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "Todo API",
    version: "1.0.0",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/health",
        description: "Check whether the API is running",
      },
      {
        method: "GET",
        path: "/api/v1/tasks",
        description: "List all tasks",
      },
      {
        method: "POST",
        path: "/api/v1/tasks",
        description: "Create a task",
      },
    ],
  });
});

app.get("/api/v1/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    message: "Todo API is running here",
  });
});
