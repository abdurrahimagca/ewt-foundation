import { data } from "@shopware-ag/meteor-admin-sdk";

const ASSOCIATIONS = [
  "applyProductsStream",
  "hotelBundle",
  "childDiscount",
  "genericBundles",
  "extraDaysConfigurator",
  "dateConfigurator",
  "hotelBundle.roomOptions",
  "hotelBundle.roomOptions.roomProductsStream",
  "hotelBundle.roomOptions.roomSaleRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProductsStream",
  "genericBundles.parentStream",
  "genericBundles.bundleStream",
];

const DEFAULT_SUMMARY_ASSOCIATIONS = ["applyProductsStream"];

export const ALL_ASSOCIATIONS_CRITERIA = new data.Classes.Criteria();
ASSOCIATIONS.forEach((association) => {
  ALL_ASSOCIATIONS_CRITERIA.addAssociation(association);
});

export const DEFAULT_SUMMARY_CRITERIA = new data.Classes.Criteria();
DEFAULT_SUMMARY_ASSOCIATIONS.forEach((association) => {
  DEFAULT_SUMMARY_CRITERIA.addAssociation(association);
});
