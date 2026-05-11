import type {
  DashboardStats,
  GameProfile,
  Mood,
  PlaylistRecommendation,
  SavedPlaylist,
  SessionStyle,
  TimeOfDay,
  UserProfile
} from "@game-music/shared";
import {
  Activity,
  BarChart3,
  Clock3,
  Database,
  Gamepad2,
  Headphones,
  Library,
  Loader2,
  Music2,
  PlayCircle,
  Save,
  Search,
  ServerCog,
  Sparkles
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  createRecommendation,
  getDashboard,
  getGames,
  getLibrary,
  getPlaylists,
  LibraryEntryWithGame,
  savePlaylist
} from "./api";

const moods: Mood[] = ["focused", "chill", "dark", "hype", "nostalgic"];
const sessionStyles: SessionStyle[] = ["ranked", "story", "farming", "co-op", "grind"];
const timesOfDay: TimeOfDay[] = ["morning", "afternoon", "evening", "late-night"];
const chartColors = ["#1f7a5c", "#e26655", "#e6a93b", "#5b6f95", "#6f5f41"];

const emptyDashboard: DashboardStats = {
  totalGames: 0,
  totalPlaylists: 0,
  weeklyPlayMinutes: 0,
  favouriteMood: "focused",
  genreBreakdown: [],
  moodBreakdown: [],
  serviceHealth: []
};

