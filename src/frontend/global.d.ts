declare namespace EntitySchema {
  interface Entities {
    product: product;
    order: order;
    ce_traveller: ce_traveller;
    ce_travel_order_info: ce_travel_order_info;
    ce_custom_date_information: ce_custom_date_information;
    ce_flight_info: ce_flight_info;
    ce_travel_order_bundle_info: ce_travel_order_bundle_info;
    ce_travel_order_bundle_info_room_selection: ce_travel_order_bundle_info_room_selection;
    ce_additional_generic_product_info: ce_additional_generic_product_info;
    ce_travel_product_config: ce_travel_product_config;
    ce_hotel_bundle: ce_hotel_bundle;
    ce_room_bundle: ce_room_bundle;
    ce_room_sale_rule: ce_room_sale_rule;
    ce_generic_bundle: ce_generic_bundle;
    product_stream: product_stream;
    ce_emergency_contact_information: ce_emergency_contact_information;
    ce_room_product_detailed_info: ce_room_product_detailed_info;
    ce_travel_product_date_config: ce_travel_product_date_config;
    ce_date_range: ce_date_range;
    ce_static_date_opt: ce_static_date_opt;
    ce_traveller_type_config: ce_traveller_type_config;
    ce_meeting_point: ce_meeting_point;
  }

  interface order {
    id: string;
    orderNumber: string;
    orderDate: string;
    
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
    travellerType: string;
    travellerName: string;
    travellerSurname: string;
    travellerEmail: string;
    travellerPhone?: string;
    travellerPassportNumber?: string;
    travellerNationality?: string;
    travellerDietInfo?: Record<string, unknown>;
    travellerDietInfoManualInput?: string;
    travellerBirthDate: string;
  }

  interface ce_custom_date_information {
    id: string;
    customDateInformation?: Record<string, unknown> | null;
    pickUpInformation?: Record<string, unknown> | null;
  }

  interface ce_travel_order_info {
    id: string;
    orderTourProductType: string;
    orderId: string;
    order?: Entity<"order">;
    metadata?: Record<string, unknown>;
    travellers: EntityCollection<"ce_traveller">;
    customDateInformation?: Entity<"ce_custom_date_information"> | null;
    emergencyContactInfo: Entity<"ce_emergency_contact_information">;
    flightInfo?: EntityCollection<"ce_flight_info">;
    roomProductDetailedInfo: EntityCollection<"ce_room_product_detailed_info">;
  }

  interface ce_flight_info {
    id: string;
    flightNumber: string;
    flightDepartureDate: string;
    flightArrivalDate: string;
    flightDepartureAirport: string;
    flightArrivalAirport: string;
    metadata?: Record<string, unknown>;
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
    genericBundles: EntityCollection<"ce_generic_bundle"> | null;
    configurationName: string | null;
    configurationIdentifier: string | null;
    travellerTypeConfigId: string | null;
    travellerTypeConfig: Entity<"ce_traveller_type_config"> | null;
  }
  interface ce_traveller_type_config{
    id: string;

    childStartAge: number | null;
    childEndAge: number | null;
    infantStartAge: number | null;
    infantEndAge: number | null;
    adultStartAge: number | null;
    adultEndAge: number | null;
    infantProductId: string | null;
    infantProduct: Entity<"product"> | null;
    childProductId: string | null;
    childProduct: Entity<"product"> | null;
  }

  interface ce_hotel_bundle {
    id: string;
    minRoomSelection: number | null;
    maxRoomSelection: number | null;
    maxAdditionalPreNight: number | null;
    minAdditionalPreNight: number | null;
    maxAdditionalPostNight: number | null;
    minAdditionalPostNight: number | null;
    roomOptions: EntityCollection<"ce_room_bundle"> | null;
  }

  interface ce_room_bundle {
    id: string;
    roomProductId: string | null;
    roomProduct: Entity<"product"> | null;
    roomSaleRuleId: string | null;
    roomSaleRule: Entity<"ce_room_sale_rule"> | null;
    additionalPreNightProductId: string | null;
    additionalPreNightProduct: Entity<"product"> | null;
    additionalPostNightProductId: string | null;
    additionalPostNightProduct: Entity<"product"> | null;
  }

  interface ce_room_sale_rule {
    id: string;
    minAdults: number | null;
    maxAdults: number | null;
    minChildren: number | null;
    maxChildren: number | null;
  
    minInfants: number | null;
    maxInfants: number | null;
    maxTotalPersons: number | null;
    minTotalPersons: number | null;
    supplementProductId: string | null;
    supplementProduct: Entity<"product"> | null;
  }



  interface ce_generic_bundle {
    id: string;
    ceTravelProductConfigGenericBundle: Entity<"ce_travel_product_config"> | null;
    ceTravelProductConfigGenericBundlesId: string | null;
    availableOnMinParentQuantity: number | null;
    availableOnMaxParentQuantity: number | null;
    availableOnMinTravellers: number | null;
    availableOnMaxTravellers: number | null;
    matchParentQuantity: boolean | null;
    matchTravellers: boolean | null;
    parentStream: Entity<"product_stream"> | null;
    parentStreamId: string | null;
    bundleStream: Entity<"product_stream"> | null;
    bundleStreamId: string | null;
  }

  interface ce_emergency_contact_information {
    id: string;
    contactName: string;
    contactSurname: string;
    contactPhone: string;
    contactEmail: string;
  }

  interface ce_room_product_detailed_info {
    id: string;
    roomProductId?: string;
    roomProduct?: Entity<"product">;
    numberOfAdults: number;
    numberOfChildren: number;
    numberOfInfants: number;
  }

  //**end of product date conf */
  interface ce_travel_product_date_config{
    id: string;
    productId?: string;
    product?: Entity<"product"> | null;
    isDateRange?: boolean | null;
    isStaticDate?: boolean | null;
    dateRange?: Entity<"ce_date_range"> | null;
    staticDate?: Entity<"ce_static_date_opt"> | null;
  }
  interface ce_date_range{
    id: string;
    dateRangeData?: Record<string, unknown> | null;
    durationInDays?: number | null;
    meetingPoint?: Entity<"ce_meeting_point"> | null;
  }
  interface ce_static_date_opt{
    id: string;
    startDate?: string | null;
    endDate?: string | null;
    durationInDays?: number | null;
  }
  interface ce_meeting_point{
      id: string;
      meetingPointName?: string | null;
      meetingPointAddress?: string | null;
      meetingPointCity?: string | null;
      meetingPointCountry?: string | null;
      meetingPointZip?: string | null;
      meetingPointPhone?: string | null;
      meetingPointEmail?: string | null;
      meetingPointStreet?: string | null;
      meetingPointHouseNumber?: string | null;
      meetingPointFloor?: string | null;
      meetingPointIframe?: string | null;
      meetingPointInstructions?: Record<string, unknown> | null;

  }
}
