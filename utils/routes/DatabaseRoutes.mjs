import { Router } from "express";
import { JSONDatabase } from "../database/JSONDatabase.mjs";

export const DATABASE_ROUTER = Router();

const TEST_DATABASE_PATH = "test-database.json";

// We use PUT since it is idempotent
DATABASE_ROUTER.put("/reset", async (req, res) =>
{
    await JSONDatabase.loadFromJSON(TEST_DATABASE_PATH);

    // Reset the database
    res.send("Database has been reset!");
});