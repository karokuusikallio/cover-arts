import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

import getSessionInfo from "./helpers/getSessionInfo";
import getCollections from "./helpers/getCollections";

import Modal from "./Modal";
import Togglable from "./Togglable";

import { Album, LoadingStates as AlbumCRUDStates } from "../types/index";

interface AlbumInfoProps extends Album {
  openedFrom: "search" | "collection";
  collectionId?: string;
  closeModal: () => void;
  deleteAlbumFromState?: (albumId: string) => void;
}

interface ReactSelectObject {
  value: string;
  label: string;
}

const AlbumInfo = ({
  name,
  images,
  artists,
  release_date,
  external_urls,
  id,
  openedFrom,
  collectionId,
  deleteAlbumFromState,
  closeModal,
}: AlbumInfoProps) => {
  const [chosenCollection, setChosenCollection] =
    useState<ReactSelectObject | null>(null);
  const [albumFormVisible, setAlbumFormVisible] = useState<boolean>(false);
  const [albumCRUDState, setAlbumCRUDState] = useState<AlbumCRUDStates>(
    AlbumCRUDStates.idle
  );
  const [userId, setUserId] = useState<string>("");

  const queryClient = useQueryClient();
  const { data: collections } = useQuery(
    ["collections", userId],
    () => getCollections(userId),
    { enabled: !!userId }
  );

  const collectionForSelect =
    collections && collections?.length > 0
      ? collections.map((collection) => ({
          value: collection.id,
          label: collection.collectionName,
        }))
      : [];

  const handleAddAlbum = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAlbumCRUDState(AlbumCRUDStates.loading);
      if (chosenCollection) {
        await fetch(
          `/api/album/query?collectionId=${chosenCollection.value}&albumId=${id}`,
          {
            method: "POST",
          }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
      setAlbumCRUDState(AlbumCRUDStates.finished);
    },
  });

  const handleDeleteAlbum = useMutation({
    mutationFn: async () => {
      if (collectionId) {
        setAlbumCRUDState(AlbumCRUDStates.loading);
        try {
          const response = await fetch(
            `/api/album/query?collectionId=${collectionId}&albumId=${id}`,
            {
              method: "DELETE",
            }
          );
          const deletedItems = await response.json();
          return deletedItems;
        } catch (error) {
          console.log(error);
        }
      }
    },
    onSuccess: () => {
      if (deleteAlbumFromState) {
        deleteAlbumFromState(id);
      }
      queryClient.invalidateQueries(["collections"]);
    },
  });

  useEffect(() => {
    const getUserId = async () => {
      const session = await getSessionInfo();
      if (session && session.user) {
        setUserId(session.user.id);
      }
    };

    getUserId();
  }, []);

  const artistNames = artists?.map((artist) => artist.name);
  const artistsNamesAsString = artistNames?.join(", ");
  const releaseYear = release_date?.substring(0, 4);

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

          {openedFrom === "search" ? (
            albumCRUDState === AlbumCRUDStates.idle ? (
              <Togglable
                buttonLabel="Add album to collection"
                visible={albumFormVisible}
                setVisibility={setAlbumFormVisible}
              >
                <form onSubmit={handleAddAlbum.mutate}>
                  <div>
                    <label>Collection name</label>
                    <Select
                      value={chosenCollection}
                      onChange={setChosenCollection}
                      options={collectionForSelect}
                    />
                  </div>
                  <button
                    disabled={chosenCollection === null}
                    className="text-bold m-5 rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
                    type="submit"
                  >
                    Add album
                  </button>
                </form>
              </Togglable>
            ) : albumCRUDState === AlbumCRUDStates.loading ? (
              <p>Adding album...</p>
            ) : albumCRUDState === AlbumCRUDStates.finished ? (
              <p>Album Added!</p>
            ) : null
          ) : null}

          {openedFrom === "collection" ? (
            albumCRUDState === AlbumCRUDStates.idle ? (
              <button
                className="text-bold m-5 rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
                onClick={() => handleDeleteAlbum.mutate()}
              >
                Remove from collection
              </button>
            ) : albumCRUDState === AlbumCRUDStates.loading ? (
              <p>Deleting album...</p>
            ) : null
          ) : null}
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
};

export default AlbumInfo;
