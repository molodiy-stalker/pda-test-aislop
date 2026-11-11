import React, { useState } from 'react';
import { UserProfile, Language } from '../../types/pda';
import { BashTerminal } from './BashTerminal';
import { Monitor, Globe, Gamepad2, FolderOpen, Settings, Radiation, ArrowLeft, ExternalLink, X } from 'lucide-react';

type DesktopApp = 'terminal' | 'browser' | 'emulator' | 'files' | 'settings';

interface PdaDesktopProps {
  profile: UserProfile;
  currentRadiation: number;
  isAntiradActive: boolean;
  lang: Language;
  onReturnToPda: () => void;
}

const APP_DETAILS: Record<DesktopApp, { icon: typeof Monitor; titleUk: string; titleEn: string }> = {
  terminal: { icon: Monitor, titleUk: 'Термінал', titleEn: 'Terminal' },
  browser: { icon: Globe, titleUk: 'Браузер', titleEn: 'Browser' },
  emulator: { icon: Gamepad2, titleUk: 'Емулятор', titleEn: 'Emulator' },
  files: { icon: FolderOpen, titleUk: 'Файли КПК', titleEn: 'PDA Files' },
  settings: { icon: Settings, titleUk: 'Налаштування', titleEn: 'Settings' }
};

export const PdaDesktop: React.FC<PdaDesktopProps> = ({ profile, currentRadiation, isAntiradActive, lang, onReturnToPda }) => {
  const [activeApp, setActiveApp] = useState<DesktopApp | null>(null);
  const [browserAddress, setBrowserAddress] = useState('https://www.openstreetmap.org');
  const [browserUrl, setBrowserUrl] = useState('https://www.openstreetmap.org');
  const [browserError, setBrowserError] = useState('');
  const isUk = lang === 'uk';

  const navigateBrowser = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = new URL(browserAddress.startsWith('http') ? browserAddress : `https://${browserAddress}`);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        throw new Error('Unsupported protocol');
      }
      setBrowserUrl(url.href);
      setBrowserAddress(url.href);
      setBrowserError('');
    } catch {
      setBrowserError(isUk ? 'Введіть коректну вебадресу.' : 'Enter a valid web address.');
    }
  };

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden bg-[#10151c] text-[#d0d4da]">
      <div className="absolute inset-0 tactical-grid opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,157,0,0.12),transparent_55%)]" />

      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-[#0b0f14]/80 px-5 py-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-white">
          <Monitor className="h-4 w-4 text-[#ff9d00]" />
          <span>Z-OS // DESKTOP</span>
          <span className="text-[#718096]">· {profile.callsign}</span>
        </div>
        <button onClick={onReturnToPda} className="flex items-center gap-2 rounded border border-[#414b5b] bg-[#171d26] px-3 py-1.5 text-white hover:border-[#ff9d00] cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5 text-[#ff9d00]" />
          {isUk ? 'Повернутися до КПК' : 'Return to PDA'}
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-5">
        {(Object.keys(APP_DETAILS) as DesktopApp[]).map((id) => {
          const app = APP_DETAILS[id];
          const Icon = app.icon;
          return (
            <button key={id} onClick={() => setActiveApp(id)} className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#171d26]/85 p-4 text-center hover:border-[#ff9d00]/70 hover:bg-[#222a35] cursor-pointer transition-colors">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#ff9d00]/30 bg-[#ff9d00]/10 text-[#ffbe3b] group-hover:bg-[#ff9d00]/20">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-white">{isUk ? app.titleUk : app.titleEn}</span>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t border-white/10 bg-[#0b0f14]/90 px-5 py-2 font-mono text-[11px]">
        <span className="text-[#8993a2]">MALIK-4 · Z-OS 2.0.4 · {profile.idNumber}</span>
        <span className="flex items-center gap-2">
          {isAntiradActive && <span className="font-bold text-emerald-400">{isUk ? 'АНТИРАД АКТИВНИЙ' : 'ANTIRAD ACTIVE'}</span>}
          <span className="flex items-center gap-1.5 text-amber-300"><Radiation className="h-3.5 w-3.5" />{currentRadiation.toFixed(2)} μSv/h</span>
        </span>
      </div>

      {activeApp && (
        <div className="absolute inset-4 z-20 flex flex-col overflow-hidden rounded-xl border border-[#4a5568] bg-[#0b0f14] shadow-2xl sm:inset-8">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#171d26] px-4 py-2.5">
            <span className="text-sm font-semibold text-white">{isUk ? APP_DETAILS[activeApp].titleUk : APP_DETAILS[activeApp].titleEn}</span>
            <button onClick={() => setActiveApp(null)} aria-label={isUk ? 'Закрити вікно' : 'Close window'} className="rounded p-1 text-[#aab3c2] hover:bg-white/10 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
          </div>

          {activeApp === 'terminal' && (
            <div className="min-h-0 flex-1">
              <BashTerminal profile={profile} currentRadiation={currentRadiation} lang={lang} onExitToPda={onReturnToPda} />
            </div>
          )}

          {activeApp === 'browser' && (
            <div className="flex min-h-0 flex-1 flex-col">
              <form onSubmit={navigateBrowser} className="flex gap-2 border-b border-white/10 p-3">
                <input value={browserAddress} onChange={(event) => setBrowserAddress(event.target.value)} aria-label={isUk ? 'Вебадреса' : 'Web address'} className="min-w-0 flex-1 rounded border border-[#3a4556] bg-[#111720] px-3 py-2 text-sm text-white outline-none focus:border-[#ff9d00]" />
                <button className="rounded bg-[#ff9d00] px-4 text-sm font-bold text-black hover:bg-[#ffbe3b] cursor-pointer">{isUk ? 'Перейти' : 'Go'}</button>
                <a href={browserUrl} target="_blank" rel="noreferrer" className="flex items-center rounded border border-[#3a4556] px-3 text-[#cbd5e1] hover:border-[#ff9d00]" title={isUk ? 'Відкрити в окремій вкладці' : 'Open in a new tab'}><ExternalLink className="h-4 w-4" /></a>
              </form>
              {browserError && <p role="alert" className="px-3 py-2 text-sm text-red-300">{browserError}</p>}
              <iframe title={isUk ? 'Веббраузер' : 'Web browser'} src={browserUrl} className="min-h-0 flex-1 bg-white" referrerPolicy="no-referrer" />
            </div>
          )}

          {activeApp === 'emulator' && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <Gamepad2 className="h-10 w-10 text-[#ff9d00]" />
              <h2 className="text-lg font-bold text-white">{isUk ? 'Емулятор не налаштовано' : 'No emulator configured'}</h2>
              <p className="max-w-lg text-sm text-[#9aa4b2]">{isUk ? 'Цей вебмакет не може запускати системні програми. У Linux-версії під’єднайте ваш емулятор через налаштування лаунчера.' : 'This web mockup cannot launch system applications. Connect an emulator through your launcher settings in the Linux build.'}</p>
            </div>
          )}

          {activeApp === 'files' && (
            <div className="grid gap-2 p-4 sm:grid-cols-2">
              {['journal.log', 'coordinates.gpx', 'artifacts.db', 'stalker-profile.json'].map((file) => (
                <div key={file} className="rounded border border-white/10 bg-[#141a22] p-3 font-mono text-sm text-[#cbd5e1]"><FolderOpen className="mr-2 inline h-4 w-4 text-[#ff9d00]" />{file}</div>
              ))}
            </div>
          )}

          {activeApp === 'settings' && (
            <div className="space-y-3 p-5 text-sm">
              <h2 className="font-bold text-white">{isUk ? 'Стан системи' : 'System status'}</h2>
              <p className="text-[#aab3c2]">MALIK-4 · Z-OS 2.0.4 · Linux x86_64</p>
              <p className="text-[#aab3c2]">{isUk ? 'Профіль' : 'Profile'}: {profile.callsign} ({profile.faction})</p>
              <p className="text-[#aab3c2]">{isUk ? 'Радіація (ігрова симуляція)' : 'Radiation (game simulation)'}: {currentRadiation.toFixed(2)} μSv/h</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
