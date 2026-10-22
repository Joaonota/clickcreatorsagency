export interface CampaignVideo {
  id: string;
  title: string;
  src: string;
  mime: string;
}

export interface CampaignPhoto {
  id: string;
  title: string;
  src: string;
}

export const campaignPhotos: CampaignPhoto[] = [
  {
    id: "camp-photo-casting",
    title: "Casting",
    src: "/camapnhas/Casting.jpeg",
  },
  {
    id: "camp-photo-entretenimento",
    title: "Entretenimento",
    src: "/camapnhas/entretenimento.jpeg",
  },
  {
    id: "camp-photo-move-run",
    title: "Move Run",
    src: "/camapnhas/MoveRun.jpeg",
  },
  {
    id: "camp-photo-moyo-biz",
    title: "Moyo Biz",
    src: "/camapnhas/MOYO%20BIZ.jpeg",
  },
];

export const campaignVideos: CampaignVideo[] = [

  {
    id: "camp-2m-1",
    title: "Campanha 2M — Parte 1",
    src: "https://firebasestorage.googleapis.com/v0/b/lamapp-b1125.firebasestorage.app/o/clik%2FCampanha_da_2m_1.MP4?alt=media&token=1bae273c-3289-475d-a5be-f91bfd76055a",
    mime: "video/mp4",
  },
  {
    id: "camp-2m-2",
    title: "Campanha 2M — Parte 2",
    src: "https://firebasestorage.googleapis.com/v0/b/lamapp-b1125.firebasestorage.app/o/clik%2FCampanha_da_2m_2.MP4?alt=media&token=cbfcd8f1-d8ab-4145-8eae-a2c246e91383",
    mime: "video/mp4",
  },
  {
    id: "camp-casting-global-lead",
    title: "Casting Global Lead",
    src: "/Videos/casting-global-lead.mp4",
    mime: "video/mp4",
  },
  {
    id: "camp-video-2",
    title: "Campanha — Vídeo 02",
    src: "/Videos/video2.mp4",
    mime: "video/mp4",
  },
  {
    id: "camp-video-3",
    title: "Campanha — Vídeo 03",
    src: "/Videos/video3.mp4",
    mime: "video/mp4",
  },
  {
    id: "camp-white-sunset-beira",
    title: "White Sunset Beira",
    src: "/Videos/white-sunset-beira.mp4",
    mime: "video/mp4",
  },
];
