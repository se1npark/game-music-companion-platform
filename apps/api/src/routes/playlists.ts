import { Router } from "express";
import { z } from "zod";
import { savedPlaylists } from "../data/seed.js";

const savePlaylistSchema = z.object({
  recommendationId: z.string().min(1),
  title: z.string().min(2),
  trackCount: z.number().int().min(1)
});

export const playlistsRouter = Router();

playlistsRouter.get("/", (_req, res) => {
  res.json({ data: savedPlaylists });
});

playlistsRouter.post("/", (req, res) => {
  const parsed = savePlaylistSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid playlist payload", details: parsed.error.flatten() });
  }

  const playlist = {
    id: `playlist-${Date.now()}`,
    ...parsed.data,
    createdAt: new Date().toISOString()
  };

  savedPlaylists.unshift(playlist);
  return res.status(201).json({ data: playlist });
});
