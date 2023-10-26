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

app.get("/api/musicians", (req, res, next) => {
    client
        .query(`SELECT * FROM musicians`)
        .then((data) => {
            res.send(data.rows);
        })
        .catch(next);
});

app.get("/api/band", (req, res, next) => {
    client
        .query(`SELECT * FROM band`)
        .then((data) => {
            res.send(data.rows);
        })
        .catch(next);
});

app.get("/api/bands", (req, res, next) => {
    const id = req.params.id;
    client
        .query(
            `SELECT band.name, band.genre, musicians.member1, musicians.member2, musicians.member3, musicians.member4, musicians.band_id FROM musicians INNER JOIN band ON musicians.band_id = band.id`
        )
        .then((data) => {
            res.send(data.rows);
        })
        .catch(next);
});

app.delete("/api/bands/:id", (req, res, next) => {
    const id = req.params.id;
    client
        .query(`DELETE FROM musicians WHERE musicians.band_id=$1 RETURNING *`, [
            id,
        ])
        .then(() => {
            client
                .query(`DELETE FROM band WHERE id=$1 RETURNING *`, [id])
                .then((data) => {
                    if (data.rows[0] === undefined) {
                        return res.sendStatus(404);
                    } else {
                        res.send(data.rows[0]);
                    }
                })
                .catch(next);
        });
});

app.put("/api/bands/:id", (req, res) => {
    const { name, genre } = req.body;
    const id = req.params.id;
    console.log(id, name, genre);
});

app.use("/", (req, res) => {
    res.sendStatus(404);
});

app.use((err, _, res, next) => {
    res.sendStatus(500);
    console.error(err);
    next();
});

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
