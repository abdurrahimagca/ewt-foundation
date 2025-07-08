import { z } from "zod";

export const meetingPointInstructionsSchema = z.array(
  z.object({
    languageCode: z
      .string()
      .max(5)
      .min(2)
      .describe("Language code exapmle: en-GB, es-ES"),
    instructions: z.array(
      z.object({
        title: z.string().describe("Title of the instruction"),
        description: z.string().describe("Description of the instruction"),
      }),
    ),
  }),
);

export type MeetingPointType = z.infer<typeof meetingPointInstructionsSchema>;
