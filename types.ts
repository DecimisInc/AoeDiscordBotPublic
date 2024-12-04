export interface Player {
  name: string;
  site_url: string;
  profile_id: number;
  country: string;
  avatars: {
    small: string;
    medium: string;
    large: string;
  };
  modes: {
    rm_solo: PlayerModeStats;
    rm_team: PlayerModeStats;
    rm_1v1_elo: PlayerModeStats;
    rm_2v2_elo: PlayerModeStats;
    rm_3v3_elo: PlayerModeStats;
    rm_4v4_elo: PlayerModeStats;
    qm_1v1: PlayerModeStats;
    qm_2v2: PlayerModeStats;
    qm_3v3: PlayerModeStats;
    qm_4v4: PlayerModeStats;
  };
}

export interface PlayerModeStats {
  rating: number;
  max_rating: number;
  max_rating_7d: number;
  max_rating_1m: number;
  rank: number;
  streak: number;
  games_count: number;
  wins_count: number;
  losses_count: number;
  disputes_count: number;
  drops_count: number;
  win_rate: number; // 80.5
}

export interface GameWithStats {
  duration: number;
  map: MapName;
  server: string;
  average_rating: number; // 1475
  average_rating_deviation: number; // 263
  average_mmr: number; // 1466
  average_mmr_deviation: number; // 151
  ongoing: false;
  just_finished: false;
  teams: GamePlayer[][];
}

export interface GamePlayer extends Player {
  result: 'win' | 'loss';
  civilization: Civilization;
  civilization_randomized: boolean;
  rating: number; // 1271
  rating_diff: number; // -12
  mmr: number; // 1334
  mmr_diff: number; // -6
  input_type: 'keyboard' | null;
}

export enum Civilization {
  OrderOfTheDragon = 'order_of_the_dragon',
  Ayyubids = 'ayyubids',
  JeanneDArc = 'jeanne_darc',
  Byzantines = 'byzantines',
  Mongols = 'mongols',
  French = 'french',
  DelhiSultanate = 'delhi_sultanate',
  Japanese = 'japanese',
  ZhuXisLegacy = 'zhu_xis_legacy',
  Rus = 'rus',
  English = 'english',
  Abbasid = 'abbasid_dynasty',
  HolyRomanEmpire = 'holy_roman_empire',
  Ottomans = 'ottomans',
  Chinese = 'chinese',
  Malians = 'malians',
}

export const civNames: Record<Civilization, string> = {
  [Civilization.OrderOfTheDragon]: 'Order of the Dragon',
  [Civilization.Ayyubids]: 'Ayyubids',
  [Civilization.JeanneDArc]: "Jeanne d'Arc",
  [Civilization.Byzantines]: 'Byzantines',
  [Civilization.Mongols]: 'Mongols',
  [Civilization.French]: 'French',
  [Civilization.DelhiSultanate]: 'Delhi Sultanate',
  [Civilization.Japanese]: 'Japanese',
  [Civilization.ZhuXisLegacy]: "Zhu Xi's Legacy",
  [Civilization.Rus]: 'Rus',
  [Civilization.English]: 'English',
  [Civilization.Abbasid]: 'Abbasid Dynasty',
  [Civilization.HolyRomanEmpire]: 'Holy Roman Empire',
  [Civilization.Ottomans]: 'Ottomans',
  [Civilization.Chinese]: 'Chinese',
  [Civilization.Malians]: 'Malians',
};

