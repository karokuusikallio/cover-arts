import { Collection } from "../../../types";

const getSeveralAlbums = async (
  userId: string,
  collection: Collection
): Promise<any> => {
  const albumIds = collection.albums.map((album) => album.albumId).join(",");
  const response = await fetch(
    `/api/searchalbums?accessToken=${userId}&albumIds=${albumIds}`
  );
  const albums = await response.json();
  return albums;
};

export default getSeveralAlbums;
