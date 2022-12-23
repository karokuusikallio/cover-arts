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
                  <div
                    key={index}
                    className="my-5 flex flex-wrap justify-center px-5 sm:px-20"
                  >
                    {page
                      ? page.map((album) => {
                          return album.images[1] ? (
                            <div className="m-2 flex flex-col shadow-smallShadow">
                              <a
                                className="flex flex-row items-center justify-center p-2 font-semibold text-spotartPurple hover:text-spotartLightPurple"
                                href={album.uri}
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
                              <div
                                className="relative cursor-pointer"
                                onClick={() => props.passModalInfo(album)}
                                key={album.id}
                              >
                                <Image
                                  src={album.images[1].url}
                                  alt=""
                                  height={300}
                                  width={300}
                                />
                              </div>
                            </div>
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
          <div className="my-5 px-5 sm:px-20">
            {isFetching && !isFetchingNextPage ? "Loading..." : null}
          </div>
        </>
      )}
    </main>
  );
};

export default InfiniteScroll;
