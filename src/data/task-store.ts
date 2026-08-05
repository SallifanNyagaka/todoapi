import type { Task } from "../types/task.js";

const seededAt = new Date().toISOString();

export const tasks: Task[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Learn APIs",
    description: "Understand HTTP and CRUD operations",
    completed: false,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "Build a Todo API",
    description: "Practice Node.js and Express",
    completed: false,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    title: "Write API tests",
    description: "Verify CRUD behavior",
    completed: false,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
];
