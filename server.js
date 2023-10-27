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

app.get("/api/musicians", (_, res, next) => {
    client
        .query(`SELECT * FROM musicians`)
        .then((data) => {
            res.send(data.rows);
        })
        .catch(next);
});

app.get("/api/band", (_, res, next) => {
    client
        .query(`SELECT * FROM band`)
        .then((data) => {
            res.send(data.rows);
        })
        .catch(next);
});

app.get("/api/bands", (req, res, next) => {
    client
        .query(
            `SELECT band.name, band.genre, musicians.musician1, musicians.musician2, musicians.musician3, musicians.musician4, musicians.band_id FROM musicians INNER JOIN band ON musicians.band_id = band.id ORDER BY band.id ASC`
        )
        .then((data) => {
            res.send(data.rows);
        })
        .catch(next);
});

app.get("/api/bands/:id", (req, res, next) => {
    const id = req.params.id;
    client
        .query(
            `SELECT band.name, band.genre, musicians.musician1, musicians.musician2, musicians.musician3, musicians.musician4, musicians.band_id FROM musicians INNER JOIN band ON musicians.band_id = band.id WHERE musicians.band_id=$1`,
            [id]
        )
        .then((data) => {
            res.send(data.rows[0]);
        })
        .catch(next);
});

app.delete("/api/bands/:id", (req, res, next) => {
    const id = req.params.id;
    client
        .query(`DELETE FROM musicians WHERE musicians.band_id=$1 RETURNING *`, [
            id,
        ])
        .then((data) => {
            if (data.rows[0] === undefined) {
                return res.sendStatus(404);
            }
            client.query(`DELETE FROM band WHERE id=$1 RETURNING *`, [id]);
            return res.sendStatus(200);
        })
        .catch(next);
});

app.post("/api/musicians/", (req, res, next) => {
    const { musician1, musician2, musician3, musician4, band_id } = req.body;
    // validation to prevent post without all of the above
    client
        .query(
            `INSERT INTO musicians(musician1, musician2, musician3, musician4, band_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [musician1, musician2, musician3, musician4, band_id]
        )
        .then((data) => {
            res.send(data.rows[0]);
            res.statusCode = 201;
        })
        .catch(next);
});

app.post("/api/band", (req, res, next) => {
    const { name, genre } = req.body;
    client
        .query(`INSERT INTO band(name, genre) VALUES ($1,$2)`, [name, genre])
        .then(() => {
            res.sendStatus(201);
        })
        .catch(next);
});

app.patch("/api/band/:id", (req, res, next) => {
    const { name, genre } = req.body;
    const id = req.params.id;
    return client
        .query(`SELECT * FROM band WHERE id=$1`, [id])
        .then((data) => {
            if (data.rows[0] === undefined) {
                return res.sendStatus(404);
            }
            client.query(
                `UPDATE band SET name = COALESCE($1, name), genre = COALESCE($2, genre) WHERE id=$3 RETURNING *`,
                [name, genre, id]
            );
            return res.sendStatus(204);
        })
        .catch(next);
});

app.patch("/api/musicians/:id", (req, res, next) => {
    const { musician1, musician2, musician3, musician4 } = req.body;
    const id = req.params.id;
    client
        .query(`SELECT * FROM musicians WHERE band_id=$1`, [id])
        .then((data) => {
            if (data.rows[0] === undefined) {
                return res.sendStatus(404);
            }
            client.query(
                `UPDATE musicians SET musician1 = COALESCE($1, musician1), musician2 = COALESCE($2, musician2), musician3 = COALESCE($3, musician3), musician4 = COALESCE($4, musician4) WHERE band_id=$5 RETURNING *`,
                [musician1, musician2, musician3, musician4, id]
            );
            return res.sendStatus(204);
        })
        .catch(next);
});

app.use("/", (_, res) => {
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
