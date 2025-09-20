import db from "../client.js";

export async function addTrackToPlaylist({ playlist_id, track_id }) {
  const SQL = `
    INSERT INTO playlists_tracks (playlist_id, track_id)
    VALUES ($1, $2)
    ON CONFLICT (playlist_id, track_id) DO NOTHING
    RETURNING *;
  `;
  const { rows: [playlistTrack] } = await db.query(SQL, [playlist_id, track_id]);
  return playlistTrack ?? null; 
}
