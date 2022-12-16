import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import HeroSection from "../../components/HeroSection";
import AlbumInfo from "../../components/AlbumInfo";

import getSessionInfo from "../../components/helpers/getSessionInfo";
import getSeveralAlbums from "../../components/helpers/getSeveralAlbums";
import getCollections from "../../components/helpers/getCollections";

import { Album, Collection, LoadingStates } from "../../types";

const CollectionPage: NextPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [collectionName, setCollectionName] = useState<string>("");
  const [modalAlbumInfo, setModalAlbumInfo] = useState<Album | null>(null);
  const [isLoading, setLoading] = useState<LoadingStates>(LoadingStates.idle);

  const router = useRouter();
  const { collectionId } = router.query;

  useEffect(() => {
    const getAlbums = async () => {
      setLoading(LoadingStates.loading);
      const session = await getSessionInfo();

      if (session && session.user && session.accessToken) {
        const collection: Collection = await getCollections(
          session.user.id,
          collectionId as string
        );

        if (collection && collection.albums) {
          setCollectionName(collection.collectionName);

          const albumIds = collection.albums
            .map((album) => album.albumId)
            .join(",");

          if (albumIds) {
            const albumsForCollection = await getSeveralAlbums(
              session.accessToken,
              albumIds as string
            );
            setAlbums(albumsForCollection);
          }
          setLoading(LoadingStates.finished);
        }
      }
    };

    getAlbums();
  }, [collectionId]);

  const handleDeleteAlbum = (albumId: string) => {
    const updatedAlbums = albums.filter((album) => album.id !== albumId);
    setAlbums(updatedAlbums);
    setModalAlbumInfo(null);
  };

  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection backgroundName="record-store">
        <h1 className="opacity-100">{collectionName ?? ""}</h1>
      </HeroSection>
      <div className="my-5 flex flex-wrap px-5 sm:px-20">
        {isLoading === LoadingStates.loading ? (
          <p>Loading...</p>
        ) : isLoading === LoadingStates.finished && albums.length > 0 ? (
          albums.map((album) => {
            return album.images[1] ? (
              <span
                className="relative m-2 h-[300px] w-[300px] cursor-pointer"
                onClick={() => setModalAlbumInfo(album)}
                key={album.id}
              >
                <Image src={album.images[1].url} alt="" fill />
              </span>
            ) : null;
          })
        ) : isLoading === LoadingStates.finished && albums.length === 0 ? (
          <p>No albums</p>
        ) : null}
      </div>
      {modalAlbumInfo ? (
        <AlbumInfo
          {...modalAlbumInfo}
          deleteAlbumFromState={handleDeleteAlbum}
          openedFrom="collection"
          collectionId={collectionId as string}
          closeModal={() => setModalAlbumInfo(null)}
        />
      ) : null}
    </main>
  );
};

export default CollectionPage;
