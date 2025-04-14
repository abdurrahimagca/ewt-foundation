declare namespace EntitySchema {
  interface Entities {
    product: product;
    ce_travellers: ce_traveller;
    ce_travel_order_info: ce_travel_order_info;
    ce_flight_info: ce_flight_info;
    ce_travel_order_bundle_info: ce_travel_order_bundle_info;
    ce_travel_order_bundle_info_room_selection: ce_travel_order_bundle_info_room_selection;
    ce_additional_generic_product_info: ce_additional_generic_product_info;
    ce_travel_product_config: ce_travel_product_config;
    ce_hotel_bundle: ce_hotel_bundle;
    ce_room_bundle: ce_room_bundle;
    ce_room_sale_rule: ce_room_sale_rule;
    ce_room_supplement_rule: ce_room_supplement_rule;
    ce_custom_child_discount: ce_custom_child_discount;
    ce_generic_bundle: ce_generic_bundle;
    ce_generic_bundle_product: ce_generic_bundle_product;
    ce_date_configurator: ce_date_configurator;
  }

  interface product {
    id: string;
    name: string | null;
    productNumber: string | null;
    taxId: string | null;
    stock: number | null;
    ceProductOptionsMapId: string | null;
    price: {
      currencyId: string | null;
      net: number | null;
      gross: number | null;
    };
    available: boolean;
  }

  interface ce_traveller {
    id: string;
    name: string;
    surname: string;
    birthdate: string;
    email: string;
    phone?: string;
    passportNumber?: string;
  }

  interface ce_travel_order_info {
    id: string;
    identifierCode?: string;
    genericInfo: Record<string, unknown>;
    orderId: string;
    orderNumber?: string;
    bundleInfo?: Entity<"ce_travel_order_bundle_info">;
    travellers: EntityCollection<"ce_travellers">;
    flightInfo?: Entity<"ce_flight_info">;
  }

  interface ce_flight_info {
    id: string;
    arrivalDate: string;
    returnDate: string;
    arrivalAirport: string;
    departureAirport: string;
    airline?: string;
    flightNumber: string;
  }

  interface ce_travel_order_bundle_info {
    id: string;
    rooms: EntityCollection<"ce_travel_order_bundle_info_room_selection">;
    additionalProducts: EntityCollection<"ce_additional_generic_product_info">;
  }

  interface ce_travel_order_bundle_info_room_selection {
    id: string;
    roomName: string;
    numberOfAdults: number;
    numberOfChildren: number;
    roomQuantity: number;
  }

  interface ce_additional_generic_product_info {
    id: string;
    productName: string;
    additionalInfo?: Record<string, unknown>;
    productPrice: number;
    productQuantity: number;
  }

  //***product config */

  interface ce_travel_product_config {
    productsToApply: EntityCollection<"product"> | null;
    hotelBundleId: string | null;
    hotelBundle: Entity<"ce_hotel_bundle"> | null;
    childDiscountId: string | null;
    childDiscount: Entity<"ce_custom_child_discount"> | null;
    genericBundles: EntityCollection<"ce_generic_bundle"> | null;
    configurationName: string | null;
    configurationIdentifier: string | null;
    variantAware: boolean | null;
    isDateConfigurable: boolean | null;
    dateConfiguratorId: string | null;
    dateConfigurator: Entity<"ce_date_configurator"> | null;
  }

  interface ce_hotel_bundle {
    id: string;
    minRoomSelection: number | null;
    maxRoomSelection: number | null;
    roomOptions: EntityCollection<"ce_room_bundle"> | null;
  }

  interface ce_room_bundle {
    id: string;
    roomProducts: EntityCollection<"product"> | null;
    roomSaleRuleId: string | null;
    roomSaleRule: Entity<"ce_room_sale_rule"> | null;
  }

  interface ce_room_sale_rule {
    id: string;
    minAdults: number | null;
    maxAdults: number | null;
    minChildren: number | null;
    maxChildren: number | null;
    childrenStartAge: number | null;
    childrenEndAge: number | null;
    minInfants: number | null;
    maxInfants: number | null;
    maxTotalPersons: number | null;
    allowPets: boolean | null;
    supplementRuleId: string | null;
    supplementRule: Entity<"ce_room_supplement_rule"> | null;
  }

  interface ce_room_supplement_rule {
    id: string;
    applyIfAdults: number | null;
    applyIfChildren: number | null;
    applyIfInfants: number | null;
    supplementProducts: EntityCollection<"product"> | null;
  }

  interface ce_custom_child_discount {
    id: string;
    childDiscountPercentage: number | null;
    infantsDiscountPercentage: number | null;
  }

  interface ce_generic_bundle {
    id: string;
    ceTravelProductConfigGenericBundlesId: string | null;
    availableOnMinParentQuantity: number | null;
    availableOnMaxParentQuantity: number | null;
    availableOnMinTravellers: number | null;
    availableOnMaxTravellers: number | null;
    availabilityOperator: Record<string, unknown> | null;
    matchParentQuantity: boolean | null;
    matchTravellers: boolean | null;
    isRequired: boolean | null;
    allowMultipleSelection: boolean | null;
    propagandaText: string | null;
    parentProductOptions: EntityCollection<"product"> | null;
    genericProductOptions: EntityCollection<"product"> | null;
  }
  /*<entity name="ce_date_configurator">
    <fields>
    <date name="accept_from" store-api-aware="true" />
    <date name="accept_to" store-api-aware="true" />
    <int name="max_days" store-api-aware="true" />
    <int name="min_days" store-api-aware="true" /> 
</fields>


</entity>*/
  interface ce_date_configurator {
    acceptFrom: string;
    acceptTo: string;
    maxDays: number;
    minDays: number;
  }
}
