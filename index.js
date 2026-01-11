const { Client } = require('pg');
const express = require('express');
const app = express();

const PORT = 8001;
// MiddleWares
app.use(express.json());

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "test",
    password: "",
    port: 5432,
});


client.connect().then(() => console.log("Connected to DATABASE")).catch((err) => console.log(err.message));

app.post('/postData', (req, res) => {
    const { name, id } = req.body;
    const insert_query = 'INSERT INTO demoTest (name,id) VALUES ($1,$2)';
    client.query(insert_query, [name, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        else {
            console.log("Data Inserted Successfully");
            res.send({ msg: "Data inserted successfully" });
        }
    });
})

app.get('/fetchData', (req, res) => {
    const fetch_query = 'SELECT * FROM demoTest';
    client.query(fetch_query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        else {
            console.log("Data Fetched Successfully");
            res.send(result.rows);
        }
    })
});

app.get('/fetchData/:id', (req, res) => {
    const id = req.params.id;
    const fetch_query = 'select * from demotest where id=$1';
    client.query(fetch_query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        else {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Data not found" });
            }
            console.log("Data fetched successfully");
            res.send(result.rows);

        }
    })
})

app.listen(PORT, () => console.log(`Server Started at port: ${PORT}`));