import React from 'react';
import { PdaTab, Language } from '../types/pda';
import { playPdaTabSwitch, playPdaClick, toggleMute, getMuteState } from '../utils/audio';
import { Volume2, VolumeX, Radio, Globe } from 'lucide-react';

interface PdaHeaderProps {
  currentTab: PdaTab;
  onSelectTab: (tab: PdaTab) => void;
  lang: Language;
  onToggleLang: () => void;
  unreadNotesCount: number;
  unreadTutorialCount: number;
}

export const PdaHeader: React.FC<PdaHeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  unreadNotesCount,
  unreadTutorialCount
}) => {
  const [time, setTime] = React.useState('01:00');
  const [muted, setMuted] = React.useState(getMuteState());

  React.useEffect(() => {
    // Realistic Zone time ticking
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tab: PdaTab) => {
    if (tab !== currentTab) {
      playPdaTabSwitch();
      onSelectTab(tab);
    }
  };

  const handleMuteToggle = () => {
    const isNowMuted = toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      playPdaClick();
    }
  };

  const tabs: { id: PdaTab; labelUk: string; labelEn: string; hasBadge?: boolean }[] = [
    { id: 'map', labelUk: 'Мапа', labelEn: 'Map' },
    { id: 'journal', labelUk: 'Журнал', labelEn: 'Journal' },
    { id: 'notes', labelUk: 'Замітки', labelEn: 'Notes', hasBadge: unreadNotesCount > 0 },
    { id: 'upgrades', labelUk: 'Модифікації', labelEn: 'Upgrades' },
    { id: 'tutorial', labelUk: 'Довідник', labelEn: 'Tutorial', hasBadge: unreadTutorialCount > 0 },
  ];

  return (
    <header className="relative bg-[#111317] border-b border-[#2a2f38] px-4 pt-2.5 pb-2 select-none shrink-0 z-30">
      {/* Top Rugged Military Bezel Detailing */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1c2027] via-[#2d3440] to-[#1c2027]" />
      <div className="absolute top-1 left-8 w-12 h-1 bg-[#0a0c0e] rounded-b border-b border-[#384152]" />
      <div className="absolute top-1 right-8 w-12 h-1 bg-[#0a0c0e] rounded-b border-b border-[#384152]" />
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#0a0c0e] rounded-b border-b border-[#384152]" />

      {/* Hardware Status Strip */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#8a92a0] mb-2 px-1">
        {/* Left: Signal & Zone Region */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#a4adbb]">
            <span className="text-[#3b82f6] text-[10px] tracking-tighter">.ıll</span>
            <span className="font-semibold text-white tracking-wide">
              {lang === 'uk' ? 'Мала Зона' : 'Lesser Zone'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-[#5a6270]">
            <Radio className="w-3 h-3 text-[#ff9d00] animate-pulse" />
            <span>FREQ: 142.85 MHz</span>
          </div>
        </div>

        {/* Center: Device Brand / Serial */}
        <div className="hidden md:flex items-center gap-2 text-[10px] text-[#555d6b] tracking-widest uppercase">
          <span>MALIK-4 // TACTICAL PDA</span>
          <span>·</span>
          <span>Z-OS 2.0.4</span>
        </div>

        {/* Right: Controls, Sound, Lang & Clock */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <button
            onClick={() => {
              playPdaClick();
              onToggleLang();
            }}
            title={lang === 'uk' ? 'Перемкнути на англійську' : 'Switch to Ukrainian'}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#181c22] border border-[#2d3440] hover:border-[#ff9d00] text-[#a4adbb] hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-3 h-3 text-[#ff9d00]" />
            <span className="font-semibold text-[10px]">{lang.toUpperCase()}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            title={muted ? 'Увімкнути звук' : 'Вимкнути звук'}
            className="flex items-center gap-1 text-[#8a92a0] hover:text-white transition-colors cursor-pointer"
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#ff9d00]" />
            )}
          </button>

          {/* Battery Status */}
          <div className="flex items-center gap-1 text-[10px] text-[#8a92a0]">
            <div className="w-4 h-2 border border-[#8a92a0] rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-[#ff9d00]" />
            </div>
            <span>94%</span>
          </div>

          {/* Clock */}
          <div className="text-white font-bold text-xs tracking-wider">
            {time}
          </div>
        </div>
      </div>

      {/* Main PDA Navigation Tabs with Q / E Keycaps */}
      <nav className="flex items-center justify-center gap-3 md:gap-8 relative" aria-label="PDA Navigation">
        {/* Q Keycap */}
        <button
          onClick={() => {
            const idx = tabs.findIndex(t => t.id === currentTab);
            const prevIdx = (idx - 1 + tabs.length) % tabs.length;
            handleTabClick(tabs[prevIdx].id);
          }}
          title="Previous tab (Q)"
          className="flex items-center justify-center w-7 h-7 bg-[#1c2027] border border-[#384152] hover:border-[#ff9d00] rounded text-xs font-bold text-white shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          Q
        </button>

        {/* Tab Links */}
        <div className="flex items-center gap-1 sm:gap-4 md:gap-8">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                aria-label={lang === 'uk' ? tab.labelUk : tab.labelEn}
                className={`group relative px-3 py-1.5 text-sm md:text-base font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white drop-shadow-[0_0_8px_rgba(255,157,0,0.5)]'
                    : 'text-[#828a96] hover:text-[#c4cbd6]'
                }`}
              >
                {/* Orange notification dot for unread content (like in game) */}
                {tab.hasBadge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff9d00] shadow-[0_0_6px_#ff9d00]" />
                )}

                <span>{lang === 'uk' ? tab.labelUk : tab.labelEn}</span>

                {/* Glowing Active Underline Indicator */}
                {isActive && (
                  <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#ff9d00] shadow-[0_0_8px_#ff9d00]">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#ffbe3b] rounded-full blur-[1px]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* E Keycap */}
        <button
          onClick={() => {
            const idx = tabs.findIndex(t => t.id === currentTab);
            const nextIdx = (idx + 1) % tabs.length;
            handleTabClick(tabs[nextIdx].id);
          }}
          title="Next tab (E)"
          className="flex items-center justify-center w-7 h-7 bg-[#1c2027] border border-[#384152] hover:border-[#ff9d00] rounded text-xs font-bold text-white shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          E
        </button>
      </nav>
    </header>
  );
};
