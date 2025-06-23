import { z } from "zod";
export const dateRangeSchema = z.object({
  dateRange: z.array(
    z.object({
      startFrom: z.string(),
      endTo: z.string(),
    }),
  ),
  maxDurationInDays: z.number(),
  minDurationInDays: z.number(),
});

export type DateRangeType = z.infer<typeof dateRangeSchema>;
