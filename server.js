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

app.get("/fst/band/:id", (req, res) => {
    const id = req.params.id;
    client
        .query(
            `SELECT musicians.member1, musicians.member2, musicians.member3, musicians.member4, band.name, band.genre FROM musicians INNER JOIN band ON musicians.band_id = band.id WHERE band.id = $1`,
            [id]
        )
        .then((data) => {
            res.send(data.rows[0]);
        });
});

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
