import type { NextPage } from "next";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import HeroSection from "../components/HeroSection";

import getSeveralAlbums from "../components/helpers/getSeveralAlbums";
import getCollections from "../components/helpers/getCollectionsQuery";

import { Album, Collection } from "../../types";

const CollectionPage: NextPage = () => {
  const [collection, setCollection] = useState<Collection>();
  const [albums, setAlbums] = useState<Album[]>([]);
  console.log(albums);

  const router = useRouter();
  const { collectionId } = router.query;

  const { data: session } = useSession();
  const { data: collections } = useQuery(
    ["collections", session?.user?.id],
    () => getCollections(session?.user?.id)
  );

  useEffect(() => {
    const getAlbums = async () => {
      if (collections && collectionId) {
        const collectionToShow = collections.find(
          (collection) => collection.id === collectionId
        );

        setCollection(collectionToShow);

        if (collectionToShow && session?.accessToken) {
          const albumIds = collectionToShow.albums
            .map((album) => album.albumId)
            .join(",");
          const albumsForCollection = await getSeveralAlbums(
            session.accessToken,
            albumIds as string
          );
          setAlbums(albumsForCollection);
        }
      }
    };
    getAlbums();
  }, [collections, collectionId, session?.accessToken]);

  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection backgroundName="record-store">
        <h1 className="opacity-100">{collection?.name ?? ""}</h1>
      </HeroSection>
      <div className="flex flex-wrap justify-center">
        {collections && collections.length > 0 && albums.length === 0 ? (
          <p>Loading...</p>
        ) : albums.length > 0 ? (
          albums.map((album) => {
            return album.images[1] ? (
              <span
                className="relative m-2 h-[300px] w-[300px] cursor-pointer"
                onClick={() => console.log(`Open album ${album.id}`)}
                key={album.id}
              >
                <Image src={album.images[1].url} alt="" layout="fill" />
              </span>
            ) : null;
          })
        ) : (
          <p>No albums</p>
        )}
      </div>
    </main>
  );
};

export default CollectionPage;
