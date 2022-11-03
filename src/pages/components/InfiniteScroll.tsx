import { useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

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

export interface InfiniteScrollProps {
  searchParam: string;
  accessToken?: string;
  passModalInfo?: (albumId: string) => void;
}

const InfiniteScroll = ({
  searchParam,
  passModalInfo,
}: InfiniteScrollProps) => {
  const { ref, inView } = useInView();

  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    ["projects", searchParam, accessToken],
    async ({ pageParam = 0 }) => {
      const offset = pageParam ? pageParam * 20 : 0;
      const res = await fetch(
        `/api/searchalbums/query?name=${searchParam}&offset=${offset}&accessToken=${accessToken}`
      );
      return res.json();
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage;
      },
      enabled: !!searchParam && !!accessToken,
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const pages: Pages = data?.pages;

  console.log(status);

  return (
    <main>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <div>
            <button
              onClick={() => fetchPreviousPage()}
              disabled={!hasPreviousPage || isFetchingPreviousPage}
            >
              {isFetchingPreviousPage
                ? "Loading more..."
                : hasPreviousPage
                ? "Load Older"
                : null}
            </button>
          </div>
          <div className="mx-10 flex flex-wrap">
            {pages &&
              pages.map((page, index) => {
                return (
                  <div key={index} className="flex flex-wrap">
                    {page.albums.items
                      ? page.albums.items.map((album: Album) => {
                          return album.images[1] && album.id ? (
                            <span
                              className="relative m-2 h-[300px] w-[300px] cursor-pointer"
                              onClick={() => passModalInfo(album)}
                              key={album.id}
                            >
                              <Image
                                src={album.images[1].url}
                                alt=""
                                layout="fill"
                              />
                            </span>
                          ) : null;
                        })
                      : null}
                  </div>
                );
              })}
          </div>
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load Newer"
                : "Nothing more to load"}
            </button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>
        </>
      )}
    </main>
  );
};

export default InfiniteScroll;
