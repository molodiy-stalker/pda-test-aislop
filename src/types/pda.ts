export type PdaTab = 'map' | 'journal' | 'notes' | 'upgrades' | 'tutorial';

export type Language = 'uk' | 'en';

export type MapSector = 'chornobyl-zone' | 'pripyat-city' | 'lesser-zone' | 'zhytomyr-osm';

export type StalkerFaction = 'loner' | 'duty' | 'freedom' | 'clearsky' | 'mercenary' | 'ecologist';

export interface UserProfile {
  id: string;
  callsign: string;
  faction: StalkerFaction;
  rank: 'rookie' | 'experienced' | 'veteran' | 'master' | 'legend';
  reputation: number;
  coupons: number;
  avatar: string;
  idNumber: string;
  radiationDose: number; // in mSv
  registeredAt: string;
  isLoggedIn: boolean;
}

export interface RadiationAlarmSettings {
  enabled: boolean;
  threshold: number; // threshold in μSv/h
  soundEnabled: boolean;
}

export type DesktopAppId = 'terminal' | 'browser' | 'emulator' | 'files' | 'settings';

export interface AppWindow {
  id: DesktopAppId;
  titleUk: string;
  titleEn: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export interface MapMarker {
  id: string;
  nameUk: string;
  nameEn: string;
  sector?: MapSector;
  type: 'quest-main' | 'quest-side' | 'safezone' | 'anomaly' | 'stash' | 'trader' | 'technician' | 'landmark' | 'custom';
  x: number; // percentage 0-100 on map
  y: number; // percentage 0-100 on map
  descriptionUk?: string;
  descriptionEn?: string;
  hazard?: 'radiation' | 'chemical' | 'burner' | 'gravitational' | 'psi';
  radiationLevel?: number; // μSv/h
  faction?: string;
  loot?: string[];
  isLooted?: boolean;
  geoLat?: number;
  geoLon?: number;
  regionId?: string;
  regionUk?: string;
  regionEn?: string;
}

export interface QuestObjective {
  id: string;
  textUk: string;
  textEn: string;
  completed: boolean;
  isCurrent?: boolean;
  optional?: boolean;
}

export interface Quest {
  id: string;
  titleUk: string;
  titleEn: string;
  category: 'main' | 'side' | 'faction';
  regionUk: string;
  regionEn: string;
  isCompleted: boolean;
  isTracking: boolean;
  status?: 'available' | 'active' | 'completed' | 'failed';
  isTestQuest?: boolean;
  headerImage?: string;
  descriptionUk: string;
  descriptionEn: string;
  objectives: QuestObjective[];
  soundUrls?: {
    accept: string;
    accomplish: string;
    fail: string;
  };
}

export interface NoteItem {
  id: string;
  titleUk: string;
  titleEn: string;
  category: 'all' | 'memos' | 'important' | 'audio' | 'diary';
  subtitleUk: string;
  subtitleEn: string;
  dateStr?: string;
  isUnread: boolean;
  contentUk: string;
  contentEn: string;
  hasAudio?: boolean;
  audioDuration?: string;
}

export interface UpgradeNode {
  id: string;
  nameUk: string;
  nameEn: string;
  type: 'barrel' | 'grip' | 'magazine' | 'receiver' | 'sight';
  x: number; // % position on weapon display
  y: number;
  installed: boolean;
  cost: number;
  descriptionUk: string;
  descriptionEn: string;
  statBonus: {
    damage?: number;
    penetration?: number;
    rateOfFire?: number;
    range?: number;
    accuracy?: number;
  };
}

export interface WeaponGearItem {
  id: string;
  nameUk: string;
  nameEn: string;
  category: 'pistol' | 'rifle' | 'suit';
  isEquipped: boolean;
  baseStats: {
    damage: number;       // 0-100
    penetration: number;  // 0-100
    rateOfFire: number;   // 0-100
    range: number;        // 0-100
    accuracy: number;     // 0-100
  };
  upgrades: UpgradeNode[];
}

export interface TutorialTopic {
  id: string;
  titleUk: string;
  titleEn: string;
  category: 'survival' | 'combat' | 'world';
  contentUk: string;
  contentEn: string;
  isUnread: boolean;
  iconType: 'hunger' | 'artifact' | 'inventory' | 'radiation' | 'compass' | 'healing' | 'anomaly';
}
