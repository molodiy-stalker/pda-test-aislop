import { Quest, NoteItem, WeaponGearItem, TutorialTopic, MapMarker } from '../types/pda';

export const INITIAL_MAP_MARKERS: MapMarker[] = [
  // --- CHORNOBYL ZONE MACRO OVERVIEW ---
  {
    id: 'poi-cnpp-sarcophagus',
    sector: 'chornobyl-zone',
    nameUk: 'ЧАЕС: 4-й Енергоблок (Саркофаг & Арка НБК)',
    nameEn: 'CNPP: Reactor #4 (Sarcophagus & NSC Arch)',
    type: 'landmark',
    x: 52,
    y: 28,
    radiationLevel: 4200, // μSv/h
    hazard: 'radiation',
    faction: 'Моноліт',
    geoLat: 51.3896,
    geoLon: 30.0991,
    descriptionUk: 'Епіцентр Зони Відчуження. 4-й енергоблок під Новим Безпечним Конфайнментом. Контролюється фанатиками угруповання «Моноліт». Рівень гамма-випромінювання критичний.',
    descriptionEn: 'The epicenter of the Exclusion Zone. Reactor #4 beneath the New Safe Confinement arch. Heavily fortified by Monolith fanatics. Lethal gamma radiation levels.'
  },
  {
    id: 'poi-pripyat-entrance',
    sector: 'chornobyl-zone',
    nameUk: 'Місто-привид Прип\'ять (Південний в\'їзд)',
    nameEn: 'Ghost City Pripyat (Southern Entry)',
    type: 'quest-main',
    x: 48,
    y: 19,
    radiationLevel: 180,
    faction: 'Одинаки / Моноліт',
    geoLat: 51.4055,
    geoLon: 30.0558,
    descriptionUk: 'Місто енергетиків, залишене у квітні 1986 року. Густа рослинність, гнізда мутантів, патрулі снайперів «Моноліту» на дахах багатоповерхівок.',
    descriptionEn: 'Abandoned atomic city evacuated in 1986. Overgrown avenues, mutant nests, and Monolith sniper posts on high-rise rooftops.'
  },
  {
    id: 'poi-red-forest',
    sector: 'chornobyl-zone',
    nameUk: 'Рудий Ліс',
    nameEn: 'The Red Forest',
    type: 'anomaly',
    x: 42,
    y: 33,
    hazard: 'radiation',
    radiationLevel: 1250,
    faction: 'Мутанти (Химери, Псевдогіганти)',
    geoLat: 51.3842,
    geoLon: 30.0617,
    descriptionUk: 'Дерева поглинули найважчий викид радіоактивного пилу. Листя набуло іржаво-рудого забарвлення. Земля всіяна аномаліями «Трамплін» та скупченнями радіонуклідів.',
    descriptionEn: 'Trees absorbed catastrophic fallout doses, turning rusted copper-red. Soil saturated with gravitational anomalies and deadly radiation pockets.'
  },
  {
    id: 'poi-duga-radar',
    sector: 'chornobyl-zone',
    nameUk: 'ЗГРЛС «Дуга-1» (Чорнобиль-2)',
    nameEn: 'Duga Over-the-Horizon Radar (Chornobyl-2)',
    type: 'landmark',
    x: 32,
    y: 52,
    hazard: 'psi',
    radiationLevel: 45,
    faction: 'Військові сталкери / «Іскра»',
    geoLat: 51.3056,
    geoLon: 30.0658,
    descriptionUk: 'Гігантська загоризонтна радіолокаційна антена «Російський Дятел». Таємний військовий центр зв\'язку та експериментів з псі-випромінюванням.',
    descriptionEn: 'Massive Soviet over-the-horizon radar installation, the "Russian Woodpecker". Secret military bunker complex with residual psi-signals.'
  },
  {
    id: 'poi-yaniv-station',
    sector: 'chornobyl-zone',
    nameUk: 'Залізнична станція «Янів»',
    nameEn: 'Yaniv Railway Station',
    type: 'safezone',
    x: 44,
    y: 24,
    radiationLevel: 0.28,
    faction: 'Вільні сталкери & «Воля» (Нейтралітет)',
    geoLat: 51.3933,
    geoLon: 30.0528,
    descriptionUk: 'Головний перевалочний хаб на півночі Зони. Перемир\'я між «Волею» та «Довгом». Торговці, ремонтні майстерні та кімнати відпочинку для сталкерів.',
    descriptionEn: 'Key northern frontier safehouse. Neutral zone shared by Free Stalkers and Freedom. Bar, gunsmiths, and radiation-shielded bunkrooms.'
  },
  {
    id: 'poi-cooling-pond',
    sector: 'chornobyl-zone',
    nameUk: 'Ставок-охолоджувач ЧАЕС',
    nameEn: 'CNPP Cooling Pond',
    type: 'anomaly',
    x: 62,
    y: 35,
    hazard: 'chemical',
    radiationLevel: 850,
    faction: 'Мутанти (Здичавілі соми-мутанти)',
    geoLat: 51.3911,
    geoLon: 30.1388,
    descriptionUk: 'Штучна водойма площею 22 кв. км для охолодження турбін. Мулисте дно зберігає гігантську концентрацію цезію-137 та стронцію-90.',
    descriptionEn: 'Giant 22 sq km artificial cooling reservoir. Sediment is heavily contaminated with Cesium-137 and populated by oversized mutated catfish.'
  },
  {
    id: 'poi-cooling-towers',
    sector: 'chornobyl-zone',
    nameUk: 'Градирні 5 та 6 Енергоблоків',
    nameEn: 'Unfinished Cooling Towers #5 & #6',
    type: 'landmark',
    x: 66,
    y: 42,
    radiationLevel: 210,
    hazard: 'gravitational',
    faction: 'Найманці',
    geoLat: 51.3789,
    geoLon: 30.1489,
    descriptionUk: 'Величезні бетонні вежі охолодження, будівництво яких було зупинено у 1986. Всередині утворилися потужні вихори аномалій «Карусель».',
    descriptionEn: 'Colossal concrete hyperbolic cooling towers abandoned mid-construction. Echoing interiors harbor violent vortex anomalies.'
  },
  {
    id: 'poi-kopachi-mound',
    sector: 'chornobyl-zone',
    nameUk: 'Село Копачі (Закопані хати)',
    nameEn: 'Kopachi Village (Buried Settlement)',
    type: 'stash',
    x: 48,
    y: 43,
    radiationLevel: 310,
    faction: 'Зомбовані сталкери',
    geoLat: 51.3653,
    geoLon: 30.1089,
    descriptionUk: 'Село зрівняне з землею бульдозерами через надвисоке радіоактивне забруднення. Вцілів лише дитячий садок із моторошними розкиданими іграшками.',
    descriptionEn: 'Bulldozed and buried radioactive hamlet. Only the brick kindergarten remains standing among radiation hazard warning mounds.'
  },

  // --- PRIPYAT CITY DETAILED (pripyat-city) ---
  {
    id: 'poi-prp-energetik',
    sector: 'pripyat-city',
    nameUk: 'ПК «Енергетик» (Центральна площа)',
    nameEn: 'Palace of Culture "Energetik"',
    type: 'landmark',
    x: 48,
    y: 45,
    radiationLevel: 1.4,
    faction: '«Моноліт» (Снайперська засідка)',
    geoLat: 51.4069,
    geoLon: 30.0556,
    descriptionUk: 'Серце Прип\'яті: палац культури з концертним залом, боксерським рингом та басейном. Сходи та парапет під постійним прицілом снайперів.',
    descriptionEn: 'The heart of Pripyat: central plaza, auditorium, gymnasium. Rooftop stairs are watched by entrenched Monolith marksmen.'
  },
  {
    id: 'poi-prp-ferris-wheel',
    sector: 'pripyat-city',
    nameUk: 'Колесо огляду (Парк атракціонів)',
    nameEn: 'Pripyat Ferris Wheel & Amusement Park',
    type: 'anomaly',
    x: 58,
    y: 42,
    hazard: 'radiation',
    radiationLevel: 98,
    faction: 'Нейтрально',
    geoLat: 51.4081,
    geoLon: 30.0559,
    descriptionUk: 'Жовте колесо огляду, яке так і не встигли офіційно відкрити на 1 травня 1986. Мохові плями під кабінками дають високий гамма-фон.',
    descriptionEn: 'Iconic yellow Ferris wheel that was never officially opened. Heavy radiocesium moss mats underneath emit sharp gamma spikes.'
  },
  {
    id: 'poi-prp-hotel-polissya',
    sector: 'pripyat-city',
    nameUk: 'Готель «Полісся»',
    nameEn: 'Hotel Polissya',
    type: 'quest-main',
    x: 44,
    y: 41,
    radiationLevel: 2.1,
    faction: 'Військові розвідники',
    geoLat: 51.4072,
    geoLon: 30.0544,
    descriptionUk: 'Шестиповерховий готель з панорамним рестораном на даху, звідки керували операцією з гасіння палаючого графіту 4-го реактора.',
    descriptionEn: 'Six-story hotel used as military command post in 1986 to direct rooftop helicopter water drop missions onto the burning graphite core.'
  },
  {
    id: 'poi-prp-azure-pool',
    sector: 'pripyat-city',
    nameUk: 'Басейн «Лазурний»',
    nameEn: 'Azure Swimming Pool',
    type: 'safezone',
    x: 35,
    y: 52,
    radiationLevel: 0.45,
    faction: 'Вільні сталкери (Таємний прихисток)',
    geoLat: 51.4078,
    geoLon: 30.0489,
    descriptionUk: 'Спортивний комплекс, який ліквідатори продовжували використовувати аж до 1998 року. Сухий кахельний басейн обладнаний як спальник та вогнище.',
    descriptionEn: 'Sports arena operated by Chernobyl liquidators until 1998. The deep tiled diving well serves as a fortified bivouac and campfire safehouse.'
  },
  {
    id: 'poi-prp-hospital-126',
    sector: 'pripyat-city',
    nameUk: 'МСЧ №126 (Міська лікарня & Підвал)',
    nameEn: 'Medical Sanitary Unit #126 (Hospital)',
    type: 'anomaly',
    x: 64,
    y: 55,
    hazard: 'radiation',
    radiationLevel: 940, // Extreme in basement
    faction: 'Бюрожасті мутанти (Кровососи)',
    geoLat: 51.4039,
    geoLon: 30.0633,
    descriptionUk: 'Сюди доставляли перших обпалених пожежників ВПЧ-2. У підвалі досі лежить їхня бойова амуніція — радіаційний фон перевищує норму у десятки тисяч разів!',
    descriptionEn: 'Where the first responding firefighters of Station #2 were admitted. Their turnout suits abandoned in the basement still emanate lethal millisievert readings.'
  },
  {
    id: 'poi-prp-jupiter-factory',
    sector: 'pripyat-city',
    nameUk: 'Завод «Юпітер» (Секретна лабораторія)',
    nameEn: 'Jupiter Industrial Plant & Secret Labs',
    type: 'quest-side',
    x: 22,
    y: 68,
    hazard: 'chemical',
    radiationLevel: 32,
    faction: 'Найманці / Вчені',
    geoLat: 51.4022,
    geoLon: 30.0356,
    descriptionUk: 'Офіційно випускав магнітофони, неофіційно — військову напівпровідникову електроніку. Підземні тунелі ведуть до секретних сховищ МАЗІС.',
    descriptionEn: 'Covert military semiconductor facility disguised as a tape recorder factory. Extensive subterranean bunker network.'
  },
  {
    id: 'poi-prp-river-port',
    sector: 'pripyat-city',
    nameUk: 'Річковий вокзал та дебаркадер',
    nameEn: 'Pripyat River Port & Cafe',
    type: 'stash',
    x: 75,
    y: 38,
    radiationLevel: 4.8,
    faction: 'Одинаки',
    geoLat: 51.4111,
    geoLon: 30.0689,
    descriptionUk: 'Причал на річці Прип\'ять з вітражним кафе. Натоплена баржа біля берега містить схованку з рідкісним артефактом «Граві».',
    descriptionEn: 'Riverboat pier with stained-glass cafe pavilion. Half-sunken barge holds a waterproof stash with rare Gravi artifact.'
  },

  // --- LESSER ZONE (lesser-zone) ---
  {
    id: 'poi-skif',
    sector: 'lesser-zone',
    nameUk: 'Скіф (Ваше положення)',
    nameEn: 'Skif (Your Position)',
    type: 'custom',
    x: 50,
    y: 52,
    radiationLevel: 0.14,
    geoLat: 51.2721,
    geoLon: 30.2219,
    descriptionUk: 'Поточне положення Скіфа в Малій Зоні. Сигнал КПК стабільний.',
    descriptionEn: 'Current GPS beacon of Skif in the Lesser Zone. Signal clear and synchronized.'
  },
  {
    id: 'poi-main-quest',
    sector: 'lesser-zone',
    nameUk: 'Точка сканування №2',
    nameEn: 'Scanning Point #2',
    type: 'quest-main',
    x: 48.8,
    y: 49.5,
    radiationLevel: 0.85,
    geoLat: 51.2735,
    geoLon: 30.2245,
    descriptionUk: 'Активне завдання: встановити та активувати сканер Германа для відкалібрування аномальних коливань.',
    descriptionEn: 'Active mission: deploy and activate Hermann\'s scanner to gauge anomalous resonance.'
  },
  {
    id: 'poi-quest-side-1',
    sector: 'lesser-zone',
    nameUk: 'Бункер професора Германа',
    nameEn: 'Professor Hermann\'s Mobile Bunker',
    type: 'quest-side',
    x: 46.8,
    y: 60.5,
    radiationLevel: 0.12,
    faction: 'Вчені МАЗІС',
    geoLat: 51.2680,
    geoLon: 30.2150,
    descriptionUk: 'Мобільна лабораторія МАЗІС з гермошлюзом. Вчені вивчають властивості аномалій та скуповують зразки артефактів.',
    descriptionEn: 'Reinforced mobile scientific laboratory with blast airlocks. Hermann analyzes fresh anomaly cores and purchases artifacts.'
  },
  {
    id: 'poi-quest-side-2',
    sector: 'lesser-zone',
    nameUk: 'Стара церква біля річки',
    nameEn: 'Old Church by the River',
    type: 'quest-side',
    x: 43.5,
    y: 63.8,
    radiationLevel: 0.22,
    geoLat: 51.2640,
    geoLon: 30.2090,
    descriptionUk: 'Дерев\'яна церква XVII століття. Сталкери використовують дзвіницю як спостережний пункт.',
    descriptionEn: 'Wooden 17th-century parish church. Bell tower serves as scout sniper overlook.'
  },
  {
    id: 'poi-anomaly-poppy',
    sector: 'lesser-zone',
    nameUk: 'Макове поле (Псі-аномалія)',
    nameEn: 'Poppy Field (Psi Anomaly)',
    type: 'anomaly',
    x: 57.5,
    y: 45.2,
    hazard: 'psi',
    radiationLevel: 12.4,
    geoLat: 51.2780,
    geoLon: 30.2310,
    descriptionUk: 'Смертельна сонливість та псі-випромінювання. Без захисного шолома чи енергетиків сталкер засинає назавжди.',
    descriptionEn: 'Lethal hypnotic drowsiness and psi-haze. Stalkers fall into permanent coma without psych-blockers or energy drinks.'
  },
  {
    id: 'poi-anomaly-boiler',
    sector: 'lesser-zone',
    nameUk: 'Аномалія «Котел»',
    nameEn: 'Boiler Thermal Anomaly',
    type: 'anomaly',
    x: 46.0,
    y: 68.0,
    hazard: 'burner',
    radiationLevel: 8.5,
    geoLat: 51.2610,
    geoLon: 30.2180,
    descriptionUk: 'Термічна активність, викиди розжареної пари та стовпів полум\'я. Можливий спавн цінного артефакта «Полум\'я».',
    descriptionEn: 'Superheated steam vents and geyser flame eruptions. High chance of Flame artifact crystallization.'
  },
  {
    id: 'poi-safezone-zalissya',
    sector: 'lesser-zone',
    nameUk: 'Селище Залісся (Головний хаб)',
    nameEn: 'Zalissya Settlement (Main Hub)',
    type: 'safezone',
    x: 64.0,
    y: 45.5,
    radiationLevel: 0.16,
    faction: 'Вільні сталкери',
    geoLat: 51.2770,
    geoLon: 30.2450,
    descriptionUk: 'Головна база вільних сталкерів у Малій Зоні. Бар, технік Льоха Староста, торговець Хом\'як, медик.',
    descriptionEn: 'Primary settlement of Free Stalkers in the Lesser Zone. Tavern, armorer Lyokha Starosta, trader Hamster.'
  },
  {
    id: 'poi-trader-hamster',
    sector: 'lesser-zone',
    nameUk: 'Торговець Хом\'як',
    nameEn: 'Trader Hamster',
    type: 'trader',
    x: 64.5,
    y: 46.2,
    radiationLevel: 0.15,
    faction: 'Вільні сталкери',
    descriptionUk: 'Купує хабар, артефакти та зброю. Продає патрони, медицину та детекторы аномалій.',
    descriptionEn: 'Purchases zone salvage, artifacts and guns. Stocks ammunition, military rations and detectors.'
  },
  {
    id: 'poi-tech-lyokha',
    sector: 'lesser-zone',
    nameUk: 'Технік Льоха Староста',
    nameEn: 'Technician Lyokha Starosta',
    type: 'technician',
    x: 63.8,
    y: 44.8,
    radiationLevel: 0.15,
    faction: 'Вільні сталкери',
    descriptionUk: 'Модифікація та ремонт зброї, броні, встановлення тактичних планок та глушників.',
    descriptionEn: 'Custom gunsmithing, barrel rifling, armor kevlar plating and tactical scopes.'
  },
  {
    id: 'poi-stash-under-bridge',
    sector: 'lesser-zone',
    nameUk: 'Схованка під трубою',
    nameEn: 'Stash Under Drain Pipe',
    type: 'stash',
    x: 42.0,
    y: 69.5,
    radiationLevel: 0.4,
    loot: ['Аптечка АІ-2', 'Бинт армійський', 'Набої 9x18 мм (30 шт.)'],
    descriptionUk: 'Герметичний ящик заховано у бетонній дренажній трубі. Всередині аптечка та боєкомплект.',
    descriptionEn: 'Waterproof metal lockbox tucked inside concrete drainage culvert with meds and 9mm rounds.'
  },

  // --- ZHYTOMYR OPENSTREETMAP SECTOR (zhytomyr-osm) ---
  {
    id: 'poi-zhytomyr-park-bridge',
    sector: 'zhytomyr-osm',
    nameUk: 'Підвісний міст через Тетерів (Парк ім. Гагаріна)',
    nameEn: 'Suspension Bridge over Teteriv (Gagarin Park)',
    type: 'anomaly',
    hazard: 'gravitational',
    x: 52,
    y: 62,
    radiationLevel: 0.22,
    geoLat: 50.2443,
    geoLon: 28.6657,
    faction: 'Вільні сталкери',
    loot: ['Артефакт «Граві»', 'Артефакт «Вогонь»', 'Енергетик Non-Stop (2 шт.)'],
    descriptionUk: 'Один із найвищих підвісних мостів в Україні (висота 43 м). Над каньйоном утворилася гравітаційна аномалія «Гравіконцентрат». Сталкери виявили на скелях рідкісний артефакт «Граві» та вогняні кристали.',
    descriptionEn: 'One of Ukraine\'s highest pedestrian suspension bridges (43m). A violent gravitational vortex anomaly formed across the canyon. Rare Gravi and Fire artifacts spotted on cliff edges.'
  },
  {
    id: 'poi-zhytomyr-chatsky-rock',
    sector: 'zhytomyr-osm',
    nameUk: 'Скеля «Голова Чацького» (Каньйон Тетерева)',
    nameEn: 'Chatsky Head Rock (Teteriv Canyon)',
    type: 'stash',
    x: 44,
    y: 65,
    radiationLevel: 0.16,
    geoLat: 50.2425,
    geoLon: 28.6475,
    faction: 'Вільні сталкери',
    loot: ['Артефакт «Нічна зірка»', 'Патрони 5.45x39 мм (60 шт.)', 'Армійська фляга'],
    descriptionUk: 'Геологічна пам\'ятка гранітного каньйону над водосховищем. У розколині скелі заховано герметичний сталкерський тайник із легендарним артефактом «Нічна зірка».',
    descriptionEn: 'Granite canyon cliff landmark above reservoir. A waterproof stalker stash hidden inside rock fissure holds the prized Night Star artifact and 5.45mm rifle ammo.'
  },
  {
    id: 'poi-zhytomyr-electrovymiriuvach',
    sector: 'zhytomyr-osm',
    nameUk: 'Завод «Електровимірювач» (Закинутий цех №3)',
    nameEn: 'Electrovymiriuvach Plant (Abandoned Workshop #3)',
    type: 'anomaly',
    hazard: 'chemical',
    x: 60,
    y: 48,
    radiationLevel: 1.85,
    geoLat: 50.2514,
    geoLon: 28.6798,
    faction: 'Найманці',
    loot: ['Артефакт «Батарейка»', 'Наукова аптечка', 'Фільтр протигаза ГП-7'],
    descriptionUk: 'Історичне підприємство авіаційної та космічної вимірювальної апаратури. У знеструмлених цехах утворилося гніздо аномалій «Електра», що живлять артефакт «Батарейка». Підвищений радіаційний фон!',
    descriptionEn: 'Industrial aerospace instrumentation factory. Abandoned assembly halls crackle with violent Electro anomaly arcs feeding the Battery artifact.'
  },
  {
    id: 'poi-zhytomyr-space-museum',
    sector: 'zhytomyr-osm',
    nameUk: 'Музей космонавтики ім. С.П. Корольова (МАЗІС)',
    nameEn: 'Korolyov Cosmonautics Museum (MAZIS Lab)',
    type: 'quest-main',
    x: 62,
    y: 45,
    radiationLevel: 0.12,
    geoLat: 50.2529,
    geoLon: 28.6835,
    faction: 'Вчені МАЗІС',
    loot: ['Артефакт «Компас»', 'Сканер аномальних полів МАЗІС'],
    descriptionUk: 'Унікальний музей ракетобудування з автентичними спускними капсулами «Союз». Переобладнаний у польову дослідницьку лабораторію вчених. Тут вивчають просторовий артефакт «Компас».',
    descriptionEn: 'World-renowned space exploration museum with real Soyuz landing capsules. Fortified into a mobile scientific lab studying the hyperspatial Compass artifact.'
  },
  {
    id: 'poi-zhytomyr-sokoliv-quarry',
    sector: 'zhytomyr-osm',
    nameUk: 'Соколівський кар\'єр (Гранітний розлом)',
    nameEn: 'Sokoliv Granite Quarry (Deep Rift)',
    type: 'anomaly',
    hazard: 'burner',
    x: 38,
    y: 20,
    radiationLevel: 4.2,
    geoLat: 50.2785,
    geoLon: 28.6322,
    faction: 'Мутанти (Снорки)',
    loot: ['Артефакт «Око»', 'Граната Ф-1 (2 шт.)', 'Комбінезон «Світанок»'],
    descriptionUk: 'Затоплений гранітний кар\'єр глибиною понад 100 метрів. На дні розлому б\'ють термальні гейзери аномалії «Жаровня». На скелястих уступах знайдено палаючий артефакт «Око».',
    descriptionEn: 'Massive 100m-deep flooded granite quarry. Thermal geysers boil at bottom crevices with active Burner anomalies and the glowing Eye artifact.'
  },
  {
    id: 'poi-zhytomyr-center-hub',
    sector: 'zhytomyr-osm',
    nameUk: 'Майдан Соборний (База «Полісся»)',
    nameEn: 'Sobornyi Square (Polissya Stalker Hub)',
    type: 'safezone',
    x: 50,
    y: 42,
    radiationLevel: 0.14,
    geoLat: 50.2547,
    geoLon: 28.6587,
    faction: 'Вільні сталкери',
    descriptionUk: 'Центральний опорний пункт вільних сталкерів у Житомирі. Бар «У Стовбура», технік по зброї, обмін хабаря на купони та патрони.',
    descriptionEn: 'Central free stalkers outpost in Zhytomyr. Tavern, weapon repair bench, artifact trader, and secure rest bunkers.'
  },
  {
    id: 'poi-zhytomyr-railway-station',
    sector: 'zhytomyr-osm',
    nameUk: 'Житомирський залізничний вокзал',
    nameEn: 'Zhytomyr Railway Junction',
    type: 'trader',
    x: 65,
    y: 32,
    radiationLevel: 0.18,
    geoLat: 50.2642,
    geoLon: 28.6925,
    faction: 'Провідники Зони',
    descriptionUk: 'Залізнична станція сполучення Житомир — Коростень — Овруч — ЧАЕС. Тут чергують досвідчені провідники, які проводять через Периметр.',
    descriptionEn: 'Rail terminal linking Zhytomyr to northern routes towards Chornobyl. Veteran guides offer safe passage through military cordons.'
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-skif',
  callsign: 'Скіф',
  faction: 'loner',
  rank: 'veteran',
  reputation: 920,
  coupons: 14850,
  avatar: 'skif',
  idNumber: 'Z-UKR-2024-8841',
  radiationDose: 0.14,
  registeredAt: '2024-11-10',
  isLoggedIn: true
};

export const DEFAULT_RADIATION_ALARM: RadiationAlarmSettings = {
  enabled: true,
  threshold: 1.5,
  soundEnabled: true
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-test-stalker',
    titleUk: 'Таємний контракт Скіфа (Тестовий квест)',
    titleEn: "Skif's Secret Contract (Test Mission)",
    category: 'main',
    regionUk: 'Мала Зона',
    regionEn: 'Lesser Zone',
    isCompleted: false,
    isTracking: false,
    status: 'available',
    isTestQuest: true,
    soundUrls: {
      accept: 'RhJJBkXckVc',
      accomplish: '2cXK4q-9GKg',
      fail: 'zHkUeLFo-jU'
    },
    descriptionUk: "Експериментальний розвідувальний контракт для перевірки каналів оповіщення та бойових частот КПК Скіфа. Прийняття, виконання та провал цього завдання супроводжуються оригінальними звуковими ефектами S.T.A.L.K.E.R. 2: Heart of Chornobyl з YouTube:\n\n• Прийняття завдання: https://youtu.be/RhJJBkXckVc\n• Виконання завдання: https://youtu.be/2cXK4q-9GKg\n• Провал завдання: https://youtu.be/zHkUeLFo-jU",
    descriptionEn: "Experimental reconnaissance contract to test the alert and comms channels of Skif's PDA. Accepting, accomplishing, or failing this mission triggers authentic S.T.A.L.K.E.R. 2: Heart of Chornobyl sound effects from YouTube:\n\n• Mission Accepted: https://youtu.be/RhJJBkXckVc\n• Mission Accomplished: https://youtu.be/2cXK4q-9GKg\n• Mission Failed: https://youtu.be/zHkUeLFo-jU",
    objectives: [
      {
        id: 'obj-t-1',
        textUk: 'Знайти зашифровану схованку біля аномалії',
        textEn: 'Locate encrypted stash near the anomaly',
        completed: false,
        isCurrent: true
      },
      {
        id: 'obj-t-2',
        textUk: 'Активувати польовий радіомаяк',
        textEn: 'Activate field radio beacon',
        completed: false
      },
      {
        id: 'obj-t-3',
        textUk: 'Доповісти про результати до Залісся',
        textEn: 'Report findings back to Zalissya',
        completed: false
      }
    ]
  },
  {
    id: 'quest-there-and-back-again',
    titleUk: 'Туди й назад',
    titleEn: 'There and Back Again',
    category: 'main',
    regionUk: 'Мала Зона',
    regionEn: 'Lesser Zone',
    isCompleted: false,
    isTracking: true,
    status: 'active',
    descriptionUk: 'Здається, це чесна угода: Герман отримує мій особливий камінь, а я — новий дім і надію на нове життя. Все, що мені потрібно зробити, це перетнути Периметр і успішно активувати Сканер. Цей всезнайко наполягає, що це єдиний спосіб відновити аномальні властивості мого згаслого артефакта. Я просто сподіваюся, що цей невеликий експеримент не затягнеться надовго, попри всі ці байки про Зону.',
    descriptionEn: 'Seems like a fair trade-off: Hermann gets my special stone, and I get a new home and hope for a new life. All I have to do is cross the Perimeter and successfully activate the Scanner. That know-it-all insists it\'s the only way to restore the anomalous properties of my faded artifact. I\'m just hoping this little experiment won\'t drag on too long, regardless of the tall tales going around about this Zone.',
    objectives: [
      {
        id: 'obj-1',
        textUk: 'Почати сканування в точці №2',
        textEn: 'Start scanning at point #2',
        completed: false,
        isCurrent: true
      },
      {
        id: 'obj-2',
        textUk: 'Взяти Сканер',
        textEn: 'Take the Scanner',
        completed: true
      },
      {
        id: 'obj-3',
        textUk: 'Дочекатися завершення сканування',
        textEn: 'Wait for the Scanner to finish scanning',
        completed: true
      },
      {
        id: 'obj-4',
        textUk: 'Залишити зону сканування',
        textEn: 'Leave the scanning area',
        completed: true
      },
      {
        id: 'obj-5',
        textUk: 'Почати сканування в точці №1',
        textEn: 'Start scanning at point #1',
        completed: true
      },
      {
        id: 'obj-6',
        textUk: 'Екіпірувати артефакт (Необов\'язково)',
        textEn: 'Equip the artifact (Optional)',
        completed: true,
        optional: true
      },
      {
        id: 'obj-7',
        textUk: 'Знайти артефакт в аномальному полі',
        textEn: 'Find the artifact in the anomalous field',
        completed: true
      },
      {
        id: 'obj-8',
        textUk: 'Перетнути Периметр',
        textEn: 'Cross the Perimeter',
        completed: true
      },
      {
        id: 'obj-9',
        textUk: 'Отримати інформацію про точки сканування',
        textEn: 'Get information about the scanning points',
        completed: true
      }
    ]
  },
  {
    id: 'quest-needle-in-haystack',
    titleUk: 'Голка в копиці сіна',
    titleEn: 'A Needle in a Haystack',
    category: 'main',
    regionUk: 'Мала Зона',
    regionEn: 'Lesser Zone',
    isCompleted: false,
    isTracking: false,
    descriptionUk: 'Невідомий нападник забрав сканер і залишив мене помирати. Потрібно знайти будь-які зачіпки в селищі Залісся і дізнатися, хто стоїть за цією засідкою.',
    descriptionEn: 'The unknown attacker took the scanner and left me to die. I need to find any leads in Zalissya settlement and find out who was behind the ambush.',
    objectives: [
      {
        id: 'obj-needle-1',
        textUk: 'Дістатися селища Залісся',
        textEn: 'Reach the settlement of Zalissya',
        completed: false,
        isCurrent: true
      },
      {
        id: 'obj-needle-2',
        textUk: 'Поговорити з барменом у «Шепоті»',
        textEn: 'Talk to the bartender at Whisper',
        completed: false
      }
    ]
  },
  {
    id: 'quest-price-of-hope',
    titleUk: 'Ціна надії',
    titleEn: 'The Price of Hope',
    category: 'side',
    regionUk: 'Макове поле',
    regionEn: 'Poppy Field',
    isCompleted: false,
    isTracking: false,
    descriptionUk: 'Сталкер з Залісся попросив знайти фамільний годинник його діда, загублений серед квітів смертельного макового поля.',
    descriptionEn: 'A stalker from Zalissya asked to find his grandfather\'s pocket watch, lost among the flowers of the lethal poppy field.',
    objectives: [
      {
        id: 'obj-hope-1',
        textUk: 'Знайти підвал на маковому полі',
        textEn: 'Find the cellar in the poppy field',
        completed: false,
        isCurrent: true
      },
      {
        id: 'obj-hope-2',
        textUk: 'Повернути годинник замовнику',
        textEn: 'Return the watch to the client',
        completed: false
      }
    ]
  },
  {
    id: 'quest-crossing-perimeter',
    titleUk: 'Перехід через Периметр',
    titleEn: 'Crossing the Perimeter',
    category: 'main',
    regionUk: 'Кордон',
    regionEn: 'Cordon',
    isCompleted: true,
    isTracking: false,
    descriptionUk: 'Контрабандист провів мене через таємну прогалину в колючому дроті та мінних полях під носом у військових.',
    descriptionEn: 'The smuggler guided me through a secret breach in the barbed wire and minefields right under the nose of the military.',
    objectives: [
      {
        id: 'obj-cross-1',
        textUk: 'Пройти через пролом у паркані',
        textEn: 'Slip through the fence breach',
        completed: true
      },
      {
        id: 'obj-cross-2',
        textUk: 'Уникнути військових прожекторів',
        textEn: 'Avoid military searchlights',
        completed: true
      }
    ]
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-memo-725',
    titleUk: 'Службова записка від 25.07',
    titleEn: 'Memo dated 7/25',
    category: 'memos',
    subtitleUk: 'Записка з мобільної лабораторії',
    subtitleEn: 'A note from the mobile lab',
    dateStr: '25.07.2024',
    isUnread: true,
    contentUk: 'Волошин! Як керівник проєкту наказую вам залишатися в бункері, доки ми не отримаємо костюми з Інституту. Безпека понад усе, незалежно від коефіцієнтів псі-випромінювання, які ви могли зафіксувати. Якщо ви ще раз посунетеся до тієї печери, я особисто вишпурну вас — спочатку з печери, а потім і з проєкту.\n\nА. Нехода, керівник експедиції',
    contentEn: 'Voloshyn! As project leader, I\'m ordering you to remain in the bunker until we receive the suits from the Institute. Safety comes first, regardless of any psi radiation coefficients you might have detected. If you venture into that cave one more time, I will kick you out personally – first out of the cave, then out of this project.\n\nA. Nehoda, Expedition Leader'
  },
  {
    id: 'note-chat-tech',
    titleUk: 'Розмова з техніком...',
    titleEn: 'Chat with a Technician...',
    category: 'important',
    subtitleUk: 'Поради щодо калібрування зброї',
    subtitleEn: 'Advice on weapon calibration',
    dateStr: '28.07.2024',
    isUnread: true,
    contentUk: '«Слухай сюди, Скіфе. Якщо хочеш, щоб твій ствол не клинило після кожної третьої пачки набоїв у пилу — змащуй поворотну пружину і не скупися на полірування газового поршня. У Зоні залізо зношується вдвічі швидше, ніж у нормальному світі. Побачиш аномальні нарости — навіть не пробуй шкребти ножем, спалиш механіку вщент!»',
    contentEn: '"Listen up, Skif. If you don\'t want your barrel jamming after every third box of ammo in the dust – oil the recoil spring and don\'t skimp on polishing the gas piston. In the Zone, metal wears out twice as fast as in the outside world. If you spot anomalous crust – don\'t even try scraping it with a knife, you\'ll ruin the mechanics completely!"'
  },
  {
    id: 'note-ipsf-soldier',
    titleUk: 'Пам\'ятка бійця ВІСП',
    titleEn: 'IPSF Soldier\'s Memo',
    category: 'memos',
    subtitleUk: 'Військові інструкції Периметра',
    subtitleEn: 'Perimeter Military Directives',
    dateStr: '12.08.2024',
    isUnread: true,
    contentUk: '«Особовому складу караульної служби забороняється вступати в контакт з невідомими цивільними особами, що наближаються з глибини Зони Відчуження. При виявленні світіння, незрозумілих шумів або спотворення простору негайно доповідати черговому офіцеру. Стрільба на ураження дозволена при порушенні 50-метрової смуги відчуження».',
    contentEn: '"Guards are strictly forbidden from establishing contact with unidentified civilians approaching from the depths of the Exclusion Zone. Upon detecting strange luminescence, unexplained noise or spatial warping, report immediately to the duty officer. Lethal force authorized for any breach of the 50-meter perimeter buffer."'
  },
  {
    id: 'note-skif-diary',
    titleUk: 'Щоденник Скіфа',
    titleEn: 'Skif\'s Diary',
    category: 'diary',
    subtitleUk: 'Особисті записи',
    subtitleEn: 'Personal journal',
    dateStr: '01.09.2024',
    isUnread: false,
    contentUk: 'Моя квартира згоріла через цей клятий артефакт. Але Герман запевняв, що це ключ. Я повинен активувати його в серці Зони. Якщо все піде за планом, я поверну собі дім і нарешті закрию борги. Тільки повітря тут важке... пахне озоном, іржею та полином.',
    contentEn: 'My apartment burned down because of this damned artifact. But Hermann assured me it was the key. I have to activate it in the heart of the Zone. If everything goes according to plan, I get my home back and clear the debts once and for all. Only the air here is heavy... smells of ozone, rust and wormwood.'
  },
  {
    id: 'note-audio-ward',
    titleUk: 'Аудіозапис: Перехоплення «Варти» #402',
    titleEn: 'Audio Log: Ward Patrol Dispatch #402',
    category: 'audio',
    subtitleUk: 'Радіоперехоплення частоти безпеки',
    subtitleEn: 'Security frequency radio intercept',
    dateStr: '04.09.2024',
    isUnread: false,
    hasAudio: true,
    audioDuration: '00:42',
    contentUk: '[Шум ефіру, тріск рації]\n«База, це Патруль-4. Ми спостерігаємо зміну щільності гравітаційних полів біля Градирні. Знову активізувалися сліпі пси. Просимо дозвіл змінити маршрут повернення на базу... [Шум перешкод]... чекайте, що це на радарі?! Скіф, якщо ти чуєш це, біжи звідти геть!»',
    contentEn: '[Radio static, squelch]\n"Base, this is Patrol-4. We are observing shifts in gravitational field density near the Cooling Tower. Blind dogs are acting agitated again. Requesting permission to divert route back to outpost... [Static interference]... wait, what is that on radar?! Skif, if you copy this, get out of there!"'
  }
];

