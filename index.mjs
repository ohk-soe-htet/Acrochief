import express from "express";
import bodyParser from "body-parser";
import { MEMBERS_ROUTER } from "./utils/routes/MemberRoutes.mjs";
import { GYM_PROGRAMS_ROUTER } from "./utils/routes/GymProgramRoutes.mjs";
import { KILL_ROUTER } from "./utils/routes/KillRoutes.mjs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cors from "cors";

import statusMonitor from "express-status-monitor";
import { logger } from "./logger.mjs";

import client from "prom-client";
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

export let app = express();
app.use(statusMonitor());

const PORT = process.env.PORT || 5050;
const START_PAGE = "index.html";

const CORS_OPTIONS = {
	origin: true,
	optionsSuccessStatus: 200,
};

app.use(cors(CORS_OPTIONS));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "/dist")));

const httpRequestDurationMicroseconds = new client.Histogram({
	name: "http_request_duration_ms",
	help: "Duration of HTTP requests in ms",
	labelNames: ["method", "route", "code"],
	buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000], // buckets for response time from 0.1ms to 5s
});

app.use((req, res, next) => {
	const end = httpRequestDurationMicroseconds.startTimer();
	res.on("finish", () => {
		end({
			method: req.method,
			route: req.route ? req.route.path : "",
			code: res.statusCode,
		});
	});
	next();
});

app.get("/metrics", async (req, res) => {
	res.set("Content-Type", client.register.contentType);
	res.end(await client.register.metrics());
});

const ROUTER = express.Router();

ROUTER.use("/members", MEMBERS_ROUTER);
ROUTER.use("/gym-programs", GYM_PROGRAMS_ROUTER);
// Used for killing the server
ROUTER.use("/kill", KILL_ROUTER);

app.get("/", (req, res) => {
	// https://stackoverflow.com/questions/14594121/express-res-sendfile-throwing-forbidden-error
	res.sendFile(path.resolve(`${__dirname}/public/${START_PAGE}`));
});

app.use("/api", ROUTER);

export let server = app.listen(PORT, function () {
	const { address, port } = server.address();
	const baseUrl = `http://${
		address === "::" ? "localhost" : address
	}:${port}`;
	console.log(`Demo project at: ${baseUrl}`);
	logger.info(`Demo project at: ${baseUrl}!`);
	logger.error(`Example or error log`);
});
