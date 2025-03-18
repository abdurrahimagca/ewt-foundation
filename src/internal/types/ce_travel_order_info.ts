import { z } from "zod";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";

// ISO 8601 Date and Time Format
const isoDate = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}([.,]\d{1,6})?(Z|[+-]\d{2}:?\d{2})?)?$/,
    "Invalid ISO 8601 Date and Time format"
  );

// Shopware ID Format (32-character hex)
export const shopwareId = z
  .string()
  .regex(/^[0-9a-f]{32}$/, "Invalid Shopware ID format");

// **CeTraveller Schema**
export const ceTravellerSchema = z.object({
  id: shopwareId.optional(),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthdate: isoDate,
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  passportNumber: z.string().optional(),
});

// **CeFlightInfo Schema**
export const ceFlightInfoSchema = z.object({
  id: shopwareId.optional(),
  arrivalDate: isoDate,
  returnDate: isoDate,
  arrivalAirport: z.string().min(1, "Arrival airport is required"),
  departureAirport: z.string().min(1, "Departure airport is required"),
  airline: z.string().optional(),
  flightNumber: z.string().min(1, "Flight number is required"),
});

// **CeTravelOrderBundleInfoRoomSelection Schema**
export const ceTravelOrderBundleInfoRoomSelectionSchema = z.object({
  id: shopwareId.optional(),
  roomName: z.string().min(1, "Room name is required"),
  numberOfAdults: z.number().min(0, "Number of adults must be non-negative"),
  numberOfChildren: z
    .number()
    .min(0, "Number of children must be non-negative"),
  roomQuantity: z.number().min(1, "Room quantity must be at least 1"),
});

// **CeAdditionalGenericProductInfo Schema**
export const ceAdditionalGenericProductInfoSchema = z.object({
  id: shopwareId.optional(),
  productName: z.string().min(1, "Product name is required"),
  additionalInfo: z.record(z.unknown()).optional(), // Generic JSON object
  productPrice: z.number().min(0, "Price must be non-negative"),
  productQuantity: z.number().min(1, "Quantity must be at least 1"),
});

// **CeTravelOrderBundleInfo Schema**
export const ceTravelOrderBundleInfoSchema = z.object({
  id: shopwareId.optional(),
  rooms: z.array(ceTravelOrderBundleInfoRoomSelectionSchema),
  additionalProducts: z.array(ceAdditionalGenericProductInfoSchema),
});

// **CeTravelOrderInfo Schema**
export const ceTravelOrderInfoSchema = z.object({
  id: shopwareId.optional(),
  identifierCode: z.string().optional(),
  genericInfo: z.record(z.unknown()).optional(), // Generic JSON object
  travellers: z.array(ceTravellerSchema),
  flightInfo: ceFlightInfoSchema.optional(),
  orderId: shopwareId,
  orderNumber: z.string().optional(),
  bundleInfo: ceTravelOrderBundleInfoSchema.optional(),
});

// **Combined Schema**
export const combinedSchema = z.object({
  travelOrderInfo: ceTravelOrderInfoSchema,
  traveller: ceTravellerSchema,
  flightInfo: ceFlightInfoSchema,
  bundleInfo: ceTravelOrderBundleInfoSchema,
});

// **Type Inference for Use in TypeScript**
export type CeTraveller = z.infer<typeof ceTravellerSchema>;
export type CeFlightInfo = z.infer<typeof ceFlightInfoSchema>;
export type CeTravelOrderInfo = z.infer<typeof ceTravelOrderInfoSchema>;
export type CeTravelOrderBundleInfoRoomSelection = z.infer<
  typeof ceTravelOrderBundleInfoRoomSelectionSchema
>;
export type CeAdditionalGenericProductInfo = z.infer<
  typeof ceAdditionalGenericProductInfoSchema
>;
export type CeTravelOrderBundleInfo = z.infer<
  typeof ceTravelOrderBundleInfoSchema
>;
export type Combined = z.infer<typeof combinedSchema>;
