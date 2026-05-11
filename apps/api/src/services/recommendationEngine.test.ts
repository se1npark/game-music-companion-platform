import { describe, expect, it } from "vitest";
import { createRecommendation, findGame } from "./recommendationEngine.js";

describe("recommendation engine", () => {
  it("matches a dark Valorant prompt to a high intensity playlist", () => {
    const recommendation = createRecommendation({
      gameTitle: "Valorant",
      prompt: "I am playing Valorant tonight and want dark, intense music.",
      durationMinutes: 90
    });

    expect(recommendation.game.title).toBe("Valorant");
    expect(recommendation.signals.inferredMood).toBe("dark");
    expect(recommendation.signals.timeOfDay).toBe("late-night");
    expect(recommendation.tracks).toHaveLength(8);
    expect(recommendation.signals.intensity).toBeGreaterThan(80);
  });

  it("keeps cozy farming sessions low energy", () => {
    const recommendation = createRecommendation({
      gameTitle: "Stardew Valley",
      prompt: "I want chill music for a cozy farming session.",
      durationMinutes: 60
    });

    const averageEnergy =
      recommendation.tracks.reduce((sum, track) => sum + track.energy, 0) / recommendation.tracks.length;

    expect(recommendation.signals.inferredMood).toBe("chill");
    expect(recommendation.signals.sessionStyle).toBe("farming");
    expect(averageEnergy).toBeLessThan(60);
  });

  it("falls back to a seeded game when the game name is unknown", () => {
    expect(findGame("some unreleased prototype").title).toBe("Valorant");
  });
});
