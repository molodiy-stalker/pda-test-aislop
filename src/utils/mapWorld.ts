import { MapMarker } from '../types/pda';

const SECTOR_BOUNDS: Record<NonNullable<MapMarker['sector']>, { south: number; north: number; west: number; east: number }> = {
  'chornobyl-zone': { south: 51.31, north: 51.44, west: 29.99, east: 30.18 },
  'pripyat-city': { south: 51.4, north: 51.42, west: 30.035, east: 30.08 },
  'lesser-zone': { south: 51.23, north: 51.34, west: 30.1, east: 30.31 },
  'zhytomyr-osm': { south: 50.23, north: 50.29, west: 28.6, east: 28.72 }
};

interface UkraineRegion {
  id: string;
  nameUk: string;
  nameEn: string;
  settlements: Array<{ nameUk: string; nameEn: string; lat: number; lon: number }>;
}

const UKRAINE_REGIONS: UkraineRegion[] = [
  { id: 'zakarpattia', nameUk: 'Закарпатська область', nameEn: 'Zakarpattia Oblast', settlements: [{ nameUk: 'Ужгород', nameEn: 'Uzhhorod', lat: 48.62, lon: 22.30 }, { nameUk: 'Мукачево', nameEn: 'Mukachevo', lat: 48.44, lon: 22.72 }] },
  { id: 'lviv', nameUk: 'Львівська область', nameEn: 'Lviv Oblast', settlements: [{ nameUk: 'Львів', nameEn: 'Lviv', lat: 49.84, lon: 24.03 }, { nameUk: 'Дрогобич', nameEn: 'Drohobych', lat: 49.35, lon: 23.51 }] },
  { id: 'volyn', nameUk: 'Волинська область', nameEn: 'Volyn Oblast', settlements: [{ nameUk: 'Луцьк', nameEn: 'Lutsk', lat: 50.75, lon: 25.33 }, { nameUk: 'Ковель', nameEn: 'Kovel', lat: 51.21, lon: 24.71 }] },
  { id: 'rivne', nameUk: 'Рівненська область', nameEn: 'Rivne Oblast', settlements: [{ nameUk: 'Рівне', nameEn: 'Rivne', lat: 50.62, lon: 26.25 }, { nameUk: 'Дубно', nameEn: 'Dubno', lat: 50.42, lon: 25.74 }] },
  { id: 'ternopil', nameUk: 'Тернопільська область', nameEn: 'Ternopil Oblast', settlements: [{ nameUk: 'Тернопіль', nameEn: 'Ternopil', lat: 49.55, lon: 25.59 }, { nameUk: 'Чортків', nameEn: 'Chortkiv', lat: 49.02, lon: 25.80 }] },
  { id: 'ivano-frankivsk', nameUk: 'Івано-Франківська область', nameEn: 'Ivano-Frankivsk Oblast', settlements: [{ nameUk: 'Івано-Франківськ', nameEn: 'Ivano-Frankivsk', lat: 48.92, lon: 24.71 }, { nameUk: 'Коломия', nameEn: 'Kolomyia', lat: 48.53, lon: 25.04 }] },
  { id: 'chernivtsi', nameUk: 'Чернівецька область', nameEn: 'Chernivtsi Oblast', settlements: [{ nameUk: 'Чернівці', nameEn: 'Chernivtsi', lat: 48.29, lon: 25.94 }, { nameUk: 'Хотин', nameEn: 'Khotyn', lat: 48.51, lon: 26.49 }] },
  { id: 'khmelnytskyi', nameUk: 'Хмельницька область', nameEn: 'Khmelnytskyi Oblast', settlements: [{ nameUk: 'Хмельницький', nameEn: 'Khmelnytskyi', lat: 49.42, lon: 26.98 }, { nameUk: 'Кам’янець-Подільський', nameEn: 'Kamianets-Podilskyi', lat: 48.68, lon: 26.58 }] },
  { id: 'zhytomyr', nameUk: 'Житомирська область', nameEn: 'Zhytomyr Oblast', settlements: [{ nameUk: 'Житомир', nameEn: 'Zhytomyr', lat: 50.25, lon: 28.66 }, { nameUk: 'Коростень', nameEn: 'Korosten', lat: 50.95, lon: 28.64 }, { nameUk: 'Бердичів', nameEn: 'Berdychiv', lat: 49.90, lon: 28.59 }] },
  { id: 'vinnytsia', nameUk: 'Вінницька область', nameEn: 'Vinnytsia Oblast', settlements: [{ nameUk: 'Вінниця', nameEn: 'Vinnytsia', lat: 49.23, lon: 28.47 }, { nameUk: 'Могилів-Подільський', nameEn: 'Mohyliv-Podilskyi', lat: 48.45, lon: 27.80 }] },
  { id: 'kyiv', nameUk: 'Київська область', nameEn: 'Kyiv Oblast', settlements: [{ nameUk: 'Біла Церква', nameEn: 'Bila Tserkva', lat: 49.80, lon: 30.12 }, { nameUk: 'Бориспіль', nameEn: 'Boryspil', lat: 50.35, lon: 30.96 }, { nameUk: 'Переяслав', nameEn: 'Pereiaslav', lat: 50.07, lon: 31.45 }] },
  { id: 'kyiv-city', nameUk: 'м. Київ', nameEn: 'Kyiv City', settlements: [{ nameUk: 'Київ', nameEn: 'Kyiv', lat: 50.45, lon: 30.52 }] },
  { id: 'chernihiv', nameUk: 'Чернігівська область', nameEn: 'Chernihiv Oblast', settlements: [{ nameUk: 'Чернігів', nameEn: 'Chernihiv', lat: 51.49, lon: 31.29 }, { nameUk: 'Ніжин', nameEn: 'Nizhyn', lat: 51.05, lon: 31.89 }] },
  { id: 'sumy', nameUk: 'Сумська область', nameEn: 'Sumy Oblast', settlements: [{ nameUk: 'Суми', nameEn: 'Sumy', lat: 50.91, lon: 34.80 }, { nameUk: 'Конотоп', nameEn: 'Konotop', lat: 51.24, lon: 33.20 }] },
  { id: 'poltava', nameUk: 'Полтавська область', nameEn: 'Poltava Oblast', settlements: [{ nameUk: 'Полтава', nameEn: 'Poltava', lat: 49.59, lon: 34.55 }, { nameUk: 'Кременчук', nameEn: 'Kremenchuk', lat: 49.07, lon: 33.42 }] },
  { id: 'cherkasy', nameUk: 'Черкаська область', nameEn: 'Cherkasy Oblast', settlements: [{ nameUk: 'Черкаси', nameEn: 'Cherkasy', lat: 49.44, lon: 32.06 }, { nameUk: 'Умань', nameEn: 'Uman', lat: 48.75, lon: 30.22 }] },
  { id: 'kharkiv', nameUk: 'Харківська область', nameEn: 'Kharkiv Oblast', settlements: [{ nameUk: 'Харків', nameEn: 'Kharkiv', lat: 49.99, lon: 36.23 }, { nameUk: 'Ізюм', nameEn: 'Izium', lat: 49.21, lon: 37.25 }] },
  { id: 'luhansk', nameUk: 'Луганська область', nameEn: 'Luhansk Oblast', settlements: [{ nameUk: 'Луганськ', nameEn: 'Luhansk', lat: 48.57, lon: 39.31 }, { nameUk: 'Старобільськ', nameEn: 'Starobilsk', lat: 49.28, lon: 38.91 }] },
  { id: 'dnipropetrovsk', nameUk: 'Дніпропетровська область', nameEn: 'Dnipropetrovsk Oblast', settlements: [{ nameUk: 'Дніпро', nameEn: 'Dnipro', lat: 48.46, lon: 35.04 }, { nameUk: 'Кривий Ріг', nameEn: 'Kryvyi Rih', lat: 47.91, lon: 33.39 }] },
  { id: 'donetsk', nameUk: 'Донецька область', nameEn: 'Donetsk Oblast', settlements: [{ nameUk: 'Донецьк', nameEn: 'Donetsk', lat: 48.00, lon: 37.80 }, { nameUk: 'Краматорськ', nameEn: 'Kramatorsk', lat: 48.74, lon: 37.58 }] },
  { id: 'kirovohrad', nameUk: 'Кіровоградська область', nameEn: 'Kirovohrad Oblast', settlements: [{ nameUk: 'Кропивницький', nameEn: 'Kropyvnytskyi', lat: 48.51, lon: 32.26 }, { nameUk: 'Олександрія', nameEn: 'Oleksandriia', lat: 48.67, lon: 33.12 }] },
  { id: 'mykolaiv', nameUk: 'Миколаївська область', nameEn: 'Mykolaiv Oblast', settlements: [{ nameUk: 'Миколаїв', nameEn: 'Mykolaiv', lat: 46.97, lon: 31.99 }, { nameUk: 'Первомайськ', nameEn: 'Pervomaisk', lat: 48.04, lon: 30.85 }] },
  { id: 'odesa', nameUk: 'Одеська область', nameEn: 'Odesa Oblast', settlements: [{ nameUk: 'Одеса', nameEn: 'Odesa', lat: 46.48, lon: 30.72 }, { nameUk: 'Ізмаїл', nameEn: 'Izmail', lat: 45.35, lon: 28.84 }] },
  { id: 'kherson', nameUk: 'Херсонська область', nameEn: 'Kherson Oblast', settlements: [{ nameUk: 'Херсон', nameEn: 'Kherson', lat: 46.64, lon: 32.62 }, { nameUk: 'Берислав', nameEn: 'Beryslav', lat: 46.84, lon: 33.43 }] },
  { id: 'zaporizhzhia', nameUk: 'Запорізька область', nameEn: 'Zaporizhzhia Oblast', settlements: [{ nameUk: 'Запоріжжя', nameEn: 'Zaporizhzhia', lat: 47.84, lon: 35.14 }, { nameUk: 'Мелітополь', nameEn: 'Melitopol', lat: 46.85, lon: 35.37 }] },
  { id: 'crimea', nameUk: 'АР Крим', nameEn: 'Autonomous Republic of Crimea', settlements: [{ nameUk: 'Сімферополь', nameEn: 'Simferopol', lat: 44.95, lon: 34.10 }, { nameUk: 'Євпаторія', nameEn: 'Yevpatoria', lat: 45.20, lon: 33.36 }] },
  { id: 'sevastopol', nameUk: 'м. Севастополь', nameEn: 'Sevastopol City', settlements: [{ nameUk: 'Севастополь', nameEn: 'Sevastopol', lat: 44.62, lon: 33.53 }] }
];

