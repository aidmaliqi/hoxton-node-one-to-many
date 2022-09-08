import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const getMuseumById = db.prepare("SELECT * FROM museums WHERE id = @id");
const getAllMuseums = db.prepare("SELECT * FROM museums");
const getAllArtworks = db.prepare("SELECT * FROM artworks");
const getArtworksById = db.prepare(`SELECT * FROM artworks WHERE id = @id`);
const createMuseum = db.prepare(
  `INSERT INTO museums (name,city) VALUES (@name, @city)`
);
const createArtwork = db.prepare(`
INSERT INTO artworks (name,picture,museumsId) VALUES (@name,@picture,@museumsId)`);

app.get(`/museums`, (req, res) => {
  const museumsData = getAllMuseums.all();
  res.send(museumsData);
});
app.get("/museums/:id", (req, res) => {
  const specificMuseum = getMuseumById.get(req.params);

  if (specificMuseum) {
    const artworksOfMuseum = getArtworksById.all(req.params);
    specificMuseum.artworks = artworksOfMuseum;
    res.send(specificMuseum);
  } else {
    res.status(404).send("museum not found");
  }
});

app.post("/museums", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("name is not found or is not a string");
  }
  if (typeof req.body.city !== "string") {
    errors.push("city is not found or is not a string");
  }
  if (errors.length === 0) {
    const newMuseum = createMuseum.run(req.body);
    const newMuseumData = getMuseumById.get({ id: newMuseum.lastInsertRowid });
    res.send(newMuseumData);
  } else {
    res.status(400).send({ errors });
  }
});

app.get(`/artworks`, (req, res) => {
  const artworksData = getAllArtworks.all();
  res.send(artworksData);
});

app.get(`/artworks/:id`, (req, res) => {
  const specificArtwork = getArtworksById.get(req.params);

  if (specificArtwork) {
    const museum = getMuseumById.get({ id: specificArtwork.museumsId });
    specificArtwork.museum = museum;
    res.send(specificArtwork);
  } else {
    res.status(404).send("artwork not found");
  }
});

app.post("/artworks", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("name is not found or is not a string");
  }
  if (typeof req.body.picture !== "string") {
    errors.push("picture is not found or is not a string");
  }
  if (typeof req.body.museumsId !== "number") {
    errors.push("museumsId is not found or is not a number");
  }

  if (errors.length === 0) {
    const checkMuseum = getMuseumById.get({ id: req.body.museumsId });
    if (checkMuseum) {
      const newArtwork = createArtwork.run(req.body);

      const newArtworkData = getArtworksById.get({
        id: newArtwork.lastInsertRowid,
      });
      newArtworkData.museum = checkMuseum;
      res.send(newArtworkData);
    } else {
      res
        .status(404)
        .send(
          "you are trying to create an artwork in a museum that does not exist"
        );
    }
  } else {
    res.status(400).send({ errors });
  }
});

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
