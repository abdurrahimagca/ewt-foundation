import { location, ui } from "@shopware-ag/meteor-admin-sdk";
import "./modules/order.js";

if (location.is(location.MAIN_HIDDEN)) {
  // Add tab bar item
  ui.tabs("sw-order-detail").addTabItem({
    label: "Travel Order Details",
    componentSectionId: "ce-order-view",
  });

  // Add component to the new created section
  ui.componentSection.add({
    component: "card",
    positionId: "ce-order-view",
    props: {
      title: "Travellers",
      locationId: "ce-traveller-view-tab-card",
    },
  });
}
