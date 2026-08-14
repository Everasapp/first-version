export type InstagramStoryEventData = {
  title: string;
  slug: string;
  imageUrl: string;
  category: string;
  city: string;
  /** Data formattata (es. 14 agosto 2026) */
  dateLabel: string;
  /** Orario formattato (es. 21:00) o stringa vuota se all-day */
  timeLabel: string;
  eventUrl: string;
};

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;
