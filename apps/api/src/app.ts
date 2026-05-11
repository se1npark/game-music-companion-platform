import cors from "cors";
import express from "express";
import { dashboardRouter } from "./routes/dashboard.js";
import { gamesRouter } from "./routes/games.js";
import { libraryRouter } from "./routes/library.js";
import { playlistsRouter } from "./routes/playlists.js";
import { recommendationsRouter } from "./routes/recommendations.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.WEB_ORIGIN?.split(",") ?? true
    })
  );
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "game-music-companion-api",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/games", gamesRouter);
  app.use("/api/library", libraryRouter);
  app.use("/api/playlists", playlistsRouter);
  app.use("/api/recommendations", recommendationsRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
}
