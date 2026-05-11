# External API Plan

## Spotify

Use Spotify OAuth for a user-owned integration.

- Read user profile and playlists.
- Search tracks by genre, mood, BPM, and artist signals.
- Create or update a playlist from a recommendation.
- Store `spotifyPlaylistId` and `spotifyUri` values in PostgreSQL.

## Steam

Use Steam Web API for play history and achievement context.

- Import owned games and playtime.
- Pull recently played games.
- Enrich a recommendation with achievements or current game progress.
- Map Steam app IDs to local `Game` rows.

## RAWG

Use RAWG as the game metadata source.

- Search games by title.
- Pull genres, platforms, release date, and tags.
- Use metadata to infer base intensity and playlist matching context.

## OpenAI

Start with constrained AI outputs rather than letting the model choose everything.

- Parse free-text prompts into `{ game, mood, sessionStyle, timeOfDay, duration }`.
- Generate a short recommendation explanation from deterministic scoring results.
- Later, add RAG over listening history, game history, liked playlists, and previous recommendations.

## Security Notes

- Keep API keys server-side only.
- Use OAuth tokens with refresh flow and scoped permissions.
- Store secrets in environment variables or platform secret storage.
- Add user ownership checks before reading or mutating playlists.
