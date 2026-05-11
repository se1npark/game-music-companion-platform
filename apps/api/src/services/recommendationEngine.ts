import type {
  GameProfile,
  Mood,
  PlaylistRecommendation,
  RecommendationRequest,
  RecommendationSignals,
  SessionStyle,
  TimeOfDay,
  TrackProfile
} from "@game-music/shared";
import { games, tracks } from "../data/seed.js";

const moodKeywords: Record<Mood, string[]> = {
  focused: ["focus", "focused", "aim", "study", "rank", "ranked", "competitive", "clutch"],
  chill: ["chill", "cozy", "relax", "calm", "farm", "farming", "soft"],
  dark: ["dark", "intense", "night", "late", "moody", "aggressive"],
  hype: ["hype", "fast", "rush", "energy", "boss", "race"],
  nostalgic: ["nostalgic", "retro", "warm", "old", "memory"]
};

const styleKeywords: Record<SessionStyle, string[]> = {
  ranked: ["ranked", "competitive", "clutch", "ladder", "queue"],
  story: ["story", "campaign", "quest", "explore"],
  farming: ["farm", "farming", "cozy", "build", "craft"],
  "co-op": ["coop", "co-op", "party", "duo", "squad"],
  grind: ["grind", "repeat", "loot", "level", "achievement"]
};

const timeKeywords: Record<TimeOfDay, string[]> = {
  morning: ["morning", "breakfast", "am"],
  afternoon: ["afternoon", "lunch"],
  evening: ["evening", "after work", "dinner"],
  "late-night": ["late", "night", "midnight", "tonight"]
};

function normalise(input: string) {
  return input.trim().toLowerCase();
}

function countKeywordMatches(text: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0);
}

export function findGame(gameTitle: string): GameProfile {
  const query = normalise(gameTitle);
  return (
    games.find((game) => normalise(game.title) === query) ??
    games.find((game) => normalise(game.title).includes(query) || query.includes(normalise(game.title))) ??
    games[0]
  );
}

