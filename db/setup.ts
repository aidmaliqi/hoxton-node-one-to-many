import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });

const museums = [
  {
    name: "Museum of Hazards",
    city: "Barcelona",
  },
  {
    name: "Gallery of Accidents",
    city: "Rome",
  },
  {
    name: "National Gallery of Ancestry",
    city: "Tokyo",
  },
  {
    name: "Childhood Gallery",
    city: "Berlin",
  },
];

const artworks = [
  {
    name: "Leonardo Da Vinci",
    picture: "Mona Lisa",
    museumsId: 1,
  },
  {
    name: "Johannes Vermeer",
    picture: "Girl with a Pearl Earring",
    museumsId: 3,
  },
  {
    name: "Vincent van Gogh",
    picture: "The Starry Night",
    museumsId: 4,
  },
  {
    name: "Gustav Klimt",
    picture: "The Kiss",
    museumsId: 2,
  },
  {
    name: "Sandro Botticelli",
    picture: "The Birth of Venus",
    museumsId: 1,
  },
  {
    name: "James Abbott McNeill Whistler",
    picture: "Arrangement in Grey and Black",
    museumsId: 3,
  },
  {
    name: "Jan van Eyck",
    picture: "The Arnolfini Portrait",
    museumsId: 3,
  },
  {
    name: "Hieronymus Bosch",
    picture: "The Garden of Earthly Delights",
    museumsId: 2,
  },
  {
    name: "Georges Seurat",
    picture: "A Sunday Afternoon on the Island of La Grande Jatte",
    museumsId: 4,
  },
  {
    name: "Pablo Picasso",
    picture: "Les Demoiselles d'Avignon",
    museumsId: 4,
  },
];

const deleteArtworks = db.prepare(`DROP TABLE IF EXISTS artworks`);
deleteArtworks.run();

const deleteMuseums = db.prepare(`DROP TABLE IF EXISTS museums`);
deleteMuseums.run();

const createMuseumTable = db.prepare(`
CREATE TABLE IF NOT EXISTS museums (
    id INTEGER,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    PRIMARY KEY (id)
)`);
createMuseumTable.run();

const createMuseum = db.prepare(`
INSERT INTO museums (name,city) VALUES (@name, @city)`);
for (const iterator of museums) {
  createMuseum.run(iterator);
}

const createArtworkTable = db.prepare(`
CREATE TABLE IF NOT EXISTS artworks (
    id INTEGER,
    name TEXT NOT NULL,
    picture TEXT NOT NULL,
    museumsId INTEGER NOT NULL,
    PRIMARY KEY (id)
    FOREIGN KEY (museumsId) REFERENCES museums(id)
)`);
createArtworkTable.run();

const createArtwork = db.prepare(`
INSERT INTO artworks (name,picture,museumsId) VALUES (@name,@picture,@museumsId)`);
for (const iterator of artworks) {
  createArtwork.run(iterator);
}
