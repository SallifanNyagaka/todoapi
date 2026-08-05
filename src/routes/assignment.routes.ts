import { Router, type Response } from "express";
import { z } from "zod";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../services/task.service.js";
import type { Task } from "../types/task.js";

const createTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
  })
  .strict();

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200).optional(),
    done: z.boolean().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

type AssignmentTask = {
  id: number;
  title: string;
  done: boolean;
};

const legacyIdByTaskId = new Map<string, number>();
let nextLegacyId = 1;

for (const task of listTasks()) {
  legacyIdByTaskId.set(task.id, nextLegacyId);
  nextLegacyId += 1;
}

function toAssignmentTask(task: Task): AssignmentTask {
  let legacyId = legacyIdByTaskId.get(task.id);

  if (legacyId === undefined) {
    legacyId = nextLegacyId;
    nextLegacyId += 1;
    legacyIdByTaskId.set(task.id, legacyId);
  }

  return {
    id: legacyId,
    title: task.title,
    done: task.completed,
  };
}

function findTaskByLegacyId(rawId: string): Task | undefined {
  const legacyId = Number(rawId);

  if (!Number.isInteger(legacyId) || legacyId < 1) {
    return undefined;
  }

  const taskId = [...legacyIdByTaskId.entries()].find(
    ([, mappedId]) => mappedId === legacyId,
  )?.[0];

  return taskId === undefined ? undefined : getTaskById(taskId);
}

function notFoundResponse(rawId: string, response: Response) {
  return response.status(404).json({
    error: `Task ${rawId} not found`,
  });
}

export const assignmentRouter = Router();

assignmentRouter.get("/", (_request, response) => {
  return response.status(200).json(listTasks().map(toAssignmentTask));
});

assignmentRouter.get("/:id", (request, response) => {
  const task = findTaskByLegacyId(request.params.id);

  if (!task) {
    return notFoundResponse(request.params.id, response);
  }

  return response.status(200).json(toAssignmentTask(task));
});

assignmentRouter.post("/", (request, response) => {
  const parsedBody = createTaskSchema.safeParse(request.body);

  if (!parsedBody.success) {
    return response.status(400).json({
      error: "Title is required and must be non-empty",
    });
  }

  const task = createTask({
    title: parsedBody.data.title,
    description: null,
  });

  return response.status(201).json(toAssignmentTask(task));
});

assignmentRouter.put("/:id", (request, response) => {
  const existingTask = findTaskByLegacyId(request.params.id);

  if (!existingTask) {
    return notFoundResponse(request.params.id, response);
  }

  const parsedBody = updateTaskSchema.safeParse(request.body);

  if (!parsedBody.success) {
    return response.status(400).json({
      error: "Provide a non-empty title and/or a boolean done value",
    });
  }

  const updates: { title?: string; completed?: boolean } = {};

  if (parsedBody.data.title !== undefined) {
    updates.title = parsedBody.data.title;
  }

  if (parsedBody.data.done !== undefined) {
    updates.completed = parsedBody.data.done;
  }

  const updatedTask = updateTask(existingTask.id, updates);

  return response.status(200).json(toAssignmentTask(updatedTask!));
});

assignmentRouter.delete("/:id", (request, response) => {
  const existingTask = findTaskByLegacyId(request.params.id);

  if (!existingTask) {
    return notFoundResponse(request.params.id, response);
  }

  deleteTask(existingTask.id);
  return response.status(204).send();
});
