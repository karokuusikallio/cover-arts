import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import { delimiters, customRender } from "./components/helpers/TagHelpers";

import AlbumInfo from "./components/AlbumInfo";
import HeroSection from "./components/HeroSection";
import InfiniteScroll from "./components/InfiniteScroll";

import { Album } from "../types";

const Browse: NextPage = () => {
  const [availableSeeds, setAvailableSeeds] = useState<Tag[]>([]);
  const [chosenSeeds, setChosenSeeds] = useState<Tag[]>([]);
  const [seedsAsString, setSeedsAsString] = useState<string>("");
  const [targetPopularity, setTargetPopularity] = useState<number>(50);

  const [modalInfo, setModalInfo] = useState<Album | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const getSeeds = async () => {
      if (session?.accessToken) {
        const response = await fetch(
          `/api/getavailableseeds?accessToken=${session?.accessToken}`
        );
        const seeds = await response.json();

        const seedsAsTags = seeds.genres.map((name: string, index: number) => {
          return {
            id: index.toString(),
            text: name,
          };
        });
        setAvailableSeeds(seedsAsTags);
      }
    };

    getSeeds();
  }, [session?.accessToken]);

  const handleDelete = (i: number) => {
    setChosenSeeds(chosenSeeds.filter((tag, index) => index !== i));
  };

  const handleAddition = (seed: Tag) => {
    const tagIsValid = availableSeeds.find(
      (availableSeed) => availableSeed.id === seed.id
    );
    if (chosenSeeds.length < 5 && tagIsValid) {
      setChosenSeeds([...chosenSeeds, seed]);
    }

    return;
  };

  const handleSliderChange = (newValue: number) => {
    setTargetPopularity(newValue);
  };

  const handleBrowseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const seedNames = chosenSeeds.map((seed) => seed.text);
    const seedsAsString = seedNames.join(",");
    setSeedsAsString(seedsAsString);
  };

  const passModalInfo = (album: Album) => {
    setModalInfo(album);
  };

  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection backgroundName="record">
        <h1>Discover new albums</h1>
      </HeroSection>
      <div className="mx-20">
        <form onSubmit={handleBrowseSubmit} className="m-2 flex flex-col">
          <p className="py-2">Genres</p>
          <ReactTags
            classNames={{
              tags: "flex items-start pb-2",
              selected: "order-2 flex flex-wrap",
              tag: "bg-spotartPurple text-white rounded-lg p-2 mb-2 mr-2 !cursor-default",
              tagInput: "mr-2 order-1 rounded-lg border-2 border-black p-2",
              tagInputField: "focus:outline-none",
              remove: "pl-2",
              suggestions: "fixed bg-white z-1000 p-5 drop-shadow-xl mt-1",
            }}
            placeholder="Search Genres"
            renderSuggestion={(tag) => customRender(tag)}
            tags={chosenSeeds}
            suggestions={availableSeeds}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            inputFieldPosition="bottom"
            minQueryLength={1}
            autocomplete
          />
          <p className="py-2">Popularity</p>
          <input
            type="range"
            max={100}
            min={0}
            step={5}
            value={targetPopularity}
            onChange={({ target }) => handleSliderChange(Number(target.value))}
            className="w-1/3 py-2"
          />
          <button
            className="text-bold my-5 h-8 w-24 rounded-lg bg-spotartPurple uppercase text-white hover:bg-spotartLightPurple"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
      <div>
        <InfiniteScroll
          SCROLL_TYPE="discover"
          queryName="discoverAlbums"
          seedsAsString={seedsAsString}
          targetPopularity={targetPopularity}
          passModalInfo={passModalInfo}
        />
      </div>
      {modalInfo ? (
        <AlbumInfo
          {...modalInfo}
          closeModal={() => setModalInfo(null)}
          openedFrom="search"
        />
      ) : null}
    </main>
  );
};

export default Browse;
