import { z } from "zod";
export const dateRangeSchema = z.object({
  dateRange: z.array(
    z.object({
      startFrom: z.date(),
      endTo: z.date(),
    }),
  ),
  maxDurationInDays: z.number(),
  minDurationInDays: z.number(),
});
