import { useState, useRef, useCallback } from "react";

import { InfiniteScrollProps } from "../components/InfiniteScroll";

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

export interface UseInfiniteScroll {
  isLoading: boolean;
  loadMoreCallback: (el: HTMLDivElement) => void;
  albums: Album[];
  isLastPage: boolean;
}

export const useInfiniteScroll = ({
  searchParam,
  accessToken,
}: InfiniteScrollProps): UseInfiniteScroll => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreTimeout: NodeJS.Timeout = setTimeout(() => null, 500);
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout>(loadMoreTimeout);

  const handleObserver = useCallback(
    (entries: any[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setIsLoading(true);
        clearTimeout(loadMoreTimeoutRef.current);

        // this timeout debounces the intersection events
        loadMoreTimeoutRef.current = setTimeout(() => {
          const offset = page ? page * 20 : 0;
          console.log("fetching", searchParam);
          fetch(
            `/api/searchalbums/query?name=${searchParam}&offset=${offset}&accessToken=${accessToken}`
          )
            .then((resp) => {
              return resp.json();
            })
            .then((data) => {
              console.log("data: ", data);
              setPage(page + 1);
              const newAlbums = data.albums;

              if (newAlbums?.length) {
                const updatedAlbums = [...albums, ...newAlbums];
                setAlbums(updatedAlbums);
                setIsLoading(false);
              } else {
                setIsLastPage(true);
              }
            });
        }, 500);
      }
    },
    [searchParam]
  );

  const loadMoreCallback = useCallback(
    (el: HTMLDivElement) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      const option: IntersectionObserverInit = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      };
      observerRef.current = new IntersectionObserver(handleObserver, option);

      if (el) observerRef.current.observe(el);
    },
    [handleObserver, isLoading]
  );

  return {
    isLoading,
    loadMoreCallback,
    albums,
    isLastPage,
  };
};
