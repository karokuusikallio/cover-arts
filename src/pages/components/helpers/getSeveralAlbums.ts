const getSeveralAlbums = async (
  accessToken: string,
  albumIds: string
): Promise<any> => {
  const response = await fetch(
    `/api/searchalbums/query?accessToken=${accessToken}&albumIds=${albumIds}`
  );
  const albums = await response.json();
  return albums;
};

export default getSeveralAlbums;
