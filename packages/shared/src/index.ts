export type Mood = "focused" | "chill" | "dark" | "hype" | "nostalgic";

export type SessionStyle = "ranked" | "story" | "farming" | "co-op" | "grind";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "late-night";

export type Platform =
  | "PC"
  | "PlayStation"
  | "Xbox"
  | "Nintendo Switch"
  | "Mobile"
  | "Steam Deck";

export interface GameProfile {
  id: string;
  title: string;
  slug: string;
  genres: string[];
  platforms: Platform[];
  releaseYear: number;
  averageSessionMinutes: number;
  energyProfile: number;
  moodTags: Mood[];
  source: "seed" | "rawg" | "steam";
}

export interface TrackProfile {
  id: string;
  title: string;
  artist: string;
  album: string;
  bpm: number;
  energy: number;
  valence: number;
  genres: string[];
  moodTags: Mood[];
  spotifyUri?: string;
}

export interface GameLibraryEntry {
  id: string;
  gameId: string;
  hoursPlayed: number;
  lastPlayedAt: string;
  achievementsUnlocked: number;
  totalAchievements: number;
  preferredMood: Mood;
}

export interface UserProfile {
  id: string;
  displayName: string;
  region: string;
  topGenres: string[];
  weeklyPlayMinutes: number;
  connectedServices: Array<"spotify" | "steam" | "rawg" | "openai">;
}

export interface RecommendationRequest {
  gameTitle: string;
  prompt: string;
  mood?: Mood;
  sessionStyle?: SessionStyle;
  timeOfDay?: TimeOfDay;
  durationMinutes?: number;
}

export interface RecommendationSignals {
  inferredMood: Mood;
  sessionStyle: SessionStyle;
  timeOfDay: TimeOfDay;
  intensity: number;
  tags: string[];
}

export interface PlaylistRecommendation {
  id: string;
  title: string;
  game: GameProfile;
  request: RecommendationRequest;
  signals: RecommendationSignals;
  tracks: TrackProfile[];
  explanation: string;
  createdAt: string;
}

export interface SavedPlaylist {
  id: string;
  recommendationId: string;
  title: string;
  trackCount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalGames: number;
  totalPlaylists: number;
  weeklyPlayMinutes: number;
  favouriteMood: Mood;
  genreBreakdown: Array<{ name: string; value: number }>;
  moodBreakdown: Array<{ name: Mood; value: number }>;
  serviceHealth: Array<{
    service: "Spotify" | "Steam" | "RAWG" | "OpenAI" | "PostgreSQL";
    status: "demo" | "configured" | "missing-key";
    detail: string;
  }>;
}
