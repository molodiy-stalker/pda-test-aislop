import React, { useState, useEffect } from 'react';
import { NoteItem, Language } from '../../types/pda';
import { playPdaClick, playCampfireGuitarChord, playDetectorBeep } from '../../utils/audio';
import notesDesk from '../../assets/pda/notes_desk.png';
import { 
  FileText, 
  AlertCircle, 
  Volume2, 
  BookOpen, 
  Play, 
  Square,
  List,
  Radio,
  Lock,
  Unlock,
  Sparkles
} from 'lucide-react';

interface NotesTabProps {
  notes: NoteItem[];
  onMarkAsRead: (noteId: string) => void;
  lang: Language;
}

export const NotesTab: React.FC<NotesTabProps> = ({
  notes,
  onMarkAsRead,
  lang
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string>('note-memo-725');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioChordIndex, setAudioChordIndex] = useState(0);

  // Radio Scanner Intercept Widget
  const [radioFreq, setRadioFreq] = useState<number>(142.85);
  const [isDecrypted, setIsDecrypted] = useState(false);

  const categories = [
    { id: 'all', icon: List, labelUk: 'Усі', labelEn: 'All' },
    { id: 'important', icon: AlertCircle, labelUk: 'Важливе', labelEn: 'Important' },
    { id: 'memos', icon: FileText, labelUk: 'Записки', labelEn: 'Memos' },
    { id: 'audio', icon: Volume2, labelUk: 'Аудіозаписи', labelEn: 'Audio' },
    { id: 'diary', icon: BookOpen, labelUk: 'Щоденник', labelEn: 'Diary' },
  ];

  const filteredNotes = notes.filter(n => {
    if (selectedCategoryId === 'all') return true;
    return n.category === selectedCategoryId;
  });

  const selectedNote = filteredNotes.find(n => n.id === selectedNoteId) || filteredNotes[0] || notes[0];

  const handleSelectNote = (id: string) => {
    playPdaClick();
    setSelectedNoteId(id);
    setIsPlayingAudio(false);
    onMarkAsRead(id);
  };

  // Play ambient chords when audio note is playing
  useEffect(() => {
    if (!isPlayingAudio) return;

    playCampfireGuitarChord(audioChordIndex);
    const interval = setInterval(() => {
      setAudioChordIndex(prev => {
        const next = prev + 1;
        playCampfireGuitarChord(next);
        return next;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [isPlayingAudio, audioChordIndex]);

  const handleCategoryCycle = (direction: 'prev' | 'next') => {
    playPdaClick();
    const currIdx = categories.findIndex(c => c.id === selectedCategoryId);
    const newIdx = direction === 'next' 
      ? (currIdx + 1) % categories.length 
      : (currIdx - 1 + categories.length) % categories.length;
    setSelectedCategoryId(categories[newIdx].id);
  };

  return (
    <div className="flex h-full w-full bg-[#0d0f13] text-[#d0d4da] overflow-hidden select-none">
      {/* Left Column: Filter Bar & Notes List */}
      <div className="w-80 md:w-96 flex flex-col border-r border-[#222731] bg-[#0f1217] shrink-0">
        {/* Category Icons Filter Bar with [A] and [D] */}
        <div className="flex items-center justify-between p-2.5 border-b border-[#222731] gap-1">
          <button
            onClick={() => handleCategoryCycle('prev')}
            title="Previous category (A)"
            className="w-6 h-6 flex items-center justify-center rounded bg-[#1c212a] border border-[#343c4a] text-white text-[10px] font-bold cursor-pointer hover:border-[#ff9d00]"
          >
            A
          </button>

          {/* Category Icons */}
          <div className="flex items-center gap-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playPdaClick();
                    setSelectedCategoryId(cat.id);
                  }}
                  title={lang === 'uk' ? cat.labelUk : cat.labelEn}
                  className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#e5e9f0] text-black shadow-sm font-bold'
                      : 'text-[#7d8796] hover:text-white hover:bg-[#191d26]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleCategoryCycle('next')}
            title="Next category (D)"
            className="w-6 h-6 flex items-center justify-center rounded bg-[#1c212a] border border-[#343c4a] text-white text-[10px] font-bold cursor-pointer hover:border-[#ff9d00]"
          >
            D
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.map((note) => {
            const isSelected = selectedNote?.id === note.id;

            return (
              <div
                key={note.id}
                onClick={() => handleSelectNote(note.id)}
                className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1c212b] border-r-4 border-r-[#ff9d00] shadow-md'
                    : 'bg-[#12151c] hover:bg-[#181c24] border border-transparent'
                }`}
              >
                <div className="truncate">
                  <div className={`font-semibold text-xs truncate ${isSelected ? 'text-white' : 'text-[#c0c6d2]'}`}>
                    {lang === 'uk' ? note.titleUk : note.titleEn}
                  </div>
                  <div className="text-[10px] font-mono text-[#747d8c] mt-0.5 truncate">
                    {lang === 'uk' ? note.subtitleUk : note.subtitleEn}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  {note.hasAudio && (
                    <Volume2 className="w-3.5 h-3.5 text-[#ff9d00]" />
                  )}
                  {note.isUnread && (
                    <span className="w-2 h-2 rounded-full bg-[#ff9d00] shadow-[0_0_6px_#ff9d00]" />
                  )}
                </div>
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-xs text-[#5e6674]">
              {lang === 'uk' ? 'У цій категорії записок немає' : 'No notes in this category'}
            </div>
          )}
        </div>

        {/* Tactical Radio Signal Interceptor Bar */}
        <div className="p-3 border-t border-[#222731] bg-[#0c0e13]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#ff9d00] font-bold mb-1.5">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{lang === 'uk' ? 'ПЕРЕХОПЛЕННЯ РАДІОСИГНАЛІВ' : 'RADIO INTERCEPTOR'}</span>
            </span>
            <span>{radioFreq.toFixed(2)} MHz</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playDetectorBeep(1400);
                setRadioFreq(142.85);
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                radioFreq === 142.85 ? 'bg-[#ff9d00] text-black' : 'bg-[#181d27] text-[#8e98a8] border border-[#2b3342]'
              }`}
            >
              142.85 (SOS)
            </button>
            <button
              onClick={() => {
                playDetectorBeep(980);
                setRadioFreq(104.20);
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                radioFreq === 104.20 ? 'bg-[#ff9d00] text-black' : 'bg-[#181d27] text-[#8e98a8] border border-[#2b3342]'
              }`}
            >
              104.20 (МАЗІС)
            </button>
            <button
              onClick={() => {
                playDetectorBeep(2100);
                setRadioFreq(433.00);
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                radioFreq === 433.00 ? 'bg-[#ff9d00] text-black' : 'bg-[#181d27] text-[#8e98a8] border border-[#2b3342]'
              }`}
            >
              433.00 (Псі)
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Note Reading View & Audio Visualizer */}
      {selectedNote ? (
        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-8 bg-[#0a0c10] relative">
          {/* Note Header */}
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold tracking-wide text-white">
                {lang === 'uk' ? selectedNote.titleUk : selectedNote.titleEn}
              </h2>
              {selectedNote.category === 'important' && (
                <button
                  onClick={() => {
                    playDetectorBeep(1800);
                    setIsDecrypted(!isDecrypted);
                  }}
                  className="px-2.5 py-1 rounded bg-[#18212e] border border-[#3b485d] text-[#ffbe3b] text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
                >
                  {isDecrypted ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isDecrypted ? (lang === 'uk' ? 'Розшифровано' : 'Decrypted') : (lang === 'uk' ? 'Дешифрувати' : 'Decrypt')}</span>
                </button>
              )}
            </div>

            <div className="text-xs font-mono text-[#ff9d00] flex items-center gap-2">
              <span>{lang === 'uk' ? selectedNote.subtitleUk : selectedNote.subtitleEn}</span>
              {selectedNote.dateStr && (
                <span className="text-[#687282]">[{selectedNote.dateStr}]</span>
              )}
            </div>

            <div className="w-full h-px bg-[#262c38] my-4" />

            {/* Note Text Body */}
            <div className="text-xs sm:text-sm leading-relaxed text-[#c7cfdc] space-y-4 whitespace-pre-line font-sans">
              <p>
                {selectedNote.category === 'important' && !isDecrypted
                  ? '░█░█░ РІВЕНЬ ДОПУСКУ О-2 // ДАШИФРУВАННЯ ПОТРІБНЕ: Дані експедиції №4 на 4-й блок ЧАЕС засекречені військовим трибуналом. Натисніть «Дешифрувати» для розблокування протоколу...'
                  : (lang === 'uk' ? selectedNote.contentUk : selectedNote.contentEn)
                }
              </p>
            </div>

            {/* Audio Log Player (if audio note) */}
            {selectedNote.hasAudio && (
              <div className="mt-8 p-4 rounded-lg bg-[#141822] border border-[#ff9d00]/40 shadow-2xl">
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#ff9d00] font-bold">
                    <Volume2 className="w-4 h-4" />
                    <span>{lang === 'uk' ? 'АУДІОЗАПИС СТАЛКЕРІВ // СИНТЕЗАТОР ЗВУКУ' : 'STALKER AUDIO LOG // ACOUSTIC TAPE'}</span>
                  </div>
                  <span className="text-[#7d8796]">{selectedNote.audioDuration}</span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      playPdaClick();
                      setIsPlayingAudio(!isPlayingAudio);
                    }}
                    className="w-10 h-10 rounded-full bg-[#ff9d00] hover:bg-[#ffbe3b] flex items-center justify-center text-black cursor-pointer shadow-lg transition-transform active:scale-95 shrink-0"
                  >
                    {isPlayingAudio ? (
                      <Square className="w-4 h-4 fill-black" />
                    ) : (
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    )}
                  </button>

                  {/* Dynamic Animated Waveform Oscilloscope */}
                  <div className="flex-1 flex items-center gap-1.5 h-10 bg-[#0d1017] p-2 rounded border border-[#262e3d]">
                    {Array.from({ length: 32 }).map((_, i) => {
                      const dynamicHeight = isPlayingAudio 
                        ? Math.max(6, Math.abs(Math.sin((i + audioChordIndex * 3) * 0.35) * 26) + 4)
                        : (i % 2 === 0 ? 10 : 4);

                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-xs transition-all duration-150"
                          style={{ 
                            height: `${dynamicHeight}px`,
                            backgroundColor: isPlayingAudio ? (i % 4 === 0 ? '#ffbe3b' : '#ff9d00') : '#3d485c'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-mono text-[#8a96a8] flex items-center justify-between">
                  <span>{isPlayingAudio ? (lang === 'uk' ? '▶ Відтворення гітарного награшу...' : '▶ Playing acoustic chord progression...') : (lang === 'uk' ? '⏸ На паузі' : '⏸ Paused')}</span>
                  <span>48 kHz // 16-BIT STEREO</span>
                </div>
              </div>
            )}
          </div>

          {/* Bunker Desk Ambient Graphic */}
          <div className="absolute bottom-4 right-4 w-72 h-48 pointer-events-none opacity-40 mix-blend-screen overflow-hidden rounded-lg">
            <img
              src={notesDesk}
              alt="Bunker desk"
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-[#5a6270]">
          {lang === 'uk' ? 'Оберіть замітку зі списку' : 'Select a note from the list'}
        </div>
      )}
    </div>
  );
};
