<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { data } from "@shopware-ag/meteor-admin-sdk";
import type { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { useSw } from "@/modules/shared/composables/useSw";

const orderId = ref<string | undefined>(undefined);
const reservation = ref<Entity<"ce_order_reservation_payment"> | null>(null);
const transactions = ref<EntityCollection<"order_transaction"> | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const { fetchSwEntity, fetchSwEntityCollection } = useSw();

const refreshData = async () => {
  if (!orderId.value) {
    return;
  }

  try {
    isLoading.value = true;

    const reservationCriteria = new data.Classes.Criteria();
    reservationCriteria.addFilter({
      type: "equals",
      field: "orderId",
      value: orderId.value,
    });
    reservation.value = await fetchSwEntity(
      "ce_order_reservation_payment",
      reservationCriteria,
    );

    const transactionCriteria = new data.Classes.Criteria();
    transactionCriteria.addFilter({
      type: "equals",
      field: "orderId",
      value: orderId.value,
    });
    transactionCriteria.addAssociation("paymentMethod");
    transactionCriteria.addAssociation("stateMachineState");
    transactionCriteria.addSorting({
      field: "createdAt",
      order: "ASC",
      naturalSorting: true,
    });
    transactions.value = await fetchSwEntityCollection(
      "order_transaction",
      transactionCriteria,
    );

    error.value = null;
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Unable to load reservation data.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const result: any = await data.get({
      id: "sw-order-detail-base__order",
      selectors: ["id"],
    });
    if (result?.id) {
      orderId.value = result.id;
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Unable to resolve current order.";
  }
});

watch(orderId, async (newValue) => {
  if (newValue) {
    await refreshData();
  }
});

const reservationAmount = computed(() => reservation.value?.reservationAmount);
const remainingBalance = computed(() => reservation.value?.remainingBalance);
const reservationStatus = computed(() => reservation.value?.status ?? "n/a");
</script>

<template>
  <div class="ewt-container ewt-container--full">
    <div class="ewt-card ewt-card--full">
      <div class="ewt-card-header ewt-flex ewt-flex--between ewt-flex--center">
        <div>
          <h2 class="ewt-card-title">Reservation Payments</h2>
          <div class="ewt-meta-info">Order ID: {{ orderId || "unknown" }}</div>
        </div>
        <div class="ewt-actions">
          <button
            class="ewt-button ewt-button--primary"
            :disabled="isLoading"
            @click="refreshData"
          >
            <span v-if="isLoading" class="ewt-loading-spinner"></span>
            <span v-else>Refresh</span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="ewt-loading">Loading...</div>
      <div v-else-if="error" class="ewt-error-text ewt-mb-3">{{ error }}</div>

      <div v-else class="ewt-grid ewt-gap-4">
        <section class="ewt-summary-card">
          <h3>Reservation Summary</h3>
          <div v-if="reservation">
            <p>
              <strong>Reservation Amount:</strong>
              {{ reservationAmount ?? "-" }}
            </p>
            <p>
              <strong>Remaining Balance:</strong>
              {{ remainingBalance ?? "-" }}
            </p>
            <p><strong>Status:</strong> {{ reservationStatus }}</p>
            <p>
              <strong>Deposit Paid:</strong>
              {{ reservation?.depositPaid ? "Yes" : "No" }}
            </p>
            <p>
              <strong>Updated At:</strong>
              {{ reservation?.depositPaidAt ?? "-" }}
            </p>
          </div>
          <div v-else>
            <p>No reservation data recorded for this order.</p>
          </div>
        </section>

        <section class="ewt-summary-card">
          <h3>Transactions</h3>
          <table class="ewt-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!transactions || transactions.length === 0">
                <td colspan="4">No transactions found.</td>
              </tr>
              <tr v-for="tx in transactions" :key="tx.id">
                <td>{{ tx.id }}</td>
                <td>{{ tx.amount?.totalPrice ?? "-" }}</td>
                <td>{{ tx.paymentMethod?.name ?? "-" }}</td>
                <td>{{ tx.stateMachineState?.technicalName ?? "unknown" }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ewt-summary-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.ewt-summary-card h3 {
  margin-bottom: 12px;
}

.ewt-table {
  width: 100%;
  border-collapse: collapse;
}

.ewt-table th,
.ewt-table td {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 1px solid #e2e8f0;
}
</style>
