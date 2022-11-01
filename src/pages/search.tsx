import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import HeroSection from "./components/HeroSection";
import Modal from "./components/Modal";

interface Album {
  name: string;
  id: string;
  images: Array<Image>;
  artists: Array<Artist>;
  release_date: string;
  external_urls: {
    spotify: string;
  };
}

interface Image {
  url: string;
}

interface Artist {
  name: string;
}

const Search: NextPage = () => {
  const [searchParam, setSearchParam] = useState<string>("");
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [modalInfo, setModalInfo] = useState<Album>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { data: session } = useSession();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (session?.accessToken) {
      const response = await fetch(
        `/api/searchalbums/query?name=${searchParam}&accessToken=${session.accessToken}`
      );

      const data = await response.json();
      console.log(data);
      setAlbums(data.albums.items);
    }
  };

  const passModalInfo = (albumId: string) => {
    const chosenAlbum = albums.find((album) => album.id === albumId);
    if (chosenAlbum) {
      setModalInfo(chosenAlbum);
      setModalVisible(true);
    }
  };

  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection backgroundName="record-store">
        <h1>Search for album covers</h1>
      </HeroSection>
      <form onSubmit={handleSearch} className="mx-20 flex flex-col">
        <label className="py-5">Artist Name</label>
        <input
          className="w-1/2 rounded-lg border-2 border-black p-2"
          type="text"
          value={searchParam}
          onChange={({ target }) => setSearchParam(target.value)}
        />
        <button
          className="text-bold my-5 h-8 w-24 rounded-lg bg-spotartPurple uppercase text-white hover:bg-spotartLightPurple"
          type="submit"
        >
          Search
        </button>
      </form>
      {albums.length > 0 && <p className="mx-20 my-2">Results:</p>}
      <div className="mx-10 flex flex-wrap">
        {albums.map((album) =>
          album.images[1] ? (
            <span
              className="relative m-2 h-[300px] w-[300px] cursor-pointer"
              onClick={() => passModalInfo(album.id)}
              key={album.id}
            >
              <Image src={album.images[1].url} alt="" layout="fill" />
            </span>
          ) : null
        )}
      </div>
      <Modal
        albumName={modalInfo?.name}
        imageUrl={modalInfo?.images[0]?.url}
        artists={modalInfo?.artists}
        releaseDate={modalInfo?.release_date}
        url={modalInfo?.external_urls.spotify}
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      />
    </main>
  );
};

export default Search;
