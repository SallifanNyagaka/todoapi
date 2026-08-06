export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Task API",
    version: "1.0.0",
    description: "An in-memory CRUD API for managing Todo tasks.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Tasks",
      description: "Create, read, update, and delete tasks",
    },
  ],
  paths: {
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List all tasks",
        responses: {
          "200": {
            description: "A list of tasks",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Task" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTask" },
              example: { title: "Buy milk" },
            },
          },
        },
        responses: {
          "201": {
            description: "Task created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          "400": {
            description: "Invalid request body",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/tasks/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Numeric task ID",
          schema: { type: "integer", minimum: 1 },
          example: 1,
        },
      ],
      get: {
        tags: ["Tasks"],
        summary: "Get one task",
        responses: {
          "200": {
            description: "The requested task",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          "404": {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Tasks"],
        summary: "Update a task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTask" },
              examples: {
                markDone: {
                  summary: "Mark a task complete",
                  value: { done: true },
                },
                rename: {
                  summary: "Rename a task",
                  value: { title: "Buy oat milk" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Task updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          "400": {
            description: "Invalid request body",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        responses: {
          "204": { description: "Task deleted" },
          "404": {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: "object",
        required: ["id", "title", "done"],
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Buy milk" },
          done: { type: "boolean", example: false },
        },
      },
      CreateTask: {
        type: "object",
        required: ["title"],
        additionalProperties: false,
        properties: {
          title: { type: "string", minLength: 1, example: "Buy milk" },
        },
      },
      UpdateTask: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          title: { type: "string", minLength: 1, example: "Buy oat milk" },
          done: { type: "boolean", example: true },
        },
      },
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: { type: "string", example: "Task 99 not found" },
        },
      },
    },
  },
} as const;
