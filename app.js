const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            // La table existe déjà
        } else {
            // Table fraîchement créer, ajouter la data
            const insert = 'INSERT OR IGNORE INTO contacts (name, email) VALUES (?,?)';
            db.run(insert, ["contact1","contact1@example.com"]);
            db.run(insert, ["contact2","contact2@example.com"]);
        }
    });

    db.all("SELECT * FROM contacts", [], (err, rows) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows)
    });
});

const express = require('express');
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
];
app.get('/api/items', (req, res) => {
    res.json(items);
});
app.post('/api/items', (req, res) => {
    const newItem = { id: items.length + 1, name: req.body.name };
    items.push(newItem);
    res.status(201).json(newItem);
})
app.delete('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const index = items.findIndex(item => item.id === itemId);
    if (index !== -1) {
        items.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});