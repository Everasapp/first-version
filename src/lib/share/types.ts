export type InstagramStoryEventData = {
  title: string;
  slug: string;
  imageUrl: string;
  /** Logo Everas come data URL (canvas-safe) */
  logoUrl?: string;
  /** QR code data URL verso la pagina evento */
  qrUrl?: string;
  category: string;
  city: string;
  /** Data formattata (es. 14 agosto 2026) */
  dateLabel: string;
  /** Orario formattato (es. 21:00) o stringa vuota se all-day */
  timeLabel: string;
  eventUrl: string;
  /** Link sito da evidenziare (es. everas.it) */
  siteLabel?: string;
};

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;
export const STORY_SITE_LABEL = "everas.it";
