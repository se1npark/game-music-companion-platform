import type {
  DashboardStats,
  GameLibraryEntry,
  GameProfile,
  SavedPlaylist,
  TrackProfile,
  UserProfile
} from "@game-music/shared";

export const userProfile: UserProfile = {
  id: "user-sein",
  displayName: "Sein Park",
  region: "Australia/Sydney",
  topGenres: ["Tactical FPS", "Life Sim", "RPG", "Indie"],
  weeklyPlayMinutes: 860,
  connectedServices: ["spotify", "steam", "rawg", "openai"]
};

export const games: GameProfile[] = [
  {
    id: "game-valorant",
    title: "Valorant",
    slug: "valorant",
    genres: ["Tactical FPS", "Competitive", "Shooter"],
    platforms: ["PC"],
    releaseYear: 2020,
    averageSessionMinutes: 75,
    energyProfile: 91,
    moodTags: ["focused", "dark", "hype"],
    source: "seed"
  },
  {
    id: "game-stardew-valley",
    title: "Stardew Valley",
    slug: "stardew-valley",
    genres: ["Life Sim", "Farming", "Cozy"],
    platforms: ["PC", "Nintendo Switch", "Mobile", "Steam Deck"],
    releaseYear: 2016,
    averageSessionMinutes: 55,
    energyProfile: 34,
    moodTags: ["chill", "nostalgic"],
    source: "seed"
  },
  {
    id: "game-elden-ring",
    title: "Elden Ring",
    slug: "elden-ring",
    genres: ["Action RPG", "Soulslike", "Adventure"],
    platforms: ["PC", "PlayStation", "Xbox"],
    releaseYear: 2022,
    averageSessionMinutes: 95,
    energyProfile: 84,
    moodTags: ["dark", "focused"],
    source: "seed"
  },
  {
    id: "game-cyberpunk-2077",
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    genres: ["RPG", "Open World", "Sci-Fi"],
    platforms: ["PC", "PlayStation", "Xbox"],
    releaseYear: 2020,
    averageSessionMinutes: 110,
    energyProfile: 73,
    moodTags: ["dark", "hype", "focused"],
    source: "seed"
  },
  {
    id: "game-league",
    title: "League of Legends",
    slug: "league-of-legends",
    genres: ["MOBA", "Competitive", "Strategy"],
    platforms: ["PC"],
    releaseYear: 2009,
    averageSessionMinutes: 45,
    energyProfile: 82,
    moodTags: ["focused", "hype"],
    source: "seed"
  },
  {
    id: "game-minecraft",
    title: "Minecraft",
    slug: "minecraft",
    genres: ["Sandbox", "Survival", "Creative"],
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    releaseYear: 2011,
    averageSessionMinutes: 90,
    energyProfile: 48,
    moodTags: ["chill", "nostalgic", "focused"],
    source: "seed"
  },
  {
    id: "game-hades",
    title: "Hades",
    slug: "hades",
    genres: ["Roguelike", "Action", "Indie"],
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Steam Deck"],
    releaseYear: 2020,
    averageSessionMinutes: 40,
    energyProfile: 78,
    moodTags: ["hype", "focused"],
    source: "seed"
  },
  {
    id: "game-forza",
    title: "Forza Horizon 5",
    slug: "forza-horizon-5",
    genres: ["Racing", "Open World", "Arcade"],
    platforms: ["PC", "Xbox"],
    releaseYear: 2021,
    averageSessionMinutes: 65,
    energyProfile: 76,
    moodTags: ["hype", "chill"],
    source: "seed"
  }
];

export const tracks: TrackProfile[] = [
  {
    id: "track-void-pulse",
    title: "Void Pulse",
    artist: "Neon Assembly",
    album: "Night Queue",
    bpm: 142,
    energy: 88,
    valence: 35,
    genres: ["Dark Electronic", "Industrial", "Bass"],
    moodTags: ["dark", "focused"]
  },
  {
    id: "track-smoke-angle",
    title: "Smoke Angle",
    artist: "Packet Loss",
    album: "Clutch Protocol",
    bpm: 150,
    energy: 92,
    valence: 42,
    genres: ["Drum and Bass", "Electronic", "Shooter"],
    moodTags: ["hype", "focused", "dark"]
  },
  {
    id: "track-lantern-rain",
    title: "Lantern Rain",
    artist: "Maple Terminal",
    album: "Small Town Sync",
    bpm: 86,
    energy: 31,
    valence: 72,
    genres: ["Lo-Fi", "Cozy", "Acoustic"],
    moodTags: ["chill", "nostalgic"]
  },
  {
    id: "track-copper-fields",
    title: "Copper Fields",
    artist: "Sunday Patch",
    album: "Harvest Mode",
    bpm: 92,
    energy: 36,
    valence: 78,
    genres: ["Indie Folk", "Cozy", "Instrumental"],
    moodTags: ["chill", "nostalgic"]
  },
  {
    id: "track-boss-door",
    title: "Boss Door",
    artist: "Ashen Keys",
    album: "Retry Window",
    bpm: 132,
    energy: 84,
    valence: 28,
    genres: ["Dark Synth", "Orchestral", "Action"],
    moodTags: ["dark", "focused", "hype"]
  },
  {
    id: "track-soft-save",
    title: "Soft Save",
    artist: "Cloud Inventory",
    album: "Autosave",
    bpm: 76,
    energy: 24,
    valence: 66,
    genres: ["Ambient", "Lo-Fi", "Indie"],
    moodTags: ["chill"]
  },
  {
    id: "track-ranked-afterglow",
    title: "Ranked Afterglow",
    artist: "Queue Theory",
    album: "MMR",
    bpm: 128,
    energy: 80,
    valence: 55,
    genres: ["House", "Electronic", "Competitive"],
    moodTags: ["focused", "hype"]
  },
  {
    id: "track-neon-district",
    title: "Neon District",
    artist: "Mono City",
    album: "Late Render",
    bpm: 118,
    energy: 69,
    valence: 48,
    genres: ["Synthwave", "Cyberpunk", "Electronic"],
    moodTags: ["dark", "nostalgic"]
  },
  {
    id: "track-mining-moon",
    title: "Mining Moon",
    artist: "Block Garden",
    album: "Creative Mode",
    bpm: 90,
    energy: 43,
    valence: 70,
    genres: ["Ambient", "Sandbox", "Lo-Fi"],
    moodTags: ["chill", "focused", "nostalgic"]
  },
  {
    id: "track-ember-loop",
    title: "Ember Loop",
    artist: "Dash Cancel",
    album: "Run Again",
    bpm: 156,
    energy: 94,
    valence: 62,
    genres: ["Breakbeat", "Action", "Indie"],
    moodTags: ["hype", "focused"]
  },
  {
    id: "track-ocean-savepoint",
    title: "Ocean Savepoint",
    artist: "Quiet Build",
    album: "Rest State",
    bpm: 82,
    energy: 28,
    valence: 74,
    genres: ["Ambient", "Piano", "Cozy"],
    moodTags: ["chill", "nostalgic"]
  },
  {
    id: "track-warm-cache",
    title: "Warm Cache",
    artist: "Localhost Cafe",
    album: "Afternoon Compile",
    bpm: 96,
    energy: 45,
    valence: 68,
    genres: ["Lo-Fi", "Jazzhop", "Study"],
    moodTags: ["focused", "chill"]
  }
];

