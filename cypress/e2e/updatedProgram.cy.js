describe("Update Program Frontend", () => {
	let baseUrl;
	before(() => {
		cy.task("startServer").then((url) => {
			baseUrl = url; // Store the base URL
			cy.visit(`${baseUrl}/pages/ManageGymPrograms.html`);
		});
	});
	after(() => {
		return cy.task("stopServer"); // Stop the server after the report is done
	});

	// it("should show an error if response is not ok when loading program data", () => {
	// 	cy.visit(`${baseUrl}/pages/ManageGymPrograms.html`);

	// 	cy.intercept("GET", "/api/gym-programs/13").as("getInvalidProgram");
	// 	cy.window().then((win) => {
	// 		cy.spy(win.console, "error").as("consoleError");
	// 	});

	// 	// Open the update modal for the program with ID '1'
	// 	cy.get("button[data-id='1']").click();

	// 	cy.wait("@getInvalidProgram");

	// 	cy.get("@consoleError").should(
	// 		"be.calledWith",
	// 		/Failed to fetch program data./
	// 	);
	// });

	it("should show an error when failed to connect to the server", () => {
		cy.visit(`${baseUrl}/pages/ManageGymPrograms.html`);

		// Open the update modal for the program with ID '1'
		cy.get("button[data-id='1']").click();

		// Fill out the update form
		cy.get("#updateReps").clear().type("8");

		// Submit the update form
		cy.get("#updateProgramForm").submit();

		// Verify the error message from window alert
		cy.on("window:alert", (str) => {
			expect(str).to.equal("Failed to connect to the server.");
		});
	});

	it("should update a program successfully", () => {
		cy.visit(`${baseUrl}/pages/ManageGymPrograms.html`);

		// Open the update modal for the program with ID '1'
		cy.get("button[data-id='1']").click();

		// Fill out the update form
		cy.get("#updateName").clear().type("Updated Program");

		// Submit the update form
		cy.get("#updateProgramForm").submit();

		// Verify the updated values in the program list
		cy.get("#1 .card-title").should("contain.text", "Updated Program");
	});

	it("should show an error when updating a program with invalid data", () => {
		cy.visit(`${baseUrl}/pages/ManageGymPrograms.html`);

		// Open the update modal for the program with ID '1'
		cy.get("button[data-id='1']").click();

		// Fill out the update form with invalid data
		cy.get("#updateReps").clear().type("15");

		// Submit the update form
		cy.get("#updateProgramForm").submit();

		// Verify the error message from window alert
		cy.on("window:alert", (str) => {
			expect(str).to.equal(
				"Error updating program: Beginner programs should have fewer than 10 reps."
			);
		});
	});

	it("should close updateModal when the close button is clicked", () => {
		cy.visit(`${baseUrl}/pages/ManageGymPrograms.html`);

		// Open the update modal for the program with ID '1'
		cy.get("button[data-id='1']").click();

		// Close the modal
		cy.get("#closeUpdateModalButton").click();

		// Verify the modal is closed
		cy.get("#updateProgramModal").should("not.be.visible");
	});

	it("should close the modal when the close button is clicked", () => {
		cy.visit(`${baseUrl}/pages/ManageGymPrograms.html`);

		// Open the create modal
		cy.get("#openModalButton").click();

		// Close the modal
		cy.get("#closeModalButton").click();

		// Verify the modal is closed
		cy.get("#programModal").should("not.be.visible");
	});
});
