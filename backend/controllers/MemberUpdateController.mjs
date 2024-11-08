import { DB_INSTANCE } from "../database/JSONDatabase.mjs";
import { MemberUpdateDTOSchema } from "../dtos/MemberDTO.mjs";
import { GymProgramIsActiveDTOSchema } from "../dtos/GymProgramDTO.mjs";
import { ZodError, ZodIssueCode } from "zod";

// TrumpMcDonaldz
export const updateMemberAsync = async (req, res) =>
{
    // Dummy update method for testing purposes

    let database = DB_INSTANCE;

    let memberID = req.params.id;

    if (memberID === undefined)
    {
        res.status(400).json({ message: "Member ID not provided!" });
        return;
    }

    let member = database.members.get(memberID);

    if (member === undefined)
    {
        res.status(404).json({ message: "Member not found!" });
        return;
    }

    let parsedMember = await MemberUpdateDTOSchema.safeParseAsync(req.body);

    if (!parsedMember.success)
    {
        res.status(400).json({ message: parsedMember.error.errors });
        return;
    }

    let body = parsedMember.data;

    if (body.name !== undefined)
    {
        member.name = body.name;
    }

    if (body.adminNumber !== undefined)
    {
        member.adminNumber = body.adminNumber;
    }

    let gymPrograms = body.gymPrograms;

    if (gymPrograms !== undefined)
    {
        for (let programName of gymPrograms)
        {
            let targetProgram = database.programs.get(programName);

            if (targetProgram === undefined)
            {
                res.status(404).json(
                {
                    message: new ZodError(
                    [
                        // https://zod.dev/ERROR_HANDLING?id=zodissue
                        {
                            code: ZodIssueCode.custom,
                            message: `Program ( Name: ${programName} ) not found!`,
                            path: [ "gymPrograms" ],
                        }
                    ])
                });
                return;
            }

            let parsedProgram = await GymProgramIsActiveDTOSchema.safeParseAsync(targetProgram);

            if (!parsedProgram.success)
            {
                res.status(404).json({ message: parsedProgram.error.errors });
                return;
            }

            // if (!targetProgram.isActive)
            // {
            //     res.status(400).json({ message: `Program ( Name: ${programName} ) is inactive!` });
            //     return;
            // }
        }

        member.gymPrograms = Array.from(gymPrograms);
    }

    await database.updateAsync();

    res.json({ message: `Member ( ID: ${memberID} ) updated successfully!` });
}