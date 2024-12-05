import { Router } from "express";
import { createProgram } from "../controllers/GymProgramCreateController.mjs";
import {
	getProgramsAsync,
	getOneProgramAsync,
} from "../controllers/GymProgramGetController.mjs";
import { updateProgram } from "../controllers/GymProgramUpdateController.mjs";

export const GYM_PROGRAMS_ROUTER = Router();

GYM_PROGRAMS_ROUTER.post("/create", createProgram);
GYM_PROGRAMS_ROUTER.get("/", getProgramsAsync);
GYM_PROGRAMS_ROUTER.get("/:id", getOneProgramAsync);
GYM_PROGRAMS_ROUTER.put("/update/:id", async (req, res) => {
	try {
		await updateProgram(req, res);
	} catch (error) {
		res.status(500).json({ errors: [error.message] });
	}
});
