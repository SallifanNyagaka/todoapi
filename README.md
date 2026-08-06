# Task API

An in-memory Todo CRUD API built with Node.js, Express, and TypeScript.

This project was built incrementally as part of the CRUD API assignment. It demonstrates the four core data operations:

- Create a task
- Read one or more tasks
- Update a task
- Delete a task

## Requirements

- Node.js 20.6 or newer
- npm

## Install and run

```bash
npm install
npm run dev
```

The API starts at:

```text
http://localhost:3000
```

The production-style build commands are:

```bash
npm run build
npm start
```

## Swagger UI

Interactive API documentation is available at:

```text
http://localhost:3000/docs/
```

Open an endpoint, select **Try it out**, provide any required values, and select **Execute** to send a real request.

![Swagger UI showing the Task API CRUD endpoints](docs/swagger-ui.png)

## Assignment endpoints

| Method | Endpoint | Description | Success status |
| --- | --- | --- | --- |
| GET | `/` | Describe the API | 200 |
| GET | `/health` | Check whether the server is running | 200 |
| GET | `/tasks` | List all tasks | 200 |
| GET | `/tasks/:id` | Get one task | 200 |
| POST | `/tasks` | Create a task | 201 |
| PUT | `/tasks/:id` | Update a task title and/or completion state | 200 |
| DELETE | `/tasks/:id` | Delete a task | 204 |

The API returns `400` for invalid request bodies and `404` when a task ID does not exist.

## Example requests

List tasks:

```bash
curl -i http://localhost:3000/tasks
```

Create a task:

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'
```

Example response:

```text
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  "id": 4,
  "title": "Buy milk",
  "done": false
}
```

Update a task:

```bash
curl -i -X PUT http://localhost:3000/tasks/4 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```

Delete a task:

```bash
curl -i -X DELETE http://localhost:3000/tasks/4
```

An existing task is deleted with status `204 No Content` and an empty response body.

## Task shape

The assignment-compatible endpoints return tasks in this form:

```json
{
  "id": 1,
  "title": "Learn APIs",
  "done": false
}
```

The versioned production API is also available under `/api/v1/tasks`. It uses UUID IDs and includes descriptions and timestamps.

## Important limitation

Tasks are stored in memory only. Restarting the server resets the data to the three seeded example tasks. No database or files are used yet; persistent storage is planned for a later stage.

## Development commands

```bash
npm run dev        # Run TypeScript with automatic restart
npm run typecheck  # Check TypeScript without emitting files
npm run build      # Compile TypeScript to dist/
npm start          # Run the compiled production build
```

## Project structure

```text
src/
├── app.ts                 # Express application and middleware
├── server.ts              # Server startup and port configuration
├── config/env.ts          # Environment configuration
├── data/task-store.ts     # In-memory task data
├── docs/openapi.ts        # OpenAPI/Swagger document
├── routes/                # HTTP routes and validation
├── services/              # Task business logic
└── types/                 # TypeScript models
```

## License

ISC

## AI vs me

The hand-built implementation is the production version in `src/`. The isolated AI implementation is in `ai-version/` and runs on port `3001`.

### Prompt used for the AI version

```text
Build a small Todo CRUD API in plain JavaScript using Node.js and Express.

Requirements:

- Store data in memory only; do not use a database or files.
- Use port 3001 by default so this version can run beside another local API.
- Start with three example tasks. Each task must have a numeric id, string title, and boolean done.
- Implement GET /, GET /health, GET /tasks, GET /tasks/:id, POST /tasks, PUT /tasks/:id, and DELETE /tasks/:id.
- POST creates a task from { "title": "..." } and returns 201.
- PUT updates a title and/or done state and returns 200.
- DELETE returns 204.
- Return 400 with a JSON error for invalid POST or PUT input.
- Return 404 with a JSON error for unknown IDs.
- Add Swagger UI at /docs documenting all five task endpoints.
- Keep the implementation self-contained in an ai-version folder with its own package.json.
- Include simple run instructions.
```

### Concrete differences

1. The AI version is plain JavaScript with one main `src/server.js` file. The hand-built version uses TypeScript with separate application, route, service, configuration, data, and documentation modules.
2. The AI version uses numeric IDs and `done`. The hand-built production API uses UUID IDs, `completed`, descriptions, and timestamps. A compatibility adapter exposes the assignment shape at `/tasks`.
3. The AI version performs manual validation in route handlers and silently ignores unknown fields. The hand-built version uses Zod schemas with strict unknown-field rejection and reusable validation behavior.
4. The hand-built version validates environment configuration and supports `.env`; the AI version uses a simple `PORT` fallback.
5. The production OpenAPI document contains detailed schemas, examples, and response definitions. The AI document is smaller and documents fewer response details.

### Result

The AI version passed the Stage 4 checkpoint independently on port `3001`: it returned three seeded tasks, created a task with `201`, read it, updated it with `PUT`, deleted it with `204`, returned `404` for an unknown ID, and served Swagger UI at `/docs/`.

### Improved rematch

The second prompt is in `ai-version-v2/PROMPT.md`, and its generated implementation is in `ai-version-v2/`. The rematch added strict rejection of unknown request fields and validated the configured port after the first version quietly ignored extra fields and accepted any numeric port. It runs on port `3002` and passed the same CRUD checkpoint.
