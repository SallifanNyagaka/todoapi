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

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").max(200).optional(),
    description: z.string().trim().max(2_000).nullable().optional(),
    completed: z.boolean().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

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

taskRouter.get("/:id", (request, response) => {
  const task = tasks.find((item) => item.id === request.params.id);

  if (!task) {
    return response.status(404).json({
      status: "error",
      message: "Task not found",
    });
  }

  return response.status(200).json({
    status: "success",
    data: task,
  });
});

taskRouter.patch("/:id", (request, response) => {
  const task = tasks.find((item) => item.id === request.params.id);

  if (!task) {
    return response.status(404).json({
      status: "error",
      message: "Task not found",
    });
  }

  const parsedBody = updateTaskSchema.safeParse(request.body);

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

  if (parsedBody.data.title !== undefined) {
    task.title = parsedBody.data.title;
  }

  if (parsedBody.data.description !== undefined) {
    task.description = parsedBody.data.description;
  }

  if (parsedBody.data.completed !== undefined) {
    task.completed = parsedBody.data.completed;
  }

  task.updatedAt = new Date().toISOString();

  return response.status(200).json({
    status: "success",
    data: task,
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
