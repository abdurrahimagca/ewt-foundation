import { z } from "zod";

const isoDateTime = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    "Invalid ISO 8601 DateTime format (YYYY-MM-DDTHH:MM:SS)",
  );

export const shopwareId = z
  .string()
  .regex(/^[0-9a-f]{32}$/, "Invalid Shopware ID format");

const flightNumber = z
  .string()
  .regex(
    /^([A-Z][\d]|[\d][A-Z]|[A-Z]{2})(\d{1,})$/,
    "Invalid IATA Flight Number format (e.g., BA026, TK1234)",
  );

export const ceTravellerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthdate: isoDateTime,
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  passportNumber: z.string().optional(),
  orderId: z.optional(shopwareId),
});

export const ceFlightInfoSchema = z.object({
  arrivalDate: isoDateTime,
  returnDate: isoDateTime,
  arrivalAirport: z.string().min(1, "Arrival airport is required"),
  departureAirport: z.string().min(1, "Departure airport is required"),
  airline: z.string().optional(),
  flightNumber: flightNumber,
  orderId: z.optional(shopwareId),
});

// Exporting combined schema if needed
export const combinedSchema = z.object({
  traveller: ceTravellerSchema,
  flightInfo: ceFlightInfoSchema,
});

export type CeTraveller = z.infer<typeof ceTravellerSchema>;
export type CeFlightInfo = z.infer<typeof ceFlightInfoSchema>;
export type Combined = z.infer<typeof combinedSchema>;


export type Order = {
  id: string;
  name: string;
  price: number;
  order_number: string;
};