import express from "express";
import { getAllTracks, getTrackById } from "../db/queries/tracks.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const tracks = await getAllTracks();
    res.status(200).send(tracks);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch tracks" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).send({ error: "id must be a positive integer" });
    }
    const track = await getTrackById(id);
    if (!track) return res.status(404).send({ error: "track not found" });
    res.status(200).send(track);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch track" });
  }
});

export default router;
