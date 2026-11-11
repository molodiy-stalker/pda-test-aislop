import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWeaponStats,
  filterQuests,
  setTrackedQuest,
  toggleUpgradeNode,
  countUnreadNotes,
  filterMapMarkers,
  acceptQuest,
  completeQuest,
  failQuest,
  resetQuest,
  calculateTacticalDistance
} from './pdaLogic';
import { WeaponGearItem, Quest, NoteItem, MapMarker } from '../types/pda';

test('calculateWeaponStats applies bonuses correctly and respects clamps', () => {
  const mockWeapon: WeaponGearItem = {
    id: 'skif-pm',
    nameUk: 'Пістолет Скіфа',
    nameEn: "Skif's Pistol",
    category: 'pistol',
    isEquipped: true,
    baseStats: {
      damage: 30,
      penetration: 20,
      rateOfFire: 50,
      range: 25,
      accuracy: 40,
    },
    upgrades: [
      {
        id: 'barrel-match',
        nameUk: 'Матчевий ствол',
        nameEn: 'Match Barrel',
        type: 'barrel',
        x: 80,
        y: 40,
        installed: true,
        cost: 1500,
        descriptionUk: '+15 до точності',
        descriptionEn: '+15 to accuracy',
        statBonus: { accuracy: 15, damage: 5 }
      },
      {
        id: 'light-trigger',
        nameUk: 'Полегшений спуск',
        nameEn: 'Lightened Trigger',
        type: 'receiver',
        x: 50,
        y: 60,
        installed: false,
        cost: 800,
        descriptionUk: '+10 до швидкострільності',
        descriptionEn: '+10 to fire rate',
        statBonus: { rateOfFire: 10 }
      }
    ]
  };

  const calculated = calculateWeaponStats(mockWeapon);
  assert.equal(calculated.accuracy, 55);
  assert.equal(calculated.damage, 35);
  assert.equal(calculated.rateOfFire, 50); // uninstalled upgrade not applied
});

test('toggleUpgradeNode flips installed state', () => {
  const weapon: WeaponGearItem = {
    id: 'w1',
    nameUk: 'Зброя',
    nameEn: 'Weapon',
    category: 'pistol',
    isEquipped: true,
    baseStats: { damage: 10, penetration: 10, rateOfFire: 10, range: 10, accuracy: 10 },
    upgrades: [
      {
        id: 'u1',
        nameUk: 'Апгрейд',
        nameEn: 'Upgrade',
        type: 'barrel',
        x: 0,
        y: 0,
        installed: false,
        cost: 100,
        descriptionUk: '',
        descriptionEn: '',
        statBonus: { damage: 5 }
      }
    ]
  };

  const updated = toggleUpgradeNode(weapon, 'u1');
  assert.equal(updated.upgrades[0].installed, true);
  const reverted = toggleUpgradeNode(updated, 'u1');
  assert.equal(reverted.upgrades[0].installed, false);
});

test('filterQuests differentiates current vs completed quests', () => {
  const quests: Quest[] = [
    {
      id: 'q1',
      titleUk: 'Завдання 1',
      titleEn: 'Quest 1',
      category: 'main',
      regionUk: 'Мала Зона',
      regionEn: 'Lesser Zone',
      isCompleted: false,
      isTracking: true,
      descriptionUk: '',
      descriptionEn: '',
      objectives: []
    },
    {
      id: 'q2',
      titleUk: 'Завдання 2',
      titleEn: 'Quest 2',
      category: 'side',
      regionUk: 'Залісся',
      regionEn: 'Zalissya',
      isCompleted: true,
      isTracking: false,
      descriptionUk: '',
      descriptionEn: '',
      objectives: []
    }
  ];

  const current = filterQuests(quests, false);
  assert.equal(current.length, 1);
  assert.equal(current[0].id, 'q1');

  const completed = filterQuests(quests, true);
  assert.equal(completed.length, 1);
  assert.equal(completed[0].id, 'q2');
});

