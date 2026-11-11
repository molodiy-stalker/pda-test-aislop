import React, { useState } from 'react';
import { Quest, Language } from '../../types/pda';
import { filterQuests, setTrackedQuest } from '../../utils/pdaLogic';
import { playPdaClick } from '../../utils/audio';
import { 
  Check, 
  Circle, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Volume2, 
  ExternalLink 
} from 'lucide-react';

interface JournalTabProps {
  quests: Quest[];
  onUpdateQuests: (quests: Quest[]) => void;
  onAcceptQuest: (questId: string) => void;
  onCompleteQuest: (questId: string) => void;
  onFailQuest: (questId: string) => void;
  onResetQuest: (questId: string) => void;
  lang: Language;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  quests,
  onUpdateQuests,
  onAcceptQuest,
  onCompleteQuest,
  onFailQuest,
  onResetQuest,
  lang
}) => {
  const [isCompletedTab, setIsCompletedTab] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string>('quest-test-stalker');

  const filteredQuests = filterQuests(quests, isCompletedTab);
  
  // Ensure selectedQuest is valid
  const selectedQuest = filteredQuests.find(q => q.id === selectedQuestId) || filteredQuests[0] || quests[0];

  const handleTabSwitch = (completed: boolean) => {
    if (completed !== isCompletedTab) {
      playPdaClick();
      setIsCompletedTab(completed);
      const newFiltered = filterQuests(quests, completed);
      if (newFiltered.length > 0) {
        setSelectedQuestId(newFiltered[0].id);
      }
    }
  };

  const handleToggleTracking = (questId: string) => {
    playPdaClick();
    const updated = setTrackedQuest(quests, questId);
    onUpdateQuests(updated);
  };

  const handleAccept = (id: string) => {
    setIsCompletedTab(false);
    setSelectedQuestId(id);
    onAcceptQuest(id);
  };

  const handleComplete = (id: string) => {
    setIsCompletedTab(true);
    setSelectedQuestId(id);
    onCompleteQuest(id);
  };

  const handleFail = (id: string) => {
    setIsCompletedTab(true);
    setSelectedQuestId(id);
    onFailQuest(id);
  };

  const handleReset = (id: string) => {
    setIsCompletedTab(false);
    setSelectedQuestId(id);
    onResetQuest(id);
  };

  return (
    <div className="flex h-full w-full bg-[#0d0f13] text-[#d0d4da] overflow-hidden select-none">
      {/* Left Column: Mission Sub-tabs & List */}
      <div className="w-80 md:w-96 flex flex-col border-r border-[#222731] bg-[#0f1217] shrink-0">
        {/* Sub-tabs: Current vs Completed with [A] and [D] key badges */}
        <div className="flex items-center gap-1.5 p-3 border-b border-[#222731]">
          {/* A Keycap */}
          <button
            onClick={() => handleTabSwitch(false)}
            title="Current missions (A)"
            className="w-6 h-6 flex items-center justify-center rounded bg-[#1c212a] border border-[#343c4a] text-white text-[10px] font-bold cursor-pointer hover:border-[#ff9d00]"
          >
            A
          </button>

          {/* Current missions tab */}
          <button
            onClick={() => handleTabSwitch(false)}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              !isCompletedTab
                ? 'bg-[#e5e9f0] text-black shadow-sm font-bold'
                : 'bg-[#151921] text-[#8e98a8] hover:text-white border border-[#222834]'
            }`}
          >
            {lang === 'uk' ? 'Поточні завдання' : 'Current missions'}
          </button>

          {/* Completed tab */}
          <button
            onClick={() => handleTabSwitch(true)}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              isCompletedTab
                ? 'bg-[#e5e9f0] text-black shadow-sm font-bold'
                : 'bg-[#151921] text-[#8e98a8] hover:text-white border border-[#222834]'
            }`}
          >
            {lang === 'uk' ? 'Виконані / Архів' : 'Completed / Archive'}
          </button>

          {/* D Keycap */}
          <button
            onClick={() => handleTabSwitch(true)}
            title="Completed missions (D)"
            className="w-6 h-6 flex items-center justify-center rounded bg-[#1c212a] border border-[#343c4a] text-white text-[10px] font-bold cursor-pointer hover:border-[#ff9d00]"
          >
            D
          </button>
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            {/* Category Subheader */}
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#636c7a] mb-2 px-1">
              — {lang === 'uk' ? 'Основні завдання' : 'Main missions'}
            </div>

            <div className="space-y-1.5">
              {filteredQuests.map((quest) => {
                const isSelected = selectedQuest?.id === quest.id;
                const isAvailable = quest.status === 'available';
                const isFailed = quest.status === 'failed';

                return (
                  <div
                    key={quest.id}
                    onClick={() => {
                      playPdaClick();
                      setSelectedQuestId(quest.id);
                    }}
                    className={`relative flex items-center justify-between p-3 rounded cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1c212b] border-r-4 border-r-[#ff9d00] shadow-md'
                        : 'bg-[#12151c] hover:bg-[#181c24] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* Quest Status Icon */}
                      <div className={`w-5 h-5 rotate-45 flex items-center justify-center border shrink-0 ${
                        isFailed
                          ? 'bg-red-600 border-white/40'
                          : quest.isCompleted
                          ? 'bg-emerald-600 border-white/40'
                          : isAvailable
                          ? 'bg-blue-600 border-white/40'
                          : 'bg-[#ff9d00] border-white/40'
                      }`}>
                        <span className="-rotate-45 text-black font-extrabold text-[10px]">
                          {isFailed ? '✕' : quest.isCompleted ? '✓' : '!'}
                        </span>
                      </div>

                      <div className="truncate">
                        <div className={`font-semibold text-xs truncate ${isSelected ? 'text-white' : 'text-[#c0c6d2]'}`}>
                          {lang === 'uk' ? quest.titleUk : quest.titleEn}
                        </div>
                        <div className="text-[10px] font-mono text-[#747d8c]">
                          {lang === 'uk' ? quest.regionUk : quest.regionEn}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 flex items-center gap-1.5 ml-2">
                      {isAvailable && (
                        <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                          {lang === 'uk' ? 'Доступно' : 'Available'}
                        </span>
                      )}
                      {quest.isTracking && (
                        <span className="text-[10px] font-mono font-bold text-[#ff9d00] uppercase tracking-wider">
                          {lang === 'uk' ? 'Відстежується' : 'Tracking'}
                        </span>
                      )}
                      {quest.isCompleted && (
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isFailed ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          {isFailed 
                            ? (lang === 'uk' ? 'Провалено' : 'Failed') 
                            : (lang === 'uk' ? 'Виконано' : 'Done')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredQuests.length === 0 && (
                <div className="text-center py-8 text-xs text-[#5e6674]">
                  {lang === 'uk' ? 'Немає завдань у цій категорії' : 'No missions in this category'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Mission Details & Objectives */}
      {selectedQuest ? (
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#0b0d11]">
          {/* Top Banner: Authentic Concept Header Image */}
          <div className="relative h-56 w-full overflow-hidden border-b border-[#222731] shrink-0">
            <img
              src="/src/assets/pda/quest_banner.png"
              alt="Mission Header"
              className="w-full h-full object-cover filter brightness-95 contrast-110"
            />
            {/* Scrim Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-transparent to-transparent" />

            {/* Header Content Overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {lang === 'uk' ? selectedQuest.titleUk : selectedQuest.titleEn}
                </h2>
                <div className="text-xs font-mono text-[#ff9d00] mt-0.5 flex items-center gap-2">
                  <span>{lang === 'uk' ? selectedQuest.regionUk : selectedQuest.regionEn}</span>
                  {selectedQuest.isTestQuest && (
                    <span className="px-1.5 py-0.5 rounded bg-[#ff9d00]/20 text-[#ffbe3b] text-[10px] border border-[#ff9d00]/40 font-bold uppercase">
                      {lang === 'uk' ? 'Тестовий квест з аудіо' : 'Test Quest with Audio'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons in Banner */}
              <div className="flex items-center gap-2">
                {/* Accept Button if Available */}
                {selectedQuest.status === 'available' && (
                  <button
                    onClick={() => handleAccept(selectedQuest.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-[#ff9d00] hover:bg-[#ffbe3b] text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>{lang === 'uk' ? 'Прийняти завдання' : 'Accept Mission'}</span>
                  </button>
                )}

                {/* Track / Untrack Button */}
                {selectedQuest.status !== 'available' && !selectedQuest.isCompleted && (
                  <button
                    onClick={() => handleToggleTracking(selectedQuest.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer border transition-colors ${
                      selectedQuest.isTracking
                        ? 'bg-[#ff9d00]/20 border-[#ff9d00] text-[#ffbe3b]'
                        : 'bg-[#1c212a] border-[#384152] text-[#c0c7d4] hover:border-[#ff9d00]'
                    }`}
                  >
                    <span className="bg-[#2a303c] px-1.5 py-0.2 rounded text-[10px] font-mono font-bold text-white">
                      F
                    </span>
                    <span>
                      {selectedQuest.isTracking
                        ? (lang === 'uk' ? 'Відстежується' : 'Untrack')
                        : (lang === 'uk' ? 'Відстежувати' : 'Track')}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Test Action Controls for Quest Lifecycle & YouTube SFX */}
          {selectedQuest.isTestQuest && (
            <div className="mx-6 mt-4 p-4 rounded-lg bg-[#141822] border border-[#ff9d00]/40 shadow-lg">
              <div className="flex items-center justify-between mb-3 border-b border-[#242b38] pb-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#ffbe3b]">
                  <Volume2 className="w-4 h-4 text-[#ff9d00]" />
                  <span>
                    {lang === 'uk' 
                      ? 'ТЕСТОВЕ УПРАВЛІННЯ КВЕСТОМ (ОРИГІНАЛЬНІ ЗВУКИ YOUTUBE)' 
                      : 'MISSION LIFECYCLE CONTROLS (YOUTUBE SFX)'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#8a94a6]">
                  {lang === 'uk' ? 'Статус:' : 'Status:'}{' '}
                  <span className="font-bold text-white uppercase">
                    {selectedQuest.status || (selectedQuest.isCompleted ? 'completed' : 'active')}
                  </span>
                </div>
              </div>

              {/* 3 Action Trigger Buttons: 1 Прийнято, 2 Виконано, 3 Провалено */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Accept Button */}
                <button
                  onClick={() => handleAccept(selectedQuest.id)}
                  className="flex flex-col items-center justify-center p-3 rounded bg-[#1c2230] border border-[#ff9d00]/60 hover:border-[#ffbe3b] hover:bg-[#252d3d] text-white transition-all cursor-pointer group text-center active:scale-95 shadow-md"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#ffbe3b] mb-1">
                    <Play className="w-3.5 h-3.5 fill-[#ffbe3b]" />
                    <span>{lang === 'uk' ? '1. ПРИЙНЯТИ КВЕСТ' : '1. ACCEPT QUEST'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#ffbe3b] font-semibold">
                    1_6efc6021.mp3
                  </span>
                  <span className="text-[10px] font-mono text-[#8c97aa] group-hover:text-white">
                    {lang === 'uk' ? '1 прийнято • RhJJBkXckVc' : '1 accepted • RhJJBkXckVc'}
                  </span>
                </button>

                {/* 2. Complete Button */}
                <button
                  onClick={() => handleComplete(selectedQuest.id)}
                  className="flex flex-col items-center justify-center p-3 rounded bg-[#132219] border border-emerald-500/60 hover:border-emerald-400 hover:bg-[#192d21] text-white transition-all cursor-pointer group text-center active:scale-95 shadow-md"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'uk' ? '2. ВИКОНАТИ КВЕСТ' : '2. COMPLETE QUEST'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    2_da8b9d7b.mp3
                  </span>
                  <span className="text-[10px] font-mono text-[#8ca896] group-hover:text-white">
                    {lang === 'uk' ? '2 виконано • 2cXK4q-9GKg' : '2 accomplished • 2cXK4q-9GKg'}
                  </span>
                </button>

                {/* 3. Fail Button */}
                <button
                  onClick={() => handleFail(selectedQuest.id)}
                  className="flex flex-col items-center justify-center p-3 rounded bg-[#251313] border border-red-500/60 hover:border-red-400 hover:bg-[#331919] text-white transition-all cursor-pointer group text-center active:scale-95 shadow-md"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1">
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>{lang === 'uk' ? '3. ПРОВАЛИТИ КВЕСТ' : '3. FAIL QUEST'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-red-400 font-semibold">
                    3_92261911.mp3
                  </span>
                  <span className="text-[10px] font-mono text-[#a88c8c] group-hover:text-white">
                    {lang === 'uk' ? '3 провалено • zHkUeLFo-jU' : '3 failed • zHkUeLFo-jU'}
                  </span>
                </button>
              </div>

              {/* Reset Quest Link */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#242b38] text-[11px] font-mono text-[#7d8796]">
                <button
                  onClick={() => handleReset(selectedQuest.id)}
                  className="inline-flex items-center gap-1.5 text-[#ff9d00] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'uk' ? 'Скинути до початкового стану' : 'Reset to Initial Available State'}</span>
                </button>
                <span>S.T.A.L.K.E.R. 2 AUDIO PROTOCOL</span>
              </div>
            </div>
          )}

          {/* Two-Column Content: Objectives vs Description */}
          <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Objectives (Цілі) */}
            <div className="border-r border-[#1a1f29] pr-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <span>{lang === 'uk' ? 'Цілі завдання:' : 'Objectives:'}</span>
              </h3>

              <div className="space-y-2.5">
                {selectedQuest.objectives.map((obj) => {
                  return (
                    <div 
                      key={obj.id} 
                      onClick={() => {
                        playPdaClick();
                        const updated = quests.map(q => {
                          if (q.id === selectedQuest.id) {
                            return {
                              ...q,
                              objectives: q.objectives.map(o => o.id === obj.id ? { ...o, completed: !o.completed } : o)
                            };
                          }
                          return q;
                        });
                        onUpdateQuests(updated);
                      }}
                      className="flex items-start gap-2.5 text-xs p-1.5 rounded hover:bg-[#151a24] cursor-pointer transition-colors group"
                      title={lang === 'uk' ? 'Натисніть щоб відмітити виконання' : 'Click to toggle objective completion'}
                    >
                      {obj.completed ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : obj.isCurrent ? (
                        <div className="relative w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                          <Circle className="w-3.5 h-3.5 text-[#ff9d00] fill-[#ff9d00] animate-pulse" />
                        </div>
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-[#525a68] group-hover:text-white shrink-0 mt-0.5" />
                      )}

                      <span
                        className={`leading-relaxed ${
                          obj.completed
                            ? 'text-emerald-400/80 line-through'
                            : obj.isCurrent
                            ? 'text-[#ff9d00] font-semibold'
                            : 'text-[#8c95a4] group-hover:text-white'
                        }`}
                      >
                        {lang === 'uk' ? obj.textUk : obj.textEn}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Description (Опис) */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                {lang === 'uk' ? 'Опис:' : 'Description:'}
              </h3>

              <div className="text-xs leading-relaxed text-[#abb4c2] font-sans space-y-3 whitespace-pre-line">
                <p>{lang === 'uk' ? selectedQuest.descriptionUk : selectedQuest.descriptionEn}</p>
              </div>

              {/* YouTube Audio Links Reference */}
              {selectedQuest.soundUrls && (
                <div className="mt-6 p-3 rounded bg-[#101319] border border-[#212733] space-y-2 text-xs font-mono">
                  <div className="text-[10px] text-[#ff9d00] font-bold uppercase tracking-wider">
                    {lang === 'uk' ? 'Оригінальні аудіотреки YouTube:' : 'Original YouTube Audio Tracks:'}
                  </div>
                  <div className="space-y-1 text-[11px] text-[#939cae]">
                    <div className="flex items-center justify-between">
                      <span>{lang === 'uk' ? 'Прийняття:' : 'Accepted:'}</span>
                      <a 
                        href={`https://youtu.be/${selectedQuest.soundUrls.accept}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#ffbe3b] hover:underline flex items-center gap-1"
                      >
                        <span>youtu.be/{selectedQuest.soundUrls.accept}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{lang === 'uk' ? 'Виконання:' : 'Accomplished:'}</span>
                      <a 
                        href={`https://youtu.be/${selectedQuest.soundUrls.accomplish}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>youtu.be/{selectedQuest.soundUrls.accomplish}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{lang === 'uk' ? 'Провал:' : 'Failed:'}</span>
                      <a 
                        href={`https://youtu.be/${selectedQuest.soundUrls.fail}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-red-400 hover:underline flex items-center gap-1"
                      >
                        <span>youtu.be/{selectedQuest.soundUrls.fail}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-[#5a6270]">
          {lang === 'uk' ? 'Оберіть завдання зі списку' : 'Select a mission from the list'}
        </div>
      )}
    </div>
  );
};
