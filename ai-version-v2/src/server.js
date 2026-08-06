import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapiDocument } from "./openapi.js";

const app = express();
const port = Number(process.env.PORT || 3002);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const tasks = [
  { id: 1, title: "Learn APIs", done: false },
  { id: 2, title: "Build a Todo API", done: false },
  { id: 3, title: "Write tests", done: false },
];

let nextId = 4;

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get("/", (_request, response) => {
  response.json({
    name: "AI Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/tasks", (_request, response) => {
  response.json(tasks);
});

app.get("/tasks/:id", (request, response) => {
  const task = tasks.find((item) => item.id === Number(request.params.id));

  if (!task) {
    return response.status(404).json({
      error: `Task ${request.params.id} not found`,
    });
  }

  response.json(task);
});

app.post("/tasks", (request, response) => {
  const { title } = request.body ?? {};
  const unknownFields = Object.keys(request.body ?? {}).filter(
    (field) => field !== "title",
  );

  if (
    unknownFields.length > 0 ||
    typeof title !== "string" ||
    title.trim() === ""
  ) {
    return response.status(400).json({
      error: "Only a non-empty title is accepted",
    });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    done: false,
  };

  tasks.push(task);
  response.status(201).json(task);
});

app.put("/tasks/:id", (request, response) => {
  const task = tasks.find((item) => item.id === Number(request.params.id));

  if (!task) {
    return response.status(404).json({
      error: `Task ${request.params.id} not found`,
    });
  }

  const { title, done } = request.body ?? {};
  const unknownFields = Object.keys(request.body ?? {}).filter(
    (field) => field !== "title" && field !== "done",
  );
  const hasTitle = title !== undefined;
  const hasDone = done !== undefined;

  if (
    unknownFields.length > 0 ||
    (!hasTitle && !hasDone) ||
    (hasTitle && (typeof title !== "string" || title.trim() === "")) ||
    (hasDone && typeof done !== "boolean")
  ) {
    return response.status(400).json({
      error: "Provide a non-empty title and/or boolean done value",
    });
  }

  if (hasTitle) task.title = title.trim();
  if (hasDone) task.done = done;

  response.json(task);
});

app.delete("/tasks/:id", (request, response) => {
  const index = tasks.findIndex((item) => item.id === Number(request.params.id));

  if (index === -1) {
    return response.status(404).json({
      error: `Task ${request.params.id} not found`,
    });
  }

  tasks.splice(index, 1);
  response.status(204).send();
});

app.listen(port, () => {
  console.log(`AI version listening on http://localhost:${port}`);
});
