import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { Album } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

import getCollections from "./helpers/getCollectionsQuery";

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
  console.log(chosenCollectionId);

  const { data: session } = useSession();

  const queryClient = useQueryClient();
  const { data: collections, status } = useQuery(
    ["collections", session?.user?.id],
    () => getCollections(session?.user?.id)
  );

  const collectionForSelect =
    collections && collections?.length > 0
      ? collections.map((collection) => ({
          value: collection.id,
          label: collection.name,
        }))
      : [];

  const handleAddAlbum = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await fetch(`/api/album/${chosenCollectionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ albumId: id }),
        });
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
    },
  });

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
              <form onSubmit={handleAddAlbum.mutate}>
                <div>
                  <label>Collection name</label>
                  <Select
                    value={chosenCollectionId}
                    onChange={setChosenCollectionId}
                    options={collectionForSelect}
                  />
                </div>
                <button type="submit">Add album</button>
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
