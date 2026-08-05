import { app } from "./app.js";
import { config } from "./config/env.js";

app.listen(config.port, () => {
  console.log(`Todo API is listening on http://localhost:${config.port}`);
});
