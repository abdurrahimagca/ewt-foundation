declare namespace EntitySchema {
  interface Entities {
    ce_travellers: ce_traveller;
    ce_travel_order_info: ce_travel_order_info;
    ce_flight_info: ce_flight_info;
    ce_travel_order_bundle_info: ce_travel_order_bundle_info;
    ce_travel_order_bundle_info_room_selection: ce_travel_order_bundle_info_room_selection;
    ce_additional_generic_product_info: ce_additional_generic_product_info;
    ce_travel_product_config: ce_travel_product_config;
    ce_bundle: ce_bundle;
    ce_hotel_bundle: ce_hotel_bundle;
    ce_room_bundle: ce_room_bundle;
    ce_room_rules: ce_room_rules;
    ce_room_supplement: ce_room_supplement;
    ce_sale_rules: ce_sale_rules;
    ce_child_discount: ce_child_discount;
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

  interface ce_travel_product_config {
    id: string;
    product: Entity<"product">;
    bundles: EntityCollection<"ce_bundle">;
    childDiscount?: Entity<"ce_child_discount">;
  }

  interface ce_bundle {
    id: string;
    bundleProduct: Entity<"product">;
    rules?: Entity<"ce_sale_rules">;
    hotelBundle?: Entity<"ce_hotel_bundle">;
  }

  interface ce_hotel_bundle {
    id: string;
    minRoomSelection: number;
    maxRoomSelection: number;
    rooms: EntityCollection<"ce_room_bundle">;
  }

  interface ce_room_bundle {
    id: string;
    room: Entity<"product">;
    roomExtra: EntityCollection<"product">;
    roomRules?: Entity<"ce_room_rules">;
  }

  interface ce_room_rules {
    id: string;
    minAdults: number;
    maxAdults: number;
    minChildren: number;
    maxChildren: number;
    supplement?: Entity<"ce_room_supplement">;
  }

  interface ce_room_supplement {
    id: string;
    supplementName: string;
    applyIfAdults: number;
    applyIfChildren: number;
    supplementProduct?: Entity<"product">;
  }

  interface ce_sale_rules {
    id: string;
    ruleName: string;
    ruleDescription: string;
    minQuantityAgainstParentProductQuantity: number;
    validFromParentProductQuantity: number;
    maxQuantityAgainstParentProductQuantity: number;
  }

  interface ce_child_discount {
    id: string;
    discountPercentage: number;
    applyOnQuantity: number;
    applyToQuantity: number;
  }
}
