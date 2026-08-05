import { randomUUID } from "node:crypto";
import { tasks } from "../data/task-store.js";
import type { Task } from "../types/task.js";

export interface CreateTaskInput {
  title: string;
  description: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export function listTasks(): Task[] {
  return [...tasks];
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}

export function createTask(input: CreateTaskInput): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);
  return task;
}

export function updateTask(id: string, input: UpdateTaskInput): Task | undefined {
  const task = getTaskById(id);

  if (!task) {
    return undefined;
  }

  if (input.title !== undefined) {
    task.title = input.title;
  }

  if (input.description !== undefined) {
    task.description = input.description;
  }

  if (input.completed !== undefined) {
    task.completed = input.completed;
  }

  task.updatedAt = new Date().toISOString();
  return task;
}

export function deleteTask(id: string): boolean {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
}
