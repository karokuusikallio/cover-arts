export interface Album {
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

//Infinite Scroll Component Props
interface ISCommonProps {
  queryName: string;
  passModalInfo: (album: Album) => void;
}

export interface ISSearchProps extends ISCommonProps {
  SCROLL_TYPE: "search";
  searchParam: string | undefined;
}

export interface ISDiscoverProps extends ISCommonProps {
  SCROLL_TYPE: "discover";
  seedsAsString: string;
  targetPopularity: number;
}
