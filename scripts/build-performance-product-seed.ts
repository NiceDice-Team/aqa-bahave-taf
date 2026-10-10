import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SNAPSHOT_DIRECTORY = path.resolve('backups/product-catalog/2026-10-10');
const TARGET_PRODUCT_COUNT = 100;

interface ExistingProduct {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface Candidate {
  name: string;
  brand: string;
  type: 'Strategy' | 'Adventure' | 'Thematic' | 'Party' | 'Abstract';
  audience: 'Family' | 'Friends' | 'Couples' | 'Kids' | 'Adults';
  players: string;
  age: string;
  playTime: string;
  source: keyof typeof SOURCES;
}

const SOURCES = {
  bgg: 'https://boardgamegeek.com/browse/boardgame',
  stonemaier: 'https://store.stonemaiergames.com/collections/all/base-game',
  cmon: 'https://www.cmon.com/products/',
  ravensburger: 'https://www.ravensburger.us/en-US/products/games/board-games',
  cephalofair: 'https://cephalofair.com/collections/all/frosthaven',
  leder: 'https://ledergames.com/collections/new-to-root/root',
  asmodee: 'https://store.asmodee.com/products/splendor',
} as const;

const CANDIDATES: Candidate[] = [
  {
    name: 'Wingspan',
    brand: 'Stonemaier Games',
    type: 'Strategy',
    audience: 'Family',
    players: '1-5',
    age: '10+',
    playTime: '40-70 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Scythe',
    brand: 'Stonemaier Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-5',
    age: '14+',
    playTime: '90-140 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Viticulture Essential Edition',
    brand: 'Stonemaier Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-6',
    age: '13+',
    playTime: '45-90 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Wyrmspan',
    brand: 'Stonemaier Games',
    type: 'Strategy',
    audience: 'Family',
    players: '1-5',
    age: '14+',
    playTime: '90 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Finspan',
    brand: 'Stonemaier Games',
    type: 'Strategy',
    audience: 'Family',
    players: '1-5',
    age: '10+',
    playTime: '45-60 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Tapestry',
    brand: 'Stonemaier Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-5',
    age: '12+',
    playTime: '90-120 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Apiary',
    brand: 'Stonemaier Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-5',
    age: '14+',
    playTime: '60-90 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Libertalia: Winds of Galecrest',
    brand: 'Stonemaier Games',
    type: 'Strategy',
    audience: 'Friends',
    players: '1-6',
    age: '14+',
    playTime: '45-60 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Expeditions',
    brand: 'Stonemaier Games',
    type: 'Adventure',
    audience: 'Adults',
    players: '1-5',
    age: '14+',
    playTime: '60-90 minutes',
    source: 'stonemaier',
  },
  {
    name: 'Root',
    brand: 'Leder Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-4',
    age: '10+',
    playTime: '60-90 minutes',
    source: 'leder',
  },
  {
    name: 'Spirit Island',
    brand: 'Greater Than Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-4',
    age: '13+',
    playTime: '90-120 minutes',
    source: 'bgg',
  },
  {
    name: 'Brass: Birmingham',
    brand: 'Roxley Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-4',
    age: '14+',
    playTime: '60-120 minutes',
    source: 'bgg',
  },
  {
    name: 'Ark Nova',
    brand: 'Capstone Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-4',
    age: '14+',
    playTime: '90-150 minutes',
    source: 'bgg',
  },
  {
    name: 'Terraforming Mars',
    brand: 'FryxGames',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-5',
    age: '12+',
    playTime: '120 minutes',
    source: 'bgg',
  },
  {
    name: 'Gloomhaven',
    brand: 'Cephalofair Games',
    type: 'Adventure',
    audience: 'Adults',
    players: '1-4',
    age: '14+',
    playTime: '60-120 minutes',
    source: 'cephalofair',
  },
  {
    name: 'Gloomhaven: Jaws of the Lion',
    brand: 'Cephalofair Games',
    type: 'Adventure',
    audience: 'Adults',
    players: '1-4',
    age: '14+',
    playTime: '30-120 minutes',
    source: 'cephalofair',
  },
  {
    name: 'Dune: Imperium',
    brand: 'Dire Wolf',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-4',
    age: '14+',
    playTime: '60-120 minutes',
    source: 'bgg',
  },
  {
    name: 'Lost Ruins of Arnak',
    brand: 'Czech Games Edition',
    type: 'Adventure',
    audience: 'Adults',
    players: '1-4',
    age: '12+',
    playTime: '30-120 minutes',
    source: 'bgg',
  },
  {
    name: 'Everdell',
    brand: 'Tabletop Tycoon',
    type: 'Strategy',
    audience: 'Family',
    players: '1-4',
    age: '10+',
    playTime: '40-80 minutes',
    source: 'bgg',
  },
  {
    name: 'Cascadia',
    brand: 'Flatout Games',
    type: 'Abstract',
    audience: 'Family',
    players: '1-4',
    age: '10+',
    playTime: '30-45 minutes',
    source: 'bgg',
  },
  {
    name: 'Agricola',
    brand: 'Lookout Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-4',
    age: '12+',
    playTime: '30-120 minutes',
    source: 'bgg',
  },
  {
    name: 'A Feast for Odin',
    brand: 'Feuerland Spiele',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-4',
    age: '12+',
    playTime: '30-120 minutes',
    source: 'bgg',
  },
  {
    name: 'Great Western Trail',
    brand: 'Eggertspiele',
    type: 'Strategy',
    audience: 'Adults',
    players: '1-4',
    age: '12+',
    playTime: '75-150 minutes',
    source: 'bgg',
  },
  {
    name: 'The Castles of Burgundy',
    brand: 'Ravensburger',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-4',
    age: '12+',
    playTime: '70-120 minutes',
    source: 'bgg',
  },
  {
    name: 'Concordia',
    brand: 'PD-Verlag',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-5',
    age: '13+',
    playTime: '100 minutes',
    source: 'bgg',
  },
  {
    name: 'Power Grid',
    brand: 'Rio Grande Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-6',
    age: '12+',
    playTime: '120 minutes',
    source: 'bgg',
  },
  {
    name: 'El Grande',
    brand: 'Hans im Glück',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-5',
    age: '12+',
    playTime: '90 minutes',
    source: 'bgg',
  },
  {
    name: 'Puerto Rico 1897',
    brand: 'Ravensburger',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-5',
    age: '12+',
    playTime: '70-120 minutes',
    source: 'ravensburger',
  },
  {
    name: 'Five Tribes',
    brand: 'Days of wonder',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-4',
    age: '13+',
    playTime: '40-80 minutes',
    source: 'bgg',
  },
  {
    name: 'Race for the Galaxy',
    brand: 'Rio Grande Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-4',
    age: '12+',
    playTime: '30-60 minutes',
    source: 'bgg',
  },
  {
    name: 'Dominion',
    brand: 'Rio Grande Games',
    type: 'Strategy',
    audience: 'Friends',
    players: '2-4',
    age: '13+',
    playTime: '30 minutes',
    source: 'bgg',
  },
  {
    name: 'Res Arcana',
    brand: 'Sand Castle Games',
    type: 'Strategy',
    audience: 'Adults',
    players: '2-4',
    age: '12+',
    playTime: '30-60 minutes',
    source: 'bgg',
  },
  {
    name: 'Splendor',
    brand: 'Asmodee',
    type: 'Strategy',
    audience: 'Family',
    players: '2-4',
    age: '10+',
    playTime: '30 minutes',
    source: 'asmodee',
  },
  {
    name: 'Jaipur',
    brand: 'Asmodee',
    type: 'Strategy',
    audience: 'Couples',
    players: '2',
    age: '10+',
    playTime: '30 minutes',
    source: 'bgg',
  },
  {
    name: 'Love Letter',
    brand: 'Asmodee',
    type: 'Party',
    audience: 'Friends',
    players: '2-6',
    age: '10+',
    playTime: '20 minutes',
    source: 'bgg',
  },
  {
    name: 'Hanabi',
    brand: 'Asmodee',
    type: 'Party',
    audience: 'Friends',
    players: '2-5',
    age: '8+',
    playTime: '25 minutes',
    source: 'bgg',
  },
  {
    name: 'Bohnanza',
    brand: 'Amigo',
    type: 'Strategy',
    audience: 'Family',
    players: '2-7',
    age: '10+',
    playTime: '45 minutes',
    source: 'bgg',
  },
  {
    name: 'Sushi Go Party!',
    brand: 'Gamewright',
    type: 'Party',
    audience: 'Family',
    players: '2-8',
    age: '8+',
    playTime: '20 minutes',
    source: 'bgg',
  },
  {
    name: 'Codenames',
    brand: 'Czech Games Edition',
    type: 'Party',
    audience: 'Friends',
    players: '2-8+',
    age: '10+',
    playTime: '15 minutes',
    source: 'bgg',
  },
  {
    name: 'Just One',
    brand: 'Repos Production',
    type: 'Party',
    audience: 'Friends',
    players: '3-7',
    age: '8+',
    playTime: '20 minutes',
    source: 'bgg',
  },
  {
    name: 'Decrypto',
    brand: 'Le Scorpion Masqué',
    type: 'Party',
    audience: 'Friends',
    players: '3-8',
    age: '12+',
    playTime: '30 minutes',
    source: 'bgg',
  },
  {
    name: 'Mysterium',
    brand: 'Asmodee',
    type: 'Thematic',
    audience: 'Friends',
    players: '2-7',
    age: '10+',
    playTime: '40 minutes',
    source: 'bgg',
  },
  {
    name: 'The Mind',
    brand: 'Pandasaurus Games',
    type: 'Abstract',
    audience: 'Friends',
    players: '2-4',
    age: '8+',
    playTime: '20 minutes',
    source: 'bgg',
  },
  {
    name: 'Skull',
    brand: 'Asmodee',
    type: 'Party',
    audience: 'Friends',
    players: '3-6',
    age: '10+',
    playTime: '30 minutes',
    source: 'bgg',
  },
  {
    name: 'Coup',
    brand: 'Indie Boards & Cards',
    type: 'Party',
    audience: 'Friends',
    players: '2-6',
    age: '13+',
    playTime: '15 minutes',
    source: 'bgg',
  },
  {
    name: 'King of Tokyo',
    brand: 'IELLO',
    type: 'Thematic',
    audience: 'Family',
    players: '2-6',
    age: '8+',
    playTime: '30 minutes',
    source: 'bgg',
  },
  {
    name: 'The Quacks of Quedlinburg',
    brand: 'CMYK',
    type: 'Strategy',
    audience: 'Family',
    players: '2-4',
    age: '10+',
    playTime: '45 minutes',
    source: 'bgg',
  },
  {
    name: 'Patchwork',
    brand: 'Lookout Games',
    type: 'Abstract',
    audience: 'Couples',
    players: '2',
    age: '8+',
    playTime: '30 minutes',
    source: 'bgg',
  },
  {
    name: 'Sagrada',
    brand: 'Floodgate Games',
    type: 'Abstract',
    audience: 'Family',
    players: '1-4',
    age: '10+',
    playTime: '30-45 minutes',
    source: 'bgg',
  },
  {
    name: 'Calico',
    brand: 'Flatout Games',
    type: 'Abstract',
    audience: 'Family',
    players: '1-4',
    age: '10+',
    playTime: '30-45 minutes',
    source: 'bgg',
  },
  {
    name: 'PARKS',
    brand: 'Keymaster Games',
    type: 'Strategy',
    audience: 'Family',
    players: '1-5',
    age: '10+',
    playTime: '40-70 minutes',
    source: 'bgg',
  },
  {
    name: 'Photosynthesis',
    brand: 'Blue Orange Games',
    type: 'Abstract',
    audience: 'Family',
    players: '2-4',
    age: '8+',
    playTime: '30-60 minutes',
    source: 'bgg',
  },
  {
    name: 'Takenoko',
    brand: 'Asmodee',
    type: 'Strategy',
    audience: 'Family',
    players: '2-4',
    age: '8+',
    playTime: '45 minutes',
    source: 'bgg',
  },
  {
    name: 'Santorini',
    brand: 'Roxley Games',
    type: 'Abstract',
    audience: 'Family',
    players: '2-4',
    age: '8+',
    playTime: '20 minutes',
    source: 'bgg',
  },
  {
    name: 'Onitama',
    brand: 'Arcane Wonders',
    type: 'Abstract',
    audience: 'Couples',
    players: '2',
    age: '10+',
    playTime: '15-20 minutes',
    source: 'bgg',
  },
  {
    name: 'Hive',
    brand: 'Gen42 Games',
    type: 'Abstract',
    audience: 'Couples',
    players: '2',
    age: '9+',
    playTime: '20 minutes',
    source: 'bgg',
  },
  {
    name: 'Horrified: Universal Monsters',
    brand: 'Ravensburger',
    type: 'Thematic',
    audience: 'Family',
    players: '1-5',
    age: '10+',
    playTime: '60 minutes',
    source: 'ravensburger',
  },
  {
    name: 'Sherlock Holmes Consulting Detective: The Thames Murders & Other Cases',
    brand: 'Space Cowboys',
    type: 'Adventure',
    audience: 'Adults',
    players: '1-8',
    age: '13+',
    playTime: '90 minutes',
    source: 'bgg',
  },
];

function normalizedName(name: string): string {
  return name
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function priceFor(index: number): string {
  return (19.99 + ((index * 7) % 65)).toFixed(2);
}

async function writeJson(fileName: string, value: unknown): Promise<void> {
  await writeFile(path.join(SNAPSHOT_DIRECTORY, fileName), `${JSON.stringify(value, null, 2)}\n`);
}

async function main(): Promise<void> {
  const existing = JSON.parse(
    await readFile(path.join(SNAPSHOT_DIRECTORY, 'products.json'), 'utf8')
  ) as ExistingProduct[];
  const required = TARGET_PRODUCT_COUNT - existing.length;

  if (required < 0) throw new Error(`Snapshot already contains ${existing.length} products`);
  if (CANDIDATES.length < required) {
    throw new Error(`Need ${required} candidates, but only ${CANDIDATES.length} are configured`);
  }

  const seen = new Set(existing.map((product) => normalizedName(product.name)));
  const selected = CANDIDATES.filter((candidate) => {
    const key = normalizedName(candidate.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, required);

  if (selected.length !== required) {
    throw new Error(`Could only select ${selected.length} non-duplicate products; need ${required}`);
  }

  const additional = selected.map((candidate, index) => ({
    id: existing.length + index + 1,
    name: candidate.name,
    description: `${candidate.name} is represented as a curated ${candidate.type.toLowerCase()} board-game entry for catalog, search, pagination, load, and performance testing. This original test description intentionally avoids copying publisher marketing text.`,
    short_description: `Curated ${candidate.type.toLowerCase()} game for performance-test catalog coverage.`,
    price: priceFor(index),
    discount: index % 9 === 0 ? '10.00' : '0.00',
    stock: 5 + ((index * 11) % 96),
    stars: '0.00',
    categories: [3],
    brand_name: candidate.brand,
    type_names: [candidate.type],
    audience_names: [candidate.audience],
    images: [],
    game_information: {
      players: candidate.players,
      ages: candidate.age,
      'play time': candidate.playTime,
    },
    seed_source: SOURCES[candidate.source],
  }));

  await mkdir(SNAPSHOT_DIRECTORY, { recursive: true });
  await writeJson('additional-performance-products.json', additional);
  await writeJson('performance-catalog-100.json', [...existing, ...additional]);
  await writeJson('performance-seed-metadata.json', {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    existingProductCount: existing.length,
    additionalProductCount: additional.length,
    totalProductCount: existing.length + additional.length,
    duplicateNames: [],
    purpose: ['local', 'test', 'staging', 'load', 'performance'],
    productionImportRecommended: false,
    sources: SOURCES,
  });

  process.stdout.write(`Created ${additional.length} unique products; total catalog size is 100.\n`);
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
