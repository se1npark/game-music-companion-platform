import { Router } from "express";
import { games, library, userProfile } from "../data/seed.js";

export const libraryRouter = Router();

libraryRouter.get("/", (_req, res) => {
  const data = library.map((entry) => ({
    ...entry,
    game: games.find((game) => game.id === entry.gameId)
  }));

  res.json({ profile: userProfile, data });
});
