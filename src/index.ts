import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerChirpValidate } from "./api/chirps.js";
import { errorHandler } from "./api/error.js";
import postgres from "postgres";
import { config } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerUsers } from "./api/users.js";
import { handlerGetAllChirps } from "./api/chirps.js";

const migrationClient = postgres(config.db.url, { max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use(express.json());

app.get('/api/healthz', handlerReadiness);
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);
app.post('/api/users', handlerUsers);
app.post('/api/chirps', handlerChirpValidate);
app.get('/api/chirps', handlerGetAllChirps);

app.use(errorHandler);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});