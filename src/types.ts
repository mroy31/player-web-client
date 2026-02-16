
export type PlayerStateT = {
  volume: number;
  playingStatus: string;
  videoId: number;
  timePosition: number;
  aChannelIdx: number;
  sChannelIdx: number;
};

export type StreamT = {
  idx: number;
  lang: string;
};

export type VideoT = {
  name: string;
  duration: number;
  audioStreams: StreamT[];
  subStreams: StreamT[];
};
