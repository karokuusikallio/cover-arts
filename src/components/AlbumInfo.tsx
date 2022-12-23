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
  uri,
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
      <div
        className="my-20 flex w-full flex-col items-center justify-between bg-white p-5
      md:w-[90%] lg:h-[90%] lg:flex-row"
      >
        <div className="mt-[400px] shadow-smallShadow lg:mt-0">
          {images[0] ? (
            <Image src={images[0]?.url} alt="" height={600} width={600} />
          ) : null}
        </div>
        <div className="m-5 flex flex-col items-center justify-center text-center">
          <b>Artist:</b>
          <p>{artistsNamesAsString}</p>
          <br />
          <b>Album:</b>
          <p>{name ?? "Not Found"}</p>
          <br />
          <b>Release Year</b>
          <p>{releaseYear}</p>
          <br />
          {uri ? (
            <a
              className="flex flex-row items-center font-semibold text-spotartPurple hover:text-spotartLightPurple"
              href={uri}
              target="_blank"
              rel="noreferrer"
            >
              Play on
              <Image
                className="p-2"
                src={"/spotify-logo-cropped.svg"}
                width={120}
                height={50}
                alt={"spotify-logo"}
              />
            </a>
          ) : null}

          {openedFrom === "search" ? (
            albumCRUDState === AlbumCRUDStates.idle ? (
              <Togglable
                buttonLabel="Add album to collection"
                visible={albumFormVisible}
                setVisibility={setAlbumFormVisible}
              >
                <form onSubmit={handleAddAlbum.mutate} className="m-2 h-full">
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
                    className="text-bold mt-5 rounded-lg bg-spotartPurple p-2 px-3 uppercase text-white hover:bg-spotartLightPurple"
                    type="submit"
                  >
                    Add album
                  </button>
                </form>
              </Togglable>
            ) : albumCRUDState === AlbumCRUDStates.loading ? (
              <p className="m-2">Adding album...</p>
            ) : albumCRUDState === AlbumCRUDStates.finished ? (
              <p className="m-2">Album Added!</p>
            ) : null
          ) : null}

          {openedFrom === "collection" ? (
            albumCRUDState === AlbumCRUDStates.idle ? (
              <button
                className="text-bold m-5 rounded-lg bg-spotartPurple p-2 uppercase text-white hover:bg-spotartLightPurple"
                onClick={() => handleDeleteAlbum.mutate()}
              >
                Remove from collection
              </button>
            ) : albumCRUDState === AlbumCRUDStates.loading ? (
              <p className="m-2">Deleting album...</p>
            ) : null
          ) : null}
        </div>
        <div className="h-full">
          <button
            className="text-bold m-5 h-8 w-10 rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
            onClick={() => closeModal()}
          >
            X
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AlbumInfo;