function formatMood(label: string) {
  return label
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="min-h-28 rounded-lg border border-ink/10 bg-white/70 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink/60">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: accent }}>
          <Icon className="h-4 w-4 text-white" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function App() {
  const [games, setGames] = useState<GameProfile[]>([]);
  const [library, setLibrary] = useState<LibraryEntryWithGame[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dashboard, setDashboard] = useState<DashboardStats>(emptyDashboard);
  const [playlists, setPlaylists] = useState<SavedPlaylist[]>([]);
  const [recommendation, setRecommendation] = useState<PlaylistRecommendation | null>(null);
  const [gameTitle, setGameTitle] = useState("Valorant");
  const [prompt, setPrompt] = useState("I'm playing Valorant tonight and want dark, intense music.");
  const [mood, setMood] = useState<Mood>("dark");
  const [sessionStyle, setSessionStyle] = useState<SessionStyle>("ranked");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("late-night");
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("Loading demo data");

  useEffect(() => {
    async function load() {
      try {
        const [dashboardResponse, gamesResponse, libraryResponse, playlistsResponse] = await Promise.all([
          getDashboard(),
          getGames(),
          getLibrary(),
          getPlaylists()
        ]);
        setDashboard(dashboardResponse.data);
        setGames(gamesResponse.data);
        setLibrary(libraryResponse.data);
        setProfile(libraryResponse.profile);
        setPlaylists(playlistsResponse.data);
        setStatus("API connected");
      } catch {
        setStatus("API offline");
      }
    }

    void load();
  }, []);

  const selectedGame = useMemo(
    () => games.find((game) => game.title === gameTitle) ?? games[0],
    [gameTitle, games]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("Generating playlist");

    try {
      const response = await createRecommendation({
        gameTitle,
        prompt,
        mood,
        sessionStyle,
        timeOfDay,
        durationMinutes
      });
      setRecommendation(response.data);
      setStatus("Recommendation ready");
    } catch {
      setStatus("Recommendation failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSavePlaylist() {
    if (!recommendation) return;

    const response = await savePlaylist({
      recommendationId: recommendation.id,
      title: recommendation.title,
      trackCount: recommendation.tracks.length
    });
    setPlaylists((current) => [response.data, ...current]);
    setDashboard((current) => ({ ...current, totalPlaylists: current.totalPlaylists + 1 }));
  }

  return (
    <main className="min-h-screen px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-moss">
              <Headphones className="h-4 w-4" aria-hidden="true" />
              Game Music Companion
            </div>
            <h1 className="max-w-4xl text-3xl font-semibold text-ink sm:text-4xl">
              Playlist intelligence for game sessions
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-white/70 px-3 py-2 font-medium">
              <ServerCog className="h-4 w-4 text-moss" aria-hidden="true" />
              {status}
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-white/70 px-3 py-2 font-medium">
              <Clock3 className="h-4 w-4 text-coral" aria-hidden="true" />
              {profile?.region ?? "Australia/Sydney"}
            </span>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile icon={Gamepad2} label="Games indexed" value={String(dashboard.totalGames)} accent="#1f7a5c" />
          <StatTile icon={Music2} label="Saved playlists" value={String(dashboard.totalPlaylists)} accent="#e26655" />
          <StatTile
            icon={Activity}
            label="Weekly playtime"
            value={`${Math.round(dashboard.weeklyPlayMinutes / 60)}h`}
            accent="#e6a93b"
          />
          <StatTile icon={Sparkles} label="Favourite mood" value={formatMood(dashboard.favouriteMood)} accent="#5b6f95" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <form className="rounded-lg border border-ink/10 bg-white/75 p-5 shadow-sm" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="h-5 w-5 text-coral" aria-hidden="true" />
                Session composer
              </h2>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <PlayCircle className="h-4 w-4" aria-hidden="true" />}
                Generate
              </button>
            </div>

            <label className="mt-5 block text-sm font-semibold text-ink/70" htmlFor="game">
              Game
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-ink/10 bg-cloud px-3">
              <Search className="h-4 w-4 text-ink/50" aria-hidden="true" />
              <select
                id="game"
                className="h-11 w-full bg-transparent text-sm outline-none"
                value={gameTitle}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setGameTitle(nextTitle);
                  setPrompt(`Give me a playlist for ${nextTitle}.`);
                }}
              >
                {games.map((game) => (
                  <option key={game.id} value={game.title}>
                    {game.title}
                  </option>
                ))}
              </select>
            </div>

            <label className="mt-4 block text-sm font-semibold text-ink/70" htmlFor="prompt">
              Prompt
            </label>
            <textarea
              id="prompt"
              className="mt-2 min-h-28 w-full resize-none rounded-lg border border-ink/10 bg-cloud p-3 text-sm outline-none"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="block text-sm font-semibold text-ink/70" htmlFor="mood">
                Mood
                <select
                  id="mood"
                  className="mt-2 h-11 w-full rounded-lg border border-ink/10 bg-cloud px-3 text-sm outline-none"
                  value={mood}
                  onChange={(event) => setMood(event.target.value as Mood)}
                >
                  {moods.map((item) => (
                    <option key={item} value={item}>
                      {formatMood(item)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-ink/70" htmlFor="style">
                Session
                <select
                  id="style"
                  className="mt-2 h-11 w-full rounded-lg border border-ink/10 bg-cloud px-3 text-sm outline-none"
                  value={sessionStyle}
                  onChange={(event) => setSessionStyle(event.target.value as SessionStyle)}
                >
                  {sessionStyles.map((item) => (
                    <option key={item} value={item}>
                      {formatMood(item)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-ink/70" htmlFor="time">
                Time
                <select
                  id="time"
                  className="mt-2 h-11 w-full rounded-lg border border-ink/10 bg-cloud px-3 text-sm outline-none"
                  value={timeOfDay}
                  onChange={(event) => setTimeOfDay(event.target.value as TimeOfDay)}
                >
                  {timesOfDay.map((item) => (
                    <option key={item} value={item}>
                      {formatMood(item)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-ink/70" htmlFor="duration">
                Minutes
                <input
                  id="duration"
                  type="number"
                  min={15}
                  max={240}
                  className="mt-2 h-11 w-full rounded-lg border border-ink/10 bg-cloud px-3 text-sm outline-none"
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(Number(event.target.value))}
                />
              </label>
            </div>

            {selectedGame ? (
              <div className="mt-5 border-t border-ink/10 pt-4 text-sm text-ink/70">
                <p className="font-semibold text-ink">{selectedGame.title}</p>
                <p className="mt-1">{selectedGame.genres.join(" / ")}</p>
                <p className="mt-1">{selectedGame.platforms.join(", ")}</p>
              </div>
            ) : null}
          </form>

          <div className="grid gap-6">
            <section className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-semibold text-white/60">Recommendation</p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {recommendation?.title ?? "Generate a session mix"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleSavePlaylist}
                  disabled={!recommendation}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-honey disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save
                </button>
              </div>

              {recommendation ? (
                <>
                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    {[
                      ["Mood", formatMood(recommendation.signals.inferredMood)],
                      ["Session", formatMood(recommendation.signals.sessionStyle)],
                      ["Time", formatMood(recommendation.signals.timeOfDay)],
                      ["Energy", `${recommendation.signals.intensity}/100`]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-white/10 bg-white/8 p-3">
                        <p className="text-xs font-semibold text-white/50">{label}</p>
                        <p className="mt-2 text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 max-w-4xl text-sm leading-6 text-white/75">{recommendation.explanation}</p>
                  <div className="mt-5 divide-y divide-white/10">
                    {recommendation.tracks.map((track, index) => (
                      <div key={track.id} className="grid gap-3 py-3 sm:grid-cols-[44px_minmax(0,1fr)_90px] sm:items-center">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-sm font-semibold">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{track.title}</p>
                          <p className="truncate text-sm text-white/55">
                            {track.artist} · {track.genres.slice(0, 2).join(", ")}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-honey">{track.bpm} BPM</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-8 min-h-72 rounded-lg border border-dashed border-white/20 p-6 text-white/65">
                  <Music2 className="h-8 w-8 text-honey" aria-hidden="true" />
                  <p className="mt-4 max-w-xl text-sm leading-6">
                    Select a game, mood, time, and session style to create a playlist with explainable matching signals.
                  </p>
                </div>
              )}
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-lg border border-ink/10 bg-white/75 p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <BarChart3 className="h-5 w-5 text-moss" aria-hidden="true" />
                  Library analytics
                </h2>
                <div className="mt-5 grid min-h-72 gap-4 md:grid-cols-2">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dashboard.genreBreakdown}>
                      <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "rgba(31,122,92,0.08)" }} />
                      <Bar dataKey="value" fill="#1f7a5c" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={dashboard.moodBreakdown} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86}>
                        {dashboard.moodBreakdown.map((entry, index) => (
                          <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg border border-ink/10 bg-white/75 p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Database className="h-5 w-5 text-coral" aria-hidden="true" />
                  Service map
                </h2>
                <div className="mt-4 divide-y divide-ink/10">
                  {dashboard.serviceHealth.map((service) => (
                    <div key={service.service} className="py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{service.service}</p>
                        <span className="rounded-lg bg-cloud px-2 py-1 text-xs font-semibold text-ink/70">
                          {service.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-ink/60">{service.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-ink/10 bg-white/75 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Library className="h-5 w-5 text-honey" aria-hidden="true" />
              Game library
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {library.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-ink/10 bg-cloud p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{entry.game?.title}</p>
                      <p className="mt-1 text-sm text-ink/60">{entry.game?.genres.slice(0, 2).join(" / ")}</p>
                    </div>
                    <span className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-moss">
                      {formatMood(entry.preferredMood)}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <p>
                      <span className="block text-ink/50">Hours</span>
                      <span className="font-semibold">{entry.hoursPlayed}</span>
                    </p>
                    <p>
                      <span className="block text-ink/50">Achievements</span>
                      <span className="font-semibold">
                        {entry.achievementsUnlocked}/{entry.totalAchievements || "-"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white/75 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Music2 className="h-5 w-5 text-coral" aria-hidden="true" />
              Saved playlists
            </h2>
            <div className="mt-4 divide-y divide-ink/10">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="py-3">
                  <p className="font-semibold">{playlist.title}</p>
                  <p className="mt-1 text-sm text-ink/60">
                    {playlist.trackCount} tracks · {new Date(playlist.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
