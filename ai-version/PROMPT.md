# AI generation prompt

Build a small Todo CRUD API in plain JavaScript using Node.js and Express.

Requirements:

- Store data in memory only; do not use a database or files.
- Use port 3001 by default so this version can run beside another local API.
- Start with three example tasks. Each task must have a numeric `id`, string `title`, and boolean `done`.
- Implement these endpoints:
  - `GET /` returning API information
  - `GET /health` returning `{ "status": "ok" }`
  - `GET /tasks` listing tasks
  - `GET /tasks/:id` returning one task or `404` with JSON error data
  - `POST /tasks` creating a task from `{ "title": "..." }`, returning `201`
  - `PUT /tasks/:id` updating a title and/or done state, returning `200`
  - `DELETE /tasks/:id` deleting a task, returning `204`
- Return `400` with a JSON error when POST or PUT input is missing or invalid.
- Return `404` with a JSON error for unknown IDs.
- Add Swagger UI at `/docs` documenting all five task endpoints.
- Keep the implementation self-contained in an `ai-version` folder with its own package.json.
- Include simple run instructions.
