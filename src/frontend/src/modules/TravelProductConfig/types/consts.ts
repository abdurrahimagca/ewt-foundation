import { data } from "@shopware-ag/meteor-admin-sdk";

const ASSOCIATIONS = [
  "productsToApply",
  "productsToApply.productOptions",
  "hotelBundle",
  "childDiscount",
  "genericBundles",
  "dateConfigurator",
  "hotelBundle.roomOptions",
  "hotelBundle.roomOptions.roomProducts",
  "hotelBundle.roomOptions.roomProducts.productOptions",
  "hotelBundle.roomOptions.roomSaleRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts.productOptions",
  "genericBundles.parentProductOptions",
  "genericBundles.genericProductOptions",
  "genericBundles.genericProductOptions.productOptions",
  "genericBundles.parentProductOptions.productOptions",
];

const DEFAULT_SUMMARY_ASSOCIATIONS = [
  "productsToApply",
  "productsToApply.productOptions",
];

export const ALL_ASSOCIATIONS_CRITERIA = new data.Classes.Criteria();
ASSOCIATIONS.forEach((association) => {
  ALL_ASSOCIATIONS_CRITERIA.addAssociation(association);
});

export const DEFAULT_SUMMARY_CRITERIA = new data.Classes.Criteria();
DEFAULT_SUMMARY_ASSOCIATIONS.forEach((association) => {
  DEFAULT_SUMMARY_CRITERIA.addAssociation(association);
});
