import { z } from "zod";
import { Order } from "./order.type.js";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

// Shopware ID Format (32-character hex)
export const shopwareId = z
  .string()
  .regex(/^[0-9a-f]{32}$/, "Invalid Shopware ID format");

/**
 * Base schema for emergency contact information
 */
const ceEmergencyContactInformationBaseSchema = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  contactSurname: z.string().min(1, "Contact surname is required"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  contactEmail: z.string().email("Invalid email address"),
});

export const ceEmergencyContactInsertInformationSchema =
  ceEmergencyContactInformationBaseSchema;
export const ceEmergencyContactUpdateInformationSchema =
  ceEmergencyContactInformationBaseSchema.extend({
    id: shopwareId,
  });

/**
 * Base schema for traveller information
 */
const ceTravellerBaseSchema = z.object({
  travellerType: z.string().min(1, "Traveller type is required"),
  travellerName: z.string().min(1, "Traveller name is required"),
  travellerSurname: z.string().min(1, "Traveller surname is required"),
  travellerEmail: z.string().email("Invalid email address"),
  travellerPhone: z.string().optional(),
  travellerPassportNumber: z.string().optional(),
  travellerNationality: z.string().optional(),
  travellerDietInfo: z.record(z.unknown()).optional(),
  travellerDietInfoManualInput: z.string().optional(),
  travellerBirthDate: z.string().datetime("Invalid date format"),
});

export const ceTravellerInsertInformationSchema = ceTravellerBaseSchema;
export const ceTravellerUpdateInformationSchema = ceTravellerBaseSchema.extend({
  id: shopwareId,
});

/**
 * Base schema for flight information
 */
const ceFlightInfoBaseSchema = z.object({
  flightNumber: z.string().min(1, "Flight number is required"),
  flightDepartureDate: z.string().datetime("Invalid date format"),
  flightArrivalDate: z.string().datetime("Invalid date format"),
  flightDepartureAirport: z.string().min(1, "Departure airport is required"),
  flightArrivalAirport: z.string().min(1, "Arrival airport is required"),
  metadata: z.record(z.unknown()).optional(),
});

export const ceFlightInfoInsertInformationSchema = ceFlightInfoBaseSchema;
export const ceFlightInfoUpdateInformationSchema =
  ceFlightInfoBaseSchema.extend({
    id: shopwareId,
  });

/**
 * Base schema for room product detailed information
 */
const ceRoomProductDetailedInfoBaseSchema = z.object({
  roomProductId: shopwareId.optional(),
  numberOfAdults: z.number().min(0, "Number of adults must be non-negative"),
  numberOfChildren: z
    .number()
    .min(0, "Number of children must be non-negative"),
  numberOfInfants: z.number().min(0, "Number of infants must be non-negative"),
});

export const ceRoomProductDetailedInfoInsertInformationSchema =
  ceRoomProductDetailedInfoBaseSchema;
export const ceRoomProductDetailedInfoUpdateInformationSchema =
  ceRoomProductDetailedInfoBaseSchema.extend({
    id: shopwareId,
  });

/**
 * Base schema for travel order information
 */
const ceTravelOrderInfoBaseSchema = z.object({
  orderId: shopwareId,
  order: z.custom<Order>().optional(),
  metadata: z.record(z.unknown()).optional(),
  travellers: z.array(ceTravellerBaseSchema),
  emergencyContactInfo: ceEmergencyContactInformationBaseSchema,
  flightInfo: z.array(ceFlightInfoBaseSchema).optional(),
  roomProductDetailedInfo: z.array(ceRoomProductDetailedInfoBaseSchema),
});

export const ceTravelOrderInfoInsertInformationSchema = z.array(
  ceTravelOrderInfoBaseSchema,
);
export const ceTravelOrderInfoUpdateInformationSchema = z.array(
  ceTravelOrderInfoBaseSchema.extend({
    id: shopwareId,
  }),
);

const ceTravelOrderInfoEntitySchema = z
  .object({
    ...ceTravelOrderInfoBaseSchema.shape,
    id: shopwareId,
  })
  .partial();

export type CeTravelOrderInfoEntity = z.infer<
  typeof ceTravelOrderInfoEntitySchema
>;
export const searchTravelOrderInfoSchema = z.object({
  criteria: z.custom<Criteria>((val) => val instanceof Criteria, {
    message: "Invalid criteria object",
  }),
});

export type SearchTravelOrderInfo = z.infer<typeof searchTravelOrderInfoSchema>;

// Type exports
export type CeEmergencyContactInformationInsertInformation = z.infer<
  typeof ceEmergencyContactInsertInformationSchema
>;
export type CeEmergencyContactInformationUpdateInformation = z.infer<
  typeof ceEmergencyContactUpdateInformationSchema
>;
export type CeTravellerInsertInformation = z.infer<
  typeof ceTravellerInsertInformationSchema
>;
export type CeTravellerUpdateInformation = z.infer<
  typeof ceTravellerUpdateInformationSchema
>;
export type CeFlightInfoInsertInformation = z.infer<
  typeof ceFlightInfoInsertInformationSchema
>;
export type CeFlightInfoUpdateInformation = z.infer<
  typeof ceFlightInfoUpdateInformationSchema
>;
export type CeRoomProductDetailedInfoInsertInformation = z.infer<
  typeof ceRoomProductDetailedInfoInsertInformationSchema
>;
export type CeRoomProductDetailedInfoUpdateInformation = z.infer<
  typeof ceRoomProductDetailedInfoUpdateInformationSchema
>;
export type CeTravelOrderInfoInsertInformation = z.infer<
  typeof ceTravelOrderInfoInsertInformationSchema
>;
export type CeTravelOrderInfoUpdateInformation = z.infer<
  typeof ceTravelOrderInfoUpdateInformationSchema
>;