export enum MapName {
  AfricanWaters = 'African Waters',
  Altai = 'Altai',
  AncientSpires = 'Ancient Spires',
  Arabia = 'Arabia',
  Archipelago = 'Archipelago',
  Atoll = 'Atoll',
  Baldland = 'Baldland',
  Baltic = 'Baltic',
  Basin = 'Basin',
  BlackForest = 'Black Forest',
  Bohemia = 'Bohemia',
  BoulderBay = 'Boulder Bay',
  Bridges = 'Bridges',
  Canal = 'Canal',
  Cauldron = 'Cauldron',
  Cliffside = 'Cliffside',
  Coastal = 'Coastal',
  CoastalCliffs = 'Coastal Cliffs',
  Confluence = 'Confluence',
  Continental = 'Continental',
  DanubeRiver = 'Danube River',
  DryRiver = 'Dry River',
  Escarpment = 'Escarpment',
  Floodplain = 'Floodplain',
  ForestPonds = 'Forest Ponds',
  Forts = 'Forts',
  FourLakes = 'Four Lakes',
  FrenchPass = 'French Pass',
  FrisianMarshes = 'Frisian Marshes',
  Glade = 'Glade',
  GoldenHeights = 'Golden Heights',
  GoldenPit = 'Golden Pit',
  GoldenSwamp = 'Golden Swamp',
  Gorge = 'Gorge',
  Haywire = 'Haywire',
  HiddenValley = 'Hidden Valley',
  Hideout = 'Hideout',
  HighView = 'High View',
  HillAndDale = 'Hill and Dale',
  Himeyama = 'Himeyama',
  HolyIsland = 'Holy Island',
  JoustingFields = 'Jousting Fields',
  Kawasan = 'Kawasan',
  Kerlaugar = 'Kerlaugar',
  KingOfTheHill = 'King of the Hill',
  LakeSide = 'Lake Side',
  Lipany = 'Lipany',
  Marshland = 'Marshland',
  MegaRandom = 'MegaRandom',
  Migration = 'Migration',
  MongolianHeights = 'Mongolian Heights',
  MountainClearing = 'Mountain Clearing',
  MountainPass = 'Mountain Pass',
  MovingOut = 'Moving Out',
  Nagari = 'Nagari',
  Oasis = 'Oasis',
  PigeonsValley = 'Pigeons Valley',
  Prairie = 'Prairie',
  Regions = 'Regions',
  RockyCanyon = 'Rocky Canyon',
  RockyRiver = 'Rocky River',
  Scandinavia = 'Scandinavia',
  ShambleHill = 'Shamble Hill',
  Skargard = 'Skargard',
  Socotra = 'Socotra',
  Tempi = 'Tempi',
  ThePit = 'The Pit',
  Thickets = 'Thickets',
  TurtleRidge = 'Turtle Ridge',
  VolcanicIsland = 'Volcanic Island',
  WarringIslands = 'Warring Islands',
  WaterDrake = 'Water Drake',
  Waterholes = 'Waterholes',
  Wetlands = 'Wetlands',
  Woodwall = 'Woodwall',
}

export const countryCodes: Record<string, string> = {
  de: 'Germany',
  cz: 'Czech Republic',
  es: 'Spain',
  us: 'United States',
  by: 'Belarus',
  hk: 'Hong Kong',
  fr: 'France',
  gb: 'United Kingdom',
  it: 'Italy',
  pl: 'Poland',
  ru: 'Russia',
  br: 'Brazil',
  jp: 'Japan',
  ca: 'Canada',
  au: 'Australia',
  mx: 'Mexico',
  in: 'India',
  kr: 'South Korea',
  cn: 'China',
  ar: 'Argentina',
  se: 'Sweden',
  no: 'Norway',
  fi: 'Finland',
  dk: 'Denmark',
  nl: 'Netherlands',
  be: 'Belgium',
  ch: 'Switzerland',
  at: 'Austria',
  za: 'South Africa',
  ae: 'United Arab Emirates',
  sa: 'Saudi Arabia',
  sk: 'Slovakia',
  ro: 'Romania',
  tr: 'Turkey',
  id: 'Indonesia',
  ph: 'Philippines',
  th: 'Thailand',
  my: 'Malaysia',
  vn: 'Vietnam',
  sg: 'Singapore',
  tw: 'Taiwan',
  pk: 'Pakistan',
  eg: 'Egypt',
  ir: 'Iran',
  iq: 'Iraq',
  ng: 'Nigeria',
  ke: 'Kenya',
  cl: 'Chile',
  pe: 'Peru',
  co: 'Colombia',
  ec: 'Ecuador',
  uy: 'Uruguay',
  py: 'Paraguay',
  bo: 'Bolivia',
  gt: 'Guatemala',
  hn: 'Honduras',
  ni: 'Nicaragua',
  cr: 'Costa Rica',
  bz: 'Belize',
  qa: 'Qatar',
  kw: 'Kuwait',
  om: 'Oman',
  lb: 'Lebanon',
  jo: 'Jordan',
  sy: 'Syria',
  ly: 'Libya',
  sd: 'Sudan',
  ma: 'Morocco',
  tn: 'Tunisia',
  dz: 'Algeria',
  is: 'Iceland',
  gr: 'Greece',
  hu: 'Hungary',
  bg: 'Bulgaria',
  hr: 'Croatia',
  si: 'Slovenia',
  lt: 'Lithuania',
  lv: 'Latvia',
  ee: 'Estonia',
  ua: 'Ukraine',
  md: 'Moldova',
  ge: 'Georgia',
  am: 'Armenia',
  az: 'Azerbaijan',
  bt: 'Bhutan',
  np: 'Nepal',
  mv: 'Maldives',
  bd: 'Bangladesh',
  mm: 'Myanmar',
  la: 'Laos',
  kh: 'Cambodia',
  zm: 'Zambia',
  zw: 'Zimbabwe',
};
