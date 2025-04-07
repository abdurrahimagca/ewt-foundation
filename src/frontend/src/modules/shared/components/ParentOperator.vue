<template>
  <div class="operator-container">
    <div class="header-actions">
      <button class="action-btn danger" @click="startOver">Start Over</button>
      <button class="action-btn" @click="toggleRawData">
        {{ showRawData ? "Hide Raw Data" : "Show Raw Data" }}
      </button>
    </div>

    <div class="available-products">
      <h3 class="section-title">Available Products</h3>
      <p class="section-description">
        Click on products to add them to your current group
      </p>
      <div class="product-grid">
        <div
          v-for="product in props.products"
          :key="product.id"
          class="product-box"
          :class="{ disabled: isProductSelected(product.id) }"
          @click="addProduct(product)"
        >
          {{ product.productNumber }}
        </div>
      </div>
    </div>

    <div class="expression-builder">
      <h3 class="section-title">Expression Builder</h3>
      <p class="section-description">
        Build your logical expression by creating groups and nesting them
      </p>

      <div class="expression-container">
        <div class="current-group-section">
          <h4 class="subsection-title">Current Group</h4>
          <div class="expression-group">
            <div class="group-content">
              <div
                v-for="(box, index) in currentGroup"
                :key="box.pid"
                class="product-box selected"
              >
                {{ box.productNumber }}
                <button class="remove-btn" @click="removeProduct(index)">
                  ×
                </button>
              </div>
              <div v-if="currentGroup.length === 0" class="empty-state">
                Add products to create a group
              </div>
            </div>
            <div class="group-operator">
              <button
                class="operator-btn"
                :class="{ active: groupOperator === __OPERATOR__.AND }"
                @click="setGroupOperator(__OPERATOR__.AND)"
              >
                AND
              </button>
              <button
                class="operator-btn"
                :class="{ active: groupOperator === __OPERATOR__.OR }"
                @click="setGroupOperator(__OPERATOR__.OR)"
              >
                OR
              </button>
            </div>
          </div>
        </div>

        <div class="expression-actions">
          <button
            class="action-btn"
            @click="startNewGroup"
            :disabled="currentGroup.length === 0"
          >
            Start New Group
          </button>
          <button
            class="action-btn"
            @click="nestCurrentGroup"
            :disabled="currentGroup.length === 0 || nestedGroups.length === 0"
          >
            Nest Current Group
          </button>
          <button
            class="action-btn"
            @click="closeCurrentGroup"
            :disabled="currentGroup.length === 0"
          >
            Close Current Group
          </button>
        </div>
      </div>
    </div>

    <div class="logical-statement-container">
      <h3 class="section-title">Final Statement</h3>
      <div class="logical-statement">
        {{ logicalStatement || "No expression built yet" }}
      </div>
    </div>

    <div v-if="showRawData" class="raw-data-container">
      <h3 class="section-title">Raw Data</h3>
      <pre class="raw-data">{{ JSON.stringify(rawData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  products: {
    id: string;
    productNumber: string;
  }[];
}>();

type __STATEMENT_BOX__ = {
  pid: string;
  productNumber: string;
  position: number;
};

type __STATEMENT__ = {
  group: __STATEMENT_BOX__[];
  operator: __OPERATOR__;
  nested?: __STATEMENT__[];
};

enum __OPERATOR__ {
  AND = "&&",
  OR = "||",
}

const currentGroup = ref<__STATEMENT_BOX__[]>([]);
const groupOperator = ref<__OPERATOR__>(__OPERATOR__.AND);
const nestedGroups = ref<__STATEMENT__[]>([]);
const showRawData = ref(false);

const startOver = () => {
  currentGroup.value = [];
  nestedGroups.value = [];
  groupOperator.value = __OPERATOR__.AND;
};

const toggleRawData = () => {
  showRawData.value = !showRawData.value;
};

const isProductSelected = (productId: string): boolean => {
  // Check if product is in current group
  if (currentGroup.value.some((box) => box.pid === productId)) {
    return true;
  }
  // Check if product is in any nested group
  return nestedGroups.value.some(
    (group) =>
      group.group.some((box) => box.pid === productId) ||
      (group.nested &&
        group.nested.some((nestedGroup) =>
          nestedGroup.group.some((box) => box.pid === productId),
        )),
  );
};

const addProduct = (product: { id: string; productNumber: string }) => {
  if (!isProductSelected(product.id)) {
    currentGroup.value.push({
      pid: product.id,
      productNumber: product.productNumber,
      position: currentGroup.value.length,
    });
  }
};

const removeProduct = (index: number) => {
  currentGroup.value.splice(index, 1);
  // Update positions
  currentGroup.value.forEach((box, i) => {
    box.position = i;
  });
};

const setGroupOperator = (operator: __OPERATOR__) => {
  groupOperator.value = operator;
};

const startNewGroup = () => {
  if (currentGroup.value.length > 0) {
    nestedGroups.value.push({
      group: [...currentGroup.value],
      operator: groupOperator.value,
    });
    currentGroup.value = [];
  }
};

const nestCurrentGroup = () => {
  if (currentGroup.value.length > 0) {
    const lastGroup = nestedGroups.value[nestedGroups.value.length - 1];
    if (lastGroup) {
      lastGroup.nested = lastGroup.nested || [];
      lastGroup.nested.push({
        group: [...currentGroup.value],
        operator: groupOperator.value,
      });
      currentGroup.value = [];
    }
  }
};

const closeCurrentGroup = () => {
  if (currentGroup.value.length > 0) {
    startNewGroup();
  }
};

const buildNestedStatement = (groups: __STATEMENT__[]): string => {
  if (!groups || groups.length === 0) return "";

  return groups
    .map((group, index) => {
      const groupStr = group.group
        .sort((a, b) => a.position - b.position)
        .map((box) => box.productNumber)
        .join(` ${group.operator} `);

      let result = `(${groupStr})`;

      if (group.nested && group.nested.length > 0) {
        const nestedStr = buildNestedStatement(group.nested);
        result = `(${result} ${group.operator} ${nestedStr})`;
      }

      // Only add operator if it's not the first group
      if (index > 0) {
        return `${group.operator} ${result}`;
      }
      return result;
    })
    .join(" ");
};

const logicalStatement = computed(() => {
  if (currentGroup.value.length > 0) {
    const tempGroups = [...nestedGroups.value];
    tempGroups.push({
      group: [...currentGroup.value],
      operator: groupOperator.value,
    });
    return buildNestedStatement(tempGroups);
  }
  return buildNestedStatement(nestedGroups.value);
});

type LogicalExpression = {
  position: number;
  __typename__: string;
  __operatorname__: string;
  __operator__: string;
  conditions: Array<{
    __typename__: string;
    position: number;
    value: {
      __typename__: string;
      __operatorname__?: string;
      __operator__?: string;
      id?: string;
      productNumber?: string;
      conditions?: LogicalExpression["conditions"];
    };
  }>;
};

const buildLogicalExpression = (groups: __STATEMENT__[]): LogicalExpression => {
  if (!groups || groups.length === 0) {
    return {
      position: 0,
      __typename__: "root-condition-wrapper",
      __operatorname__: "AND",
      __operator__: "&&",
      conditions: [],
    };
  }

  const conditions: LogicalExpression["conditions"] = groups.map(
    (group, index) => {
      const productConditions = group.group
        .sort((a, b) => a.position - b.position)
        .map((box) => ({
          __typename__: "product-condition",
          position: box.position,
          value: {
            __typename__: "product-value",
            id: box.pid,
            productNumber: box.productNumber,
          },
        }));

      if (group.nested && group.nested.length > 0) {
        const nestedExpression = buildLogicalExpression(group.nested);
        return {
          __typename__: "group-condition",
          position: index,
          value: {
            __typename__: "condition-wrapper",
            __operatorname__:
              group.operator === __OPERATOR__.AND ? "AND" : "OR",
            __operator__: group.operator,
            conditions: nestedExpression.conditions,
          },
        };
      }

      return {
        __typename__: "group-condition",
        position: index,
        value: {
          __typename__: "condition-wrapper",
          __operatorname__: group.operator === __OPERATOR__.AND ? "AND" : "OR",
          __operator__: group.operator,
          conditions: productConditions,
        },
      };
    },
  );

  // Use the operator from the first group for the root
  const rootOperator = groups[0].operator;
  return {
    position: 0,
    __typename__: "root-condition-wrapper",
    __operatorname__: rootOperator === __OPERATOR__.AND ? "AND" : "OR",
    __operator__: rootOperator,
    conditions,
  };
};

const rawData = computed<Record<string, unknown>>(() => {
  if (currentGroup.value.length > 0) {
    const tempGroups = [...nestedGroups.value];
    tempGroups.push({
      group: [...currentGroup.value],
      operator: groupOperator.value,
    });
    return buildLogicalExpression(tempGroups);
  }
  return buildLogicalExpression(nestedGroups.value);
});
</script>

<style scoped>
.operator-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.section-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.expression-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
}

.current-group-section {
  margin-bottom: 1.5rem;
}

.expression-group {
  margin-bottom: 1.5rem;
}

.group-content {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  min-height: 80px;
}

.empty-state {
  color: #999;
  font-style: italic;
  width: 100%;
  text-align: center;
  padding: 1rem;
}

.product-box {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #2c3e50;
  background-color: #ffffff;
  min-width: 100px;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.product-box:hover:not(.disabled) {
  border-color: #3498db;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-box.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f8f9fa;
}

.product-box.selected {
  background-color: #3498db;
  border-color: #2980b9;
  color: white;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
}

.group-operator {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.operator-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #2c3e50;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.operator-btn:hover {
  border-color: #3498db;
  background-color: #f8f9fa;
}

.operator-btn.active {
  background-color: #3498db;
  border-color: #2980b9;
  color: white;
}

.expression-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #3498db;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #3498db;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  background-color: #3498db;
  color: white;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.danger {
  border-color: #e74c3c;
  color: #e74c3c;
}

.action-btn.danger:hover:not(:disabled) {
  background-color: #e74c3c;
  color: white;
}

.logical-statement-container {
  margin-top: 2rem;
}

.logical-statement {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-family: "Fira Code", monospace;
  font-size: 0.9rem;
  color: #2c3e50;
  border: 2px solid #e0e0e0;
  white-space: pre-wrap;
  word-break: break-all;
}

.raw-data-container {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.raw-data {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-family: "Fira Code", monospace;
  font-size: 0.9rem;
  color: #2c3e50;
  border: 2px solid #e0e0e0;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 400px;
  overflow-y: auto;
}

.available-products,
.expression-builder,
.logical-statement-container {
  margin-bottom: 2rem;
}
</style>
