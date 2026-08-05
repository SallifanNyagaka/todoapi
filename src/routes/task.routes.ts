import { Router } from "express";
import { z } from "zod";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../services/task.service.js";

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
  const taskList = listTasks();

  return response.status(200).json({
    status: "success",
    data: taskList,
    meta: {
      count: taskList.length,
    },
  });
});

taskRouter.get("/:id", (request, response) => {
  const task = getTaskById(request.params.id);

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
  if (!getTaskById(request.params.id)) {
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

  const updates: {
    title?: string;
    description?: string | null;
    completed?: boolean;
  } = {};

  if (parsedBody.data.title !== undefined) {
    updates.title = parsedBody.data.title;
  }

  if (parsedBody.data.description !== undefined) {
    updates.description = parsedBody.data.description;
  }

  if (parsedBody.data.completed !== undefined) {
    updates.completed = parsedBody.data.completed;
  }

  const task = updateTask(request.params.id, updates);

  return response.status(200).json({
    status: "success",
    data: task,
  });
});

taskRouter.delete("/:id", (request, response) => {
  const deleted = deleteTask(request.params.id);

  if (!deleted) {
    return response.status(404).json({
      status: "error",
      message: "Task not found",
    });
  }

  return response.status(204).send();
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

  const task = createTask({
    title: parsedBody.data.title,
    description: parsedBody.data.description ?? null,
  });

  return response.status(201).json({
    status: "success",
    data: task,
  });
});
