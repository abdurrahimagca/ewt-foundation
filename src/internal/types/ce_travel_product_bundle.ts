import { z } from "zod";

// ISO 8601 Date Format (YYYY-MM-DD)
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid ISO 8601 Date format (YYYY-MM-DD)");

// Shopware ID Format (32-character hex)
export const shopwareId = z
  .string()
  .regex(/^[0-9a-f]{32}$/, "Invalid Shopware ID format");

// **CeRoomSupplement Schema**
export const ceRoomSupplementSchema = z.object({
  supplementName: z.string().min(1, "Supplement name is required"),
  applyIfAdults: z.number().min(0, "Must be non-negative"),
  applyIfChildren: z.number().min(0, "Must be non-negative"),
  supplementProduct: shopwareId.optional(),
});

// **CeRoomRules Schema**
export const ceRoomRulesSchema = z.object({
  minAdults: z.number().min(0, "Must be non-negative"),
  maxAdults: z.number().min(0, "Must be non-negative"),
  minChildren: z.number().min(0, "Must be non-negative"),
  maxChildren: z.number().min(0, "Must be non-negative"),
  supplement: ceRoomSupplementSchema.optional(),
});

// **CeRoomBundle Schema**
export const ceRoomBundleSchema = z.object({
  room: shopwareId.optional(),
  roomExtra: z.array(shopwareId),
  roomRules: ceRoomRulesSchema.optional(),
});

// **CeHotelBundle Schema**
export const ceHotelBundleSchema = z.object({
  minRoomSelection: z.number().min(0, "Must be non-negative"),
  maxRoomSelection: z.number().min(0, "Must be non-negative"),
  rooms: z.array(ceRoomBundleSchema),
});

// **CeSaleRules Schema**
export const ceSaleRulesSchema = z.object({
  ruleName: z.string().min(1, "Rule name is required"),
  ruleDescription: z.string().optional(),
  minQuantityAgainstParentProductQuantity: z
    .number()
    .min(0, "Must be non-negative"),
  validFromParentProductQuantity: z.number().min(0, "Must be non-negative"),
  maxQuantityAgainstParentProductQuantity: z
    .number()
    .min(0, "Must be non-negative"),
});

// **CeBundle Schema**
export const ceBundleSchema = z.object({
  bundleProduct: shopwareId.optional(),
  rules: ceSaleRulesSchema.optional(),
  hotelBundle: ceHotelBundleSchema.optional(),
});

// **CeChildDiscount Schema**
export const ceChildDiscountSchema = z.object({
  discountPercentage: z.number().min(0, "Must be non-negative"),
  applyOnQuantity: z.number().min(0, "Must be non-negative"),
  applyToQuantity: z.number().min(0, "Must be non-negative"),
});

// **CeTravelProductConfig Schema**
export const ceTravelProductConfigSchema = z.object({
  product: shopwareId.optional(),
  bundles: z.array(ceBundleSchema),
  childDiscount: ceChildDiscountSchema.optional(),
});

// **Combined Schema**
export const combinedSchema = z.object({
  travelProductConfig: ceTravelProductConfigSchema,
  bundle: ceBundleSchema,
  hotelBundle: ceHotelBundleSchema,
  roomBundle: ceRoomBundleSchema,
  roomRules: ceRoomRulesSchema,
  roomSupplement: ceRoomSupplementSchema,
  saleRules: ceSaleRulesSchema,
  childDiscount: ceChildDiscountSchema,
});

// **Type Inference for Use in TypeScript**
export type CeRoomSupplement = z.infer<typeof ceRoomSupplementSchema>;
export type CeRoomRules = z.infer<typeof ceRoomRulesSchema>;
export type CeRoomBundle = z.infer<typeof ceRoomBundleSchema>;
export type CeHotelBundle = z.infer<typeof ceHotelBundleSchema>;
export type CeSaleRules = z.infer<typeof ceSaleRulesSchema>;
export type CeBundle = z.infer<typeof ceBundleSchema>;
export type CeChildDiscount = z.infer<typeof ceChildDiscountSchema>;
export type CeTravelProductConfig = z.infer<typeof ceTravelProductConfigSchema>;
export type Combined = z.infer<typeof combinedSchema>;
