import { DB_INSTANCE } from "../database/JSONDatabase.mjs";
import { GymProgramDTO } from "../../common/dtos/GymProgramDTO.mjs";

export const updateProgram = async (req, res) => {
	const programId = req.params.id;
	const programData = req.body;
	const errors = [];

	let {
		name,
		focusBodyPart,
		intensity,
		difficulty,
		targetAudience,
		reps,
		isActive,
	} = programData;

	isActive = isActive ?? true;

	// Change to lower case
	[focusBodyPart, intensity, difficulty, targetAudience] = [
		focusBodyPart,
		intensity,
		difficulty,
		targetAudience,
	].map((str) => str.toLowerCase());

	// Validation
	if (!name || typeof name !== "string") {
		errors.push("Name is required and should be a string.");
	}

	if (!["upper", "lower", "back"].includes(focusBodyPart)) {
		errors.push("Focus body part must be 'upper' or 'lower' or 'back'.");
	}

	if (!["mild", "average", "high"].includes(intensity)) {
		errors.push("Intensity must be 'mild', 'average', or 'high'.");
	}

	if (!["beginner", "intermediate", "advanced"].includes(difficulty)) {
		errors.push(
			"Difficulty must be 'beginner', 'intermediate', or 'advanced'."
		);
	}

	if (!["teenagers", "adults", "elders"].includes(targetAudience)) {
		errors.push(
			"Target audience must be 'teenagers', 'adults', or 'elders'."
		);
	}

	if (!reps || typeof reps !== "number") {
		errors.push("Reps must be a number.");
	}

	// Validation for difficulty and intensity levels
	if (difficulty === "beginner") {
		if (intensity === "high") {
			errors.push("Beginner programs cannot have 'high' intensity.");
		}
		if (reps > 10) {
			errors.push("Beginner programs should have fewer than 10 reps.");
		}
	} else if (
		difficulty === "intermediate" &&
		intensity === "high" &&
		reps > 20
	) {
		errors.push(
			"Intermediate programs should not exceed 20 reps with high intensity."
		);
	} else if (difficulty === "advanced") {
		if (intensity !== "high") {
			errors.push("Advanced programs must have 'high' intensity.");
		}
		if (reps < 15) {
			errors.push(
				"Advanced programs should have at least 15 reps for effective workout."
			);
		}
	}

	const database = DB_INSTANCE;
	const existingPrograms = database.programs;

	if (!existingPrograms.has(programId)) {
		errors.push("Program with this ID does not exist.");
	}

	// Return errors if validation fails
	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}

	// Update and save the program
	const updatedProgram = new GymProgramDTO({
		id: programId,
		name,
		focusBodyPart,
		intensity,
		difficulty,
		targetAudience,
		reps,
		isActive,
	});

	existingPrograms.set(programId, updatedProgram);
	await database.updateAsync();

	// Return the updated program
	res.status(200).json({
		message: "Program updated successfully!",
		program: updatedProgram,
	});
};
