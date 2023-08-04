// TODO: write get and post routes for /api/notes 
// get /notes should read db.json for user notes and return notes.html
// get * should return index.html

const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// this should return index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// this should return notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
    //res.status(200).json(db);
    console.log(db);
});

// added get route to read db.json for user notes
app.get('/api/notes', (req, res) => {
    res.json(db);
})

// post route to add new notes to db.json
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    // note body, id should be a random number
    const newNote = {
        title,
        text,
        id: Math.floor((1 + Math.random()) * 0x1000)
    }
    // get existing notes from db.json and add new notes to it
    // corrected path to db.json
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const notes = JSON.parse(data);
            notes.push(newNote); // add new notes
            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => 
            err ? console.error(err) : console.log('New note added!'))
            // have notes show on notes.html

        }
    })
    const response = {
        status: 'success',
        body: newNote,
    };

    if (response.status === 'success') {
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

// try to delete notes?

app.listen(3000, () => console.log(`App listening at http://localhost:${PORT}`))