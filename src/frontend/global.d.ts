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

  // Traveller Entity
  interface ce_traveller {
    id: string;
    name: string;
    surname: string;
    birthdate: string; // ISO 8601 Date
    email: string;
    phone?: string;
    passportNumber?: string;
  }

  // Travel Order Info Entity
  interface ce_travel_order_info {
    id: string;
    identifierCode?: string;
    genericInfo: Record<string, unknown>;
    orderId: string;
    orderNumber?: string;
    bundleInfo?: EntityCollection<"ce_travel_order_bundle_info">;
    travellers: EntityCollection<"ce_travellers">;
    flightInfo?: EntityCollection<"ce_flight_info">;
  }

  // Flight Info Entity
  interface ce_flight_info {
    id: string;
    arrivalDate: string;
    returnDate: string;
    arrivalAirport: string;
    departureAirport: string;
    airline?: string;
    flightNumber: string;
  }

  // Travel Order Bundle Info Entity
  interface ce_travel_order_bundle_info {
    id: string;
    rooms: EntityCollection<"ce_travel_order_bundle_info_room_selection">;
    additionalProducts: EntityCollection<"ce_additional_generic_product_info">;
  }

  // Travel Order Room Selection
  interface ce_travel_order_bundle_info_room_selection {
    id: string;
    roomName: string;
    numberOfAdults: number;
    numberOfChildren: number;
    roomQuantity: number;
  }

  // Additional Generic Product Info Entity
  interface ce_additional_generic_product_info {
    id: string;
    productName: string;
    additionalInfo?: Record<string, unknown>;
    productPrice: number;
    productQuantity: number;
  }

  // Travel Product Config Entity
  interface ce_travel_product_config {
    id: string;
    product: string;
    bundles: EntityCollection<"ce_bundle">;
    childDiscount?: EntityCollection<"ce_child_discount">;
  }

  // Bundle Entity
  interface ce_bundle {
    id: string;
    bundleProduct: string;
    rules?: EntityCollection<"ce_sale_rules">;
    hotelBundle?: EntityCollection<"ce_hotel_bundle">;
  }

  // Hotel Bundle Entity
  interface ce_hotel_bundle {
    id: string;
    minRoomSelection: number;
    maxRoomSelection: number;
    rooms: EntityCollection<"ce_room_bundle">;
  }

  // Room Bundle Entity
  interface ce_room_bundle {
    id: string;
    room: string;
    roomExtra: EntityCollection<"product">;
    roomRules?: EntityCollection<"ce_room_rules">;
  }

  // Room Rules Entity
  interface ce_room_rules {
    id: string;
    minAdults: number;
    maxAdults: number;
    minChildren: number;
    maxChildren: number;
    supplement?: EntityCollection<"ce_room_supplement">;
  }

  // Room Supplement Entity
  interface ce_room_supplement {
    id: string;
    supplementName: string;
    applyIfAdults: number;
    applyIfChildren: number;
    supplementProduct?: string;
  }

  // Sale Rules Entity
  interface ce_sale_rules {
    id: string;
    ruleName: string;
    ruleDescription: string;
    minQuantityAgainstParentProductQuantity: number;
    validFromParentProductQuantity: number;
    maxQuantityAgainstParentProductQuantity: number;
  }

  // Child Discount Entity
  interface ce_child_discount {
    id: string;
    discountPercentage: number;
    applyOnQuantity: number;
    applyToQuantity: number;
  }
}
