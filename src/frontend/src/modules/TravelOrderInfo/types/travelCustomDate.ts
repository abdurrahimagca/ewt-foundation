import { z } from "zod";

export const customDateInformationSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  durationInDays: z.number(),
});

export type CustomDateInformation = z.infer<typeof customDateInformationSchema>;
export const pickUpLocationSchema = z.object({
  meetingPointName: z.string(),
  meetingPointAddress: z.string().optional(),
  meetingPointCity: z.string(),
  meetingPointCountry: z.string(),
  meetingPointZip: z.string(),
  meetingPointPhone: z.string(),
  meetingPointEmail: z.string().optional(),
  meetingPointStreet: z.string(),
  meetingPointHouseNumber: z.string(),
  meetingPointFloor: z.string(),
  meetingPointIframe: z.string().optional(),
});

export type PickUpLocation = z.infer<typeof pickUpLocationSchema>;

export const pickUpInformationSchema = z.object({
  pickUpDate: z.string(),
  pickUpTime: z.string(),
  pickUpLocation: pickUpLocationSchema,
});

export const customDateOrderInformationSchema = z.object({
  customDateInformation: customDateInformationSchema,
  pickUpInformation: pickUpInformationSchema,
});

export type CustomDateOrderInformation = z.infer<
  typeof customDateOrderInformationSchema
>;
