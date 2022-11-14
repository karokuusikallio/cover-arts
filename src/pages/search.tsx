import type { NextPage } from "next";
import { useState } from "react";

import HeroSection from "./components/HeroSection";
import InfiniteScroll from "./components/InfiniteScroll";
import AlbumInfo from "./components/AlbumInfo";

import { Album } from "../types";

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
      <InfiniteScroll
        SCROLL_TYPE="search"
        queryName="searchAlbums"
        searchParam={applySearch}
        passModalInfo={passModalInfo}
      />
      {modalInfo ? (
        <AlbumInfo
          {...modalInfo}
          modalVisible={modalVisible}
          closeModal={() => setModalVisible(false)}
        />
      ) : null}
    </main>
  );
};

export default Search;
