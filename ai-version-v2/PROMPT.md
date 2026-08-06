# Improved rematch prompt

Improve the first AI-generated Todo API while preserving its public contract. Keep plain JavaScript, Node.js, Express, in-memory numeric tasks, `/tasks` CRUD routes, and Swagger UI at `/docs`.

For this rematch:

- Use port 3002 by default and validate that the configured port is an integer from 1 through 65535.
- Reject unknown request-body fields with status 400 instead of silently ignoring them.
- Keep title validation strict: it must be a non-empty string after trimming.
- Keep PUT validation strict: at least one of title or done is required, title must be non-empty when supplied, and done must be boolean when supplied.
- Keep the same 200, 201, 204, 400, and 404 status behavior.
- Keep Swagger documentation and the implementation isolated from the hand-built API.
