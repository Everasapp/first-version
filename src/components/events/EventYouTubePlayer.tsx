import { extractYoutubeVideoId, youtubeEmbedUrl } from "@/src/lib/youtube";

type EventYouTubePlayerProps = {
  youtubeUrl: string;
  title: string;
};

export default function EventYouTubePlayer({
  youtubeUrl,
  title,
}: EventYouTubePlayerProps) {
  const videoId = extractYoutubeVideoId(youtubeUrl);

  if (!videoId) {
    return null;
  }

  return (
    <div className="py-10">
      <h2 className="text-3xl font-bold text-slate-900">Video</h2>
      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
        <div className="relative aspect-video w-full">
          <iframe
            title={`Video YouTube: ${title}`}
            src={youtubeEmbedUrl(videoId)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
