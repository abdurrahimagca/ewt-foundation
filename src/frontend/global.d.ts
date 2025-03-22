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
    ce_travel_product_config_room_bundle: ce_travel_product_config_room_bundle;
    ce_room_sale_rule: ce_room_sale_rule;
    ce_room_supplement_rule: ce_room_supplement_rule;
    ce_custom_child_discount: ce_custom_child_discount;
    ce_generic_product_bundle: ce_generic_product_bundle;
  }

  interface product {
    id: string;
    name: string;
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

  interface ce_travel_product_config {
    id: string;
    productId?: string;
    product?: Entity<"product">;
    hotelBundle?: Entity<"ce_hotel_bundle">;
    childDiscount?: Entity<"ce_custom_child_discount">;
    additionalProducts: Entity<"ce_generic_product_bundle">;
  }

  interface ce_hotel_bundle {
    id: string;
    minRoomSelection: number;
    maxRoomSelection: number;
    additionalProducts?: EntityCollection<"ce_generic_product_bundle">;
    roomOptions: EntityCollection<"ce_travel_product_config_room_bundle">;
  }

  interface ce_travel_product_config_room_bundle {
    id: string;
    roomProductId?: string;
    roomProduct?: Entity<"product">;
    additionalProducts?: Entity<"ce_generic_product_bundle">;
    roomSaleRule?: Entity<"ce_room_sale_rule">;
  }

  interface ce_room_sale_rule {
    id: string;
    minAdults: number;
    maxAdults: number;
    minChildren: number;
    maxChildren: number;
    supplementRule?: Entity<"ce_room_supplement_rule">;
  }

  interface ce_room_supplement_rule {
    id: string;
    supplementName: string;
    applyIfAdults: number;
    applyIfChildren: number;
    supplementProductId?: string;
    supplementProduct?: Entity<"product">;
  }

  interface ce_custom_child_discount {
    id: string;
    discountPercentage: number;
    applyOnQuantity: number;
    applyToQuantity: number;
  }

  interface ce_generic_product_bundle {
    id: string;
    availableOnMinParentQuantity: number;
    availableOnMaxParentQuantity: number;
    allowMultipleProducts: boolean;
    disableIfChild: boolean;
    productOptionsIds: string[];
    productOptions: EntityCollection<"product">;
  }
}
