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

interface ISCommonProps {
  queryName: string;
  passModalInfo?: (albumId: string) => void;
}

interface ISSearchProps extends ISCommonProps {
  SCROLL_TYPE: "search";
  searchParam: string | undefined;
}

interface ISDiscoverProps extends ISCommonProps {
  SCROLL_TYPE: "discover";
  seedsAsString: string;
  targetPopularity: number;
}

type InfiniteScrollProps = ISSearchProps | ISDiscoverProps;

const InfiniteScroll = (props: InfiniteScrollProps) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  let query: Array<string | number | undefined> = [];
  let url: string;
  let enabled = false;

  if (props.SCROLL_TYPE === "search") {
    query = [props.queryName, props.searchParam, accessToken];
    url = `/api/searchalbums/query?name=${props.searchParam}&accessToken=${accessToken}`;
    enabled = !!props.searchParam && !!accessToken;
  }

  if (props.SCROLL_TYPE === "discover") {
    query = [
      props.queryName,
      props.seedsAsString,
      props.targetPopularity,
      accessToken,
    ];
    url = `/api/getrecommendations/recommendations?seedgenres=${props.seedsAsString}&popularity=${props.targetPopularity}&accessToken=${accessToken}`;
    enabled = !!props.seedsAsString && !!accessToken;
  }

  const { ref, inView } = useInView();

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
    [query],
    async ({ pageParam = 0 }) => {
      const offset = pageParam ? pageParam * 20 : 0;
      const res = await fetch(`${url}&offset=${offset}`);
      return res.json();
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage;
      },
      enabled,
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const pages = data?.pages;

  console.log(data);

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
          <div>
            {pages
              ? pages.map((page, index) => (
                  <div key={index} className="flex flex-wrap justify-center">
                    {page
                      ? page.map((album: Album) => {
                          return album.images[1] && album.id ? (
                            <span
                              className="relative m-2 h-[300px] w-[300px] cursor-pointer"
                              onClick={() => props.passModalInfo(album)}
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
                ))
              : null}
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
