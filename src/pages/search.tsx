import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

interface Album {
  id: string;
  images: Array<Image>;
}

interface Image {
  url: string;
}

const Search: NextPage = () => {
  const [searchParam, setSearchParam] = useState<string>("");
  const [albums, setAlbums] = useState<Array<Album>>([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const promise = await fetch(`/api/searchalbums/${searchParam}`);

    const response = await promise.json();
    setAlbums(response.albums.items);
    setSearchParam("");
  };

  return (
    <main>
      <form onSubmit={handleSearch}>
        <label>Search for album covers</label>
        <input
          type="text"
          value={searchParam}
          onChange={({ target }) => setSearchParam(target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {albums.map((album) =>
          album.images[0] ? (
            <Image
              key={album.id}
              src={album.images[0].url}
              alt=""
              height="640"
              width="640"
            />
          ) : null
        )}
      </div>
    </main>
  );
};

export default Search;
