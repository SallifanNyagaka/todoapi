import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { tasks } from "../data/task-store.js";
import type { Task } from "../types/task.js";

const createTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
    description: z.string().trim().max(2_000).nullable().optional(),
  })
  .strict();

export const taskRouter = Router();

taskRouter.get("/", (_request, response) => {
  return response.status(200).json({
    status: "success",
    data: tasks,
    meta: {
      count: tasks.length,
    },
  });
});

taskRouter.post("/", (request, response) => {
  const parsedBody = createTaskSchema.safeParse(request.body);

  if (!parsedBody.success) {
    return response.status(400).json({
      status: "error",
      message: "Request body is invalid",
      errors: parsedBody.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
  }

  const now = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    title: parsedBody.data.title,
    description: parsedBody.data.description ?? null,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);

  return response.status(201).json({
    status: "success",
    data: task,
  });
});