export const INITIAL_WEAPONS: WeaponGearItem[] = [
  {
    id: 'skif-pistol',
    nameUk: 'Пістолет Скіфа',
    nameEn: 'Skif\'s Pistol',
    category: 'pistol',
    isEquipped: true,
    baseStats: {
      damage: 32,
      penetration: 24,
      rateOfFire: 62,
      range: 28,
      accuracy: 45
    },
    upgrades: [
      {
        id: 'up-muzzle-brake',
        nameUk: 'Дульне гальмо-компенсатор',
        nameEn: 'Muzzle Brake Compensator',
        type: 'barrel',
        x: 82,
        y: 42,
        installed: false,
        cost: 950,
        descriptionUk: 'Зменшує підкидання ствола під час стрільби, підвищуючи купчастість та точність.',
        descriptionEn: 'Reduces muzzle climb during rapid fire, increasing grouping and accuracy.',
        statBonus: { accuracy: 12, range: 4 }
      },
      {
        id: 'up-match-barrel',
        nameUk: 'Полірований нарізний ствол',
        nameEn: 'Match-Grade Rifled Barrel',
        type: 'barrel',
        x: 72,
        y: 41,
        installed: false,
        cost: 1600,
        descriptionUk: 'Високоточна обробка каналу ствола. Збільшує швидкість кулі та пробивну здатність.',
        descriptionEn: 'High-precision bore machining. Increases bullet velocity and penetration.',
        statBonus: { penetration: 14, damage: 6, accuracy: 8 }
      },
      {
        id: 'up-trigger-action',
        nameUk: 'Спортивний УСМ',
        nameEn: 'Sport Trigger Group',
        type: 'receiver',
        x: 52,
        y: 53,
        installed: false,
        cost: 1100,
        descriptionUk: 'Короткий плавний хід спускового гачка для максимальної швидкострільності.',
        descriptionEn: 'Short smooth trigger pull for maximum rate of fire and rapid split times.',
        statBonus: { rateOfFire: 18, accuracy: 4 }
      },
      {
        id: 'up-ergonomic-grip',
        nameUk: 'Анатомічне руків\'я з бакеліту',
        nameEn: 'Ergonomic Bakelite Grip',
        type: 'grip',
        x: 42,
        y: 72,
        installed: false,
        cost: 750,
        descriptionUk: 'Зручний хват у вологих рукавицях, швидке повернення на лінію прицілювання.',
        descriptionEn: 'Textured secure grip in wet gloves, fast recoil recovery.',
        statBonus: { accuracy: 9 }
      },
      {
        id: 'up-extended-mag',
        nameUk: 'Подовжений магазин (+4 набої)',
        nameEn: 'Extended Magazine (+4 rounds)',
        type: 'magazine',
        x: 45,
        y: 88,
        installed: false,
        cost: 850,
        descriptionUk: 'Збільшена місткість магазину з 8 до 12 патронів 9х18 мм.',
        descriptionEn: 'Increased magazine capacity from 8 to 12 rounds of 9x18 mm.',
        statBonus: { rateOfFire: 6 }
      }
    ]
  },
  {
    id: 'leather-jacket',
    nameUk: 'Шкіряна куртка',
    nameEn: 'Leather Jacket',
    category: 'suit',
    isEquipped: true,
    baseStats: {
      damage: 18,
      penetration: 12,
      rateOfFire: 0,
      range: 0,
      accuracy: 20
    },
    upgrades: [
      {
        id: 'up-kevlar-lining',
        nameUk: 'Кевларова підкладка',
        nameEn: 'Kevlar Lining',
        type: 'receiver',
        x: 50,
        y: 50,
        installed: false,
        cost: 1400,
        descriptionUk: 'Захист від пістолетних куль та осколків гранат.',
        descriptionEn: 'Protection against pistol caliber rounds and shrapnel.',
        statBonus: { damage: 15, penetration: 20 }
      }
    ]
  },
  {
    id: 'akm-74u',
    nameUk: 'АКМ-74У',
    nameEn: 'AKM-74U',
    category: 'rifle',
    isEquipped: true,
    baseStats: {
      damage: 58,
      penetration: 52,
      rateOfFire: 78,
      range: 48,
      accuracy: 42
    },
    upgrades: [
      {
        id: 'up-collimator-kobra',
        nameUk: 'Коліматорний приціл «Кобра»',
        nameEn: 'Kobra Collimator Sight',
        type: 'sight',
        x: 55,
        y: 35,
        installed: false,
        cost: 2100,
        descriptionUk: 'Швидке прицілювання по рухомих мутантах та в темряві.',
        descriptionEn: 'Rapid target acquisition against fast mutants and in low light.',
        statBonus: { accuracy: 22, range: 10 }
      }
    ]
  },
  {
    id: 'ar416',
    nameUk: 'AR416',
    nameEn: 'AR416',
    category: 'rifle',
    isEquipped: true,
    baseStats: {
      damage: 64,
      penetration: 68,
      rateOfFire: 82,
      range: 68,
      accuracy: 74
    },
    upgrades: []
  },
  {
    id: 'viper-5',
    nameUk: 'Вайпер-5',
    nameEn: 'Viper-5',
    category: 'rifle',
    isEquipped: false,
    baseStats: {
      damage: 38,
      penetration: 32,
      rateOfFire: 92,
      range: 35,
      accuracy: 58
    },
    upgrades: []
  },
  {
    id: 'akm-74s',
    nameUk: 'АКМ-74С',
    nameEn: 'AKM-74S',
    category: 'rifle',
    isEquipped: false,
    baseStats: {
      damage: 62,
      penetration: 56,
      rateOfFire: 74,
      range: 62,
      accuracy: 54
    },
    upgrades: []
  }
];