function inferMood(prompt: string, game: GameProfile, explicitMood?: Mood): Mood {
  if (explicitMood) return explicitMood;
  const text = normalise(prompt);
  const ranked = Object.entries(moodKeywords)
    .map(([mood, keywords]) => ({
      mood: mood as Mood,
      score: countKeywordMatches(text, keywords) + (game.moodTags.includes(mood as Mood) ? 0.5 : 0)
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score ? ranked[0].mood : game.moodTags[0];
}

function inferSessionStyle(prompt: string, game: GameProfile, explicitStyle?: SessionStyle): SessionStyle {
  if (explicitStyle) return explicitStyle;
  const text = normalise(prompt);
  const ranked = Object.entries(styleKeywords)
    .map(([style, keywords]) => ({
      style: style as SessionStyle,
      score:
        countKeywordMatches(text, keywords) +
        (game.genres.some((genre) => keywords.some((keyword) => normalise(genre).includes(keyword))) ? 0.5 : 0)
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score ? ranked[0].style : game.energyProfile > 75 ? "ranked" : "story";
}

function inferTimeOfDay(prompt: string, explicitTime?: TimeOfDay): TimeOfDay {
  if (explicitTime) return explicitTime;
  const text = normalise(prompt);
  const ranked = Object.entries(timeKeywords)
    .map(([timeOfDay, keywords]) => ({
      timeOfDay: timeOfDay as TimeOfDay,
      score: countKeywordMatches(text, keywords)
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score ? ranked[0].timeOfDay : "evening";
}

function intensityFor(mood: Mood, sessionStyle: SessionStyle, game: GameProfile, durationMinutes: number) {
  const moodBoost: Record<Mood, number> = {
    focused: 8,
    chill: -24,
    dark: 10,
    hype: 18,
    nostalgic: -8
  };
  const styleBoost: Record<SessionStyle, number> = {
    ranked: 12,
    story: 0,
    farming: -20,
    "co-op": 4,
    grind: 6
  };
  const durationAdjustment = durationMinutes > 100 ? -6 : durationMinutes < 40 ? 5 : 0;
  return Math.max(5, Math.min(98, Math.round(game.energyProfile + moodBoost[mood] + styleBoost[sessionStyle] + durationAdjustment)));
}

function buildSignals(request: RecommendationRequest, game: GameProfile): RecommendationSignals {
  const inferredMood = inferMood(request.prompt, game, request.mood);
  const sessionStyle = inferSessionStyle(request.prompt, game, request.sessionStyle);
  const timeOfDay = inferTimeOfDay(request.prompt, request.timeOfDay);
  const durationMinutes = request.durationMinutes ?? game.averageSessionMinutes;
  const intensity = intensityFor(inferredMood, sessionStyle, game, durationMinutes);

  const tags = Array.from(
    new Set([
      inferredMood,
      sessionStyle,
      timeOfDay,
      ...game.genres.slice(0, 3).map((genre) => genre.toLowerCase())
    ])
  );

  return { inferredMood, sessionStyle, timeOfDay, intensity, tags };
}

function scoreTrack(track: TrackProfile, game: GameProfile, signals: RecommendationSignals) {
  const moodScore = track.moodTags.includes(signals.inferredMood) ? 36 : 0;
  const secondaryMoodScore = track.moodTags.some((mood) => game.moodTags.includes(mood)) ? 12 : 0;
  const genreScore = track.genres.some((trackGenre) =>
    game.genres.some((gameGenre) => normalise(trackGenre).includes(normalise(gameGenre).split(" ")[0]))
  )
    ? 14
    : 0;
  const intensityDistance = Math.abs(track.energy - signals.intensity);
  const intensityScore = Math.max(0, 28 - intensityDistance / 2);
  const valenceScore =
    signals.inferredMood === "dark"
      ? Math.max(0, 16 - track.valence / 8)
      : signals.inferredMood === "chill"
        ? Math.max(0, track.valence / 6)
        : 8;
  const timeScore =
    signals.timeOfDay === "late-night" && track.energy > 95
      ? -10
      : signals.timeOfDay === "morning" && track.valence > 55
        ? 8
        : 0;

  return moodScore + secondaryMoodScore + genreScore + intensityScore + valenceScore + timeScore;
}

function titleFor(game: GameProfile, signals: RecommendationSignals) {
  const moodName = signals.inferredMood.replace("-", " ");
  const styleName = signals.sessionStyle.replace("-", " ");
  return `${game.title}: ${moodName} ${styleName} mix`;
}

function explain(game: GameProfile, signals: RecommendationSignals, selectedTracks: TrackProfile[]) {
  const averageBpm = Math.round(selectedTracks.reduce((sum, track) => sum + track.bpm, 0) / selectedTracks.length);
  const genreList = game.genres.slice(0, 2).join(" and ");
  const firstTrack = selectedTracks[0];

  return [
    `Matched ${game.title} because it is a ${genreList} game with a ${game.energyProfile}/100 base intensity profile.`,
    `The request leans ${signals.inferredMood} for a ${signals.sessionStyle} session, so the engine targeted ${signals.intensity}/100 energy and an average tempo around ${averageBpm} BPM.`,
    `${firstTrack.title} leads the playlist because its mood tags and energy are closest to the requested session context.`
  ].join(" ");
}

export function createRecommendation(request: RecommendationRequest): PlaylistRecommendation {
  const game = findGame(request.gameTitle);
  const signals = buildSignals(request, game);
  const selectedTracks = [...tracks]
    .map((track) => ({
      track,
      score: scoreTrack(track, game, signals)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ track }) => track);

  return {
    id: `rec-${Date.now()}`,
    title: titleFor(game, signals),
    game,
    request,
    signals,
    tracks: selectedTracks,
    explanation: explain(game, signals, selectedTracks),
    createdAt: new Date().toISOString()
  };
}
