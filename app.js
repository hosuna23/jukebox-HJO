import express from "express";
import tracksRoutes from "./api/tracks.js";
import playlistsRoutes from "./api/playlists.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Works");
});


app.use("/tracks", tracksRoutes);
app.use("/playlists", playlistsRoutes);

export default app;
