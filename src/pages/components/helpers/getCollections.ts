import { Collection } from "../../../types";

const getCollections = async (
  userId: string | undefined,
  collectionId?: string
): Promise<Collection[] | Collection> => {
  if (collectionId) {
    const response = await fetch(
      `/api/collection/query?userId=${userId}&collectionId=${collectionId}`
    );
    const collection = await response.json();
    return collection;
  }

  const response = await fetch(`/api/collection/query?userId=${userId}`);
  const collections = await response.json();
  return collections;
};

export default getCollections;
