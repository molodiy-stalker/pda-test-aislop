import React, { useState, useEffect } from 'react';
import { PdaTab, Language, MapMarker, Quest, NoteItem, WeaponGearItem, TutorialTopic } from './types/pda';
import { 
  INITIAL_MAP_MARKERS, 
  INITIAL_QUESTS, 
  INITIAL_NOTES, 
  INITIAL_WEAPONS, 
  INITIAL_TUTORIALS 
} from './data/pdaData';
import { PdaHeader } from './components/PdaHeader';
import { PdaFooter } from './components/PdaFooter';
import { MapTab } from './components/tabs/MapTab';
import { JournalTab } from './components/tabs/JournalTab';
import { NotesTab } from './components/tabs/NotesTab';
import { UpgradesTab } from './components/tabs/UpgradesTab';
import { TutorialTab } from './components/tabs/TutorialTab';
import { PdaStandby } from './components/PdaStandby';
import { QuestNotificationBanner, QuestNotification } from './components/QuestNotificationBanner';
import { YouTubeAudioPlayer } from './components/YouTubeAudioPlayer';
import { 
  playPdaTabSwitch, 
  playPdaClick, 
  playMissionAcceptedSting, 
  playMissionAccomplishedSting, 
  playMissionFailedSting 
} from './utils/audio';
import { 
  countUnreadNotes, 
  acceptQuest, 
  completeQuest, 
  failQuest, 
  resetQuest 
} from './utils/pdaLogic';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PdaTab>('journal'); // Defaults to Journal to immediately showcase the new quest
  const [isStandby, setIsStandby] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('uk');

  // Application Data States
  const [markers, setMarkers] = useState<MapMarker[]>(INITIAL_MAP_MARKERS);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [weapons, setWeapons] = useState<WeaponGearItem[]>(INITIAL_WEAPONS);
  const [tutorials, setTutorials] = useState<TutorialTopic[]>(INITIAL_TUTORIALS);

  // Map Utility States
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [centerPlayerTrigger, setCenterPlayerTrigger] = useState(0);

  // Quest Notification & YouTube Audio States
  const [activeNotification, setActiveNotification] = useState<QuestNotification | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [audioTriggerKey, setAudioTriggerKey] = useState<number>(0);
  const [youtubeLabel, setYoutubeLabel] = useState<string>('S.T.A.L.K.E.R. 2 SFX');

  // Global hotkeys (Q, E, M, J, N, U, T, Esc, V, L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();
      const tabs: PdaTab[] = ['map', 'journal', 'notes', 'upgrades', 'tutorial'];

      if (e.key === 'Escape') {
        e.preventDefault();
        playPdaClick();
        setIsStandby(prev => !prev);
        return;
      }

      if (isStandby) return;

      if (key === 'q') {
        e.preventDefault();
        playPdaTabSwitch();
        setCurrentTab(prev => {
          const idx = tabs.indexOf(prev);
          return tabs[(idx - 1 + tabs.length) % tabs.length];
        });
      } else if (key === 'e') {
        e.preventDefault();
        playPdaTabSwitch();
        setCurrentTab(prev => {
          const idx = tabs.indexOf(prev);
          return tabs[(idx + 1) % tabs.length];
        });
      } else if (key === 'm') {
        e.preventDefault();
        playPdaTabSwitch();
        setCurrentTab('map');
      } else if (key === 'j') {
        e.preventDefault();
        playPdaTabSwitch();
        setCurrentTab('journal');
      } else if (key === 'n') {
        e.preventDefault();
        playPdaTabSwitch();
        setCurrentTab('notes');
      } else if (key === 'u') {
        e.preventDefault();
        playPdaTabSwitch();
        setCurrentTab('upgrades');
      } else if (key === 't') {
        e.preventDefault();
        playPdaTabSwitch();
        setCurrentTab('tutorial');
      } else if (key === 'v' && currentTab === 'map') {
        e.preventDefault();
        setCenterPlayerTrigger(c => c + 1);
      } else if (key === 'l' && currentTab === 'map') {
        e.preventDefault();
        setIsLegendOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab, isStandby]);

  const handleAddCustomMarker = (m: MapMarker) => {
    setMarkers(prev => [...prev, m]);
  };

  const handleRemoveCustomMarker = (id: string) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const handleMarkNoteRead = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  const handleMarkTutorialRead = (id: string) => {
    setTutorials(prev => prev.map(t => t.id === id ? { ...t, isUnread: false } : t));
  };

  // Quest lifecycle handlers with YouTube SFX audio trigger
  const handleAcceptQuest = (questId: string) => {
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest) return;

    setQuests(prev => acceptQuest(prev, questId));
    playMissionAcceptedSting();

    const videoId = targetQuest.soundUrls?.accept || 'RhJJBkXckVc';
    setYoutubeVideoId(videoId);
    setAudioTriggerKey(k => k + 1);
    setYoutubeLabel(lang === 'uk' ? 'Прийняття завдання' : 'Mission Accepted');

    setActiveNotification({
      id: `accept-${Date.now()}`,
      type: 'accept',
      questTitle: lang === 'uk' ? targetQuest.titleUk : targetQuest.titleEn,
      youtubeId: videoId
    });
  };

  const handleCompleteQuest = (questId: string) => {
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest) return;

    setQuests(prev => completeQuest(prev, questId));
    playMissionAccomplishedSting();

    const videoId = targetQuest.soundUrls?.accomplish || '2cXK4q-9GKg';
    setYoutubeVideoId(videoId);
    setAudioTriggerKey(k => k + 1);
    setYoutubeLabel(lang === 'uk' ? 'Завдання виконано' : 'Mission Accomplished');

    setActiveNotification({
      id: `accomplish-${Date.now()}`,
      type: 'accomplish',
      questTitle: lang === 'uk' ? targetQuest.titleUk : targetQuest.titleEn,
      youtubeId: videoId
    });
  };

  const handleFailQuest = (questId: string) => {
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest) return;

    setQuests(prev => failQuest(prev, questId));
    playMissionFailedSting();

    const videoId = targetQuest.soundUrls?.fail || 'zHkUeLFo-jU';
    setYoutubeVideoId(videoId);
    setAudioTriggerKey(k => k + 1);
    setYoutubeLabel(lang === 'uk' ? 'Завдання провалено' : 'Mission Failed');

    setActiveNotification({
      id: `fail-${Date.now()}`,
      type: 'fail',
      questTitle: lang === 'uk' ? targetQuest.titleUk : targetQuest.titleEn,
      youtubeId: videoId
    });
  };

  const handleResetQuest = (questId: string) => {
    playPdaClick();
    setQuests(prev => resetQuest(prev, questId));
    setYoutubeVideoId(null);
    setActiveNotification(null);
  };

  const unreadNotes = countUnreadNotes(notes);
  const unreadTutorials = tutorials.filter(t => t.isUnread).length;

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#07080a] p-1 sm:p-3 overflow-hidden select-none">
      {/* Heavy Military PDA Hardware Casing Bezel */}
      <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] bg-[#1a1d24] rounded-lg border-2 border-[#2b323e] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        
        {/* Top Hardware Bumper Details */}
        <div className="h-2 w-full bg-gradient-to-r from-[#12151b] via-[#242b36] to-[#12151b] flex items-center justify-between px-6 shrink-0 border-b border-[#2d3542]">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3d4554]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#3d4554]" />
          </div>
          <div className="w-16 h-1 bg-[#0b0c0e] rounded-full" />
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3d4554]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#3d4554]" />
          </div>
        </div>

        {/* Inner Tactical Screen Enclosure */}
        <div className="relative flex-1 flex flex-col bg-[#0b0d11] overflow-hidden">
          {/* Subtle CRT Scanlines & Screen Glass Vignette */}
          <div className="absolute inset-0 pda-screen-scanlines pointer-events-none z-40 opacity-40" />
          <div className="absolute inset-0 pda-screen-vignette pointer-events-none z-40 opacity-70" />

          {/* S.T.A.L.K.E.R. 2 Mission HUD Notification Banner */}
          <QuestNotificationBanner
            notification={activeNotification}
            onDismiss={() => setActiveNotification(null)}
            lang={lang}
          />

          {/* YouTube Sound Effect Player Widget */}
          <YouTubeAudioPlayer
            videoId={youtubeVideoId}
            triggerKey={audioTriggerKey}
            label={youtubeLabel}
            onClose={() => setYoutubeVideoId(null)}
          />

          {/* Standby Mode or Active PDA Operating System */}
          {isStandby ? (
            <PdaStandby onWake={() => setIsStandby(false)} lang={lang} />
          ) : (
            <>
              {/* Header */}
              <PdaHeader
                currentTab={currentTab}
                onSelectTab={setCurrentTab}
                lang={lang}
                onToggleLang={() => setLang(l => l === 'uk' ? 'en' : 'uk')}
                unreadNotesCount={unreadNotes}
                unreadTutorialCount={unreadTutorials}
              />

              {/* Main Content Area */}
              <main className="flex-1 relative overflow-hidden bg-[#0d0f14]">
                {currentTab === 'map' && (
                  <MapTab
                    markers={markers}
                    onUpdateMarkers={setMarkers}
                    lang={lang}
                    onAddCustomMarker={handleAddCustomMarker}
                    onRemoveCustomMarker={handleRemoveCustomMarker}
                    isLegendOpen={isLegendOpen}
                    onToggleLegend={() => setIsLegendOpen(o => !o)}
                    onCenterPlayerTrigger={centerPlayerTrigger}
                  />
                )}

                {currentTab === 'journal' && (
                  <JournalTab
                    quests={quests}
                    onUpdateQuests={setQuests}
                    onAcceptQuest={handleAcceptQuest}
                    onCompleteQuest={handleCompleteQuest}
                    onFailQuest={handleFailQuest}
                    onResetQuest={handleResetQuest}
                    lang={lang}
                  />
                )}

                {currentTab === 'notes' && (
                  <NotesTab
                    notes={notes}
                    onMarkAsRead={handleMarkNoteRead}
                    lang={lang}
                  />
                )}

                {currentTab === 'upgrades' && (
                  <UpgradesTab
                    weapons={weapons}
                    onUpdateWeapons={setWeapons}
                    lang={lang}
                  />
                )}

                {currentTab === 'tutorial' && (
                  <TutorialTab
                    topics={tutorials}
                    onMarkAsRead={handleMarkTutorialRead}
                    lang={lang}
                  />
                )}
              </main>

              {/* Footer */}
              <PdaFooter
                currentTab={currentTab}
                lang={lang}
                onExit={() => setIsStandby(true)}
                onCenterPlayer={() => setCenterPlayerTrigger(c => c + 1)}
                onToggleLegend={() => setIsLegendOpen(o => !o)}
                isLegendOpen={isLegendOpen}
              />
            </>
          )}
        </div>

        {/* Bottom Hardware Bezel Detailing */}
        <div className="h-2 w-full bg-[#12151b] border-t border-[#242b36] flex items-center justify-center shrink-0">
          <div className="w-20 h-1 bg-[#242b36] rounded-full" />
        </div>
      </div>
    </div>
  );
}
