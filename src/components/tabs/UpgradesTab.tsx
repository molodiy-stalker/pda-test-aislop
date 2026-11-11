import React, { useState } from 'react';
import { WeaponGearItem, UpgradeNode, Language } from '../../types/pda';
import { calculateWeaponStats, toggleUpgradeNode } from '../../utils/pdaLogic';
import { playPdaClick, playUpgradeSound, playWeaponShot } from '../../utils/audio';
import { 
  Crosshair, 
  Zap, 
  Target, 
  ShieldAlert, 
  Sparkles,
  Check,
  List,
  Shield,
  Layers,
  Wrench,
  Flame
} from 'lucide-react';

interface UpgradesTabProps {
  weapons: WeaponGearItem[];
  onUpdateWeapons: (weapons: WeaponGearItem[]) => void;
  lang: Language;
}

export const UpgradesTab: React.FC<UpgradesTabProps> = ({
  weapons,
  onUpdateWeapons,
  lang
}) => {
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('skif-pistol');
  const [selectedUpgradeNode, setSelectedUpgradeNode] = useState<UpgradeNode | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'weapons' | 'suits'>('all');
  const [isFiring, setIsFiring] = useState(false);
  const [condition, setCondition] = useState<number>(94);

  const selectedWeapon = weapons.find(w => w.id === selectedWeaponId) || weapons[0];
  const calculatedStats = calculateWeaponStats(selectedWeapon);

  const equippedWeapons = weapons.filter(w => {
    if (!w.isEquipped) return false;
    if (activeCategory === 'weapons') return w.category === 'pistol' || w.category === 'rifle';
    if (activeCategory === 'suits') return w.category === 'suit';
    return true;
  });

  const unequippedWeapons = weapons.filter(w => {
    if (w.isEquipped) return false;
    if (activeCategory === 'weapons') return w.category === 'pistol' || w.category === 'rifle';
    if (activeCategory === 'suits') return w.category === 'suit';
    return true;
  });

  const handleToggleUpgrade = (upgradeId: string) => {
    playUpgradeSound();
    const updatedWeapon = toggleUpgradeNode(selectedWeapon, upgradeId);
    const updatedWeapons = weapons.map(w => w.id === updatedWeapon.id ? updatedWeapon : w);
    onUpdateWeapons(updatedWeapons);

    // Keep node selected with updated status
    const updatedNode = updatedWeapon.upgrades.find(u => u.id === upgradeId);
    if (updatedNode) setSelectedUpgradeNode(updatedNode);
  };

  const handleTestFire = () => {
    if (isFiring) return;
    playWeaponShot();
    setIsFiring(true);
    setCondition(c => Math.max(10, c - 1));
    setTimeout(() => setIsFiring(false), 180);
  };

  const handleRepair = () => {
    playUpgradeSound();
    setCondition(100);
  };

  return (
    <div className="flex h-full w-full bg-[#0d0f13] text-[#d0d4da] overflow-hidden select-none">
      {/* Left Column: Gear categories & List */}
      <div className="w-80 md:w-96 flex flex-col border-r border-[#222731] bg-[#0f1217] shrink-0">
        {/* Top category icons bar with [A] and [D] */}
        <div className="flex items-center justify-between p-2.5 border-b border-[#222731] gap-1">
          <button
            onClick={() => {
              playPdaClick();
              setActiveCategory(activeCategory === 'all' ? 'suits' : activeCategory === 'suits' ? 'weapons' : 'all');
            }}
            title="Previous gear type (A)"
            className="w-6 h-6 flex items-center justify-center rounded bg-[#1c212a] border border-[#343c4a] text-white text-[10px] font-bold cursor-pointer hover:border-[#ff9d00]"
          >
            A
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playPdaClick();
                setActiveCategory('all');
              }}
              title={lang === 'uk' ? 'Все спорядження' : 'All gear'}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#e5e9f0] text-black shadow-sm font-bold'
                  : 'text-[#7d8796] hover:text-white hover:bg-[#191d26]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                playPdaClick();
                setActiveCategory('weapons');
              }}
              title={lang === 'uk' ? 'Зброя' : 'Weapons'}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                activeCategory === 'weapons'
                  ? 'bg-[#e5e9f0] text-black shadow-sm font-bold'
                  : 'text-[#7d8796] hover:text-white hover:bg-[#191d26]'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                playPdaClick();
                setActiveCategory('suits');
              }}
              title={lang === 'uk' ? 'Броня та костюми' : 'Armor & Suits'}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                activeCategory === 'suits'
                  ? 'bg-[#e5e9f0] text-black shadow-sm font-bold'
                  : 'text-[#7d8796] hover:text-white hover:bg-[#191d26]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
            </button>

            <button
              title={lang === 'uk' ? 'Аномальне обладнання' : 'Anomalous Gear'}
              className="w-7 h-7 flex items-center justify-center rounded text-[#576070] cursor-not-allowed"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              playPdaClick();
              setActiveCategory(activeCategory === 'all' ? 'weapons' : activeCategory === 'weapons' ? 'suits' : 'all');
            }}
            title="Next gear type (D)"
            className="w-6 h-6 flex items-center justify-center rounded bg-[#1c212a] border border-[#343c4a] text-white text-[10px] font-bold cursor-pointer hover:border-[#ff9d00]"
          >
            D
          </button>
        </div>

        {/* Weapons List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Equipped Section */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#636c7a] mb-2 px-1">
              — {lang === 'uk' ? 'Екіпіровано' : 'Equipped'}
            </div>

            <div className="space-y-1">
              {equippedWeapons.map((item) => {
                const isSelected = selectedWeapon.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      playPdaClick();
                      setSelectedWeaponId(item.id);
                      setSelectedUpgradeNode(null);
                    }}
                    className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1c212b] border-r-4 border-r-[#ff9d00] shadow-md'
                        : 'bg-[#12151c] hover:bg-[#181c24] border border-transparent'
                    }`}
                  >
                    <div>
                      <div className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-[#c0c6d2]'}`}>
                        {lang === 'uk' ? item.nameUk : item.nameEn}
                      </div>
                      <div className="text-[10px] font-mono text-[#747d8c]">
                        {lang === 'uk' ? 'Екіпіровано' : 'Equipped'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Not Equipped Section */}
          {unequippedWeapons.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#636c7a] mb-2 px-1">
                — {lang === 'uk' ? 'У рюкзаку / Схованці' : 'Not equipped'}
              </div>

              <div className="space-y-1">
                {unequippedWeapons.map((item) => {
                  const isSelected = selectedWeapon.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        playPdaClick();
                        setSelectedWeaponId(item.id);
                        setSelectedUpgradeNode(null);
                      }}
                      className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1c212b] border-r-4 border-r-[#ff9d00] shadow-md'
                          : 'bg-[#12151c] hover:bg-[#181c24] border border-transparent'
                      }`}
                    >
                      <div className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-[#c0c6d2]'}`}>
                        {lang === 'uk' ? item.nameUk : item.nameEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Weapon Diagram & Upgrade Nodes & Stats */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 md:p-8 bg-[#0b0d11] relative">
        {/* Header & Tactical Controls */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-wide text-white mb-0.5">
              {lang === 'uk' ? selectedWeapon.nameUk : selectedWeapon.nameEn}
            </h2>
            <div className="text-xs font-mono text-[#8a94a4]">
              {lang === 'uk' 
                ? 'Оберіть вузол на кресленні для монтажу поліпшень' 
                : 'Select an upgrade node on the schematic to install modifications'}
            </div>
          </div>

          {/* Condition Meter & Test Fire Actions */}
          <div className="flex items-center gap-3">
            {/* Condition Status */}
            <div className="bg-[#141822] border border-[#262f3e] rounded px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
              <span className="text-[#8793a6]">{lang === 'uk' ? 'СТАН:' : 'COND:'}</span>
              <span className={`font-bold ${condition > 80 ? 'text-emerald-400' : condition > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                {condition}%
              </span>
              <button
                onClick={handleRepair}
                title={lang === 'uk' ? 'Почистити та змастити зброю' : 'Clean & Maintain Weapon'}
                className="ml-1 p-1 rounded hover:bg-white/10 text-[#ff9d00] cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Test Fire Button (if weapon) */}
            {selectedWeapon.category !== 'suit' && (
              <button
                onClick={handleTestFire}
                disabled={isFiring}
                className="px-3 py-1.5 rounded bg-[#ff9d00] hover:bg-[#ffbe3b] text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 fill-black" />
                <span>{lang === 'uk' ? 'Тестовий постріл' : 'Test Fire'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Center: Weapon Render with Clickable Nodes */}
        <div className="relative my-4 flex items-center justify-center min-h-[300px]">
          {/* Tactical Weapon Backdrop image */}
          <div className="relative w-80 h-60 flex items-center justify-center">
            {selectedWeapon.id === 'skif-pistol' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/src/assets/pda/skif_pistol.png"
                  alt="Weapon Diagram"
                  className="w-full h-full object-contain pointer-events-none filter contrast-125 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />
                {/* Muzzle Flash Effect */}
                {isFiring && (
                  <div className="absolute right-2 top-[38%] w-10 h-10 rounded-full bg-amber-400 blur-sm animate-ping" />
                )}
              </div>
            ) : selectedWeapon.id === 'akm-74u' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-[#131720]/80 rounded-lg border border-[#232a36] p-4">
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-mono text-[#4a5870] font-bold mb-2">АКМ-74У // 5.45×39</div>
                  <div className="text-xs font-mono text-[#8c98a8]">
                    {lang === 'uk' ? 'Вкорочений автомат для боїв на близьких дистанціях' : 'Shortened carbine for close quarters combat in the Zone'}
                  </div>
                  {isFiring && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-400 blur-md animate-ping" />
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#131720]/80 rounded-lg border border-[#232a36] p-4 text-center">
                <Shield className="w-16 h-16 text-[#ff9d00] mb-2" />
                <div className="text-sm font-bold text-white mb-1">
                  {lang === 'uk' ? 'Шкіряна куртка сталкера' : 'Stalker Leather Jacket'}
                </div>
                <div className="text-xs font-mono text-[#7e8a9d]">
                  {lang === 'uk' ? 'Базовий захист від пазурів та осколків' : 'Basic protection against claws and shrapnel'}
                </div>
              </div>
            )}

            {/* Interactive Clickable Upgrade Nodes */}
            {selectedWeapon.upgrades.map((node) => {
              const isSelected = selectedUpgradeNode?.id === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    playPdaClick();
                    setSelectedUpgradeNode(node);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className={`relative flex items-center justify-center transition-transform ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}>
                    {/* Pulsing ring if selected or installed */}
                    {node.installed ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 animate-pulse absolute" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#ff9d00]/20 absolute" />
                    )}

                    {/* Outer Target Circle */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg backdrop-blur-xs ${
                      node.installed
                        ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                        : isSelected
                        ? 'border-[#ff9d00] bg-[#1a202c] text-[#ff9d00]'
                        : 'border-white/80 bg-black/60 text-white'
                    }`}>
                      {node.installed ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Upgrade Node Info Card (Overlay) */}
          {selectedUpgradeNode && (
            <div className="absolute top-2 right-2 w-72 bg-[#12161f]/95 backdrop-blur-md border border-[#3d4757] rounded-lg p-4 shadow-2xl z-30">
              <div className="text-[10px] font-mono text-[#ff9d00] uppercase tracking-wider mb-1">
                {lang === 'uk' ? 'Модифікація вузла' : 'Node Upgrade'}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {lang === 'uk' ? selectedUpgradeNode.nameUk : selectedUpgradeNode.nameEn}
              </h4>
              <p className="text-xs text-[#a4adb8] leading-relaxed mb-3">
                {lang === 'uk' ? selectedUpgradeNode.descriptionUk : selectedUpgradeNode.descriptionEn}
              </p>

              <div className="flex items-center justify-between text-xs font-mono border-t border-[#252c38] pt-2 mb-3">
                <span className="text-[#7d8796]">{lang === 'uk' ? 'Вартість' : 'Cost'}:</span>
                <span className="font-bold text-[#ffbe3b]">
                  {selectedUpgradeNode.cost} {lang === 'uk' ? 'купонів' : 'coupons'}
                </span>
              </div>

              {/* Install / Remove Button */}
              <button
                onClick={() => handleToggleUpgrade(selectedUpgradeNode.id)}
                className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  selectedUpgradeNode.installed
                    ? 'bg-red-950/80 border border-red-800 text-red-200 hover:bg-red-900'
                    : 'bg-[#ff9d00] hover:bg-[#ffbe3b] text-black shadow-md'
                }`}
              >
                {selectedUpgradeNode.installed
                  ? (lang === 'uk' ? 'Демонтувати' : 'Uninstall')
                  : (lang === 'uk' ? 'Встановити' : 'Install Upgrade')}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Section: Weapon Performance Stats & Slots */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-t border-[#1e2430] pt-4">
          {/* Stats Level Bars matching screenshot */}
          <div className="w-full max-w-md space-y-2.5">
            {/* Damage */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#a8b1be] flex items-center gap-1.5 font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff9d00]" />
                  <span>{lang === 'uk' ? 'Шкода' : 'DAMAGE'}</span>
                </span>
                <span className="text-[#ffbe3b] font-bold">{calculatedStats.damage}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1e2430] rounded-xs overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#ff9d00] transition-all duration-300"
                  style={{ width: `${calculatedStats.damage}%` }}
                />
              </div>
            </div>

            {/* Penetration */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#a8b1be] flex items-center gap-1.5 font-bold uppercase">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#ff9d00]" />
                  <span>{lang === 'uk' ? 'Пробиття' : 'PENETRATION'}</span>
                </span>
                <span className="text-[#ffbe3b] font-bold">{calculatedStats.penetration}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1e2430] rounded-xs overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#ff9d00] transition-all duration-300"
                  style={{ width: `${calculatedStats.penetration}%` }}
                />
              </div>
            </div>

            {/* Rate of fire */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#a8b1be] flex items-center gap-1.5 font-bold uppercase">
                  <Zap className="w-3.5 h-3.5 text-[#ff9d00]" />
                  <span>{lang === 'uk' ? 'Швидкострільність' : 'RATE OF FIRE'}</span>
                </span>
                <span className="text-[#ffbe3b] font-bold">{calculatedStats.rateOfFire}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1e2430] rounded-xs overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#ff9d00] transition-all duration-300"
                  style={{ width: `${calculatedStats.rateOfFire}%` }}
                />
              </div>
            </div>

            {/* Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#a8b1be] flex items-center gap-1.5 font-bold uppercase">
                  <Target className="w-3.5 h-3.5 text-[#ff9d00]" />
                  <span>{lang === 'uk' ? 'Дальність' : 'RANGE'}</span>
                </span>
                <span className="text-[#ffbe3b] font-bold">{calculatedStats.range}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1e2430] rounded-xs overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#ff9d00] transition-all duration-300"
                  style={{ width: `${calculatedStats.range}%` }}
                />
              </div>
            </div>

            {/* Accuracy */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#a8b1be] flex items-center gap-1.5 font-bold uppercase">
                  <Crosshair className="w-3.5 h-3.5 text-[#ff9d00]" />
                  <span>{lang === 'uk' ? 'Точність' : 'ACCURACY'}</span>
                </span>
                <span className="text-[#ffbe3b] font-bold">{calculatedStats.accuracy}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1e2430] rounded-xs overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#ff9d00] transition-all duration-300"
                  style={{ width: `${calculatedStats.accuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Modification Slot Boxes at Bottom Right */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((idx) => {
              const installedUpgrade = selectedWeapon.upgrades.filter(u => u.installed)[idx];
              return (
                <div
                  key={idx}
                  title={installedUpgrade ? (lang === 'uk' ? installedUpgrade.nameUk : installedUpgrade.nameEn) : 'Вільний слот'}
                  className={`w-10 h-10 rounded border flex items-center justify-center transition-colors ${
                    installedUpgrade
                      ? 'border-[#ff9d00] bg-[#ff9d00]/10 text-[#ffbe3b]'
                      : 'border-[#29303d] bg-[#12161f] text-[#4d5665]'
                  }`}
                >
                  {installedUpgrade ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#29303d]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
