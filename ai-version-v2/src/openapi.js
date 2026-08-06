export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "AI Version Task API",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3001" }],
  paths: {
    "/tasks": {
      get: {
        summary: "List tasks",
        responses: { "200": { description: "Tasks" } },
      },
      post: {
        summary: "Create a task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: { title: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
          "400": { description: "Invalid body" },
        },
      },
    },
    "/tasks/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      get: {
        summary: "Get one task",
        responses: {
          "200": { description: "Task" },
          "404": { description: "Not found" },
        },
      },
      put: {
        summary: "Update a task",
        responses: {
          "200": { description: "Updated" },
          "400": { description: "Invalid body" },
          "404": { description: "Not found" },
        },
      },
      delete: {
        summary: "Delete a task",
        responses: {
          "204": { description: "Deleted" },
          "404": { description: "Not found" },
        },
      },
    },
  },
};
