// src/components/VideoPlay.tsx
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";

interface VideoPlayProps {
  videoId: string;
  onClose?: () => void;
}

const VideoPlay = ({ videoId, onClose }: VideoPlayProps) => {
  if (!videoId) return null;

  // Nếu đang SSR thì document chưa có
  if (typeof document === "undefined") return null;

  return createPortal(
    <section className="fixed inset-0 z-9999 bg-black/80 flex justify-center items-center px-2 sm:px-4 py-4 sm:py-0">
      {/* Background click-to-close */}
      {onClose && (
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      )}

      <div className="relative bg-black w-full max-w-[900px] sm:max-w-4xl md:max-w-5xl aspect-video rounded-md sm:rounded-lg shadow-2xl z-10000">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 sm:-top-12 sm:right-0 text-3xl sm:text-4xl text-white hover:text-red-400 transition bg-black/60 rounded-full p-1"
          >
            <IoClose />
          </button>
        )}

        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full rounded-md sm:rounded-lg"
          allowFullScreen
          title="Trailer"
        />
      </div>
    </section>,
    document.body
  );
};

export default VideoPlay;