test('setTrackedQuest only sets one tracked quest', () => {
  const quests: Quest[] = [
    { id: 'q1', titleUk: '', titleEn: '', category: 'main', regionUk: '', regionEn: '', isCompleted: false, isTracking: true, descriptionUk: '', descriptionEn: '', objectives: [] },
    { id: 'q2', titleUk: '', titleEn: '', category: 'side', regionUk: '', regionEn: '', isCompleted: false, isTracking: false, descriptionUk: '', descriptionEn: '', objectives: [] }
  ];

  const result = setTrackedQuest(quests, 'q2');
  assert.equal(result.find(q => q.id === 'q1')?.isTracking, false);
  assert.equal(result.find(q => q.id === 'q2')?.isTracking, true);
});

test('countUnreadNotes correctly counts notes with unread state', () => {
  const notes: NoteItem[] = [
    { id: 'n1', titleUk: '', titleEn: '', category: 'memos', subtitleUk: '', subtitleEn: '', isUnread: true, contentUk: '', contentEn: '' },
    { id: 'n2', titleUk: '', titleEn: '', category: 'diary', subtitleUk: '', subtitleEn: '', isUnread: false, contentUk: '', contentEn: '' },
    { id: 'n3', titleUk: '', titleEn: '', category: 'audio', subtitleUk: '', subtitleEn: '', isUnread: true, contentUk: '', contentEn: '' }
  ];
  assert.equal(countUnreadNotes(notes), 2);
});

test('filterMapMarkers filters according to category', () => {
  const markers: MapMarker[] = [
    { id: 'm1', nameUk: '', nameEn: '', type: 'quest-main', x: 10, y: 10 },
    { id: 'm2', nameUk: '', nameEn: '', type: 'safezone', x: 20, y: 20 },
    { id: 'm3', nameUk: '', nameEn: '', type: 'stash', x: 30, y: 30 }
  ];

  const filtered = filterMapMarkers(markers, {
    quests: true,
    safezones: false,
    anomalies: false,
    stashes: false,
    traders: false
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'm1');
});

test('quest lifecycle transitions work: accept, complete, fail, reset', () => {
  const initialQuests: Quest[] = [
    {
      id: 'test-quest',
      titleUk: 'Тестовий контракт',
      titleEn: 'Test Contract',
      category: 'main',
      regionUk: 'Мала Зона',
      regionEn: 'Lesser Zone',
      isCompleted: false,
      isTracking: false,
      status: 'available',
      isTestQuest: true,
      descriptionUk: 'Опис',
      descriptionEn: 'Description',
      objectives: [
        { id: 'o1', textUk: 'Крок 1', textEn: 'Step 1', completed: false, isCurrent: true },
        { id: 'o2', textUk: 'Крок 2', textEn: 'Step 2', completed: false }
      ]
    }
  ];

  // 1. Accept
  const accepted = acceptQuest(initialQuests, 'test-quest');
  assert.equal(accepted[0].status, 'active');
  assert.equal(accepted[0].isTracking, true);
  assert.equal(accepted[0].isCompleted, false);

  // 2. Complete
  const completed = completeQuest(accepted, 'test-quest');
  assert.equal(completed[0].status, 'completed');
  assert.equal(completed[0].isCompleted, true);
  assert.equal(completed[0].isTracking, false);
  assert.equal(completed[0].objectives[0].completed, true);
  assert.equal(completed[0].objectives[1].completed, true);

  // 3. Fail
  const failed = failQuest(accepted, 'test-quest');
  assert.equal(failed[0].status, 'failed');
  assert.equal(failed[0].isCompleted, true);
  assert.equal(failed[0].isTracking, false);

  // 4. Reset
  const reset = resetQuest(failed, 'test-quest');
  assert.equal(reset[0].status, 'available');
  assert.equal(reset[0].isCompleted, false);
  assert.equal(reset[0].objectives[0].completed, false);
  assert.equal(reset[0].objectives[0].isCurrent, true);
});

test('calculateTacticalDistance calculates correct metric distance and travel time', () => {
  const p1 = { x: 50, y: 50 };
  const p2 = { x: 53, y: 54 }; // dx = 3%, dy = 4% -> 5%
  // 5% of 3000m = 150m
  const res = calculateTacticalDistance(p1, p2, 3000);
  assert.equal(res.distanceMeters, 150);
  assert.ok(res.travelTimeMinutes >= 1);
});

