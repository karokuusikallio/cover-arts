import { Album } from "../../types";

const getSeveralAlbums = async (
  accessToken: string,
  albumIds: string
): Promise<Album[]> => {
  const response = await fetch(
    `/api/searchalbums/query?accessToken=${accessToken}&albumIds=${albumIds}`
  );
  const albums = await response.json();
  return albums;
};

export default getSeveralAlbums;
