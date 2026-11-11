import React, { useState } from 'react';
import { UserProfile, StalkerFaction, Language } from '../types/pda';
import { playPdaClick, playLoginChime, playUpgradeSound } from '../utils/audio';
import { 
  UserCheck, 
  Shield, 
  Award, 
  Coins, 
  Radiation, 
  X, 
  Save, 
  RotateCcw,
  Sparkles,
  KeyRound,
  IdCard
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  lang: Language;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  lang
}) => {
  const [callsign, setCallsign] = useState(profile.callsign);
  const [faction, setFaction] = useState<StalkerFaction>(profile.faction);
  const [rank, setRank] = useState(profile.rank);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const factions: { id: StalkerFaction; nameUk: string; nameEn: string; color: string; descUk: string; descEn: string }[] = [
    {
      id: 'loner',
      nameUk: 'Вільні сталкери (Одинаки)',
      nameEn: 'Free Stalkers (Loners)',
      color: '#ff9d00',
      descUk: 'Незалежні мисливці за артефактами. Свобода вибору та сталкерське братерство.',
      descEn: 'Independent artifact hunters. Freedom of exploration and stalker camaraderie.'
    },
    {
      id: 'duty',
      nameUk: 'Угруповання «Довг»',
      nameEn: 'Duty Faction',
      color: '#ef4444',
      descUk: 'Військова дисципліна, захист людства та знищення смертельної загрози Зони.',
      descEn: 'Military discipline, defending civilization and destroying the Zone hazard.'
    },
    {
      id: 'freedom',
      nameUk: 'Угруповання «Воля»',
      nameEn: 'Freedom Faction',
      color: '#22c55e',
      descUk: 'Анархісти та дослідники. Зона повинна належати всім вільнодумцям.',
      descEn: 'Anarchists and free spirits believing the Zone should be open to all.'
    },
    {
      id: 'clearsky',
      nameUk: '«Чисте Небо»',
      nameEn: 'Clear Sky',
      color: '#38bdf8',
      descUk: 'Секретна дослідницька група, яка прагне зрозуміти та стабілізувати Зону.',
      descEn: 'Secret ecological expedition seeking to understand and stabilize the Zone.'
    },
    {
      id: 'mercenary',
      nameUk: 'Найманці (Синдикат)',
      nameEn: 'Mercenaries (Syndicate)',
      color: '#6366f1',
      descUk: 'Професійні бійці за контрактом. Виконують делікатні замовлення закордонних клієнтів.',
      descEn: 'Professional private military contractors executing high-value covert assignments.'
    },
    {
      id: 'ecologist',
      nameUk: 'Вчені (МАЗІС)',
      nameEn: 'Ecologists (MAZIS)',
      color: '#eab308',
      descUk: 'Державна наукова місія з вивчення аномальних явищ, фізики поля та артефактів.',
      descEn: 'Official state scientific commission investigating anomalous physics and artifacts.'
    }
  ];

  const ranks = [
    { id: 'rookie', nameUk: 'Відмичка', nameEn: 'Rookie' },
    { id: 'experienced', nameUk: 'Досвідчений', nameEn: 'Experienced' },
    { id: 'veteran', nameUk: 'Ветеран', nameEn: 'Veteran' },
    { id: 'master', nameUk: 'Майстер', nameEn: 'Master' },
    { id: 'legend', nameUk: 'Легенда Зони', nameEn: 'Zone Legend' },
  ] as const;

  const handleSave = () => {
    playLoginChime();
    const updated: UserProfile = {
      ...profile,
      callsign: callsign.trim() || 'Скіф',
      faction,
      rank,
      isLoggedIn: true
    };
    onUpdateProfile(updated);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 700);
  };

  const handleCreateNewIdentity = () => {
    playUpgradeSound();
    const randomCallsigns = ['Скіф', 'Мічений', 'Шрам', 'Привид', 'Крук', 'Бродяга', 'Лис', 'Дегтярьов'];
    const newName = randomCallsigns[Math.floor(Math.random() * randomCallsigns.length)];
    const newId = `Z-UKR-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    setCallsign(newName);
    onUpdateProfile({
      ...profile,
      idNumber: newId,
      callsign: newName,
      coupons: 15000,
      reputation: 500
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f131a] border-2 border-[#ff9d00] rounded-xl shadow-[0_0_50px_rgba(255,157,0,0.3)] overflow-hidden flex flex-col text-[#d0d4da]">
        
        {/* Top Tactical Banner */}
        <div className="bg-[#181d26] border-b border-[#2b3547] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IdCard className="w-5 h-5 text-[#ff9d00]" />
            <div>
              <h3 className="font-bold text-white text-base tracking-wide">
                {lang === 'uk' ? 'СИСТЕМА РЕЄСТРАЦІЇ ТА ПРОФІЛЬ СТАЛКЕРА' : 'STALKER PDA IDENTITY & REGISTRATION'}
              </h3>
              <div className="text-[10px] font-mono text-[#7d889b]">
                PDA PROTOCOL Z-OS // PASSPORT ID: {profile.idNumber}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#7e8b9f] hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          
          {/* Stalker Identity Badge Card */}
          <div className="p-4 rounded-lg bg-[#141822] border border-[#2e3748] flex items-center gap-4 shadow-lg">
            <div className="w-16 h-16 rounded-lg bg-[#1c2230] border-2 border-[#ff9d00] flex items-center justify-center font-bold text-2xl text-[#ffbe3b] shadow-inner shrink-0">
              {callsign.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#8a96aa] uppercase">
                  {lang === 'uk' ? 'Позивний сталкера:' : 'Stalker Callsign:'}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  {lang === 'uk' ? 'АВТОРИЗОВАНО' : 'AUTHORIZED'}
                </span>
              </div>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                placeholder="Введіть позивний..."
                className="mt-1 w-full bg-[#0d1017] border border-[#3b475d] rounded px-3 py-1.5 text-base font-bold text-white focus:outline-hidden focus:border-[#ff9d00]"
              />
            </div>
          </div>

          {/* Faction Selection */}
          <div>
            <label className="text-xs font-mono text-[#8a96aa] uppercase font-bold mb-2 block">
              {lang === 'uk' ? 'Оберіть угруповання (Фракція):' : 'Select Stalker Faction:'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {factions.map((f) => {
                const isSelected = faction === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      playPdaClick();
                      setFaction(f.id);
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#1b2230] border-[#ff9d00] shadow-md scale-[1.01]'
                        : 'bg-[#121620] border-[#252d3d] hover:border-[#3d4b63]'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mt-0.5 shrink-0 border"
                      style={{ backgroundColor: f.color, borderColor: 'white' }}
                    />
                    <div>
                      <div className="font-bold text-xs text-white">
                        {lang === 'uk' ? f.nameUk : f.nameEn}
                      </div>
                      <div className="text-[10px] text-[#7d899d] leading-snug mt-0.5">
                        {lang === 'uk' ? f.descUk : f.descEn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stalker Rank Selection */}
          <div>
            <label className="text-xs font-mono text-[#8a96aa] uppercase font-bold mb-2 block">
              {lang === 'uk' ? 'Звання та кваліфікація:' : 'Rank & Stalker Qualification:'}
            </label>

            <div className="flex flex-wrap gap-2">
              {ranks.map((r) => {
                const isSelected = rank === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      playPdaClick();
                      setRank(r.id);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#ff9d00] text-black shadow-md'
                        : 'bg-[#141822] text-[#8e98a8] border border-[#2b3547] hover:text-white'
                    }`}
                  >
                    {lang === 'uk' ? r.nameUk : r.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Passport Stats */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-[#121620] border border-[#252d3d] text-center text-xs font-mono">
            <div>
              <div className="text-[10px] text-[#7d899d]">{lang === 'uk' ? 'БАЛАНС' : 'BALANCE'}</div>
              <div className="font-bold text-[#ffbe3b] text-sm mt-0.5 flex items-center justify-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                <span>{profile.coupons} купонів</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#7d899d]">{lang === 'uk' ? 'РЕПУТАЦІЯ' : 'REPUTATION'}</div>
              <div className="font-bold text-emerald-400 text-sm mt-0.5 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>+{profile.reputation} (Висока)</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#7d899d]">{lang === 'uk' ? 'НАКОПИЧЕНА ДОЗА' : 'DOSE ACCUM'}</div>
              <div className="font-bold text-amber-300 text-sm mt-0.5 flex items-center justify-center gap-1">
                <Radiation className="w-3.5 h-3.5" />
                <span>{profile.radiationDose} mSv</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#141822] border-t border-[#252d3d] px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={handleCreateNewIdentity}
            className="text-xs font-mono text-[#8a96aa] hover:text-[#ff9d00] flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'uk' ? 'Згенерувати новий паспорт' : 'Generate New ID Passport'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#1c2230] hover:bg-[#252d3d] border border-[#37445a] text-[#c5cdd9] text-xs font-bold uppercase cursor-pointer"
            >
              {lang === 'uk' ? 'Скасувати' : 'Cancel'}
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 rounded bg-[#ff9d00] hover:bg-[#ffbe3b] text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 fill-black" />
              <span>{isSavedNotice ? (lang === 'uk' ? 'Збережено!' : 'Saved!') : (lang === 'uk' ? 'Зберегти профіль' : 'Save Profile')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
