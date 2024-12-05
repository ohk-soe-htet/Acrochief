import { closeModal, displayPrograms } from "./CreateGymProgram.mjs";
import { Endpoints } from "./Endpoints.mjs";
import { constructPUT } from "./helpers/RequestHelpers.mjs";
import { GymProgramDTO } from "../../common/dtos/GymProgramDTO.mjs";

const updateModal = document.getElementById("updateProgramModal");

export async function openUpdateModal(programId) {
	updateModal.style.display = "block";
	await loadProgramData(programId);
}

const loadProgramData = async (programId) => {
	try {
		const response = await fetch(
			`${Endpoints.GYM_PROGRAM_GET_ENDPOINT}/${programId}`
		);
		if (!response.ok) {
			alert("Failed to fetch program data.");
			return;
		}

		const updateProgramForm = document.getElementById("updateProgramForm");
		updateProgramForm.attributes["data-id"] = programId;

		const program = await response.json();
		document.getElementById("updateName").value = program.name;
		document.getElementById("updateFocusBodyPart").value =
			program.focusBodyPart;
		document.getElementById("updateDifficulty").value = program.difficulty;
		document.getElementById("updateIntensity").value = program.intensity;
		document.getElementById("updateTargetAudience").value =
			program.targetAudience;
		document.getElementById("updateReps").value = program.reps;
		document.getElementById("updateProgramId").value = program.id;
	} catch (error) {
		console.error("Error loading program data:", error);
	}
};

/**
 * @param { SubmitEvent } event
 */
const submitUpdateForm = async (event) => {
	event.preventDefault();

	const target = event.target;

	let formData = new FormData(target);

	formData = Object.fromEntries(formData.entries());

	const updatedProgram = new GymProgramDTO({
		id: formData.id,
		name: formData.name,
		focusBodyPart: formData.focusBodyPart,
		intensity: formData.intensity,
		difficulty: formData.difficulty,
		targetAudience: formData.targetAudience,
		reps: parseInt(formData.reps, 10),
		isActive: true, // TODO: Add frontend support for this
	});

	try {
		const response = await fetch(
			`${Endpoints.GYM_PROGRAM_UPDATE_ENDPOINT}/${updatedProgram.id}`,
			constructPUT(updatedProgram)
		);

		if (response.ok) {
			alert(
				`Program: [${updatedProgram.name}] has been updated successfully!`
			);
			event.target.reset();
			closeModal(document.getElementById("updateProgramModal"));
			await displayPrograms();
		} else {
			const errorData = await response.json();
			alert(
				"Error updating program: " +
					(errorData.errors
						? errorData.errors.join(", ")
						: "Unknown error!")
			);
		}
	} catch (error) {
		alert("Failed to connect to the server.");
		console.error("Error submitting update form: ", error);
	}
};

const startProgramHandlers = async () => {
	const modal = document.getElementById("updateProgramModal");
	const closeModalButton = document.getElementById("closeModalButton");
	const programForm = document.getElementById("programForm");

	closeModalButton.addEventListener("click", () => closeModal(modal));

	const closeUpdateModalButton = document.getElementById(
		"closeUpdateModalButton"
	);

	closeUpdateModalButton.addEventListener(
		"click",
		() => (updateModal.style.display = "none")
	);

	const updateProgramForm = document.getElementById("updateProgramForm");
	updateProgramForm.addEventListener("submit", submitUpdateForm);

	await displayPrograms();
};

startProgramHandlers();