const ARTIFACTS = ['Компас', 'Живе серце', 'Золота рибка', 'Медуза', 'Кристал', 'Виверт', 'Батарейка', 'Кров каменя', 'Душа', 'Око'];
const WORLD_MARKERS_PER_REGION = 3;

function randomPointInRegion(region: UkraineRegion): [number, number, string, string] {
  const settlement = region.settlements[Math.floor(Math.random() * region.settlements.length)];
  const angle = Math.random() * Math.PI * 2;
  const distance = 0.015 + Math.random() * 0.075;
  const lat = settlement.lat + Math.cos(angle) * distance;
  const lon = settlement.lon + Math.sin(angle) * distance / Math.cos(settlement.lat * Math.PI / 180);
  return [lat, lon, settlement.nameUk, settlement.nameEn];
}

export function createUkraineWorldMarkers(): MapMarker[] {
  return UKRAINE_REGIONS.flatMap((region, regionIndex) =>
    Array.from({ length: WORLD_MARKERS_PER_REGION }, (_, slot) => {
      const [geoLat, geoLon, cityUk, cityEn] = randomPointInRegion(region);
      const id = `ukraine-world-${region.id}-${slot + 1}`;
      const artifact = ARTIFACTS[(regionIndex * WORLD_MARKERS_PER_REGION + slot) % ARTIFACTS.length];
      const type: MapMarker['type'] = slot === 0 ? 'anomaly' : slot === 1 ? 'stash' : 'quest-side';
      const names = type === 'anomaly'
        ? { nameUk: `Аномальне поле біля ${cityUk}`, nameEn: `Anomaly field near ${cityEn}` }
        : type === 'stash'
          ? { nameUk: `Схованка «${cityUk}»`, nameEn: `${cityEn} Stash` }
          : { nameUk: `Сигнал КПК: ${cityUk}`, nameEn: `PDA signal: ${cityEn}` };

      return {
        id,
        type,
        x: 50,
        y: 50,
        geoLat,
        geoLon,
        regionId: region.id,
        regionUk: region.nameUk,
        regionEn: region.nameEn,
        nameUk: names.nameUk,
        nameEn: names.nameEn,
        radiationLevel: type === 'anomaly' ? +(0.6 + Math.random() * 18).toFixed(2) : +(0.08 + Math.random() * 1.2).toFixed(2),
        hazard: type === 'anomaly' ? ['radiation', 'chemical', 'burner', 'gravitational'][regionIndex % 4] as MapMarker['hazard'] : undefined,
        loot: type !== 'quest-side' ? [`Артефакт «${artifact}»`, 'Аптечка', 'Набої та провізія'] : undefined,
        descriptionUk: type === 'anomaly'
          ? `Вигадане аномальне поле в районі м. ${cityUk}. Детектор зафіксував нестабільний сигнал; поруч може бути артефакт «${artifact}». Ігрова локація.`
          : type === 'stash'
            ? `Випадково згенерована ігрова схованка поблизу м. ${cityUk}. Можливий хабар: артефакт «${artifact}», медикаменти та спорядження.`
            : `Невідомий сигнал сталкера поблизу м. ${cityUk}. Перевір маршрут і координати на мапі. Вигадане ігрове завдання.`,
        descriptionEn: type === 'anomaly'
          ? `Fictional anomaly field near ${cityEn}. The detector picked up an unstable signal; artifact "${artifact}" may be nearby. Game location.`
          : type === 'stash'
            ? `Randomly generated in-game stash near ${cityEn}. Possible loot: "${artifact}" artifact, medical supplies, and gear.`
            : `Unknown stalker signal near ${cityEn}. Check your route and map coordinates. Fictional game quest.`
      };
    })
  );
}

