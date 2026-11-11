import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as L from 'leaflet';
import { MapMarker, MapSector, Language } from '../../types/pda';
import { getMapMarkerCoordinates, randomizeMapObjectPositions } from '../../utils/mapWorld';
import { 
  playMarkerPing, 
  playPdaClick, 
  playGeigerCrackle, 
  playDetectorBeep,
  playUpgradeSound 
} from '../../utils/audio';
import { filterMapMarkers } from '../../utils/pdaLogic';
import { 
  Compass, 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Package, 
  Flame, 
  Plus, 
  Minus, 
  RotateCcw, 
  SlidersHorizontal,
  X,
  Search,
  Ruler,
  Navigation,
  Radiation,
  Eye,
  Layers,
  Radio,
  Check,
  Shuffle
} from 'lucide-react';

interface MapTabProps {
  markers: MapMarker[];
  onUpdateMarkers?: (markers: MapMarker[]) => void;
  lang: Language;
  onAddCustomMarker: (marker: MapMarker) => void;
  onRemoveCustomMarker: (id: string) => void;
  isLegendOpen: boolean;
  onToggleLegend: () => void;
  onCenterPlayerTrigger?: number;
  onRadiationChange?: (radiation: number) => void;
}

export const MapTab: React.FC<MapTabProps> = ({
  markers,
  onUpdateMarkers,
  lang,
  onAddCustomMarker,
  onRemoveCustomMarker,
  isLegendOpen,
  onToggleLegend,
  onCenterPlayerTrigger,
  onRadiationChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmContainerRef = useRef<HTMLDivElement>(null);
  const osmMapRef = useRef<L.Map | null>(null);
  const markerSelectRef = useRef<(marker: MapMarker) => void>(() => {});
  const addCustomMarkerRef = useRef<(lat: number, lon: number) => void>(() => {});
  const markersRef = useRef(markers);
  const hasFittedInitialBoundsRef = useRef(false);
  markersRef.current = markers;
  
  // Active sector on offline map
  const [activeSector, setActiveSector] = useState<MapSector>('zhytomyr-osm');
  
  // Tactical layer mode
  const [mapMode, setMapMode] = useState<'topo' | 'radiation' | 'anomalies'>('topo');
  
  // Viewport transforms
  const [zoom, setZoom] = useState(8);
  const [pan, setPan] = useState({ x: -60, y: -40 });
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.8, 29.3]);
  const [mapViewportRevision, setMapViewportRevision] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Selected location & tactical tools
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRangefinderActive, setIsRangefinderActive] = useState(false);
  const [rangeTarget, setRangeTarget] = useState<MapMarker | null>(null);

  // Filters for Legend
  const [filters, setFilters] = useState({
    quests: true,
    safezones: true,
    anomalies: true,
    stashes: true,
    traders: true
  });

  // Skif position marker
  const playerMarker = markers.find(m => m.id === 'poi-skif') || {
    id: 'poi-skif',
    nameUk: 'Скіф (Ви)',
    nameEn: 'Skif (You)',
    type: 'custom' as const,
    x: 48,
    y: 44,
    radiationLevel: 0.16
  };

  // Filtered markers by category and active sector
  const visibleMarkers = useMemo(() => {
    return filterMapMarkers(markers, filters);
  }, [markers, filters]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return markers.filter(m => 
      m.nameUk.toLowerCase().includes(q) || 
      m.nameEn.toLowerCase().includes(q) ||
      m.descriptionUk?.toLowerCase().includes(q) ||
      m.descriptionEn?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [markers, searchQuery]);

  // Ambient radiation dosimeter calculation based on proximity to hazards
  const currentRadiation = useMemo(() => {
    if (selectedMarker?.radiationLevel) return selectedMarker.radiationLevel;
    if (activeSector === 'chornobyl-zone') return 14.5;
    if (activeSector === 'pripyat-city') return 2.4;
    if (activeSector === 'zhytomyr-osm') return 0.14;
    return 0.16;
  }, [selectedMarker, activeSector]);

  const selectMarker = (marker: MapMarker) => {
    playMarkerPing();
    setSelectedMarker(marker);
    if (isRangefinderActive) {
      setRangeTarget(marker);
    }
  };

  const fitInitialWorldBounds = () => {
    const map = osmMapRef.current;
    if (!map || hasFittedInitialBoundsRef.current) return;
    const size = map.getSize();
    if (size.x === 0 || size.y === 0) return;

    const points = markersRef.current.map(getMapMarkerCoordinates);
    if (points.length < 2) return;

    hasFittedInitialBoundsRef.current = true;
    map.fitBounds(L.latLngBounds(points), { padding: [72, 72], maxZoom: 8 });
  };

  useEffect(() => {
    onRadiationChange?.(currentRadiation);
  }, [currentRadiation, onRadiationChange]);

  useEffect(() => {
    markerSelectRef.current = selectMarker;
  });

  useEffect(() => {
    if (!osmContainerRef.current || osmMapRef.current) return;

    const map = L.map(osmContainerRef.current, { center: [50.8, 29.3], zoom: 8, minZoom: 5, doubleClickZoom: false });
    osmMapRef.current = map;
    setZoom(map.getZoom());
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('dblclick', (event: L.LeafletMouseEvent) => addCustomMarkerRef.current(event.latlng.lat, event.latlng.lng));
    map.on('zoomend', () => {
      setZoom(map.getZoom());
      setMapViewportRevision((revision) => revision + 1);
    });
    map.on('moveend', () => {
      const center = map.getCenter();
      setMapCenter([center.lat, center.lng]);
      setMapViewportRevision((revision) => revision + 1);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({ pan: false });
      requestAnimationFrame(fitInitialWorldBounds);
    });
    resizeObserver.observe(osmContainerRef.current);
    requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      fitInitialWorldBounds();
    });

    return () => {
      resizeObserver.disconnect();
      map.remove();
      osmMapRef.current = null;
    };
  }, []);

  useEffect(fitInitialWorldBounds, [markers]);

  useEffect(() => {
    const map = osmMapRef.current;
    if (!map) return;

    const markerStyle: Record<MapMarker['type'], { color: string; glyph: string }> = {
      'quest-main': { color: '#ff9d00', glyph: '<span>!</span>' },
      'quest-side': { color: '#e2e8f0', glyph: '<span>?</span>' },
      safezone: { color: '#38bdf8', glyph: '<svg viewBox="0 0 24 24"><path d="M12 2 20 5v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3Z"/><path d="M12 7v9M8.5 11.5h7"/></svg>' },
      anomaly: { color: '#c084fc', glyph: '<svg viewBox="0 0 24 24"><path d="M12 2 22 21H2L12 2Z"/><circle cx="12" cy="14" r="1.5"/><path d="m12 7 .8 4"/></svg>' },
      stash: { color: '#ffbe3b', glyph: '<svg viewBox="0 0 24 24"><path d="m3 7 9-4 9 4v11l-9 4-9-4V7Z"/><path d="m3 7 9 4 9-4M12 11v11M8 5l9 4"/></svg>' },
      trader: { color: '#4ade80', glyph: '<span>₴</span>' },
      technician: { color: '#67e8f9', glyph: '<svg viewBox="0 0 24 24"><path d="M14 7a5 5 0 0 0-6.5 6.5L3 18l3 3 4.5-4.5A5 5 0 0 0 17 10l-3 3-3-3 3-3Z"/><path d="m14 7 3-3 4 4-3 3"/></svg>' },
      landmark: { color: '#fbbf24', glyph: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/></svg>' },
      custom: { color: '#fb923c', glyph: '<svg viewBox="0 0 24 24"><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>' }
    };
    const markerLayer = L.layerGroup().addTo(map);
    const zoomLevel = map.getZoom();
    const clusters = new Map<string, MapMarker[]>();
    visibleMarkers.forEach((marker) => {
      const [lat, lon] = getMapMarkerCoordinates(marker);
      const pixel = map.project([lat, lon], zoomLevel);
      const clusterKey = `${Math.floor(pixel.x / 44)}:${Math.floor(pixel.y / 44)}`;
      const cluster = clusters.get(clusterKey) ?? [];
      cluster.push(marker);
      clusters.set(clusterKey, cluster);
    });

    clusters.forEach((cluster) => {
      if (zoomLevel < 8 && cluster.length > 1) {
        const points = cluster.map((marker) => getMapMarkerCoordinates(marker));
        const center = L.latLngBounds(points).getCenter();
        const clusterIcon = L.divIcon({
          className: 'pda-map-cluster-wrap',
          html: `<span class="pda-map-cluster">${cluster.length}</span>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });
        L.marker(center, { icon: clusterIcon, title: `${cluster.length} PDA locations` })
          .on('click', () => map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: zoomLevel + 3 }))
          .addTo(markerLayer);
        return;
      }

      cluster.forEach((marker) => {
        const { color, glyph } = markerStyle[marker.type];
        const [lat, lon] = getMapMarkerCoordinates(marker);
        const icon = L.divIcon({
          className: `zhytomyr-osm-marker${selectedMarker?.id === marker.id ? ' is-selected' : ''}`,
          html: `<span class="pda-map-marker pda-map-marker--${marker.type}" style="--marker-color:${color}">${glyph}</span>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        L.marker([lat, lon], {
          icon,
          title: `${lang === 'uk' ? marker.nameUk : marker.nameEn}${marker.regionUk ? ` · ${lang === 'uk' ? marker.regionUk : marker.regionEn}` : ''}`,
          alt: `${lang === 'uk' ? marker.nameUk : marker.nameEn}${marker.regionUk ? ` · ${lang === 'uk' ? marker.regionUk : marker.regionEn}` : ''}`
        }).on('click', () => markerSelectRef.current(marker)).addTo(markerLayer);
      });
    });

    return () => {
      markerLayer.remove();
    };
  }, [visibleMarkers, lang, selectedMarker?.id, mapViewportRevision]);

  const addCustomMapMarker = (lat: number, lon: number) => {
    const marker: MapMarker = {
      id: `custom-${Date.now()}`,
      sector: 'zhytomyr-osm',
      nameUk: `Точка Скіфа #${Math.floor(Math.random() * 90 + 10)}`,
      nameEn: `Skif Waypoint #${Math.floor(Math.random() * 90 + 10)}`,
      type: 'custom',
      x: 50,
      y: 50,
      geoLat: lat,
      geoLon: lon,
      descriptionUk: 'Власноруч встановлена користувацька навігаційна точка.',
      descriptionEn: 'Manually placed custom tactical waypoint.'
    };
    onAddCustomMarker(marker);
    setSelectedMarker(marker);
  };

  useEffect(() => {
    addCustomMarkerRef.current = addCustomMapMarker;
  });

  const handleShuffleWorld = () => {
    playPdaClick();
    const shuffledMarkers = randomizeMapObjectPositions(markers);
    onUpdateMarkers?.(shuffledMarkers);
    setSelectedMarker(null);
    const points = shuffledMarkers.map(getMapMarkerCoordinates);
    if (points.length > 1) {
      osmMapRef.current?.fitBounds(L.latLngBounds(points), { padding: [72, 72], maxZoom: 8 });
    }
  };

  // Trigger occasional Geiger crackle on high radiation
  useEffect(() => {
    if (currentRadiation > 50) {
      const interval = setInterval(() => {
        playGeigerCrackle();
      }, Math.max(400, 3000 - Math.min(2500, currentRadiation * 2)));
      return () => clearInterval(interval);
    }
  }, [currentRadiation]);

  // Center on player
  const centerOnPlayer = () => {
    playMarkerPing();
    setSelectedMarker(playerMarker);
    osmMapRef.current?.setView(getMapMarkerCoordinates(playerMarker), 14);
  };

  useEffect(() => {
    if (onCenterPlayerTrigger) {
      centerOnPlayer();
    }
  }, [onCenterPlayerTrigger]);

  // Pan / Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((prev) => Math.min(3.5, Math.max(0.7, +(prev + delta).toFixed(2))));
  };

  // Add custom tactical marker on double-click
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const clickX = e.clientX - rect.left - pan.x;
    const clickY = e.clientY - rect.top - pan.y;

    const baseWidth = rect.width * zoom;
    const baseHeight = rect.height * zoom;

    const pctX = Math.max(5, Math.min(95, (clickX / baseWidth) * 100));
    const pctY = Math.max(5, Math.min(95, (clickY / baseHeight) * 100));

    playMarkerPing();
    const newMarker: MapMarker = {
      id: `custom-${Date.now()}`,
      sector: activeSector,
      nameUk: `Точка Скіфа #${Math.floor(Math.random() * 90 + 10)}`,
      nameEn: `Skif Waypoint #${Math.floor(Math.random() * 90 + 10)}`,
      type: 'custom',
      x: Math.round(pctX * 10) / 10,
      y: Math.round(pctY * 10) / 10,
      radiationLevel: +(Math.random() * 2.5 + 0.1).toFixed(2),
      descriptionUk: 'Власноруч встановлена користувацька навігаційна точка.',
      descriptionEn: 'Manually placed custom tactical waypoint.'
    };
    onAddCustomMarker(newMarker);
    setSelectedMarker(newMarker);
  };

  const handleMarkerClick = (m: MapMarker, e: React.MouseEvent) => {
    e.stopPropagation();
    selectMarker(m);
  };

  // Move Skif position to target
  const handleMoveSkifHere = (m: MapMarker) => {
    playDetectorBeep(1800);
    const [geoLat, geoLon] = getMapMarkerCoordinates(m);
    const updatedMarkers = markers.map(item => {
      if (item.id === 'poi-skif') {
        return { ...item, x: m.x, y: m.y, sector: m.sector, geoLat, geoLon };
      }
      return item;
    });
    onUpdateMarkers?.(updatedMarkers);
  };

  // Loot stash
  const handleLootStash = (m: MapMarker) => {
    playUpgradeSound();
    const updatedMarkers = markers.map(item => {
      if (item.id === m.id) {
        return { ...item, isLooted: true };
      }
      return item;
    });
    onUpdateMarkers?.(updatedMarkers);
    setSelectedMarker({ ...m, isLooted: true });
  };

  // Focus on searched location
  const handleSelectSearchResult = (m: MapMarker) => {
    setSearchQuery('');
    setSelectedMarker(m);
    playMarkerPing();
    osmMapRef.current?.setView(getMapMarkerCoordinates(m), 14);
  };

  // Tactical Rangefinder metric calculation
  const tacticalDistance = useMemo(() => {
    const target = rangeTarget || selectedMarker;
    if (!target) return null;
    const [playerLat, playerLon] = getMapMarkerCoordinates(playerMarker);
    const [targetLat, targetLon] = getMapMarkerCoordinates(target);
    const radians = Math.PI / 180;
    const dLat = (targetLat - playerLat) * radians;
    const dLon = (targetLon - playerLon) * radians;
    const lat1 = playerLat * radians;
    const lat2 = targetLat * radians;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const distanceMeters = Math.round(6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    return {
      distanceMeters,
      travelTimeMinutes: Math.max(1, Math.round(distanceMeters / (1.4 * 60)))
    };
  }, [rangeTarget, selectedMarker, playerMarker, activeSector]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#0a0c10] select-none text-[#d0d4da]">
      {/* Top Tactical Map Control Bar */}
      <div className="h-12 border-b border-[#242b36] bg-[#0e1117] flex items-center justify-between px-4 z-30 shrink-0">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-[#ff9d00]" />
          <span className="hidden text-[10px] font-mono font-bold uppercase tracking-wide text-[#c5cdd9] sm:inline">
            {lang === 'uk' ? 'УКРАЇНА // 27 РЕГІОНІВ' : 'UKRAINE // 27 REGIONS'}
          </span>
          <button
            onClick={handleShuffleWorld}
            title={lang === 'uk' ? 'Випадково розмістити аномалії, схованки й завдання' : 'Randomize anomalies, stashes, and quests'}
            className="flex shrink-0 items-center gap-1.5 rounded border border-[#654b22] bg-[#211a10] px-2 py-1 text-[10px] font-mono font-bold text-[#ffbe3b] hover:border-[#ff9d00] hover:bg-[#30220e] cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>{lang === 'uk' ? 'НОВИЙ РОЗКИД' : 'RESHUFFLE'}</span>
          </button>
        </div>

        {/* Search Bar in Zone */}
        <div className="relative flex-1 max-w-xs mx-4 hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#6c7686]" />
            <input
              type="text"
              placeholder={lang === 'uk' ? 'Пошук локацій, ЧАЕС, схованок...' : 'Search POIs, CNPP, stashes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121620] border border-[#2d3545] rounded pl-8 pr-3 py-1 text-xs text-white placeholder-[#5c6576] focus:outline-hidden focus:border-[#ff9d00]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-[#7b8698] hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#121620] border border-[#3b4559] rounded-md shadow-2xl z-50 overflow-hidden divide-y divide-[#1e2533]">
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleSelectSearchResult(res)}
                  className="p-2 hover:bg-[#1a202e] cursor-pointer transition-colors text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white">
                      {lang === 'uk' ? res.nameUk : res.nameEn}
                    </div>
                    <div className="text-[10px] text-[#788395] font-mono">
                      {res.sector} · {res.radiationLevel || 0.1} μSv/h
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#1e2535] text-[#ffbe3b]">
                    {res.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Layer Mode Switchers (Topo / Radiation / Anomalies) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              playPdaClick();
              setMapMode('topo');
            }}
            title={lang === 'uk' ? 'Військова топографія' : 'Military Topography'}
            className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              mapMode === 'topo'
                ? 'bg-[#2a3447] text-white border border-[#485672]'
                : 'text-[#7d8798] hover:text-white hover:bg-[#151922]'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden lg:inline">{lang === 'uk' ? 'Топографія' : 'Topo'}</span>
          </button>

          <button
            onClick={() => {
              playGeigerCrackle();
              setMapMode('radiation');
            }}
            title={lang === 'uk' ? 'Радіаційний фон (Ізолінії)' : 'Radiation Contamination Heatmap'}
            className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              mapMode === 'radiation'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-[#7d8798] hover:text-amber-400 hover:bg-[#151922]'
            }`}
          >
            <Radiation className="w-3 h-3" />
            <span className="hidden lg:inline">{lang === 'uk' ? 'Радіація' : 'Radiation'}</span>
          </button>

          <button
            onClick={() => {
              playPdaClick();
              setMapMode('anomalies');
            }}
            title={lang === 'uk' ? 'Аномальні поля' : 'Anomalous Activity'}
            className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              mapMode === 'anomalies'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'text-[#7d8798] hover:text-purple-400 hover:bg-[#151922]'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span className="hidden lg:inline">{lang === 'uk' ? 'Аномалії' : 'Anomalies'}</span>
          </button>

          {/* Rangefinder Tool Button */}
          <button
            onClick={() => {
              playPdaClick();
              setIsRangefinderActive(!isRangefinderActive);
              if (!isRangefinderActive && selectedMarker) {
                setRangeTarget(selectedMarker);
              }
            }}
            title={lang === 'uk' ? 'Тактичний далекомір' : 'Tactical Rangefinder'}
            className={`p-1.5 rounded transition-colors cursor-pointer ml-1 ${
              isRangefinderActive
                ? 'bg-[#ff9d00] text-black shadow-md'
                : 'text-[#7d8798] hover:text-white hover:bg-[#181d28] border border-[#2b3342]'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Map Surface */}
      <div 
        ref={containerRef}
        onMouseDown={activeSector === 'zhytomyr-osm' ? undefined : handleMouseDown}
        onMouseMove={activeSector === 'zhytomyr-osm' ? undefined : handleMouseMove}
        onMouseUp={activeSector === 'zhytomyr-osm' ? undefined : handleMouseUp}
        onMouseLeave={activeSector === 'zhytomyr-osm' ? undefined : handleMouseUp}
        onWheel={activeSector === 'zhytomyr-osm' ? undefined : handleWheel}
        onDoubleClick={activeSector === 'zhytomyr-osm' ? undefined : handleDoubleClick}
        className="relative flex-1 w-full h-full overflow-hidden bg-[#080a0e] cursor-grab active:cursor-grabbing select-none"
      >
        {activeSector === 'zhytomyr-osm' && (
          <>
            <div ref={osmContainerRef} className="absolute inset-0 z-10" />
            <div className="absolute bottom-3 right-3 z-[500] rounded border border-[#475569] bg-[#0b0f14]/90 px-2.5 py-1.5 text-[10px] font-mono text-[#cbd5e1]">
              {lang === 'uk' ? 'OSM · артефакти й аномалії вигадані для гри' : 'OSM · artifacts and anomalies are fictional game content'}
            </div>
          </>
        )}
        {/* Map Canvas Layer */}
        {activeSector !== 'zhytomyr-osm' && <div
          className="absolute inset-0 origin-center transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            width: '100%',
            height: '100%'
          }}
        >
          {/* SVG Tactical Vector Topography according to Active Sector */}
          <svg 
            viewBox="0 0 1000 700" 
            className="w-full h-full pointer-events-none select-none filter contrast-110"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#18202d" strokeWidth="0.8" />
              </pattern>
              
              <pattern id="diagonal-hazard" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1.5" />
              </pattern>

              {/* Radiation Heatmap Radial Gradients */}
              <radialGradient id="rad-cnpp-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="rad-hospital-basement" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base Background Topographic Field */}
            <rect width="1000" height="700" fill="#0d1117" />
            <rect width="1000" height="700" fill="url(#grid-pattern)" />

            {/* SECTOR 1: CHORNOBYL ZONE MACRO (ЧАЕС, Ставок-охолоджувач, Рудий Ліс) */}
            {activeSector === 'chornobyl-zone' && (
              <g id="sector-chornobyl">
                {/* River Pripyat & Cooling Pond */}
                <path 
                  d="M 100 0 Q 300 120 480 180 T 750 340 T 950 550 L 1000 700 L 850 700 L 600 400 L 350 200 Z" 
                  fill="#0e2336" 
                  stroke="#1b4263" 
                  strokeWidth="2" 
                />
                
                {/* CNPP Giant Artificial Cooling Pond (22 sq km) */}
                <ellipse cx="620" cy="280" rx="140" ry="85" fill="#0b2942" stroke="#255885" strokeWidth="2" />
                <text x="620" y="285" fill="#4281b3" fontSize="12" fontFamily="monospace" textAnchor="middle" opacity="0.7">
                  СТАВОК-ОХОЛОДЖУВАЧ ЧАЕС (22 КМ²)
                </text>

                {/* Red Forest Rust Polygon */}
                <polygon 
                  points="340,180 460,190 480,290 380,310 320,240" 
                  fill="#3d1f14" 
                  stroke="#8f3e23" 
                  strokeWidth="1.5" 
                  opacity="0.85" 
                />
                <text x="390" y="245" fill="#d97757" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  РУДИЙ ЛІС
                </text>

                {/* CNPP Industrial Site Silhouette */}
                <rect x="490" y="165" width="60" height="45" fill="#242c38" stroke="#ff9d00" strokeWidth="1.5" />
                {/* Sarcophagus Arch outline */}
                <path d="M 495 185 Q 520 155 545 185" fill="none" stroke="#ffbe3b" strokeWidth="2.5" />
                <text x="520" y="225" fill="#ffbe3b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  ЧАЕС: БЛОК №4 (НБК)
                </text>

                {/* Railway lines towards Yaniv */}
                <path d="M 0 350 L 440 220 L 510 210 L 1000 390" fill="none" stroke="#505d73" strokeWidth="3" strokeDasharray="6,4" />

                {/* Duga-1 Radar Antenna Line */}
                <line x1="280" y1="460" x2="360" y2="520" stroke="#a0aec0" strokeWidth="4" strokeDasharray="3,3" />
                <text x="320" y="450" fill="#a0aec0" fontSize="10" fontFamily="monospace">ЗГРЛС ДУГА-1</text>
              </g>
            )}

            {/* SECTOR 2: PRIPYAT CITY DETAILED (Детальна мапа вулиць, будинків, парку) */}
            {activeSector === 'pripyat-city' && (
              <g id="sector-pripyat">
                {/* River Port Shoreline */}
                <path d="M 720 0 Q 760 250 820 450 T 920 700 L 1000 700 L 1000 0 Z" fill="#0e2336" stroke="#255885" strokeWidth="2" />
                <text x="820" y="320" fill="#3b729e" fontSize="12" fontFamily="monospace" textAnchor="middle" transform="rotate(75, 820, 320)">
                  РІЧКА ПРИП'ЯТЬ // ПРИСТАНЬ
                </text>

                {/* Main Avenues (Проспект Леніна, вул. Курчатова, Дружби Народів) */}
                {/* Lenin Avenue */}
                <line x1="200" y1="520" x2="680" y2="280" stroke="#333f52" strokeWidth="12" />
                <line x1="200" y1="520" x2="680" y2="280" stroke="#161c26" strokeWidth="10" />
                <text x="360" y="420" fill="#607088" fontSize="10" fontFamily="monospace" transform="rotate(-26, 360, 420)">
                  ПРОСПЕКТ ЛЕНІНА
                </text>

                {/* Kurchatov Street */}
                <line x1="420" y1="150" x2="520" y2="580" stroke="#333f52" strokeWidth="8" />
                <text x="480" y="270" fill="#607088" fontSize="10" fontFamily="monospace" transform="rotate(77, 480, 270)">
                  ВУЛ. КУРЧАТОВА
                </text>

                {/* Druzhby Narodiv Street */}
                <line x1="250" y1="260" x2="620" y2="480" stroke="#2a3545" strokeWidth="6" />

                {/* City Central Plaza & Energetik Palace */}
                <rect x="460" y="295" width="55" height="40" fill="#202733" stroke="#48576e" strokeWidth="1.5" />
                <text x="487" y="320" fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  ПК ЕНЕРГЕТИК
                </text>

                {/* Hotel Polissya L-shape */}
                <path d="M 425 270 L 455 270 L 455 305 L 442 305 L 442 282 L 425 282 Z" fill="#2d3748" stroke="#ff9d00" strokeWidth="1" />
                <text x="438" y="262" fill="#ffbe3b" fontSize="8" fontFamily="monospace">ГОТЕЛЬ ПОЛІССЯ</text>

                {/* Amusement Park & Ferris Wheel Circle */}
                <circle cx="580" cy="295" r="28" fill="none" stroke="#ff9d00" strokeWidth="1.5" strokeDasharray="4,3" />
                <circle cx="580" cy="295" r="4" fill="#ff9d00" />
                {/* Spokes */}
                <line x1="552" y1="295" x2="608" y2="295" stroke="#ff9d00" strokeWidth="1" />
                <line x1="580" y1="267" x2="580" y2="323" stroke="#ff9d00" strokeWidth="1" />
                <text x="580" y="338" fill="#ffbe3b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  КОЛЕСО ОГЛЯДУ
                </text>

                {/* Azure Swimming Pool complex */}
                <rect x="330" y="350" width="40" height="30" fill="#1b2a38" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="350" y="370" fill="#7dd3fc" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  БАСЕЙН ЛАЗУРНИЙ
                </text>

                {/* Hospital 126 complex */}
                <path d="M 620 370 L 670 370 L 670 410 L 650 410 L 650 385 L 620 385 Z" fill="#2d1b1b" stroke="#f87171" strokeWidth="1.5" />
                <text x="645" y="362" fill="#f87171" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  МСЧ №126 (ЛІКАРНЯ)
                </text>

                {/* Jupiter Factory Industrial Blocks */}
                <rect x="180" y="440" width="70" height="50" fill="#1e2430" stroke="#64748b" strokeWidth="1.5" />
                <rect x="220" y="495" width="45" height="35" fill="#1a1f29" stroke="#64748b" strokeWidth="1" />
                <text x="215" y="470" fill="#94a3b8" fontSize="9" fontFamily="monospace">ЗАВОД ЮПІТЕР</text>

                {/* Avangard Stadium track */}
                <ellipse cx="360" cy="210" rx="45" ry="25" fill="none" stroke="#2a3648" strokeWidth="4" />
                <text x="360" y="215" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">СТАДІОН АВАНГАРД</text>
              </g>
            )}

            {/* SECTOR 3: LESSER ZONE (Залісся, Бункер Германа, Макове Поле) */}
            {activeSector === 'lesser-zone' && (
              <g id="sector-lesser">
                {/* Lesser Zone River Uzh branch */}
                <path d="M 380 700 Q 430 500 480 320 T 580 0" fill="none" stroke="#1c3d59" strokeWidth="16" />
                <path d="M 380 700 Q 430 500 480 320 T 580 0" fill="none" stroke="#0e2336" strokeWidth="12" />

                {/* Zalissya Village perimeter */}
                <polygon points="610,290 680,290 690,360 620,370" fill="#18231c" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="3,3" />
                <text x="650" y="330" fill="#86efac" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  СЕЛИЩЕ ЗАЛІССЯ
                </text>

                {/* Professor Hermann Mobile Research Bunker */}
                <rect x="445" y="400" width="40" height="30" rx="6" fill="#1b2a3a" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="465" y="445" fill="#7dd3fc" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  БУНКЕР ГЕРМАНА
                </text>

                {/* Poppy Field Psi Mist contour */}
                <ellipse cx="575" cy="315" rx="55" ry="35" fill="rgba(168, 85, 247, 0.18)" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,2" />
                <text x="575" y="320" fill="#d8b4fe" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  МАКОВЕ ПОЛЕ (ПСІ-ЗОНА)
                </text>

                {/* Boiler Thermal Crater */}
                <circle cx="460" cy="475" r="25" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.2" />
                <text x="460" y="480" fill="#fca5a5" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  КОТЕЛ
                </text>
              </g>
            )}

            {/* LAYER 2: RADIATION HEATMAP OVERLAYS */}
            {mapMode === 'radiation' && (
              <g id="layer-radiation" className="transition-opacity duration-300">
                {activeSector === 'chornobyl-zone' && (
                  <>
                    {/* CNPP Super Critical Core Fallout zone */}
                    <circle cx="520" cy="190" r="140" fill="url(#rad-cnpp-core)" />
                    <circle cx="390" cy="245" r="95" fill="url(#rad-cnpp-core)" />
                    <text x="520" y="160" fill="#fee2e2" fontSize="12" fontFamily="monospace" fontWeight="bold">
                      ⚠ 4,200 μSv/h (ЕКСТРЕМАЛЬНИЙ РІВЕНЬ)
                    </text>
                  </>
                )}

                {activeSector === 'pripyat-city' && (
                  <>
                    {/* Hospital 126 Basement lethal clothing dump */}
                    <circle cx="645" cy="385" r="70" fill="url(#rad-hospital-basement)" />
                    <circle cx="580" cy="295" r="50" fill="url(#rad-hospital-basement)" opacity="0.6" />
                    <text x="645" y="340" fill="#fecaca" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      ⚠ 940 μSv/h (ПІДВАЛ МСЧ-126)
                    </text>
                  </>
                )}

                {activeSector === 'lesser-zone' && (
                  <>
                    <circle cx="575" cy="315" r="60" fill="rgba(245, 158, 11, 0.25)" />
                    <circle cx="460" cy="475" r="45" fill="rgba(239, 68, 68, 0.3)" />
                  </>
                )}
              </g>
            )}

            {/* LAYER 3: ANOMALOUS ACTIVITY OVERLAYS */}
            {mapMode === 'anomalies' && (
              <g id="layer-anomalies">
                <circle cx="575" cy="315" r="30" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="6,4" className="animate-spin" />
                <circle cx="460" cy="475" r="22" fill="none" stroke="#f87171" strokeWidth="2" strokeDasharray="3,3" />
              </g>
            )}

            {/* TACTICAL RANGEFINDER LASER LINE */}
            {isRangefinderActive && (rangeTarget || selectedMarker) && (
              <g id="rangefinder-laser">
                {(() => {
                  const target = rangeTarget || selectedMarker!;
                  return (
                    <>
                      <line 
                        x1={`${playerMarker.x * 10}`} 
                        y1={`${playerMarker.y * 7}`} 
                        x2={`${target.x * 10}`} 
                        y2={`${target.y * 7}`} 
                        stroke="#ff9d00" 
                        strokeWidth="2" 
                        strokeDasharray="6,4" 
                      />
                      <circle cx={`${target.x * 10}`} cy={`${target.y * 7}`} r="8" fill="none" stroke="#ff9d00" strokeWidth="2" className="animate-ping" />
                    </>
                  );
                })()}
              </g>
            )}
          </svg>

          {/* Render Active POI Markers */}
          {visibleMarkers.map((m) => {
            const isPlayer = m.id === 'poi-skif';
            const isSelected = selectedMarker?.id === m.id;

            return (
              <div
                key={m.id}
                onClick={(e) => handleMarkerClick(m, e)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
              >
                {/* Special Player Icon: Green Arrow with radar beacon */}
                {isPlayer ? (
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 animate-ping absolute" />
                    <div className="w-6 h-6 rounded-full bg-emerald-950/90 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_14px_#10b981]">
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-emerald-300 -rotate-45" />
                    </div>
                  </div>
                ) : m.type === 'quest-main' ? (
                  /* Main Quest: Glowing Amber Diamond */
                  <div className="relative flex items-center justify-center">
                    <div className="w-6 h-6 rounded-xs bg-[#ff9d00]/30 animate-pulse absolute" />
                    <div className="w-5 h-5 bg-[#ff9d00] rotate-45 flex items-center justify-center border border-white/60 shadow-[0_0_14px_#ff9d00] hover:scale-125 transition-transform">
                      <span className="-rotate-45 text-black font-extrabold text-[10px]">!</span>
                    </div>
                  </div>
                ) : m.type === 'quest-side' ? (
                  /* Side Quest: White Diamond Target */
                  <div className="w-4 h-4 bg-[#1e232b] rotate-45 flex items-center justify-center border-2 border-[#d0d4da] shadow-md hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 bg-white rounded-full -rotate-45" />
                  </div>
                ) : m.type === 'landmark' ? (
                  /* Strategic Landmark (CNPP, Energetik) */
                  <div className="w-5 h-5 rounded-xs bg-amber-950/90 border border-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)] hover:scale-125 transition-transform">
                    <Radiation className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                ) : m.type === 'anomaly' ? (
                  /* Anomaly Hazard */
                  <div className="w-5 h-5 rounded-full bg-purple-950/90 border border-purple-400 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:scale-125 transition-transform">
                    <AlertTriangle className="w-3 h-3 text-purple-300" />
                  </div>
                ) : m.type === 'safezone' ? (
                  /* Safe Zone Hub */
                  <div className="w-5 h-5 rounded-full bg-blue-950/90 border border-blue-400 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:scale-125 transition-transform">
                    <Shield className="w-3 h-3 text-blue-300" />
                  </div>
                ) : m.type === 'stash' ? (
                  /* Stash */
                  <div className={`w-4 h-4 rounded-xs border flex items-center justify-center hover:scale-125 transition-transform ${
                    m.isLooted 
                      ? 'bg-[#151922] border-[#444f62] text-[#55637a]' 
                      : 'bg-amber-950/90 border-amber-300 text-amber-300'
                  }`}>
                    <Package className="w-2.5 h-2.5" />
                  </div>
                ) : (
                  /* Custom Waypoint */
                  <div className="w-5 h-5 rounded-full bg-[#ff9d00] border-2 border-white flex items-center justify-center shadow-lg hover:scale-125 transition-transform">
                    <MapPin className="w-3 h-3 text-black" />
                  </div>
                )}

                {/* Marker Label tooltip on hover or select */}
                {(isSelected || isPlayer) && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 bg-[#0c1017]/95 border border-[#3b475c] rounded text-[11px] font-sans font-medium text-white whitespace-nowrap shadow-2xl pointer-events-none z-30 flex items-center gap-1.5">
                    <span>{lang === 'uk' ? m.nameUk : m.nameEn}</span>
                    {m.radiationLevel && (
                      <span className="text-[10px] font-mono text-[#ffbe3b] font-bold">
                        · {m.radiationLevel} μSv/h
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>}

        {/* Top-Left Tactical Heading & Geo-Coords */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-3 bg-[#0d1017]/90 backdrop-blur-xs border border-[#2a3445] rounded px-3 py-1.5 text-xs font-mono text-[#c5cdd9] shadow-xl">
          <Compass className="w-4 h-4 text-[#ff9d00]" />
          <span>SE 142°</span>
          <span className="text-[#455062]">|</span>
          <span className="text-[#9ba4b5]">
            {`LAT ${mapCenter[0].toFixed(4)} // LON ${mapCenter[1].toFixed(4)}`}
          </span>
          <span className="text-[#455062]">|</span>
          <span className="text-emerald-400 font-bold">GPS LOCK (Z-OS)</span>
        </div>

        {/* Left Zoom Gauge Controls */}
        <div className="absolute left-3 top-16 z-20 flex flex-col items-center gap-1 bg-[#0d1017]/90 backdrop-blur-xs border border-[#2a3445] rounded p-1 shadow-xl">
          <button
            onClick={() => {
              playPdaClick();
              osmMapRef.current?.zoomIn();
            }}
            title={lang === 'uk' ? 'Збільшити масштаб (+)' : 'Zoom in (+)'}
            className="w-7 h-7 flex items-center justify-center text-[#c5cdd9] hover:text-[#ff9d00] hover:bg-[#1a212e] rounded cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="text-[10px] font-mono text-[#ff9d00] font-bold py-1">
            x{zoom.toFixed(1)}
          </div>

          <button
            onClick={() => {
              playPdaClick();
              osmMapRef.current?.zoomOut();
            }}
            title={lang === 'uk' ? 'Зменшити масштаб (-)' : 'Zoom out (-)'}
            className="w-7 h-7 flex items-center justify-center text-[#c5cdd9] hover:text-[#ff9d00] hover:bg-[#1a212e] rounded cursor-pointer transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-full h-px bg-[#2a3445] my-0.5" />

          <button
            onClick={centerOnPlayer}
            title={lang === 'uk' ? 'Сфокусувати на Скіфі (V)' : 'Center on Skif (V)'}
            className="w-7 h-7 flex items-center justify-center text-[#c5cdd9] hover:text-[#ff9d00] hover:bg-[#1a212e] rounded cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tactical Rangefinder Overlay Banner (when measuring distance) */}
        {tacticalDistance && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-[#121620]/95 border border-[#ff9d00] rounded-md px-4 py-1.5 shadow-2xl flex items-center gap-3 text-xs font-mono text-white animate-in fade-in duration-150">
            <Ruler className="w-4 h-4 text-[#ff9d00]" />
            <span>
              {lang === 'uk' ? 'ВІДСТАНЬ:' : 'DISTANCE:'}{' '}
              <strong className="text-[#ffbe3b]">{tacticalDistance.distanceMeters} м</strong>
            </span>
            <span className="text-[#566378]">·</span>
            <span>
              {lang === 'uk' ? 'ПРИБЛ. ЧАС:' : 'EST. TIME:'}{' '}
              <strong className="text-white">{tacticalDistance.travelTimeMinutes} {lang === 'uk' ? 'хв' : 'min'}</strong>
            </span>
            <span className="text-[#566378]">·</span>
            <span className="text-emerald-400">АЗИМУТ 054°</span>
          </div>
        )}

        {/* Bottom Left: Live Dosimeter Reading */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 bg-[#0d1017]/95 border border-[#2b3547] rounded px-3 py-1.5 shadow-xl text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Radiation className="w-4 h-4 text-amber-400" />
            <span className="text-[#8894a8]">{lang === 'uk' ? 'РАДІАЦІЯ:' : 'RAD:'}</span>
            <span className={`font-bold ${
              currentRadiation > 500 ? 'text-red-500 animate-pulse' : currentRadiation > 20 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {currentRadiation.toFixed(2)} μSv/h
            </span>
          </div>
          <div className="w-24 h-2 bg-[#1b2230] rounded-full overflow-hidden border border-[#303c50]">
            <div 
              className={`h-full transition-all duration-300 ${
                currentRadiation > 500 ? 'bg-red-500' : currentRadiation > 20 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, (currentRadiation / 100) * 100))}%` }}
            />
          </div>
        </div>

        {/* Selected Marker Detail Card (Top-Right Tactical Intel Dossier) */}
        {selectedMarker && (
          <div className="absolute top-3 right-3 z-20 w-80 bg-[#0f131a]/95 backdrop-blur-md border border-[#3b475c] rounded-lg p-4 shadow-2xl text-xs">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#242d3d]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff9d00] font-bold mb-0.5 flex items-center gap-1.5">
                  <span>{selectedMarker.type.toUpperCase()}</span>
                  {selectedMarker.sector && (
                    <span className="text-[#727e91]">· {selectedMarker.regionUk ? (lang === 'uk' ? selectedMarker.regionUk : selectedMarker.regionEn) : selectedMarker.sector}</span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-white">
                  {lang === 'uk' ? selectedMarker.nameUk : selectedMarker.nameEn}
                </h4>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-[#788292] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Faction & Radiation Badges */}
            <div className="flex items-center gap-2 mb-3">
              {selectedMarker.faction && (
                <span className="px-2 py-0.5 rounded bg-[#1c2433] border border-[#364259] text-[10px] font-mono text-[#cbd5e1]">
                  {selectedMarker.faction}
                </span>
              )}
              {selectedMarker.radiationLevel !== undefined && (
                <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-600/50 text-[10px] font-mono text-amber-300 font-bold">
                  {selectedMarker.radiationLevel} μSv/h
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#aab3c2] text-xs leading-relaxed mb-3">
              {lang === 'uk' ? selectedMarker.descriptionUk : selectedMarker.descriptionEn}
            </p>

            {/* Hazard Alert */}
            {selectedMarker.hazard && (
              <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded bg-purple-950/40 border border-purple-800/60 text-purple-300 text-[11px]">
                <Flame className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {lang === 'uk' 
                    ? `Аномальна небезпека: ${selectedMarker.hazard}` 
                    : `Anomalous hazard: ${selectedMarker.hazard}`}
                </span>
              </div>
            )}

            {/* Stash Contents & Loot Button */}
            {selectedMarker.loot && selectedMarker.loot.length > 0 && (
              <div className="mb-3 p-2.5 rounded bg-[#161c26] border border-[#2b3545]">
                <div className="text-[10px] font-mono uppercase text-[#ffbe3b] font-bold mb-1 flex items-center justify-between">
                  <span>{lang === 'uk' ? 'Вміст схованки:' : 'Stash Contents:'}</span>
                  {selectedMarker.isLooted && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {lang === 'uk' ? 'Забрано' : 'Looted'}
                    </span>
                  )}
                </div>
                <div className="space-y-1 mb-2">
                  {selectedMarker.loot.map((item, idx) => (
                    <div key={idx} className="text-[11px] text-[#cbd5e1] font-mono flex items-center gap-1.5">
                      <Package className="w-3 h-3 text-[#ff9d00]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {!selectedMarker.isLooted && (
                  <button
                    onClick={() => handleLootStash(selectedMarker)}
                    className="w-full py-1.5 rounded bg-[#ff9d00] hover:bg-[#ffbe3b] text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    {lang === 'uk' ? 'Забрати хабар' : 'Take Loot'}
                  </button>
                )}
              </div>
            )}

            {/* Tactical Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#242d3d]">
              {selectedMarker.id !== 'poi-skif' && (
                <button
                  onClick={() => handleMoveSkifHere(selectedMarker)}
                  className="flex-1 py-1.5 rounded bg-[#1a2332] hover:bg-[#232f44] border border-[#3b4b66] text-[#cbd5e1] hover:text-white text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3 h-3 text-[#ff9d00]" />
                  <span>{lang === 'uk' ? 'Перемістити Скіфа' : 'Move Skif Here'}</span>
                </button>
              )}

              {/* Delete custom marker option */}
              {selectedMarker.id.startsWith('custom-') && (
                <button
                  onClick={() => {
                    playPdaClick();
                    onRemoveCustomMarker(selectedMarker.id);
                    setSelectedMarker(null);
                  }}
                  className="py-1.5 px-3 rounded bg-red-950/60 border border-red-800 text-red-200 hover:bg-red-900 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {lang === 'uk' ? 'Видалити' : 'Remove'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Legend Drawer Toggle & Overlay (Hotkey L) */}
        {isLegendOpen && (
          <div className="absolute bottom-3 right-3 z-20 w-64 bg-[#0e1219]/95 backdrop-blur-md border border-[#364257] rounded-lg p-3 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#242d3d]">
              <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-[11px]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff9d00]" />
                <span>{lang === 'uk' ? 'Легенда мапи' : 'Map Legend'}</span>
              </div>
              <button
                onClick={onToggleLegend}
                className="text-[#788292] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between text-[#c4cbd6] hover:text-white cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#ff9d00] rotate-45 inline-block" />
                  <span>{lang === 'uk' ? 'Завдання (Квести)' : 'Missions'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={filters.quests}
                  onChange={() => setFilters(f => ({ ...f, quests: !f.quests }))}
                  className="accent-[#ff9d00]"
                />
              </label>

              <label className="flex items-center justify-between text-[#c4cbd6] hover:text-white cursor-pointer">
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lang === 'uk' ? 'Безпечні зони' : 'Safe Zones'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={filters.safezones}
                  onChange={() => setFilters(f => ({ ...f, safezones: !f.safezones }))}
                  className="accent-[#ff9d00]"
                />
              </label>

              <label className="flex items-center justify-between text-[#c4cbd6] hover:text-white cursor-pointer">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'uk' ? 'Аномальні поля' : 'Anomalies'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={filters.anomalies}
                  onChange={() => setFilters(f => ({ ...f, anomalies: !f.anomalies }))}
                  className="accent-[#ff9d00]"
                />
              </label>

              <label className="flex items-center justify-between text-[#c4cbd6] hover:text-white cursor-pointer">
                <span className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'uk' ? 'Схованки' : 'Stashes'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={filters.stashes}
                  onChange={() => setFilters(f => ({ ...f, stashes: !f.stashes }))}
                  className="accent-[#ff9d00]"
                />
              </label>

              <label className="flex items-center justify-between text-[#c4cbd6] hover:text-white cursor-pointer">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'uk' ? 'Торговці та техніки' : 'Traders & Techs'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={filters.traders}
                  onChange={() => setFilters(f => ({ ...f, traders: !f.traders }))}
                  className="accent-[#ff9d00]"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
