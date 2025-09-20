import "dotenv/config";
import db from "./client.js";
import { createPlaylist } from "./queries/playlists.js";
import { createTrack } from "./queries/tracks.js";

async function seed() {

  for (let i = 1; i <= 10; i++) {
    await createPlaylist({
      name: `Playlist ${i}`,
      description: `Random Description ${i}`
    });
  }


  for (let i = 1; i <= 20; i++) {
    await createTrack({
      name: `Track ${i}`,
      duration_ms: 180000 + i * 1000
    });
  }

 
  const { rows: playlists } = await db.query(`SELECT id FROM playlists ORDER BY id`);
  const { rows: tracks } = await db.query(`SELECT id FROM tracks ORDER BY id`);

  let links = 0;
  for (let p = 0; p < Math.min(5, playlists.length); p++) {
    for (let t = 0; t < 5 && links < 15; t++) {
      const playlist_id = playlists[p].id;
      const track_id = tracks[(p * 3 + t) % tracks.length].id;
      await db.query(
        `INSERT INTO playlists_tracks (playlist_id, track_id)
         VALUES ($1, $2)
         ON CONFLICT (playlist_id, track_id) DO NOTHING`,
        [playlist_id, track_id]
      );
      links++;
    }
  }
}

(async () => {
  await db.connect();
  try {
    await seed();
    console.log("Database seeded.");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await db.end();
  }
})();
