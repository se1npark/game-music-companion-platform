import { Router } from "express";
import { games } from "../data/seed.js";

export const gamesRouter = Router();

gamesRouter.get("/", (req, res) => {
  const query = String(req.query.q ?? "").toLowerCase();
  const filtered = query
    ? games.filter((game) => {
        const haystack = `${game.title} ${game.genres.join(" ")} ${game.platforms.join(" ")}`.toLowerCase();
        return haystack.includes(query);
      })
    : games;

  res.json({ data: filtered });
});
