import type {
  DashboardStats,
  GameLibraryEntry,
  GameProfile,
  PlaylistRecommendation,
  RecommendationRequest,
  SavedPlaylist,
  UserProfile
} from "@game-music/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type LibraryEntryWithGame = GameLibraryEntry & { game?: GameProfile };

export async function getDashboard() {
  return request<{ data: DashboardStats }>("/api/dashboard");
}

export async function getGames() {
  return request<{ data: GameProfile[] }>("/api/games");
}

export async function getLibrary() {
  return request<{ profile: UserProfile; data: LibraryEntryWithGame[] }>("/api/library");
}

export async function getPlaylists() {
  return request<{ data: SavedPlaylist[] }>("/api/playlists");
}

export async function createRecommendation(payload: RecommendationRequest) {
  return request<{ data: PlaylistRecommendation }>("/api/recommendations", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function savePlaylist(payload: {
  recommendationId: string;
  title: string;
  trackCount: number;
}) {
  return request<{ data: SavedPlaylist }>("/api/playlists", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
