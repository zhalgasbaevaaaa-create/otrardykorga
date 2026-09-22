import React, { useState } from 'react';
import { MapPOI, GameState } from '../types';
import { MAP_POIS, SCOUT_ROUTES } from '../data/mapData';
import { soundManager } from '../utils/sound';
import { GAME_IMAGES } from '../assets/images';
import { 
  Shield, 
  Castle, 
  MapPin, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  X, 
  Flame,
  Layers,
  Droplets,
  Scroll
} from 'lucide-react';

interface InteractiveMapProps {
  gameState: GameState;
  activeSector?: string;
  selectableRoutes?: boolean;
  selectedRouteId?: string | null;
  onSelectRoute?: (routeId: string) => void;
  highlightPoiId?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  gameState,
  selectableRoutes = false,
  selectedRouteId = null,
  onSelectRoute,
  highlightPoiId
}) => {
  const [selectedPoi, setSelectedPoi] = useState<MapPOI | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<'oasis' | 'inner_city' | 'parchment'>('oasis');

  const handlePoiClick = (poi: MapPOI) => {
    soundManager.playClick();
    setSelectedPoi(poi);
  };

  const handleZoom = (delta: number) => {
    soundManager.playClick();
    setZoomLevel(prev => Math.min(Math.max(0.85, prev + delta), 1.6));
  };

  const resetZoom = () => {
    soundManager.playClick();
    setZoomLevel(1);
  };

  // Mongol siege proximity based on defense and stage
  const siegeOffset = Math.max(0, (100 - gameState.defense) * 1.5);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-[#8c6b3e]/60 bg-[#1f1912] shadow-2xl">
      {/* Map Control Toolbar */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 rounded-xl border border-[#b38848]/40 bg-[#16120e]/85 p-1.5 backdrop-blur-md">
        <button
          onClick={() => handleZoom(0.2)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#ecd7b0] transition hover:bg-[#b38848]/30 active:scale-95"
          title="Үлкейту"
          aria-label="Үлкейту"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#ecd7b0] transition hover:bg-[#b38848]/30 active:scale-95"
          title="Кішірейту"
          aria-label="Кішірейту"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={resetZoom}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#ecd7b0] transition hover:bg-[#b38848]/30 active:scale-95"
          title="Бастапқы күйге қайтару"
          aria-label="Бастапқы күйге қайтару"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition active:scale-95 ${
            showLegend ? 'bg-[#b38848] text-[#1a140d]' : 'text-[#ecd7b0] hover:bg-[#b38848]/30'
          }`}
          title="Карта шартты белгілері"
          aria-label="Карта шартты белгілері"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* Map Header Status Indicator & View Switchers */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-[#b38848]/40 bg-[#16120e]/90 px-3 py-1.5 text-xs text-[#ecd7b0] backdrop-blur-md shadow-lg">
          <Compass className="h-4 w-4 text-[#d97706] animate-spin" style={{ animationDuration: '18s' }} />
          <span className="font-semibold tracking-wide uppercase hidden sm:inline">Отырар • 1219–1220 жж.</span>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center rounded-xl border border-[#b38848]/40 bg-[#16120e]/90 p-1 backdrop-blur-md shadow-lg text-xs">
          <button
            onClick={() => {
              soundManager.playClick();
              setMapMode('oasis');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition font-medium ${
              mapMode === 'oasis' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Оазис шебі</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setMapMode('inner_city');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition font-medium ${
              mapMode === 'inner_city' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <Droplets className="h-3.5 w-3.5 text-sky-400" />
            <span>Ішкі қала және кәріз</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setMapMode('parchment');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition font-medium ${
              mapMode === 'parchment' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <Scroll className="h-3.5 w-3.5 text-amber-300" />
            <span>Антикварлық пергамент</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: PARCHMENT CARTOGRAPHY */}
      {mapMode === 'parchment' && (
        <div className="relative w-full overflow-hidden bg-[#1a130b] flex items-center justify-center p-2 min-h-[380px] sm:min-h-[440px]">
          <div className="relative max-w-full overflow-hidden rounded-xl border border-amber-900/60 shadow-2xl">
            <img
              src={GAME_IMAGES.mapAntique}
              alt="Отырар оазисінің көне картасы"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[500px] object-cover rounded-lg filter sepia-[0.15] contrast-105"
            />
            {/* Interactive POI Hotspots on Antique Map */}
            <div 
              onClick={() => handlePoiClick(MAP_POIS[0])}
              className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 bg-[#1a140d]/90 border border-amber-500/80 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-200 shadow-xl group-hover:scale-110 transition">
                <Castle className="h-3.5 w-3.5 text-amber-400" />
                <span>Отырар Цитаделі</span>
              </div>
            </div>

            <div 
              onClick={() => handlePoiClick(MAP_POIS[2])}
              className="absolute top-[35%] left-[30%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="flex items-center gap-1 bg-[#1a140d]/85 border border-sky-600/80 px-2 py-0.5 rounded-full text-[10px] text-sky-200 shadow group-hover:scale-110 transition">
                <Droplets className="h-3 w-3 text-sky-400" />
                <span>Сырдария (Сейхун)</span>
              </div>
            </div>

            <div 
              onClick={() => handlePoiClick(MAP_POIS[MAP_POIS.length - 1])}
              className="absolute top-[65%] left-[82%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="flex items-center gap-1 bg-red-950/90 border border-red-500/80 px-2 py-0.5 rounded-full text-[10px] text-red-200 shadow group-hover:scale-110 transition">
                <Flame className="h-3 w-3 text-red-400 animate-pulse" />
                <span>Моңғол шебі (40 000)</span>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 bg-black/75 px-3 py-1.5 rounded-lg border border-amber-800 text-[11px] text-stone-300 backdrop-blur-md">
              📜 <span className="font-semibold text-amber-300">Тарихи пергамент:</span> XIII ғ. картографиялық үлгіде жасалған тактикалық карта
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: INNER CITY ARCHITECTURAL & KYARIZ WATER SCHEMATIC */}
      {mapMode === 'inner_city' && (
        <div 
          className="w-full transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg 
            viewBox="0 0 1000 650" 
            className="w-full h-auto select-none bg-[#17120a]"
            style={{ minHeight: '380px' }}
          >
            <defs>
              <linearGradient id="innerCitadelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
              <linearGradient id="kyarizWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>

            {/* City Outer Moat (Қорғаныс оры) */}
            <rect width="1000" height="650" fill="#17120a" />
            <path d="M 0,0 L 1000,0 L 1000,650 L 0,650 Z" fill="#140f08" />

            {/* Outer Moat with water */}
            <circle cx="500" cy="325" r="290" fill="#241a10" stroke="#0369a1" strokeWidth="12" strokeDasharray="16 8" opacity="0.75" />
            <text x="500" y="45" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              ҚАЛА АЙНАЛАСЫНДАҒЫ СУЛЫ ОР ЖӘНЕ ШЕПТЕР
            </text>

            {/* Rabad (Outer craft district wall) */}
            <polygon 
              points="500,65 740,145 800,325 740,505 500,585 260,505 200,325 260,145" 
              fill="#2e2114" 
              stroke="#b45309" 
              strokeWidth="5" 
            />
            <text x="260" y="240" fill="#ca8a04" fontSize="11" fontWeight="bold">РАБАД (Қолөнер кварталы)</text>

            {/* Shahristan (Central residential & market district wall) */}
            <polygon 
              points="500,145 680,215 720,325 680,435 500,505 320,435 280,325 320,215" 
              fill="#422f1c" 
              stroke="#d97706" 
              strokeWidth="4" 
            />
            <text x="340" y="290" fill="#fef08a" fontSize="11" fontWeight="bold">ШАХРИСТАН (Орталық)</text>

            {/* SUBTERRANEAN KYARIZ WATER NETWORK (Кәріз жүйесі) */}
            <g id="kyariz-system">
              {/* Main supply pipe from Arys (South-East) */}
              <path 
                d="M 850,560 Q 680,480 500,380" 
                fill="none" 
                stroke="url(#kyarizWaterGrad)" 
                strokeWidth="7" 
                strokeDasharray="10 6"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-60" dur="4s" repeatCount="indefinite" />
              </path>
              <text x="750" y="525" fill="#7dd3fc" fontSize="10" fontWeight="bold">Арыстан келетін кәріз құбыры</text>

              {/* Branch to Citadel Reservoir */}
              <path 
                d="M 500,380 L 500,325" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="6" 
                strokeDasharray="8 4"
              />

              {/* Branch to Shahristan Bath & Granary */}
              <path 
                d="M 500,380 Q 420,360 380,330" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="5" 
                strokeDasharray="6 4"
              />

              {/* Inspection Wells (Кәріз құдықтары) */}
              <circle cx="680" cy="480" r="11" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" className="cursor-pointer" onClick={() => handlePoiClick(MAP_POIS[3])} />
              <text x="680" y="475" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle">Құдық 1</text>
              
              <circle cx="500" cy="380" r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" className="cursor-pointer" onClick={() => handlePoiClick(MAP_POIS[3])} />
              <text x="500" y="375" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle">Бас торап</text>

              <circle cx="380" cy="330" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => handlePoiClick(MAP_POIS[3])} />
              <text x="380" y="325" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle">Құдық 2</text>
            </g>

            {/* POTTERY & WEAPONS QUARTERS («Отырар оты» шеберханалары) */}
            <g 
              transform="translate(620, 240)" 
              className="cursor-pointer group" 
              onClick={() => handlePoiClick(MAP_POIS[4])}
            >
              <rect x="-35" y="-25" width="70" height="50" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="-8" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">ҚЫШ ЖӘНЕ ОТ</text>
              <text x="0" y="8" fill="#fb923c" fontSize="8" textAnchor="middle">«Отырар оты» пештері</text>
              <circle cx="0" cy="18" r="4" fill="#ef4444">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* GRANARY & BREAD OVENS (Астық қоймасы) */}
            <g 
              transform="translate(380, 230)" 
              className="cursor-pointer group" 
              onClick={() => handlePoiClick(MAP_POIS[5])}
            >
              <rect x="-30" y="-22" width="60" height="44" rx="4" fill="#5c3d1e" stroke="#eab308" strokeWidth="2" />
              <text x="0" y="-5" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">АСТЫҚ ҚОЙМАСЫ</text>
              <text x="0" y="10" fill="#cbd5e1" fontSize="8" textAnchor="middle">Жерасты қамбалары</text>
            </g>

            {/* CENTRAL CITADEL (Қайыр хан ордасы) */}
            <g 
              transform="translate(500, 325)" 
              className="cursor-pointer" 
              onClick={() => handlePoiClick(MAP_POIS[0])}
            >
              <rect 
                x="-55" 
                y="-55" 
                width="110" 
                height="110" 
                rx="6" 
                fill="url(#innerCitadelGrad)" 
                stroke="#fef08a" 
                strokeWidth="4" 
              />
              <circle cx="-55" cy="-55" r="11" fill="#713f12" stroke="#fde047" strokeWidth="2" />
              <circle cx="55" cy="-55" r="11" fill="#713f12" stroke="#fde047" strokeWidth="2" />
              <circle cx="-55" cy="55" r="11" fill="#713f12" stroke="#fde047" strokeWidth="2" />
              <circle cx="55" cy="55" r="11" fill="#713f12" stroke="#fde047" strokeWidth="2" />

              <text x="0" y="-12" fill="#451a03" fontSize="13" fontWeight="900" textAnchor="middle">ЦИИТАДЕЛЬ</text>
              <text x="0" y="6" fill="#78350f" fontSize="9" fontWeight="bold" textAnchor="middle">ҚАЙЫР ХАН ОРДАСЫ</text>
              <circle cx="0" cy="24" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
              <text x="0" y="27" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">СУ</text>
            </g>

            {/* GATES */}
            {/* North Gate - Sopykhana */}
            <g transform="translate(500, 65)" className="cursor-pointer" onClick={() => handlePoiClick(MAP_POIS[6])}>
              <rect x="-30" y="-14" width="60" height="28" rx="3" fill="#1c1917" stroke="#ef4444" strokeWidth="2.5" />
              <text x="0" y="4" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">Сопыхана қақпасы</text>
            </g>

            {/* South Gate - Darwaza */}
            <g transform="translate(500, 585)" className="cursor-pointer" onClick={() => handlePoiClick(MAP_POIS[7])}>
              <rect x="-30" y="-14" width="60" height="28" rx="3" fill="#1c1917" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="0" y="4" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">Бас Дәруаза қақпасы</text>
            </g>
          </svg>
        </div>
      )}

      {/* VIEW MODE 3: STANDARD STRATEGIC OASIS MAP */}
      {mapMode === 'oasis' && (
      <div 
        className="w-full transition-transform duration-300 ease-out origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg 
          viewBox="0 0 1000 650" 
          className="w-full h-auto select-none"
          style={{ minHeight: '380px' }}
        >
          <defs>
            {/* Steppe parchment ground pattern */}
            <radialGradient id="steppeGlow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#41311f" />
              <stop offset="60%" stopColor="#2c2114" />
              <stop offset="100%" stopColor="#1a130b" />
            </radialGradient>

            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25516b" />
              <stop offset="50%" stopColor="#3d7291" />
              <stop offset="100%" stopColor="#1e3f54" />
            </linearGradient>

            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#aa834f" />
              <stop offset="100%" stopColor="#674b29" />
            </linearGradient>

            <linearGradient id="citadelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2b46b" />
              <stop offset="100%" stopColor="#875c2a" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.7" />
            </filter>

            <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Steppe Ground */}
          <rect width="1000" height="650" fill="url(#steppeGlow)" />

          {/* Steppe Sand Dunes / Topography lines */}
          <path d="M 0,180 Q 250,220 500,160 T 1000,210" fill="none" stroke="#54402a" strokeWidth="1.5" opacity="0.35" />
          <path d="M 0,380 Q 300,430 600,360 T 1000,410" fill="none" stroke="#54402a" strokeWidth="1.5" opacity="0.35" />
          <path d="M 0,550 Q 400,500 700,570 T 1000,520" fill="none" stroke="#54402a" strokeWidth="1.5" opacity="0.3" />

          {/* Syr Darya River */}
          <path 
            d="M 60,0 C 80,120 180,240 140,360 C 100,480 180,560 150,650" 
            fill="none" 
            stroke="url(#riverGrad)" 
            strokeWidth="38" 
            strokeLinecap="round"
            filter="url(#shadowFilter)"
          />
          {/* River Water Ripple Highlights */}
          <path 
            d="M 60,0 C 80,120 180,240 140,360 C 100,480 180,560 150,650" 
            fill="none" 
            stroke="#6db2d9" 
            strokeWidth="4" 
            strokeDasharray="18 14"
            opacity="0.55"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="100" dur="8s" repeatCount="indefinite" />
          </path>
          <text x="75" y="320" fill="#a5d8f7" fontSize="13" fontWeight="bold" opacity="0.8" transform="rotate(-78, 75, 320)">
            С Ы Р Д А Р И Я (С Е Й Х У Н)
          </text>

          {/* Arys River tributary */}
          <path 
            d="M 140,360 Q 280,390 420,440 T 700,580" 
            fill="none" 
            stroke="url(#riverGrad)" 
            strokeWidth="18" 
            strokeLinecap="round"
            opacity="0.85"
          />
          <text x="280" y="420" fill="#a5d8f7" fontSize="11" opacity="0.75" transform="rotate(16, 280, 420)">
            Арыс өзені
          </text>

          {/* Silk Road Caravan Route */}
          <path 
            d="M 980,110 C 800,160 680,240 500,290 C 350,330 250,340 140,350" 
            fill="none" 
            stroke="#d4a359" 
            strokeWidth="3.5" 
            strokeDasharray="9 7" 
            opacity="0.7"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-80" dur="10s" repeatCount="indefinite" />
          </path>
          <text x="760" y="145" fill="#f0ca8b" fontSize="12" fontWeight="600" opacity="0.9" transform="rotate(-12, 760, 145)">
            Ж І Б Е К   Ж О Л Ы
          </text>

          {/* Animated Silk Road Camel Caravan */}
          <g>
            <animateMotion 
              path="M 980,110 C 800,160 680,240 500,290 C 350,330 250,340 140,350" 
              dur="24s" 
              repeatCount="indefinite"
            />
            <circle cx="0" cy="0" r="7" fill="#facc15" stroke="#713f12" strokeWidth="2" />
            <text x="-4" y="4" fontSize="10">🐫</text>
          </g>

          {/* OTRAR CITY GROUNDS (Outer moats and ramparts) */}
          <g transform="translate(500, 325)" filter="url(#shadowFilter)">
            {/* Outer Moat (Қаланың айналасындағы ор) */}
            <circle r="185" fill="#2d2216" stroke="#48331d" strokeWidth="6" strokeDasharray="14 8" />
            
            {/* Outer Wall (Рабад пен Шахристан қабырғасы) */}
            <polygon 
              points="0,-150 110,-110 150,0 110,110 0,150 -110,110 -150,0 -110,-110" 
              fill="url(#wallGrad)" 
              stroke="#e2b46b" 
              strokeWidth="4" 
            />

            {/* City interior quarters / Shakhristan houses */}
            <g opacity="0.65" fill="#4a3520" stroke="#7c5832" strokeWidth="1">
              {/* Residential clusters */}
              <rect x="-95" y="-75" width="28" height="22" rx="2" />
              <rect x="-60" y="-85" width="22" height="26" rx="2" />
              <rect x="-95" y="40" width="30" height="25" rx="2" />
              <rect x="-55" y="55" width="24" height="22" rx="2" />
              <rect x="50" y="-80" width="30" height="24" rx="2" />
              <rect x="75" y="-50" width="22" height="25" rx="2" />
              <rect x="65" y="45" width="28" height="24" rx="2" />
              <rect x="35" y="65" width="25" height="20" rx="2" />
            </g>

            {/* Central Market & Mosque */}
            <rect x="-24" y="-30" width="48" height="25" rx="3" fill="#634526" stroke="#c99742" strokeWidth="1.5" />
            <text x="0" y="-14" fill="#fae8b4" fontSize="8" fontWeight="bold" textAnchor="middle">БАЙ БАЗАР</text>

            {/* Granary & Water Reservoir (Кәріз құдықтары) */}
            <circle cx="-35" cy="18" r="9" fill="#1e3a4c" stroke="#5fa6d1" strokeWidth="1.5" />
            <text x="-35" y="21" fill="#cbe6f7" fontSize="7" textAnchor="middle">СУ</text>

            <rect x="18" y="10" width="20" height="15" rx="2" fill="#714e21" stroke="#f59e0b" strokeWidth="1" />
            <text x="28" y="21" fill="#fde68a" fontSize="7" textAnchor="middle">АЗЫҚ</text>

            {/* Inner Citadel (ЦИТАДЕЛЬ - Қайыр хан ордасы) */}
            <g id="citadel-center" className="cursor-pointer" onClick={() => handlePoiClick(MAP_POIS[0])}>
              <rect 
                x="-42" 
                y="-42" 
                width="84" 
                height="84" 
                rx="6" 
                fill="url(#citadelGrad)" 
                stroke="#ffd166" 
                strokeWidth="3.5" 
                filter="url(#glowGold)"
              />
              {/* Citadel Corner Turrets */}
              <circle cx="-42" cy="-42" r="9" fill="#9e6e2f" stroke="#ffd166" strokeWidth="2" />
              <circle cx="42" cy="-42" r="9" fill="#9e6e2f" stroke="#ffd166" strokeWidth="2" />
              <circle cx="-42" cy="42" r="9" fill="#9e6e2f" stroke="#ffd166" strokeWidth="2" />
              <circle cx="42" cy="42" r="9" fill="#9e6e2f" stroke="#ffd166" strokeWidth="2" />

              {/* Central Khan Banner */}
              <g transform="translate(0, -6)">
                <path d="M 0,0 L 0,-24" stroke="#eab308" strokeWidth="2.5" />
                <path d="M 0,-24 L 18,-18 L 0,-12 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="0" cy="0" r="14" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
                <text x="0" y="4" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">ҚАМАЛ</text>
              </g>
            </g>

            {/* Four City Gates of Otrar */}
            {/* 1. North Gate - Sopykhana */}
            <g 
              transform="translate(0, -150)" 
              className="cursor-pointer group"
              onClick={() => handlePoiClick(MAP_POIS[0])}
            >
              <rect x="-24" y="-12" width="48" height="24" rx="3" fill="#2d1f11" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="-24" cy="0" r="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="24" cy="0" r="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="0" y="-18" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">1. Солтүстік (Сопыхана) қақпасы</text>
              <text x="0" y="4" fill="#fae8b4" fontSize="8" fontWeight="bold" textAnchor="middle">ҚАҚПА</text>
            </g>

            {/* 2. South Gate - Berdibek */}
            <g 
              transform="translate(0, 150)" 
              className="cursor-pointer group"
              onClick={() => handlePoiClick(MAP_POIS[1])}
            >
              <rect x="-24" y="-12" width="48" height="24" rx="3" fill="#2d1f11" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="-24" cy="0" r="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="24" cy="0" r="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="0" y="28" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">2. Оңтүстік (Бердібек) қақпасы</text>
              <text x="0" y="4" fill="#fae8b4" fontSize="8" fontWeight="bold" textAnchor="middle">ҚАҚПА</text>
            </g>

            {/* 3. East Gate - Zhibek / Bazar */}
            <g 
              transform="translate(150, 0)" 
              className="cursor-pointer group"
              onClick={() => handlePoiClick(MAP_POIS[2])}
            >
              <rect x="-12" y="-24" width="24" height="48" rx="3" fill="#2d1f11" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="0" cy="-24" r="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="0" cy="24" r="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="22" y="4" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="start">3. Шығыс (Жібек) қақпасы</text>
            </g>

            {/* 4. West Gate - Syrdarya / Water */}
            <g 
              transform="translate(-150, 0)" 
              className="cursor-pointer group"
              onClick={() => handlePoiClick(MAP_POIS[3])}
            >
              <rect x="-12" y="-24" width="24" height="48" rx="3" fill="#2d1f11" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="0" cy="-24" r="7" fill="#0369a1" stroke="#7dd3fc" strokeWidth="1.5" />
              <circle cx="0" cy="24" r="7" fill="#0369a1" stroke="#7dd3fc" strokeWidth="1.5" />
              <text x="-22" y="4" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end">4. Батыс (Сырдария) қақпасы</text>
            </g>
          </g>

          {/* GEOGRAPHICAL LANDSCAPE: TWO SIDES MOUNTAINS, ONE SIDE RIVER, ONE SIDE FLAT PLAINS */}
          {/* 1. North Mountain Ridge (Таулы өлке) */}
          <g id="north-mountains" opacity="0.9">
            <polygon points="180,0 260,110 340,30 420,95 500,10 580,90 660,25 740,110 820,0" fill="#292015" stroke="#54402a" strokeWidth="2" />
            <polygon points="260,110 310,50 340,30 380,70 420,95" fill="#382b1d" />
            <polygon points="500,10 540,60 580,90 620,45 660,25" fill="#382b1d" />
            <text x="500" y="32" fill="#d6ba8b" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="2">
              ▲ СОЛТҮСТІК ТАУ ЖОТАЛАРЫ (ТАБИҒИ ШЕП) ▲
            </text>
          </g>

          {/* 2. East Mountain Range - Karatau (Шығыс Қаратау сілемі) */}
          <g id="east-mountains" opacity="0.95">
            <polygon points="1000,120 890,190 940,270 870,340 950,420 880,500 1000,560" fill="#2d2217" stroke="#6b5338" strokeWidth="2.5" />
            <polygon points="890,190 925,230 940,270" fill="#443424" />
            <polygon points="870,340 915,380 950,420" fill="#443424" />
            <polygon points="880,500 930,520 1000,560" fill="#443424" />
            <text x="940" y="340" fill="#ebd2a9" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(90, 940, 340)">
              ▲ ШЫҒЫС ҚАРАТАУ СІЛЕМІ (ТАУЛЫ БЕЛДЕУ) ▲
            </text>
          </g>

          {/* 3. South Flat Plains (Оңтүстік жазық даласы) */}
          <g id="south-plains" opacity="0.85">
            <path d="M 150,600 Q 500,560 850,600 L 1000,650 L 0,650 Z" fill="#221910" stroke="#48331d" strokeWidth="1.5" />
            <path d="M 250,620 Q 500,590 750,620" fill="none" stroke="#715433" strokeWidth="2" strokeDasharray="8 6" />
            <text x="500" y="635" fill="#fde68a" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="3">
              ════ ОҢТҮСТІК ОТЫРАР ЖАЗЫҚ ДАЛАСЫ (КЕҢ КӨКЖИЕК) ════
            </text>
          </g>

          {/* SCOUT ROUTES (Visible during Stage 2 or if selectableRoutes is active) */}
          {selectableRoutes && (
            <g id="scout-routes-layer">
              {SCOUT_ROUTES.map((route) => {
                const isSelected = selectedRouteId === route.id;
                return (
                  <g 
                    key={route.id} 
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => {
                      if (onSelectRoute) {
                        soundManager.playClick();
                        onSelectRoute(route.id);
                      }
                    }}
                  >
                    {/* Background glow path */}
                    <path
                      d={route.pathD}
                      fill="none"
                      stroke={isSelected ? '#38bdf8' : '#eab308'}
                      strokeWidth={isSelected ? '8' : '5'}
                      strokeLinecap="round"
                      strokeDasharray="12 8"
                      opacity={isSelected ? 0.95 : 0.65}
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="4s" repeatCount="indefinite" />
                    </path>

                    {/* Interactive Marker at Scout Pos */}
                    <g transform={`translate(${route.markerPos.x * 10}, ${route.markerPos.y * 6.5})`}>
                      <circle 
                        r="18" 
                        fill={isSelected ? '#0284c7' : '#854d0e'} 
                        stroke="#fef08a" 
                        strokeWidth="2.5" 
                      />
                      <text x="0" y="5" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                        {route.id === 'route_east' ? 'A' : route.id === 'route_south' ? 'B' : route.id === 'route_transoxiana' ? 'C' : 'D'}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* Interactive POI Hotspots */}
          {MAP_POIS.map((poi) => {
            const isHighlighted = highlightPoiId === poi.id;
            return (
              <g 
                key={poi.id} 
                transform={`translate(${poi.x * 10}, ${poi.y * 6.5})`}
                className="cursor-pointer group"
                onClick={() => handlePoiClick(poi)}
              >
                {/* Pulsing ring */}
                <circle 
                  r={isHighlighted ? '22' : '16'} 
                  fill="none" 
                  stroke={isHighlighted ? '#ef4444' : '#eab308'} 
                  strokeWidth="2" 
                  opacity="0.75"
                >
                  <animate attributeName="r" values="14;24;14" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
                </circle>

                {/* Inner marker icon disc */}
                <circle 
                  r="12" 
                  fill={isHighlighted ? '#dc2626' : '#92400e'} 
                  stroke="#fef08a" 
                  strokeWidth="2" 
                  className="transition-transform group-hover:scale-125"
                />

                {/* Icon symbol */}
                {poi.type === 'fortress' ? (
                  <path d="M -5,-5 L 5,-5 L 5,5 L -5,5 Z" fill="#fef08a" />
                ) : poi.type === 'camp' ? (
                  <path d="M 0,-6 L 6,5 L -6,5 Z" fill="#fca5a5" />
                ) : poi.type === 'river' ? (
                  <circle r="4" fill="#7dd3fc" />
                ) : (
                  <circle r="3.5" fill="#fef08a" />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      )}

      {/* Map Legend Drawer */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-30 max-w-xs rounded-xl border border-[#b38848]/60 bg-[#16120e]/95 p-3.5 text-xs text-[#ebd5b3] shadow-xl backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between border-b border-[#b38848]/30 pb-1.5">
            <span className="font-bold text-[#f59e0b]">Шартты белгілер</span>
            <button 
              onClick={() => setShowLegend(false)}
              className="text-[#9ca3af] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#facc15] border border-black inline-block"></span>
              <span>Отырардың 4 қақпасы мен цитаделі</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#d97706] border border-black inline-block"></span>
              <span>Тау сілемдері (Солтүстік және Шығыс Қаратау)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-5 rounded bg-[#38bdf8] inline-block"></span>
              <span>Сырдария өзені (Батыс су шебі)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-5 border-t-2 border-dashed border-[#f59e0b] inline-block"></span>
              <span>Оңтүстік жазық даласы мен шұраты</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected POI Detail Modal / Card */}
      {selectedPoi && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-[#b38848] bg-[#1a140d] p-5 text-[#f5ebd8] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedPoi(null)}
              className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#2d2114] text-[#d4af37] transition hover:bg-[#3d2f1d]"
              aria-label="Жабу"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b38848]/20 text-[#f59e0b] border border-[#b38848]/40">
                {selectedPoi.type === 'fortress' ? <Castle className="h-5 w-5" /> :
                 selectedPoi.type === 'camp' ? <Flame className="h-5 w-5 text-red-500" /> :
                 selectedPoi.type === 'gate' ? <Shield className="h-5 w-5" /> :
                 <MapPin className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-bold text-[#fae8b4] text-base">{selectedPoi.name}</h4>
                <span className="text-[11px] text-[#b38848] uppercase tracking-wider font-semibold">Тарихи орын • 1219 жыл</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#d6c7b0] mb-4">
              {selectedPoi.description}
            </p>
            <div className="rounded-xl border border-[#b38848]/30 bg-[#251c12] p-3 text-xs text-[#c9b79b]">
              <span className="font-semibold text-[#f59e0b]">Қолбасшы жазбасы:</span> Бұл нүкте қала қорғанысының маңызды бекініс торабы саналады. Әрбір шешім осы шептердің беріктігіне әсер етеді.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
