import React, { useEffect, useState } from 'react';
import { Language } from '../types/pda';
import { playPdaClick, playPdaTabSwitch } from '../utils/audio';
import { Power, Shield, Radio, Radiation } from 'lucide-react';

interface PdaStandbyProps {
  onWake: () => void;
  lang: Language;
  callsign: string;
  idNumber: string;
  currentRadiation: number;
}

export const PdaStandby: React.FC<PdaStandbyProps> = ({ onWake, lang, callsign, idNumber, currentRadiation }) => {
  const [clock, setClock] = useState('01:00');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    const handleKeyDown = () => {
      playPdaTabSwitch();
      onWake();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onWake]);

  return (
    <div 
      onClick={() => {
        playPdaTabSwitch();
        onWake();
      }}
      className="relative w-full h-full flex flex-col items-center justify-between p-8 bg-[#08090b] cursor-pointer select-none overflow-hidden"
    >
      {/* Background Military Grid */}
      <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pda-screen-scanlines" />
      <div className="absolute inset-0 pda-screen-vignette" />

      {/* Top Standby Telemetry */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs font-mono text-[#6c7686] z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#ff9d00]" />
          <span className="font-bold text-white tracking-wider">MALIK-4 PDA // SYSTEM SLEEP</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>ENCRYPTED ZONE FREQ</span>
          </span>
          <span>BATTERY: 94%</span>
        </div>
      </div>

      {/* Center Tactical Clock & Callsign */}
      <div className="flex flex-col items-center justify-center text-center z-10 space-y-4">
        {/* Callsign Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161f] border border-[#2b3342] text-[#ff9d00] text-xs font-mono tracking-widest uppercase">
          <span>{lang === 'uk' ? `СТАЛКЕР: ${callsign}` : `STALKER: ${callsign}`}</span>
          <span>·</span>
          <span>ID: {idNumber}</span>
        </div>

        {/* Large Digital Clock */}
        <div className="text-6xl md:text-8xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,157,0,0.3)]">
          {clock}
        </div>

        <div className="text-sm font-mono text-[#8a94a6] tracking-wide">
          {lang === 'uk' ? 'ЧОРНОБИЛЬСЬКА ЗОНА ВІДЧУЖЕННЯ // МАЛА ЗОНА' : 'CHORNOBYL EXCLUSION ZONE // LESSER ZONE'}
        </div>

        {/* Radiation Widget */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded bg-[#10141b] border border-[#ff9d00]/40 text-[#ffbe3b] text-xs font-mono">
          <Radiation className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          <span>RAD: {currentRadiation.toFixed(2)} μSv/h</span>
        </div>
      </div>

      {/* Bottom Wake Prompt */}
      <div className="flex flex-col items-center gap-2 z-10">
        <div className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#141822] border border-[#3b4556] text-white hover:border-[#ff9d00] hover:text-[#ff9d00] shadow-xl transition-all animate-pulse">
          <Power className="w-4 h-4 text-[#ff9d00]" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">
            {lang === 'uk' 
              ? 'Натисніть будь-яку клавішу або клацніть, щоб активувати КПК' 
              : 'Press any key or click to activate PDA'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#586170]">
          S.T.A.L.K.E.R. 2 HEART OF CHORNOBYL // TACTICAL INTERFACE
        </div>
      </div>
    </div>
  );
};
