import { useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Album, ISSearchProps, ISDiscoverProps } from "../types";

type InfiniteScrollProps = ISSearchProps | ISDiscoverProps;

const InfiniteScroll = (props: InfiniteScrollProps) => {
  const { data: session } = useSession();
  const { ref, inView } = useInView();
  const accessToken = session?.accessToken;

  let query: Array<string | number | undefined> = [];
  let url: string;

  if (props.SCROLL_TYPE === "search" && accessToken && props.searchParam) {
    query = [props.queryName, props.searchParam];
    url = `/api/searchalbums/query?search=${props.searchParam}&accessToken=${accessToken}`;
  }

  if (props.SCROLL_TYPE === "discover" && accessToken && props.seedsAsString) {
    query = [props.queryName, props.seedsAsString, props.targetPopularity];
    url = `/api/getrecommendations/recommendations?seedgenres=${props.seedsAsString}&popularity=${props.targetPopularity}&accessToken=${accessToken}`;
  }

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [query],
    async ({ pageParam = 0 }): Promise<Album[]> => {
      const offset = pageParam ? pageParam * 20 : 0;
      const res = await fetch(`${url}&offset=${offset}`);
      return res.json();
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (props.SCROLL_TYPE === "discover") {
          return undefined;
        }
        const nextPage = allPages.length + 1;
        return nextPage;
      },
      enabled: !(query[1] === undefined),
    }
  );

  useEffect(() => {
    if (inView && status === "success") {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, status]);

  const pages = data?.pages;

  return (
    <main>
      {status === "error" && error instanceof Error ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <div>
            {pages
              ? pages.map((page, index) => (
                  <div key={index} className="my-5 flex flex-wrap px-20">
                    {page
                      ? page.map((album) => {
                          return album.images[1] ? (
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
                : status === "loading"
                ? ""
                : "End of results"}
            </button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? "Loading..." : null}</div>
        </>
      )}
    </main>
  );
};

export default InfiniteScroll;
