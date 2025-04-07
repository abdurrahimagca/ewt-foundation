import { data } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";

export function useSw() {
  async function fetchSwEntity<T extends keyof EntitySchema.Entities>(
    key: T,
    criteria?: InstanceType<typeof data.Classes.Criteria>,
  ): Promise<Entity<T> | null> {
    const c = criteria || new data.Classes.Criteria();
    const result = await data.repository(key).search(c);
    return result?.first() || null;
  }
  async function fetchSwEntityCollection<T extends keyof EntitySchema.Entities>(
    key: T,
    criteria?: InstanceType<typeof data.Classes.Criteria>,
  ): Promise<EntityCollection<T> | null> {
    const c = criteria || new data.Classes.Criteria();
    const result = await data.repository(key).search(c);
    return result;
  }
  async function saveSwEntity<T extends keyof EntitySchema.Entities>(
    key: T,
    entity: Entity<T>,
  ): Promise<void> {
    await data.repository(key).save(entity);
  }
  async function deleteSwEntity<T extends keyof EntitySchema.Entities>(
    key: T,
    id: string,
  ): Promise<void> {
    await data.repository(key).delete(id);
  }
  async function createSwEntity<T extends keyof EntitySchema.Entities>(
    key: T,
  ): Promise<Entity<T> | null> {
    const entity = data.repository(key).create();
    return entity;
  }
  async function saveSwEntityCollection<T extends keyof EntitySchema.Entities>(
    key: T,
    entityCollection: EntityCollection<T>,
  ): Promise<void> {
    await data.repository(key).saveAll(entityCollection);
  }

  return {
    fetchSwEntity,
    fetchSwEntityCollection,
    saveSwEntity,
    deleteSwEntity,
    createSwEntity,
    saveSwEntityCollection,
  };
}
