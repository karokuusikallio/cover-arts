import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import HeroSection from "./components/HeroSection";

interface Track {
  album: {
    images: Array<{
      url: string;
    }>;
  };
}

const Browse: NextPage = () => {
  const [availableSeeds, setAvailableSeeds] = useState<Tag[]>([]);
  const [chosenSeeds, setChosenSeeds] = useState<Tag[]>([]);
  const [targetPopularity, setTargetPopularity] = useState<number>(50);
  const [albumUrls, setAlbumUrls] = useState<string[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    const getSeeds = async () => {
      if (session?.accessToken) {
        const response = await fetch(
          `/api/getavailableseeds?accessToken=${session?.accessToken}`
        );
        const seeds = await response.json();

        console.log(seeds);

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

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleDelete = (i: number) => {
    setChosenSeeds(chosenSeeds.filter((tag, index) => index !== i));
  };

  const handleAddition = (seed: Tag) => {
    if (chosenSeeds.length < 5) {
      setChosenSeeds([...chosenSeeds, seed]);
    }

    return;
  };

  const handleDrag = (seed: Tag, currPos: number, newPos: number) => {
    const newChosenSeeds = chosenSeeds.slice();

    chosenSeeds.splice(currPos, 1);
    chosenSeeds.splice(newPos, 0, seed);

    setChosenSeeds(newChosenSeeds);
  };

  const handleSliderChange = (newValue: number) => {
    setTargetPopularity(newValue);
  };

  const handleBrowseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlbumUrls([]);
    const seedNames = chosenSeeds.map((seed) => seed.text);
    const seedsAsString = seedNames.join(",");
    if (session?.accessToken) {
      const response = await fetch(
        `/api/getrecommendations/recommendations?seedgenres=${seedsAsString}&popularity=${targetPopularity}&accessToken=${session.accessToken}`
      );
      const result = await response.json();

      const resultUrls = result.tracks
        .filter((track: Track) => track?.album?.images[0]?.url != undefined)
        .map((track: Track) => track?.album?.images[0]?.url);
      setAlbumUrls(resultUrls);
    }
  };

  return (
    <main>
      <HeroSection backgroundName="record-store">
        <h1>Discover new albums</h1>
      </HeroSection>
      <form onSubmit={handleBrowseSubmit}>
        <p>Categories</p>
        <ReactTags
          tags={chosenSeeds}
          suggestions={availableSeeds}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          inputFieldPosition="bottom"
          minQueryLength={1}
          autocomplete
        />
        <p>Popularity</p>
        <input
          type="range"
          max={100}
          min={0}
          step={5}
          value={targetPopularity}
          onChange={({ target }) => handleSliderChange(Number(target.value))}
        />
        <button type="submit">Browse Album Covers</button>
      </form>
      <div>
        <h2>Result</h2>
        {albumUrls.map((albumUrl, index) => (
          <Image key={index} src={albumUrl} alt="" height="640" width="640" />
        ))}
      </div>
      {}
    </main>
  );
};

export default Browse;
