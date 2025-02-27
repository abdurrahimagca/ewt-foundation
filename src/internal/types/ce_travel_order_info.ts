import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { z } from "zod";

// ISO 8601 DateTime Format (YYYY-MM-DDTHH:MM:SS)
const isoDateTime = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    "Invalid ISO 8601 DateTime format (YYYY-MM-DDTHH:MM:SS)",
  );

// Shopware ID Format (32 karakter, hexadecimal)
export const shopwareId = z
  .string()
  .regex(/^[0-9a-f]{32}$/, "Invalid Shopware ID format");

// Flight Number Format (IATA formatı)
const flightNumber = z
  .string()
  .regex(
    /^([A-Z][\d]|[\d][A-Z]|[A-Z]{2})(\d{1,})$/,
    "Invalid IATA Flight Number format (e.g., BA026, TK1234)",
  );

// CeTraveller Schema
export const ceTravellerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthdate: isoDateTime,
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  passportNumber: z.string().optional(),
});

// CeFlightInfo Schema
export const ceFlightInfoSchema = z.object({
  arrivalDate: isoDateTime,
  returnDate: isoDateTime,
  arrivalAirport: z.string().min(1, "Arrival airport is required"),
  departureAirport: z.string().min(1, "Departure airport is required"),
  airline: z.string().optional(),
  flightNumber: flightNumber,
});

// CeTravelOrderInfo Schema
export const ceTravelOrderInfoSchema = z.object({
  identifierCode: z.string().min(1, "Identifier code is required"),
  numberOfTravellers: z.number().min(1, "At least one traveller is required"),
  isHotel: z.boolean(),
  hotelId: z.optional(shopwareId),
  isTransfer: z.boolean(),
  transfer: z.optional(shopwareId),
  travellers: z.array(ceTravellerSchema),
  flightInfo: z.optional(ceFlightInfoSchema),
  orderId: shopwareId,
});

// Combined Schema
export const combinedSchema = z.object({
  travelOrderInfo: ceTravelOrderInfoSchema,
  traveller: ceTravellerSchema,
  flightInfo: ceFlightInfoSchema,
});

// Type Inference
export type CeTraveller = z.infer<typeof ceTravellerSchema>;
export type CeFlightInfo = z.infer<typeof ceFlightInfoSchema>;
export type CeTravelOrderInfo = z.infer<typeof ceTravelOrderInfoSchema>;
export type Combined = z.infer<typeof combinedSchema>;
