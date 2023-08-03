// TODO: write get and post routes for /api/notes 
// get /notes should read db.json for user notes and return notes.html
// get * should return index.html

const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// this should return index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});