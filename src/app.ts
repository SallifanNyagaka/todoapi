import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapiDocument } from "./docs/openapi.js";
import { assignmentRouter } from "./routes/assignment.routes.js";
import { taskRouter } from "./routes/task.routes.js";

export const app = express();

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use("/tasks", assignmentRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (_request, response) => {
  response.status(200).json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
    status: "ok",
    service: "Todo API",
    routes: [
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

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    message: "Todo API is running here",
  });
});
