import { Quest, WeaponGearItem, NoteItem, MapMarker } from '../types/pda';

/**
 * Computes modified stats for a weapon given its installed upgrades
 */
export function calculateWeaponStats(weapon: WeaponGearItem) {
  const result = { ...weapon.baseStats };
  for (const up of weapon.upgrades) {
    if (up.installed) {
      if (up.statBonus.damage) result.damage = Math.min(100, Math.max(0, result.damage + up.statBonus.damage));
      if (up.statBonus.penetration) result.penetration = Math.min(100, Math.max(0, result.penetration + up.statBonus.penetration));
      if (up.statBonus.rateOfFire) result.rateOfFire = Math.min(100, Math.max(0, result.rateOfFire + up.statBonus.rateOfFire));
      if (up.statBonus.range) result.range = Math.min(100, Math.max(0, result.range + up.statBonus.range));
      if (up.statBonus.accuracy) result.accuracy = Math.min(100, Math.max(0, result.accuracy + up.statBonus.accuracy));
    }
  }
  return result;
}

/**
 * Filter quests by status (active vs completed) and category
 */
export function filterQuests(quests: Quest[], completedTab: boolean, categoryFilter: 'all' | 'main' | 'side' | 'faction' = 'all') {
  return quests.filter(q => {
    if (q.isCompleted !== completedTab) return false;
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    return true;
  });
}

/**
 * Toggle tracking on a quest: only one quest is tracked at a time
 */
export function setTrackedQuest(quests: Quest[], targetId: string): Quest[] {
  return quests.map(q => {
    if (q.id === targetId) {
      return { ...q, isTracking: !q.isTracking };
    }
    return { ...q, isTracking: false };
  });
}

/**
 * Accept a quest: changes status to 'active', tracks it, and keeps uncompleted
 */
export function acceptQuest(quests: Quest[], questId: string): Quest[] {
  return quests.map(q => {
    if (q.id === questId) {
      return {
        ...q,
        status: 'active',
        isCompleted: false,
        isTracking: true
      };
    }
    return q;
  });
}

/**
 * Accomplish/complete a quest: marks completed, stops tracking, marks all objectives completed
 */
export function completeQuest(quests: Quest[], questId: string): Quest[] {
  return quests.map(q => {
    if (q.id === questId) {
      return {
        ...q,
        status: 'completed',
        isCompleted: true,
        isTracking: false,
        objectives: q.objectives.map(o => ({ ...o, completed: true, isCurrent: false }))
      };
    }
    return q;
  });
}

/**
 * Fail a quest: marks failed, stops tracking
 */
export function failQuest(quests: Quest[], questId: string): Quest[] {
  return quests.map(q => {
    if (q.id === questId) {
      return {
        ...q,
        status: 'failed',
        isCompleted: true, // goes into completed/archive tab as failed
        isTracking: false,
        objectives: q.objectives.map(o => ({ ...o, completed: false, isCurrent: false }))
      };
    }
    return q;
  });
}

/**
 * Reset a test quest to available state
 */
export function resetQuest(quests: Quest[], questId: string): Quest[] {
  return quests.map(q => {
    if (q.id === questId) {
      return {
        ...q,
        status: 'available',
        isCompleted: false,
        isTracking: false,
        objectives: q.objectives.map((o, idx) => ({ ...o, completed: false, isCurrent: idx === 0 }))
      };
    }
    return q;
  });
}

/**
 * Toggle an upgrade node on a weapon
 */
export function toggleUpgradeNode(weapon: WeaponGearItem, upgradeId: string): WeaponGearItem {
  return {
    ...weapon,
    upgrades: weapon.upgrades.map(u => {
      if (u.id === upgradeId) {
        return { ...u, installed: !u.installed };
      }
      return u;
    })
  };
}

/**
 * Count unread notes
 */
export function countUnreadNotes(notes: NoteItem[]): number {
  return notes.filter(n => n.isUnread).length;
}

/**
 * Filter map markers by enabled filter types and active sector
 */
export function filterMapMarkers(
  markers: MapMarker[], 
  filters: { quests: boolean; safezones: boolean; anomalies: boolean; stashes: boolean; traders: boolean },
  sector?: string
): MapMarker[] {
  return markers.filter(m => {
    // If sector is specified, only include markers for that sector (or custom player waypoints)
    if (sector && m.sector && m.sector !== sector && m.type !== 'custom') return false;
    if ((m.type === 'quest-main' || m.type === 'quest-side') && !filters.quests) return false;
    if (m.type === 'safezone' && !filters.safezones) return false;
    if (m.type === 'anomaly' && !filters.anomalies) return false;
    if (m.type === 'stash' && !filters.stashes) return false;
    if ((m.type === 'trader' || m.type === 'technician') && !filters.traders) return false;
    return true;
  });
}

/**
 * Calculates tactical distance in meters and walking travel time across Zone map
 */
export function calculateTacticalDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  scaleMeters = 3000
): { distanceMeters: number; travelTimeMinutes: number } {
  const dx = (p1.x - p2.x) * (scaleMeters / 100);
  const dy = (p1.y - p2.y) * (scaleMeters / 100);
  const dist = Math.sqrt(dx * dx + dy * dy);
  const speedMetersPerSec = 1.4; // Average stalker terrain speed
  const timeMin = Math.round(dist / (speedMetersPerSec * 60));
  return {
    distanceMeters: Math.round(dist),
    travelTimeMinutes: Math.max(1, timeMin)
  };
}
