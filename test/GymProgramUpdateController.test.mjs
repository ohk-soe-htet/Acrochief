import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { app, server } from "../index.mjs";

chai.use(chaiHttp);
let baseUrl;

describe("Gym Program Update API", () => {
	before(async () => {
		const { address, port } = await server.address();
		baseUrl = `http://${address === "::" ? "localhost" : address}:${port}`;
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
			.put("/api/programs/1")
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
				expect(res.body.program.name).to.equal("updated program");
				done();
			});
	});

	it("should return 400 for missing name", (done) => {
		chai.request(baseUrl)
			.put("/api/programs/1")
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
			.put("/api/programs/1")
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
			.put("/api/programs/1")
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
			.put("/api/programs/1")
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
			.put("/api/programs/1")
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
			.put("/api/programs/1")
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

	it("should return 400 for non-existent program ID", (done) => {
		chai.request(baseUrl)
			.put("/api/programs/nonexistent")
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
});
