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
    product_stream: product_stream;
    ce_extra_day_configurator: ce_extra_day_configurator;
  }

  interface product {
    id: string;
    versionId: string;
    name: string | null;
    productNumber: string | null;
    taxId: string | null;
    stock: number | null;
    price: {
      currencyId: string | null;
      net: number | null;
      gross: number | null;
      linked: boolean | null;
      listPrice: number | null;
      percentage: number | null;
      regulationPrice: number | null;
    };
    available: boolean;
  }
  interface product_stream {
    id: string;
    name: string;
    description: string;
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
    applyProductsStreamId: string | null;
    applyProductsStream: Entity<"product_stream"> | null;
    hotelBundleId: string | null;
    hotelBundle: Entity<"ce_hotel_bundle"> | null;
    childDiscountId: string | null;
    childDiscount: Entity<"ce_custom_child_discount"> | null;
    genericBundles: EntityCollection<"ce_generic_bundle"> | null;
    configurationName: string | null;
    configurationIdentifier: string | null;
    isDateConfigurable: boolean | null;
    allowExtraDays: boolean | null;
    dateConfiguratorId: string | null;
    dateConfigurator: Entity<"ce_date_configurator"> | null;
    extraDaysConfiguratorId: string | null;
    extraDaysConfigurator: Entity<"ce_extra_day_configurator"> | null;
  }

  interface ce_hotel_bundle {
    id: string;
    minRoomSelection: number | null;
    maxRoomSelection: number | null;
    roomOptions: EntityCollection<"ce_room_bundle"> | null;
  }

  interface ce_room_bundle {
    id: string;
    roomProductsStreamId: string | null;
    roomProductsStream: Entity<"product_stream"> | null;
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
    supplementProductsStreamId: string | null;
    supplementProductsStream: Entity<"product_stream"> | null;
  }

  interface ce_custom_child_discount {
    id: string;
    childDiscountPercentage: number | null;
    infantsDiscountPercentage: number | null;
  }

  interface ce_generic_bundle {
    id: string;
    ceTravelProductConfigGenericBundle: Entity<"ce_travel_product_config"> | null;
    ceTravelProductConfigGenericBundlesId: string | null;
    availableOnMinParentQuantity: number | null;
    availableOnMaxParentQuantity: number | null;
    durationEffectDayPerQuantity: number | null;
    availableOnMinTravellers: number | null;
    availableOnMaxTravellers: number | null;
    matchParentQuantity: boolean | null;
    matchTravellers: boolean | null;
    isRequired: boolean | null;
    allowMultipleSelection: boolean | null;
    parentStream: Entity<"product_stream"> | null;
    parentStreamId: string | null;
    bundleStream: Entity<"product_stream"> | null;
    bundleStreamId: string | null;
  }
  interface ce_date_configurator {
    id: string;
    acceptFrom: string;
    acceptTo: string;
    maxDays: number;
    minDays: number;
  }
  interface ce_extra_day_configurator {
    id: string;
    maxExtraPreDays: number | null;
    maxExtraPostDays: number | null;
    maxTravellersAccepted: number | null;
  }
}
