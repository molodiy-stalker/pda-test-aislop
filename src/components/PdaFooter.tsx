import React from 'react';
import { PdaTab, Language } from '../types/pda';
import { playPdaClick, playGeigerCrackle } from '../utils/audio';
import { Radiation } from 'lucide-react';

interface PdaFooterProps {
  currentTab: PdaTab;
  lang: Language;
  onExit: () => void;
  onCenterPlayer?: () => void;
  onToggleLegend?: () => void;
  isLegendOpen?: boolean;
  currentRadiation: number;
  isAntiradActive: boolean;
}

export const PdaFooter: React.FC<PdaFooterProps> = ({
  currentTab,
  lang,
  onExit,
  onCenterPlayer,
  onToggleLegend,
  isLegendOpen,
  currentRadiation,
  isAntiradActive
}) => {
  const handleRadClick = () => {
    playGeigerCrackle();
  };

  return (
    <footer className="relative bg-[#111317] border-t border-[#2a2f38] px-4 py-2 select-none shrink-0 z-30 flex items-center justify-between text-xs font-mono text-[#8a92a0]">
      {/* Left Action: Esc Exit / Standby */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            playPdaClick();
            onExit();
          }}
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#1c2027] border border-[#384152] hover:border-[#ff9d00] text-white hover:text-[#ff9d00] transition-colors cursor-pointer group active:scale-95"
        >
          <span className="bg-[#2a2f38] group-hover:bg-[#ff9d00] group-hover:text-black text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
            Esc
          </span>
          <span className="font-sans font-medium text-xs">
            {lang === 'uk' ? 'Вимкнути КПК' : 'Exit / Standby'}
          </span>
        </button>
      </div>

      {/* Center Contextual Hotkeys depending on active tab */}
      <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#9ba4b3]">
        {currentTab === 'map' && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                Scroll
              </span>
              <span>{lang === 'uk' ? 'Масштаб' : 'Zoom'}</span>
            </div>

            <button
              onClick={() => {
                playPdaClick();
                onCenterPlayer?.();
              }}
              className="flex items-center gap-1.5 hover:text-white cursor-pointer"
            >
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                V
              </span>
              <span>{lang === 'uk' ? 'До гравця' : 'To player'}</span>
            </button>

            <button
              onClick={() => {
                playPdaClick();
                onToggleLegend?.();
              }}
              className={`flex items-center gap-1.5 cursor-pointer ${isLegendOpen ? 'text-[#ff9d00]' : 'hover:text-white'}`}
            >
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                L
              </span>
              <span>{lang === 'uk' ? 'Легенда' : 'Legend'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                LMB
              </span>
              <span>{lang === 'uk' ? 'Маркер' : 'Marker'}</span>
            </div>
          </>
        )}

        {currentTab === 'journal' && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                A / D
              </span>
              <span>{lang === 'uk' ? 'Вкладки' : 'Categories'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                F
              </span>
              <span>{lang === 'uk' ? 'Відстежувати' : 'Track / Untrack'}</span>
            </div>
          </>
        )}

        {currentTab === 'notes' && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                A / D
              </span>
              <span>{lang === 'uk' ? 'Фільтр' : 'Filter'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                Space
              </span>
              <span>{lang === 'uk' ? 'Читати' : 'Read'}</span>
            </div>
          </>
        )}

        {currentTab === 'upgrades' && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                LMB
              </span>
              <span>{lang === 'uk' ? 'Точка модернізації' : 'Upgrade Node'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                A / D
              </span>
              <span>{lang === 'uk' ? 'Тип спорядження' : 'Gear Type'}</span>
            </div>
          </>
        )}

        {currentTab === 'tutorial' && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#1c2027] border border-[#384152] px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                A / D
              </span>
              <span>{lang === 'uk' ? 'Розділи' : 'Sections'}</span>
            </div>
          </>
        )}
      </div>

      {/* Right: Geiger Sensor Widget */}
      <button
        onClick={handleRadClick}
        title={lang === 'uk' ? 'Ігровий показник радіації — не вимірювання датчика' : 'Simulated radiation level — not a sensor reading'}
        className="flex items-center gap-2 px-2 py-0.5 rounded bg-[#181c22] border border-[#2d3440] hover:border-[#ff9d00] transition-colors cursor-pointer"
      >
        <Radiation className="w-3.5 h-3.5 text-[#ff9d00] animate-spin" style={{ animationDuration: '6s' }} />
        <span className="text-[11px] font-semibold text-white">
          {currentRadiation.toFixed(2)} <span className="text-[9px] text-[#8a92a0]">μSv/h</span>
        </span>
        {isAntiradActive && <span className="text-[9px] font-bold text-emerald-400">{lang === 'uk' ? 'ЗАХИСТ' : 'SHIELD'}</span>}
      </button>
    </footer>
  );
};
