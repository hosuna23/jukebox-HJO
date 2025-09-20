import db from "../client.js";

export async function createTrack({ name, duration_ms }) {
  const SQL = `
    INSERT INTO tracks (name, duration_ms)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const { rows: [track] } = await db.query(SQL, [name, duration_ms]);
  return track;
}

export async function getAllTracks() {
  const SQL = `SELECT * FROM tracks ORDER BY id;`;
  const { rows } = await db.query(SQL);
  return rows;
}

export async function getTrackById(id) {
  const SQL = `SELECT * FROM tracks WHERE id = $1;`;
  const { rows: [track] } = await db.query(SQL, [id]);
  return track;
}
