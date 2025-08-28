import { z } from "zod";

export const meetingPointDataSchema = z.object({
  meeting_point_option_data: z.discriminatedUnion("input_type", [
    z.object({
      input_type: z.literal("select"),
      content: z.array(
        z.object({
          langCode: z.enum(["en-GB", "es-ES"]),
          title: z.string(),
          description: z.string(),
        }),
      ),
      options: z.array(
        z.array(
          z.object({
            langCode: z.enum(["en-GB", "es-ES"]),
            title: z.string(),
            description: z.string(),
          }),
        ),
      ),
    }),
    z.object({
      input_type: z.literal("form_input"),
      content: z.array(
        z.object({
          langCode: z.enum(["en-GB", "es-ES"]),
          title: z.string(),
          description: z.string(),
        }),
      ),
      fields: z.array(
        z.object({
          name: z.array(
            z.object({
              langCode: z.enum(["en-GB", "es-ES"]),
              title: z.string(),
            }),
          ),
          type: z.enum(["text", "number", "email", "tel", "date"]),
          required: z.boolean(),
          placeholder: z.array(
            z.object({
              langCode: z.enum(["en-GB", "es-ES"]),
              title: z.string(),
            }),
          ),
        }),
      ),
    }),
    z.object({
      input_type: z.literal("open_street_maps_iframe_options"),
      content: z.array(
        z.object({
          langCode: z.enum(["en-GB", "es-ES"]),
          title: z.string(),
          description: z.string(),
        }),
      ),
      options: z.array(
        z.object({
          langCode: z.enum(["en-GB", "es-ES"]),
          title: z.string(),
          description: z.string(),
          latitude: z.number(),
          longitude: z.number(),
        }),
      ),
    }),
    z.object({
      input_type: z.literal("manual_input"),
      content: z.array(
        z.object({
          langCode: z.enum(["en-GB", "es-ES"]),
          title: z.string(),
          description: z.string(),
        }),
      ),
    }),
  ]),
});
export type MeetingPointData = z.infer<typeof meetingPointDataSchema>;
