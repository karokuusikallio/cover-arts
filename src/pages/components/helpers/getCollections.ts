import { Collection } from "../../../types";

async function getCollections(userId: string): Promise<Collection[]>;

async function getCollections(
  userId: string,
  collectionId: string
): Promise<Collection>;

async function getCollections(
  userId: string,
  collectionId?: string
): Promise<Collection | Collection[]> {
  if (collectionId) {
    const response = await fetch(
      `/api/collection/query?userId=${userId}&collectionId=${collectionId}`
    );
    const collection = await response.json();
    return collection as Collection;
  }

  const response = await fetch(`/api/collection/query?userId=${userId}`);
  const collections = await response.json();
  return collections as Collection[];
}

export default getCollections;
