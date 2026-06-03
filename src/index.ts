import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerChirpValidate } from "./api/chirpValidate.js";
import { errorHandler } from "./api/error.js";
import postgres from "postgres";
import { config } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerUsers } from "./api/users.js";

const migrationClient = postgres(config.db.url, { max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use(express.json());

app.get('/api/healthz', handlerReadiness);
app.post('/api/validate_chirp', handlerChirpValidate);
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);
app.post('/api/users', handlerUsers);

app.use(errorHandler);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});