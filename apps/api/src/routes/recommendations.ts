import { Router } from "express";
import { z } from "zod";
import { createRecommendation } from "../services/recommendationEngine.js";

const recommendationSchema = z.object({
  gameTitle: z.string().min(2),
  prompt: z.string().min(5),
  mood: z.enum(["focused", "chill", "dark", "hype", "nostalgic"]).optional(),
  sessionStyle: z.enum(["ranked", "story", "farming", "co-op", "grind"]).optional(),
  timeOfDay: z.enum(["morning", "afternoon", "evening", "late-night"]).optional(),
  durationMinutes: z.coerce.number().int().min(15).max(240).optional()
});

export const recommendationsRouter = Router();

recommendationsRouter.post("/", (req, res) => {
  const parsed = recommendationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid recommendation request", details: parsed.error.flatten() });
  }

  const recommendation = createRecommendation(parsed.data);
  return res.status(201).json({ data: recommendation });
});
