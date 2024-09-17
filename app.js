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

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});