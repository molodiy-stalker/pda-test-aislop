import React, { useState, useEffect } from 'react';
import { TutorialTopic, Language } from '../../types/pda';
import tutorialInventory from '../../assets/pda/tutorial_inventory.png';
import { 
  playPdaClick, 
  playBoltThrow, 
  playAnomalyDischarge, 
  playDetectorBeep, 
  playGeigerCrackle,
  playUpgradeSound
} from '../../utils/audio';
import { 
  Utensils, 
  Sparkles, 
  Package, 
  Radiation, 
  Compass, 
  HeartPulse, 
  AlertTriangle,
  List,
  Wrench,
  Flame,
  Zap,
  Target,
  Activity,
  RotateCcw
} from 'lucide-react';

interface TutorialTabProps {
  topics: TutorialTopic[];
  onMarkAsRead: (topicId: string) => void;
  lang: Language;
}

export const TutorialTab: React.FC<TutorialTabProps> = ({
  topics,
  onMarkAsRead,
  lang
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'guide' | 'simulator'>('simulator');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('tut-hunger');
  const [filterCategory, setFilterCategory] = useState<'all' | 'survival' | 'combat'>('all');

  // Interactive Anomaly Simulator state
  const [selectedAnomaly, setSelectedAnomaly] = useState<'gravitational' | 'burner' | 'electro'>('gravitational');
  const [isBoltFlying, setIsBoltFlying] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);
  const [boltCount, setBoltCount] = useState(12);
  const [artifactFound, setArtifactFound] = useState<string | null>(null);

  // Survival Triage simulator state
  const [hungerLevel, setHungerLevel] = useState(65);
  const [radiationLevel, setRadiationLevel] = useState(42);
  const [bleedingLevel, setBleedingLevel] = useState(30);

  const filteredTopics = topics.filter(t => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  const selectedTopic = filteredTopics.find(t => t.id === selectedTopicId) || filteredTopics[0] || topics[0];

  const handleSelectTopic = (id: string) => {
    playPdaClick();
    setSelectedTopicId(id);
    onMarkAsRead(id);
  };

  const getTopicIcon = (type: TutorialTopic['iconType']) => {
    switch (type) {
      case 'hunger': return Utensils;
      case 'artifact': return Sparkles;
      case 'inventory': return Package;
      case 'radiation': return Radiation;
      case 'compass': return Compass;
      case 'healing': return HeartPulse;
      default: return AlertTriangle;
    }
  };

  // Toss bolt into anomaly
  const handleTossBolt = () => {
    if (isBoltFlying || isDischarging) return;
    playBoltThrow();
    setIsBoltFlying(true);
    setBoltCount(b => b - 1);
    setArtifactFound(null);

    // After flight, trigger anomaly shockwave
    setTimeout(() => {
      setIsBoltFlying(false);
      setIsDischarging(true);
      playAnomalyDischarge(selectedAnomaly);

      // Random chance to reveal anomalous artifact
      if (Math.random() > 0.45) {
        setTimeout(() => {
          playDetectorBeep(2200);
          const artifacts = {
            gravitational: lang === 'uk' ? 'Артефакт «Медуза» (Захист від куль +12%)' : 'Artifact "Jellyfish" (+12% Ballistic Protection)',
            burner: lang === 'uk' ? 'Артефакт «Око» (Регенерація здоров\'я +4/с)' : 'Artifact "Eye" (+4 HP/sec Health Regen)',
            electro: lang === 'uk' ? 'Артефакт «Спалах» (Витривалість +25%)' : 'Artifact "Flash" (+25% Stamina Regen)'
          };
          setArtifactFound(artifacts[selectedAnomaly]);
        }, 400);
      }

      setTimeout(() => {
        setIsDischarging(false);
      }, 700);
    }, 450);
  };

  return (
    <div className="flex h-full w-full bg-[#0d0f13] text-[#d0d4da] overflow-hidden select-none">
      {/* Left Column: Mode Toggle & Topics List */}
      <div className="w-80 md:w-96 flex flex-col border-r border-[#222731] bg-[#0f1217] shrink-0">
        {/* Sub-tab Switcher: Handbook vs Simulator */}
        <div className="flex items-center gap-1 p-2.5 border-b border-[#222731]">
          <button
            onClick={() => {
              playPdaClick();
              setActiveSubTab('simulator');
            }}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'simulator'
                ? 'bg-[#ff9d00] text-black shadow-md'
                : 'bg-[#151921] text-[#8e98a8] hover:text-white border border-[#222834]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{lang === 'uk' ? 'Симулятор виживання' : 'Survival Sandbox'}</span>
          </button>

          <button
            onClick={() => {
              playPdaClick();
              setActiveSubTab('guide');
            }}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'guide'
                ? 'bg-[#ff9d00] text-black shadow-md'
                : 'bg-[#151921] text-[#8e98a8] hover:text-white border border-[#222834]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{lang === 'uk' ? 'Довідник Зони' : 'Field Manual'}</span>
          </button>
        </div>

        {/* Category Icons Bar (in guide mode) */}
        {activeSubTab === 'guide' && (
          <div className="flex items-center justify-between p-2 border-b border-[#222731] gap-1">
            <span className="text-[10px] font-mono text-[#7d8796] uppercase px-1">
              {lang === 'uk' ? 'Розділи довідника' : 'Manual Topics'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  filterCategory === 'all' ? 'bg-[#ff9d00] text-black' : 'text-[#8c97aa] hover:text-white'
                }`}
              >
                {lang === 'uk' ? 'Всі' : 'All'}
              </button>
              <button
                onClick={() => setFilterCategory('survival')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  filterCategory === 'survival' ? 'bg-[#ff9d00] text-black' : 'text-[#8c97aa] hover:text-white'
                }`}
              >
                {lang === 'uk' ? 'Виживання' : 'Survival'}
              </button>
              <button
                onClick={() => setFilterCategory('combat')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  filterCategory === 'combat' ? 'bg-[#ff9d00] text-black' : 'text-[#8c97aa] hover:text-white'
                }`}
              >
                {lang === 'uk' ? 'Бій' : 'Combat'}
              </button>
            </div>
          </div>
        )}

        {/* Topics List or Simulator Presets */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeSubTab === 'guide' ? (
            filteredTopics.map((topic) => {
              const isSelected = selectedTopic?.id === topic.id;
              const Icon = getTopicIcon(topic.iconType);

              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic.id)}
                  className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1c212b] border-r-4 border-r-[#ff9d00] shadow-md'
                      : 'bg-[#12151c] hover:bg-[#181c24] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 text-[#8f99a8] shrink-0" />
                    <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-[#b9c1cd]'}`}>
                      {lang === 'uk' ? topic.titleUk : topic.titleEn}
                    </span>
                  </div>

                  {topic.isUnread && (
                    <span className="w-2 h-2 rounded-full bg-[#ff9d00] shadow-[0_0_6px_#ff9d00] shrink-0" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="space-y-3 p-2">
              <div className="text-[11px] font-mono uppercase text-[#737e90] font-bold">
                — {lang === 'uk' ? 'Тип небезпечної аномалії' : 'Anomaly Hazards'}
              </div>

              {/* Anomaly Selector buttons */}
              <button
                onClick={() => {
                  playPdaClick();
                  setSelectedAnomaly('gravitational');
                  setArtifactFound(null);
                }}
                className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                  selectedAnomaly === 'gravitational'
                    ? 'bg-[#1c2230] border-[#ff9d00] text-white shadow-md'
                    : 'bg-[#12151c] border-[#252c3b] text-[#9ba5b5] hover:border-[#ff9d00]/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-[#ff9d00]" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {lang === 'uk' ? '«Трамплін» (Гравітаційна)' : '"Springboard" (Gravitational)'}
                    </div>
                    <div className="text-[10px] font-mono text-[#7e8a9d]">
                      {lang === 'uk' ? 'Стискає простір та жбурляє у повітря' : 'Spatial compression and kinetic vortex'}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  playPdaClick();
                  setSelectedAnomaly('burner');
                  setArtifactFound(null);
                }}
                className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                  selectedAnomaly === 'burner'
                    ? 'bg-[#291717] border-red-500 text-white shadow-md'
                    : 'bg-[#12151c] border-[#252c3b] text-[#9ba5b5] hover:border-red-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-red-400" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {lang === 'uk' ? '«Жаровня» (Термічна)' : '"Burner" (Thermal)'}
                    </div>
                    <div className="text-[10px] font-mono text-[#7e8a9d]">
                      {lang === 'uk' ? 'Стовп розжареного газу до 1500°C' : 'Superheated geyser blast up to 1500°C'}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  playPdaClick();
                  setSelectedAnomaly('electro');
                  setArtifactFound(null);
                }}
                className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                  selectedAnomaly === 'electro'
                    ? 'bg-[#14232e] border-cyan-400 text-white shadow-md'
                    : 'bg-[#12151c] border-[#252c3b] text-[#9ba5b5] hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {lang === 'uk' ? '«Електра» (Електрична)' : '"Electro" (Electric)'}
                    </div>
                    <div className="text-[10px] font-mono text-[#7e8a9d]">
                      {lang === 'uk' ? 'Високовольтні високі розряди струму' : 'High voltage static arc discharges'}
                    </div>
                  </div>
                </div>
              </button>

              {/* Survival Triage Quick Meds */}
              <div className="mt-6 pt-4 border-t border-[#232a38]">
                <div className="text-[11px] font-mono uppercase text-[#737e90] font-bold mb-2">
                  — {lang === 'uk' ? 'Польова аптечка сталакера' : 'Stalker Medical Field Kit'}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      playDetectorBeep(1200);
                      setRadiationLevel(r => Math.max(0, r - 35));
                    }}
                    className="p-2 rounded bg-[#161c27] hover:bg-[#1e2636] border border-[#2f394d] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[11px] font-bold text-amber-300">Антирад Р-12</div>
                    <div className="text-[9px] font-mono text-[#7d899e]">-35 μSv/h рад.</div>
                  </button>

                  <button
                    onClick={() => {
                      playPdaClick();
                      setBleedingLevel(b => Math.max(0, b - 25));
                    }}
                    className="p-2 rounded bg-[#161c27] hover:bg-[#1e2636] border border-[#2f394d] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[11px] font-bold text-red-300">Армійський бинт</div>
                    <div className="text-[9px] font-mono text-[#7d899e]">-25% кровотечі</div>
                  </button>

                  <button
                    onClick={() => {
                      playPdaClick();
                      setHungerLevel(h => Math.max(0, h - 40));
                    }}
                    className="p-2 rounded bg-[#161c27] hover:bg-[#1e2636] border border-[#2f394d] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[11px] font-bold text-emerald-300">Тушонка «Сніданок»</div>
                    <div className="text-[9px] font-mono text-[#7d899e]">-40% голоду</div>
                  </button>

                  <button
                    onClick={() => {
                      playDetectorBeep(1600);
                      setBleedingLevel(0);
                      setRadiationLevel(r => Math.max(0, r - 15));
                    }}
                    className="p-2 rounded bg-[#161c27] hover:bg-[#1e2636] border border-[#2f394d] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[11px] font-bold text-orange-300">Аптечка АІ-2</div>
                    <div className="text-[9px] font-mono text-[#7d899e]">Повне лікування</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Active Content (Interactive Simulator OR Manual Article) */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-[#0a0c10] relative">
        {activeSubTab === 'simulator' ? (
          <div className="max-w-3xl space-y-6">
            {/* Simulator Header */}
            <div>
              <div className="text-xs font-mono text-[#ff9d00] uppercase tracking-wider mb-1">
                {lang === 'uk' ? 'СИМУЛЯТОР АНОМАЛЬНОГО ПОЛЯ ТА КИДАННЯ БОЛТІВ' : 'ANOMALY RESONANCE & BOLT TOSSING SIMULATOR'}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {selectedAnomaly === 'gravitational' && (lang === 'uk' ? 'Гравітаційна аномалія «Трамплін»' : 'Gravitational Anomaly "Springboard"')}
                {selectedAnomaly === 'burner' && (lang === 'uk' ? 'Термічна аномалія «Жаровня»' : 'Thermal Anomaly "Burner"')}
                {selectedAnomaly === 'electro' && (lang === 'uk' ? 'Електрична аномалія «Електра»' : 'Electric Anomaly "Electro"')}
              </h2>
            </div>

            {/* Interactive Bolt Tossing Sandbox Canvas */}
            <div className="relative w-full h-80 rounded-xl bg-radial from-[#151c27] to-[#090b0f] border-2 border-[#2b3547] overflow-hidden flex items-center justify-center shadow-2xl">
              {/* Tactical Distance Grid Background */}
              <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none" />

              {/* Anomaly Center Pulsing Core */}
              <div className="relative flex items-center justify-center">
                {/* Outer Danger Radius Ring */}
                <div className={`w-64 h-64 rounded-full border border-dashed transition-all duration-300 ${
                  isDischarging
                    ? selectedAnomaly === 'burner' ? 'border-red-500 scale-125 bg-red-500/20' : selectedAnomaly === 'electro' ? 'border-cyan-400 scale-125 bg-cyan-400/20' : 'border-[#ff9d00] scale-125 bg-[#ff9d00]/20'
                    : 'border-[#4a5870] animate-pulse'
                }`} />

                {/* Core Visual */}
                <div className={`w-32 h-32 rounded-full absolute flex items-center justify-center transition-transform duration-200 ${
                  isDischarging ? 'scale-150' : 'scale-100'
                }`}>
                  {selectedAnomaly === 'gravitational' && (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff9d00]/30 to-purple-900/50 blur-md border border-[#ffbe3b] animate-spin" />
                  )}
                  {selectedAnomaly === 'burner' && (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-t from-red-600 via-amber-500 to-transparent blur-md border border-red-500 animate-pulse" />
                  )}
                  {selectedAnomaly === 'electro' && (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400/40 via-blue-600/30 to-transparent blur-md border border-cyan-300 animate-ping" />
                  )}
                </div>

                {/* Flying Bolt */}
                {isBoltFlying && (
                  <div className="absolute w-4 h-4 bg-gray-300 rounded-xs border border-white shadow-[0_0_8px_white] animate-in fade-in zoom-in duration-300 -translate-y-12" />
                )}

                {/* Shockwave Energy Flash */}
                {isDischarging && (
                  <div className="absolute inset-0 w-80 h-80 rounded-full bg-white/20 blur-xl animate-out fade-out duration-500" />
                )}
              </div>

              {/* Detector HUD Sensor Readout (Top Left) */}
              <div className="absolute top-3 left-3 bg-[#0d1017]/90 border border-[#2b3547] rounded px-3 py-1.5 font-mono text-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[#aab5c7]">DETECTOR «ВЕЛЕС»:</span>
                <span className="font-bold text-[#ffbe3b]">
                  {isDischarging ? '⚠ КРИТИЧНИЙ РОЗРЯД' : isBoltFlying ? 'АНАЛІЗ ТРАЄКТОРІЇ...' : 'АКТИВНЕ ПОЛЕ'}
                </span>
              </div>

              {/* Bolt Inventory Count (Top Right) */}
              <div className="absolute top-3 right-3 bg-[#0d1017]/90 border border-[#2b3547] rounded px-3 py-1.5 font-mono text-xs text-[#aab5c7]">
                {lang === 'uk' ? 'ЗАПАС БОЛТІВ:' : 'BOLTS:'} <strong className="text-white">{boltCount} шт.</strong>
              </div>

              {/* Action Button to Toss Bolt */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button
                  onClick={handleTossBolt}
                  disabled={isBoltFlying || isDischarging || boltCount <= 0}
                  className="px-6 py-2.5 rounded-lg bg-[#ff9d00] hover:bg-[#ffbe3b] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xl transition-all active:scale-95 flex items-center gap-2"
                >
                  <Target className="w-4 h-4 fill-black" />
                  <span>{lang === 'uk' ? 'Кинути болт (ПРОБІЛ / КЛІК)' : 'Toss Bolt (SPACE / CLICK)'}</span>
                </button>

                {boltCount <= 0 && (
                  <button
                    onClick={() => {
                      playUpgradeSound();
                      setBoltCount(12);
                    }}
                    className="px-3 py-2.5 rounded-lg bg-[#1c2230] border border-[#39465c] text-white text-xs font-semibold cursor-pointer"
                  >
                    {lang === 'uk' ? 'Поповнити болти' : 'Restock Bolts'}
                  </button>
                )}
              </div>
            </div>

            {/* Revealed Artifact Notification Banner */}
            {artifactFound && (
              <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-500 shadow-2xl flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      {lang === 'uk' ? 'УСПІШНО ВИЯВЛЕНО АРТЕФАКТ!' : 'ARTIFACT CRYSTALLIZED!'}
                    </div>
                    <div className="font-bold text-sm text-white">{artifactFound}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playUpgradeSound();
                    setArtifactFound(null);
                  }}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs uppercase cursor-pointer"
                >
                  {lang === 'uk' ? 'Забрати в контейнер' : 'Stow in Container'}
                </button>
              </div>
            )}

            {/* Live Stalker Vitals & Dosimeter Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Hunger */}
              <div className="p-3.5 rounded-lg bg-[#121620] border border-[#2b3547]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="flex items-center gap-1.5 text-[#cbd5e1]">
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'uk' ? 'Голод' : 'Hunger'}</span>
                  </span>
                  <span className="font-bold text-amber-400">{hungerLevel}%</span>
                </div>
                <div className="w-full h-2 bg-[#1b2230] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${hungerLevel}%` }} />
                </div>
              </div>

              {/* Radiation */}
              <div className="p-3.5 rounded-lg bg-[#121620] border border-[#2b3547]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="flex items-center gap-1.5 text-[#cbd5e1]">
                    <Radiation className="w-3.5 h-3.5 text-red-400" />
                    <span>{lang === 'uk' ? 'Радіоактивне зараження' : 'Radiation'}</span>
                  </span>
                  <span className="font-bold text-red-400">{radiationLevel} μSv/h</span>
                </div>
                <div className="w-full h-2 bg-[#1b2230] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${radiationLevel}%` }} />
                </div>
              </div>

              {/* Bleeding */}
              <div className="p-3.5 rounded-lg bg-[#121620] border border-[#2b3547]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="flex items-center gap-1.5 text-[#cbd5e1]">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                    <span>{lang === 'uk' ? 'Кровотеча' : 'Bleeding'}</span>
                  </span>
                  <span className="font-bold text-rose-400">{bleedingLevel}%</span>
                </div>
                <div className="w-full h-2 bg-[#1b2230] rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${bleedingLevel}%` }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Manual Article Content */
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-wide text-white mb-2">
              {lang === 'uk' ? selectedTopic.titleUk : selectedTopic.titleEn}
            </h2>

            <div className="w-full h-px bg-[#262c38] mb-6" />

            <div className="text-xs sm:text-sm leading-relaxed text-[#c7cfdc] space-y-4 whitespace-pre-line font-sans mb-8">
              <p>{lang === 'uk' ? selectedTopic.contentUk : selectedTopic.contentEn}</p>
            </div>

            {/* Inventory Visual Preview */}
            <div className="max-w-md p-4 rounded-lg bg-[#11141b] border border-[#262c38] shadow-xl">
              <div className="text-[10px] font-mono text-[#ff9d00] uppercase tracking-wider mb-2">
                {lang === 'uk' ? 'Ілюстрація інвентарю та раціону' : 'Inventory & Consumables Illustration'}
              </div>

              <div className="relative w-full aspect-[4/3] rounded overflow-hidden border border-[#2a303c] flex items-center justify-center bg-[#090b0e]">
                <img
                  src={tutorialInventory}
                  alt="Tutorial Visual"
                  className="w-full h-full object-contain filter brightness-95 contrast-110"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
