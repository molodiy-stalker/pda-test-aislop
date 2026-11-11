import React, { useEffect, useState } from 'react';
import { Volume2, ExternalLink, X } from 'lucide-react';

interface YouTubeAudioPlayerProps {
  videoId: string | null;
  triggerKey: number;
  label?: string;
  onClose?: () => void;
}

export const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({
  videoId,
  triggerKey,
  label,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoId) {
      setIsPlaying(true);
      // Auto-hide indicator after sound finishes (sounds are 4-8s long)
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, 9000);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [videoId, triggerKey]);

  if (!videoId || !isPlaying) return null;

  return (
    <div className="fixed bottom-12 right-6 z-50 flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#141822]/95 border border-[#ff9d00]/70 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Hidden YouTube Iframe for audio playback */}
      <iframe
        key={`${videoId}-${triggerKey}`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
        title="S.T.A.L.K.E.R. 2 Sound Effect Audio"
        allow="autoplay; encrypted-media"
        className="w-1 h-1 opacity-0 pointer-events-none absolute"
      />

      <div className="w-6 h-6 rounded-full bg-[#ff9d00]/20 flex items-center justify-center text-[#ff9d00] shrink-0">
        <Volume2 className="w-3.5 h-3.5 animate-bounce" />
      </div>

      <div className="flex flex-col text-xs font-mono">
        <span className="text-[10px] text-[#ff9d00] font-bold uppercase tracking-wider">
          {label || 'S.T.A.L.K.E.R. 2 SFX'}
        </span>
        <a
          href={`https://youtu.be/${videoId}`}
          target="_blank"
          rel="noreferrer"
          className="text-[#9ea8ba] hover:text-white underline text-[11px] inline-flex items-center gap-1"
        >
          <span>youtu.be/{videoId}</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      <button
        onClick={() => {
          setIsPlaying(false);
          onClose?.();
        }}
        className="text-[#7d8796] hover:text-white p-1 rounded hover:bg-white/10 ml-1 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
