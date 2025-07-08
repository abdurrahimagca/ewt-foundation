import { z } from "zod";
export const dateRangeSchema = z.object({
  dateRange: z.array(
    z.object({
      startFrom: z.string(),
      endTo: z.string(),
    }),
  ),
  durationInDays: z.number().min(1),
});

export type DateRangeType = z.infer<typeof dateRangeSchema>;
