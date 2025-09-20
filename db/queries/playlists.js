import db from "../client.js";

export async function createPlaylist({ name, description }) {
  const SQL = `
    INSERT INTO playlists (name, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const { rows: [playlist] } = await db.query(SQL, [name, description]);
  return playlist;
}

export async function getAllPlaylists() {
  const SQL = `SELECT * FROM playlists ORDER BY id;`;
  const { rows } = await db.query(SQL);
  return rows;
}

export async function getPlaylistById(id) {
  const SQL = `SELECT * FROM playlists WHERE id = $1;`;
  const { rows: [playlist] } = await db.query(SQL, [id]);
  return playlist;
}

export async function getTracksForPlaylist(id) {
  const SQL = `
    SELECT t.*
    FROM playlists_tracks pt
    JOIN tracks t ON t.id = pt.track_id
    WHERE pt.playlist_id = $1
    ORDER BY t.id;
  `;
  const { rows } = await db.query(SQL, [id]);
  return rows;
}
