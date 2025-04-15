import { data } from "@shopware-ag/meteor-admin-sdk";

const ASSOCIATIONS = [
  "productsToApply",
  "hotelBundle",
  "childDiscount",
  "genericBundles",
  "dateConfigurator",
  "hotelBundle.roomOptions",
  "hotelBundle.roomOptions.roomProducts",

  "hotelBundle.roomOptions.roomSaleRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts",

 "genericBundles.parentProductOptions",
  "genericBundles.genericProductOptions",
];

const DEFAULT_SUMMARY_ASSOCIATIONS = ["productsToApply"];

export const ALL_ASSOCIATIONS_CRITERIA = new data.Classes.Criteria();
ASSOCIATIONS.forEach((association) => {
  ALL_ASSOCIATIONS_CRITERIA.addAssociation(association);
});
ALL_ASSOCIATIONS_CRITERIA.addIncludes({
  product: [
    "name",
    "productNumber",
    "available",
    "id",
    "versionId",
    "stock",
    "price",
    "taxId",
  ],
});

export const DEFAULT_SUMMARY_CRITERIA = new data.Classes.Criteria();
DEFAULT_SUMMARY_ASSOCIATIONS.forEach((association) => {
  DEFAULT_SUMMARY_CRITERIA.addAssociation(association);
});
