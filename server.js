import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const { PORT, DATABASE_URL } = process.env;
const client = new pg.Client({
    connectionString: DATABASE_URL,
});

app.use(express.static("public"));
app.use(express.json());

await client.connect();

app.get("/fst/musicians", (req, res) => {
    console.log("test!");
    client.query(`SELECT * FROM musicians`).then((data) => {
        res.send(data.rows);
    });
});

app.get("/fst/band", (req, res) => {
    console.log("test!");
    client.query(`SELECT * FROM band`).then((data) => {
        res.send(data.rows);
    });
});

app.get("/fst/bands/", (req, res) => {
    const id = req.params.id;
    client
        .query(
            `SELECT band.name, band.genre, musicians.member1, musicians.member2, musicians.member3, musicians.member4 FROM musicians INNER JOIN band ON musicians.band_id = band.id`
        )
        .then((data) => {
            res.send(data.rows);
        });
});

app.use("/", (req, res) => {
    res.sendStatus(404);
});

app.use((err, res, _, next) => {
    console.error(err);
    res.sendStatus(500);
    next();
});

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