export const library: GameLibraryEntry[] = [
  {
    id: "library-valorant",
    gameId: "game-valorant",
    hoursPlayed: 420,
    lastPlayedAt: "2026-05-10T12:15:00.000Z",
    achievementsUnlocked: 0,
    totalAchievements: 0,
    preferredMood: "focused"
  },
  {
    id: "library-stardew",
    gameId: "game-stardew-valley",
    hoursPlayed: 188,
    lastPlayedAt: "2026-05-09T08:30:00.000Z",
    achievementsUnlocked: 28,
    totalAchievements: 49,
    preferredMood: "chill"
  },
  {
    id: "library-cyberpunk",
    gameId: "game-cyberpunk-2077",
    hoursPlayed: 96,
    lastPlayedAt: "2026-05-06T14:00:00.000Z",
    achievementsUnlocked: 21,
    totalAchievements: 57,
    preferredMood: "dark"
  },
  {
    id: "library-hades",
    gameId: "game-hades",
    hoursPlayed: 64,
    lastPlayedAt: "2026-05-11T10:40:00.000Z",
    achievementsUnlocked: 32,
    totalAchievements: 49,
    preferredMood: "hype"
  }
];

export const savedPlaylists: SavedPlaylist[] = [
  {
    id: "playlist-late-ranked",
    recommendationId: "rec-seed-late-ranked",
    title: "Late-night ranked focus",
    trackCount: 8,
    createdAt: "2026-05-08T10:20:00.000Z"
  },
  {
    id: "playlist-cozy-farm",
    recommendationId: "rec-seed-cozy-farm",
    title: "Cozy farming loop",
    trackCount: 10,
    createdAt: "2026-05-04T09:10:00.000Z"
  }
];

export function getDashboardStats(): DashboardStats {
  return {
    totalGames: games.length,
    totalPlaylists: savedPlaylists.length,
    weeklyPlayMinutes: userProfile.weeklyPlayMinutes,
    favouriteMood: "focused",
    genreBreakdown: [
      { name: "Competitive", value: 36 },
      { name: "Life Sim", value: 22 },
      { name: "RPG", value: 18 },
      { name: "Action", value: 14 },
      { name: "Sandbox", value: 10 }
    ],
    moodBreakdown: [
      { name: "focused", value: 38 },
      { name: "chill", value: 25 },
      { name: "dark", value: 18 },
      { name: "hype", value: 14 },
      { name: "nostalgic", value: 5 }
    ],
    serviceHealth: [
      {
        service: "Spotify",
        status: process.env.SPOTIFY_CLIENT_ID ? "configured" : "demo",
        detail: process.env.SPOTIFY_CLIENT_ID ? "OAuth credentials detected" : "Using seeded track catalogue"
      },
      {
        service: "Steam",
        status: process.env.STEAM_API_KEY ? "configured" : "demo",
        detail: process.env.STEAM_API_KEY ? "Steam API key detected" : "Using seeded library history"
      },
      {
        service: "RAWG",
        status: process.env.RAWG_API_KEY ? "configured" : "demo",
        detail: process.env.RAWG_API_KEY ? "RAWG key detected" : "Using curated game metadata"
      },
      {
        service: "OpenAI",
        status: process.env.OPENAI_API_KEY ? "configured" : "demo",
        detail: process.env.OPENAI_API_KEY ? "AI explanations enabled" : "Using deterministic explanation engine"
      },
      {
        service: "PostgreSQL",
        status: process.env.DATABASE_URL ? "configured" : "missing-key",
        detail: process.env.DATABASE_URL ? "Database URL available" : "Run Docker Compose for local persistence"
      }
    ]
  };
}
