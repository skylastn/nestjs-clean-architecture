import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export const entityManagerStorage = new AsyncLocalStorage<EntityManager>();

export function getEntityManager(defaultManager: EntityManager): EntityManager {
  const manager = entityManagerStorage.getStore();
  return manager ?? defaultManager;
}
