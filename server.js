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
            `SELECT band.name, band.genre, musicians.member1, musicians.member2, musicians.member3, musicians.member4, musicians.band_id FROM musicians INNER JOIN band ON musicians.band_id = band.id ORDER BY band.id DESC`
        )
        .then((data) => {
            res.send(data.rows);
        })
        .catch(next);
});

app.delete("/api/bands/:id", (req, res, next) => {
    const id = req.params.id;
    client.query(`DELETE FROM musicians WHERE musicians.band_id=$1`, [id]);
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

app.post("/api/musicians/", (req, res, next) => {
    const { member1, member2, member3, member4, band_id } = req.body;
    client
        .query(
            `INSERT INTO musicians(member1, member2, member3, member4, band_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [member1, member2, member3, member4, band_id]
        )
        .then((data) => {
            res.sendStatus(201);
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
    client
        .query(`SELECT * FROM band WHERE id=$1`, [id])
        .then((data) => {
            if (data.rows[0] === undefined) {
                return res.sendStatus(404);
            } else {
                client
                    .query(
                        `UPDATE band SET name = COALESCE($1, name), genre = COALESCE($2, genre) WHERE id=$3 RETURNING *`,
                        [name, genre, id]
                    )
                    .then(() => {
                        res.sendStatus(204);
                    });
            }
        })
        .catch(next);
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
