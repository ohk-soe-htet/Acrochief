import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { app, server } from "../index.mjs";
import sinon from "sinon";
import { DB_INSTANCE } from "../utils/database/JSONDatabase.mjs";

chai.use(chaiHttp);
let baseUrl;

describe("Gym Program Update API", function () {
	this.timeout(10000);

	before(async () => {
		const { address, port } = await server.address();
		baseUrl = `http://${address === "::" ? "localhost" : address}:${port}`;

		// Add a real program to the database
		await DB_INSTANCE.tryCreateGymProgram({
			id: 1,
			name: "Initial Program",
			focusBodyPart: "upper",
			intensity: "mild",
			difficulty: "beginner",
			targetAudience: "adults",
			reps: 8,
			isActive: true,
		});
	});

	after(() => {
		return new Promise((resolve) => {
			server.close(() => {
				resolve();
			});
		});
	});

	it("should update a program successfully", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body.message).to.equal(
					"Program updated successfully!"
				);
				expect(res.body.program.name).to.equal("Updated Program");

				chai.assert.isObject(
					res.body.program,
					"Program should be an object"
				);

				done();
			});
	});

	it("should return 400 for missing name", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Name is required and should be a string."
				);
				done();
			});
	});

	it("should return 400 for invalid focus body part", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "invalid",
				intensity: "mild",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Focus body part must be 'upper' or 'lower' or 'back'."
				);
				done();
			});
	});

	it("should return 400 for invalid intensity", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "invalid",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Intensity must be 'mild', 'average', or 'high'."
				);
				done();
			});
	});

	it("should return 400 for invalid difficulty", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "invalid",
				targetAudience: "adults",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Difficulty must be 'beginner', 'intermediate', or 'advanced'."
				);
				done();
			});
	});

	it("should return 400 for invalid target audience", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "beginner",
				targetAudience: "invalid",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Target audience must be 'teenagers', 'adults', or 'elders'."
				);
				done();
			});
	});

	it("should return 400 for invalid reps", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: "invalid",
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include("Reps must be a number.");
				done();
			});
	});

	it("should return 400 for invalid difficulty and intensity combination", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "high",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Beginner programs cannot have 'high' intensity."
				);
				done();
			});
	});

	it("should return 400 for invalid reps for beginner programs", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: 15,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Beginner programs should have fewer than 10 reps."
				);
				done();
			});
	});

	it("should return 400 for invalid reps for intermediate programs with high intensity", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "high",
				difficulty: "intermediate",
				targetAudience: "adults",
				reps: 25,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Intermediate programs should not exceed 20 reps with high intensity."
				);
				done();
			});
	});

	it("should return 400 for invalid reps for advanced programs with high intensity", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "advanced",
				targetAudience: "adults",
				reps: 10,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Advanced programs must have 'high' intensity."
				);
				done();
			});
	});

	it("should retur 400 for non-existing program", (done) => {
		chai.request(baseUrl)
			.put("/api/gym-programs/update/100")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body.errors).to.include(
					"Program with this ID does not exist."
				);
				done();
			});
	});

	it("should handle database error gracefully", (done) => {
		sinon
			.stub(DB_INSTANCE, "updateAsync")
			.throws(new Error("Database error"));

		chai.request(baseUrl)
			.put("/api/gym-programs/update/1")
			.send({
				name: "Updated Program",
				focusBodyPart: "upper",
				intensity: "mild",
				difficulty: "beginner",
				targetAudience: "adults",
				reps: 8,
				isActive: true,
			})
			.end((err, res) => {
				expect(res).to.have.status(500);
				expect(res.body.errors).to.include("Database error");
				DB_INSTANCE.updateAsync.restore();
				done();
			});
	});
});
