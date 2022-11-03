import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import HeroSection from "./components/HeroSection";
import InfiniteScroll from "./components/InfiniteScroll";
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
  const [applySearch, setApplySearch] = useState<string>();
  const [modalInfo, setModalInfo] = useState<Album>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApplySearch(searchParam);
  };

  const passModalInfo = (album: Album) => {
    console.log(album);
    setModalInfo(album);
    setModalVisible(true);
  };

  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection backgroundName="record-wall">
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
      <InfiniteScroll searchParam={applySearch} passModalInfo={passModalInfo} />
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
