import { Collection } from "../../../types";

const getCollections = async (
  userId: string | undefined
): Promise<Collection[] | undefined> => {
  if (userId) {
    const response = await fetch(`/api/collection/${userId}`);
    const collections = await response.json();
    return collections;
  }
  return;
};

export default getCollections;