export const INITIAL_TUTORIALS: TutorialTopic[] = [
  {
    id: 'tut-hunger',
    titleUk: 'Голод',
    titleEn: 'Hunger',
    category: 'survival',
    isUnread: true,
    iconType: 'hunger',
    contentUk: 'Голод накопичується з часом і може погіршити бойові якості вашого персонажа: знижується витривалість та сповільнюється регенерація здоров\'я. На рівень голоду впливають вживані розхідні матеріали — одні продукти втамовують голод (батон, ковбаса, туристичний сніданок), тоді як енергетики та деякі стимулятори можуть його навпаки посилювати.\n\nВживання свіжої їжі — найнадійніший спосіб залишатися ситим та готовим до несподіванок Зони.',
    contentEn: 'Hunger accumulates over time and can impair combat performance: stamina recovers slower and health regeneration stalls. Your hunger level can also be affected by consumables you use – certain items alleviate hunger, while others (like energy drinks) may actually increase it.\n\nUnsurprisingly, eating food is an effective way to alleviate hunger and stay resilient in the Zone.'
  },
  {
    id: 'tut-artifacts',
    titleUk: 'Артефакти та їх пошук',
    titleEn: 'Artifacts & Detection',
    category: 'survival',
    iconType: 'artifact',
    isUnread: true,
    contentUk: 'Артефакти народжуються в серці аномальних полів. Вони невидимі неозброєним оком, поки ви не дістанете детектор аномалій (клавіша [O]). Коли детектор починає пищати швидше, підходьте ближче до джерела сигналу і приготуйтеся схопити артефакт рукою або щипцями. Будьте обережні: аномалії реагують на будь-який рух — кидайте болти [6]!',
    contentEn: 'Artifacts are born in the center of anomalous fields. They remain invisible to the naked eye until you equip your detector (press [O]). When the beeping frequency increases, approach the signal source and be ready to claim it. Watch your step: anomalies trigger violently – always toss bolts [6]!'
  },
  {
    id: 'tut-inventory',
    titleUk: 'Інвентар та вага',
    titleEn: 'Inventory & Weight',
    category: 'survival',
    iconType: 'inventory',
    isUnread: false,
    contentUk: 'Кожен кілограм понад норму уповільнює спринт і змушує Скіфа швидше задихатися. Слідкуйте за індикатором ваги на поясі. Непотрібний хабар продавайте торговцям або ховайте в особисті скрині у безпечних таборах.',
    contentEn: 'Every kilogram exceeding the safe limit slows your sprint and drains stamina rapidly. Keep an eye on your load meter. Sell spare loot to traders or store it in personal lockboxes in safe camps.'
  },
  {
    id: 'tut-radiation',
    titleUk: 'Радіація',
    titleEn: 'Radiation',
    category: 'survival',
    iconType: 'radiation',
    isUnread: false,
    contentUk: 'Радіаційне опромінення поступово спалює запас здоров\'я. Ознака небезпеки — тріск дозиметра в навушнику та зеленуватий значок на HUD. Для нейтралізації використовуйте протирадіаційні препарати (Р-1) або сталкерську горілку «Козаки».',
    contentEn: 'Radiation exposure continuously drains your maximum health. The telltale sign is the clicking of your dosimeter and the yellow/green icon on HUD. Counteract it with antirad injectors or Cossacks vodka.'
  },
  {
    id: 'tut-compass',
    titleUk: 'Компас та навігація',
    titleEn: 'Compass & Navigation',
    category: 'world',
    iconType: 'compass',
    isUnread: false,
    contentUk: 'У верхній частині інтерфейсу розташовано тактичний компас. На ньому відображаються сторони світу, активний маркер квесту, відстань до мети в метрах, ворожі та нейтральні сталкери, а також найближчі схованки.',
    contentEn: 'The tactical compass at the top of your HUD displays cardinal directions, active mission marker with distance in meters, nearby stalkers, and discovered stashes.'
  },
  {
    id: 'tut-bleeding',
    titleUk: 'Кровотеча та лікування',
    titleEn: 'Bleeding & Healing',
    category: 'combat',
    iconType: 'healing',
    isUnread: false,
    contentUk: 'Кульові та осколкові поранення викликають кровотечу (червона крапля на екрані). Звичайна аптечка відновлює здоров\'я, але не зупиняє втрату крові — спочатку завжди використовуйте стерильний бинт, а вже потім лікуйтеся!',
    contentEn: 'Bullet and shrapnel wounds cause bleeding (red drop indicator). A medkit restores health, but does not stem active blood loss – always apply a bandage first before administering healing stimulants!'
  }
];
