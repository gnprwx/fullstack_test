import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const {PORT, DATABASE_URL} = process.env;
const client = new pg.Client({
    connectionString: DATABASE_URL,
});

app.use(express.static("public"));
app.use(express.json());

await client.connect();

app.get('/fst', (req, res) => {
    console.log('test!');
    res.send('x');
})

app.listen(PORT, () => {
    console.log(`Connected on port ${PORT}`);
});
