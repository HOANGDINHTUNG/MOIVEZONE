// src/components/VideoPlay.tsx
import { IoClose } from "react-icons/io5";

interface VideoPlayProps {
  videoId: string;
  onClose?: () => void; // optional để DetailsPage không bắt buộc phải truyền
}

const VideoPlay = ({ videoId, onClose }: VideoPlayProps) => {
  if (!videoId) return null;

  return (
    <section className="fixed inset-0 z-40 bg-black/70 flex justify-center items-center">
      <div className="bg-black w-full max-h-[80vh] max-w-5xl aspect-video rounded relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -right-2 -top-8 text-3xl text-white z-50"
          >
            <IoClose />
          </button>
        )}

        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          allowFullScreen
          title="Trailer"
        />
      </div>
    </section>
  );
};

export default VideoPlay;
