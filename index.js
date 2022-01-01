const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Softy shop");
})

app.listen(port, () => {
    console.log("Listening port: ", port);
})