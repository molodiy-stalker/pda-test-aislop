import React, { useEffect } from 'react';
import { Language } from '../types/pda';
import { CheckCircle2, AlertOctagon, Sparkles, X, ExternalLink } from 'lucide-react';

export interface QuestNotification {
  id: string;
  type: 'accept' | 'accomplish' | 'fail';
  questTitle: string;
  youtubeId: string;
}

interface QuestNotificationBannerProps {
  notification: QuestNotification | null;
  onDismiss: () => void;
  lang: Language;
}

export const QuestNotificationBanner: React.FC<QuestNotificationBannerProps> = ({
  notification,
  onDismiss,
  lang
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 7000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const isAccept = notification.type === 'accept';
  const isAccomplish = notification.type === 'accomplish';
  const isFail = notification.type === 'fail';

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`relative rounded-lg p-3.5 backdrop-blur-md shadow-2xl border flex items-center justify-between gap-3 ${
        isAccept
          ? 'bg-[#18150f]/95 border-[#ff9d00] shadow-[0_0_25px_rgba(255,157,0,0.35)] text-white'
          : isAccomplish
          ? 'bg-[#0b1a13]/95 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] text-white'
          : 'bg-[#1a0c0c]/95 border-red-600 shadow-[0_0_25px_rgba(239,68,68,0.35)] text-white'
      }`}>
        {/* Left Glowing Icon */}
        <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 border ${
          isAccept
            ? 'bg-[#ff9d00]/20 border-[#ff9d00] text-[#ffbe3b]'
            : isAccomplish
            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
            : 'bg-red-500/20 border-red-400 text-red-400'
        }`}>
          {isAccept && <Sparkles className="w-5 h-5 animate-pulse" />}
          {isAccomplish && <CheckCircle2 className="w-5 h-5" />}
          {isFail && <AlertOctagon className="w-5 h-5" />}
        </div>

        {/* Center Content */}
        <div className="flex-1 min-w-0">
          <div className={`text-[10px] font-mono uppercase tracking-widest font-bold mb-0.5 ${
            isAccept ? 'text-[#ff9d00]' : isAccomplish ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {isAccept && (lang === 'uk' ? 'НОВЕ ЗАВДАННЯ ПРИЙНЯТО' : 'NEW MISSION ACCEPTED')}
            {isAccomplish && (lang === 'uk' ? 'ЗАВДАННЯ ВИКОНАНО' : 'MISSION ACCOMPLISHED')}
            {isFail && (lang === 'uk' ? 'ЗАВДАННЯ ПРОВАЛЕНО' : 'MISSION FAILED')}
          </div>

          <div className="font-bold text-sm tracking-wide text-white truncate">
            {notification.questTitle}
          </div>

          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-[#8a94a6]">
            <span className="font-semibold text-white">
              {isAccept && '🔊 1_6efc6021.mp3 (1 прийнято)'}
              {isAccomplish && '🔊 2_da8b9d7b.mp3 (2 виконано)'}
              {isFail && '🔊 3_92261911.mp3 (3 провалено)'}
            </span>
            <span>·</span>
            <a
              href={`https://youtu.be/${notification.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#c4cbd8] hover:text-white underline inline-flex items-center gap-0.5"
            >
              <span>youtu.be/{notification.youtubeId}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Right Close Button */}
        <button
          onClick={onDismiss}
          className="text-[#7d8796] hover:text-white cursor-pointer p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
