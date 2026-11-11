import React, { useEffect, useState } from 'react';
import { RadiationAlarmSettings, Language } from '../types/pda';
import { playRadiationAlarm, playDetectorBeep } from '../utils/audio';
import { AlertTriangle, Radiation, ShieldCheck, Sliders, X } from 'lucide-react';

interface RadiationAlarmBannerProps {
  currentRadiation: number;
  settings: RadiationAlarmSettings;
  onUpdateSettings: (settings: RadiationAlarmSettings) => void;
  onApplyAntirad: () => void;
  lang: Language;
}

export const RadiationAlarmBanner: React.FC<RadiationAlarmBannerProps> = ({
  currentRadiation,
  settings,
  onUpdateSettings,
  onApplyAntirad,
  lang
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isAlarmTriggered = settings.enabled && currentRadiation > settings.threshold;

  // Sound alarm whenever radiation spikes above threshold
  useEffect(() => {
    if (isAlarmTriggered && !isDismissed && settings.soundEnabled) {
      playRadiationAlarm();
      const interval = setInterval(() => {
        playRadiationAlarm();
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isAlarmTriggered, isDismissed, settings.soundEnabled]);

  // Reset dismissal if radiation drops below threshold and spikes again
  useEffect(() => {
    if (currentRadiation <= settings.threshold) {
      setIsDismissed(false);
    }
  }, [currentRadiation, settings.threshold]);

  if (!isAlarmTriggered || isDismissed) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative rounded-lg p-3.5 bg-[#250d0d]/95 backdrop-blur-md border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] text-white flex flex-col gap-2.5">
        
        {/* Main Alert Content */}
        <div className="flex items-center justify-between gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
            <Radiation className="w-6 h-6 animate-spin" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-red-400">
                {lang === 'uk' ? '⚠ ТРИВОГА: НЕБЕЗПЕЧНИЙ РАДІАЦІЙНИЙ ФОН!' : '⚠ ALARM: DANGEROUS RADIATION DOSE!'}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-950 border border-red-700 text-red-200 font-bold">
                +{((currentRadiation / settings.threshold) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="font-bold text-sm tracking-wide text-white mt-0.5 truncate flex items-center gap-2">
              <span>{lang === 'uk' ? 'Поточний рівень:' : 'Current Level:'}</span>
              <span className="text-red-300 font-mono text-base font-extrabold">
                {currentRadiation.toFixed(2)} μSv/h
              </span>
              <span className="text-[#8894a8] text-xs font-mono">
                ({lang === 'uk' ? 'поріг' : 'limit'}: {settings.threshold} μSv/h)
              </span>
            </div>
          </div>

          {/* Quick Action: Take Antirad */}
          <button
            onClick={() => {
              playDetectorBeep(1200);
              onApplyAntirad();
              setIsDismissed(true);
            }}
            className="px-3.5 py-2 rounded bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-transform shrink-0 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'uk' ? 'Вжити антирад' : 'Take Antirad'}</span>
          </button>

          {/* Settings / Dismiss */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title={lang === 'uk' ? 'Налаштування порогу сповіщення' : 'Alarm settings'}
              className="text-[#99a6b8] hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-[#99a6b8] hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Alert Calibration Settings */}
        {isSettingsOpen && (
          <div className="pt-2.5 mt-1 border-t border-red-900/60 flex items-center justify-between text-xs font-mono text-[#cbd5e1] gap-4">
            <div className="flex items-center gap-2">
              <span>{lang === 'uk' ? 'Поріг спрацювання:' : 'Alarm Threshold:'}</span>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={settings.threshold}
                onChange={(e) => onUpdateSettings({ ...settings, threshold: parseFloat(e.target.value) })}
                className="w-32 accent-red-500 cursor-pointer"
              />
              <span className="font-bold text-red-300">{settings.threshold} μSv/h</span>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                className="accent-red-500"
              />
              <span>{lang === 'uk' ? 'Звукова сирена' : 'Audible Siren'}</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
