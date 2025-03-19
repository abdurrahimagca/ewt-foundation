<script setup>
import { onMounted } from "vue";
import { location, ui } from "@shopware-ag/meteor-admin-sdk";

onMounted(() => {
  if (location.is(location.MAIN_HIDDEN)) {
    ui.tabs("sw-order-detail").addTabItem({
      label: "Travel Order Details",
      componentSectionId: "ce-order-view",
    });

    ui.componentSection.add({
      component: "card",
      positionId: "ce-order-view",
      props: {
        title: "Travellers",
        locationId: "ce-traveller-view-tab-card",
      },
    });

    ui.tabs("sw-product-detail").addTabItem({
      label: "Product Bundles",
      componentSectionId: "ce-product-view",
    });

    ui.componentSection.add({
      component: "card",
      positionId: "ce-product-view",
      props: {
        title: "Bundles",
        locationId: "ce-product-view-tab-card",
      },
    });
  }
});
</script>