export function randomizeMapObjectPositions(markers: MapMarker[]): MapMarker[] {
  return markers.map((marker) => {
    const worldRegionId = marker.regionId ?? (marker.id.startsWith('ukraine-world-')
      ? marker.id.slice('ukraine-world-'.length).replace(/-\d+$/, '')
      : null);
    if (worldRegionId) {
      const region = UKRAINE_REGIONS.find((item) => item.id === worldRegionId);
      if (!region) return marker;
      const [geoLat, geoLon, cityUk, cityEn] = randomPointInRegion(region);
      return {
        ...marker,
        geoLat,
        geoLon,
        regionUk: region.nameUk,
        regionEn: region.nameEn,
        nameUk: marker.type === 'anomaly' ? `Аномальне поле біля ${cityUk}` : marker.type === 'stash' ? `Схованка «${cityUk}»` : `Сигнал КПК: ${cityUk}`,
        nameEn: marker.type === 'anomaly' ? `Anomaly field near ${cityEn}` : marker.type === 'stash' ? `${cityEn} Stash` : `PDA signal: ${cityEn}`
      };
    }
    return marker;
  });
}

export function ensureUkraineWorldMarkers(markers: MapMarker[]): MapMarker[] {
  const generated = createUkraineWorldMarkers();
  const generatedById = new Map(generated.map((marker) => [marker.id, marker]));
  const existingWorldMarkerIds = new Set(
    markers.filter((marker) => marker.id.startsWith('ukraine-world-')).map((marker) => marker.id)
  );
  const upgradedMarkers = markers.map((marker) => {
    const template = generatedById.get(marker.id);
    if (!template) return marker;
    return {
      ...template,
      ...marker,
      regionId: marker.regionId ?? template.regionId,
      regionUk: marker.regionUk ?? template.regionUk,
      regionEn: marker.regionEn ?? template.regionEn
    };
  });
  const missingMarkers = generated.filter((marker) => !existingWorldMarkerIds.has(marker.id));
  return [...upgradedMarkers, ...missingMarkers];
}

export function getMapMarkerCoordinates(marker: MapMarker): [number, number] {
  if (marker.geoLat !== undefined && marker.geoLon !== undefined) {
    return [marker.geoLat, marker.geoLon];
  }

  const bounds = SECTOR_BOUNDS[marker.sector ?? 'zhytomyr-osm'];
  return [
    bounds.south + (marker.y / 100) * (bounds.north - bounds.south),
    bounds.west + (marker.x / 100) * (bounds.east - bounds.west)
  ];
}
