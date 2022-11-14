import { useState } from "react";
import Image from "next/image";
import { Album, Collection } from "../../types";
import { useQuery } from "@tanstack/react-query";

import Modal from "./Modal";
import Togglable from "./Togglable";

interface AlbumInfoProps extends Album {
  modalVisible: boolean;
  closeModal: () => void;
}

const AlbumInfo = ({
  name,
  images,
  artists,
  release_date,
  external_urls,
  modalVisible,
  id,
  closeModal,
}: AlbumInfoProps) => {
  const [chosenCollectionId, setChosenCollectionId] = useState<string>("");

  const getCollections = async (): Promise<Collection[]> => {
    const response = await fetch("/api/collection");
    const collections = await response.json();
    return collections;
  };

  const { data: collections, status } = useQuery(
    ["collections"],
    getCollections
  );

  const handleAddAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const addedAlbum = await fetch(`/api/album/${chosenCollectionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ albumId: id }),
      });

      alert(`Added album ${addedAlbum}!`);
    } catch (error) {
      console.log(error);
    }
  };

  const artistNames = artists?.map((artist) => artist.name);
  const artistsNamesAsString = artistNames?.join(", ");
  const releaseYear = release_date?.substring(0, 4);

  if (modalVisible) {
    return (
      <Modal>
        <div className="flex h-5/6 w-5/6 bg-white">
          <span className="relative m-5 w-2/3">
            {images[0] ? (
              <Image
                src={images[0]?.url}
                alt=""
                layout="fill"
                objectFit="contain"
              />
            ) : null}
          </span>
          <div className="m-5 flex w-1/3 flex-col justify-center text-center">
            <b>Artist:</b>
            <p>{artistsNamesAsString}</p>
            <br />
            <br />
            <b>Album:</b>
            <p>{name ?? "Not Found"}</p>
            <br />
            <br />
            <b>Release Year</b>
            <p>{releaseYear}</p>
            <br />
            <br />
            {external_urls.spotify ? (
              <a
                className="text-bold mx-5 rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
                href={external_urls.spotify}
                target="_blank"
                rel="noreferrer"
              >
                Listen to The Album
              </a>
            ) : null}

            <Togglable buttonLabel="Add album to collection">
              <form onSubmit={handleAddAlbum}>
                <div>
                  <label>Collection name</label>
                  <select
                    value={chosenCollectionId}
                    onChange={({ target }) =>
                      setChosenCollectionId(target.value)
                    }
                  >
                    {collections &&
                      status === "success" &&
                      collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                  </select>
                </div>
                <button type="submit" disabled={!chosenCollectionId}>
                  Add album
                </button>
              </form>
            </Togglable>
          </div>
          <button
            className="text-bold relative top-0 right-0 m-5 h-8 w-8 rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
            onClick={() => closeModal()}
          >
            X
          </button>
        </div>
      </Modal>
    );
  }

  return null;
};

export default AlbumInfo;
