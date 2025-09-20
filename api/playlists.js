import express from "express";
import { createPlaylist, getAllPlaylists, getPlaylistById, getTracksForPlaylist } from "../db/queries/playlists.js";
import { addTrackToPlaylist } from "../db/queries/playlists_tracks.js";
import { getTrackById } from "../db/queries/tracks.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const playlists = await getAllPlaylists();
    res.status(200).send(playlists);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch playlists" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body ?? {};
    if (!name || !description) {
      return res.status(400).send({ error: "name and description are required" });
    }
    const playlist = await createPlaylist({ name, description });
    res.status(201).send(playlist);
  } catch (err) {
    res.status(500).send({ error: "Failed to create playlist" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).send({ error: "id must be a positive integer" });
    }
    const playlist = await getPlaylistById(id);
    if (!playlist) return res.status(404).send({ error: "playlist not found" });
    res.status(200).send(playlist);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch playlist" });
  }
});


router.get("/:id/tracks", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).send({ error: "id must be a positive integer" });
    }
    
    const playlist = await getPlaylistById(id);
    if (!playlist) return res.status(404).send({ error: "playlist not found" });

    const tracks = await getTracksForPlaylist(id);
    res.status(200).send(tracks);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch tracks for playlist" });
  }
});


router.post("/:id/tracks", async (req, res) => {
  try {
    const playlist_id = Number(req.params.id);
    const { trackId } = req.body ?? {};

    if (!Number.isInteger(playlist_id) || playlist_id <= 0) {
      return res.status(400).send({ error: "id must be a positive integer" });
    }
    if (!Number.isInteger(trackId) || trackId <= 0) {
      return res.status(400).send({ error: "trackId must be a positive integer" });
    }

    
    const playlist = await getPlaylistById(playlist_id);
    if (!playlist) return res.status(404).send({ error: "playlist not found" });

    const track = await getTrackById(trackId);
    if (!track) return res.status(404).send({ error: "track not found" });

    const created = await addTrackToPlaylist({ playlist_id, track_id: trackId });
   
    if (!created) {
      return res.status(409).send({ error: "track already in playlist" });
    }

    res.status(201).send(created);
  } catch (err) {
    res.status(500).send({ error: "Failed to add track to playlist" });
  }
});

export default router;
