//Install Dependencies 
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
//Set port
const port = 4040;
const mainDir = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//API CALLS
//GET calls to retrieve notes
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(mainDir, "notes.html"));
    });
    app.get("/api/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "/db/db.json"));
    });

    app.get("/api/notes/:id", function (req, res) {
                                    //file type
        let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
        res.json(savedNotes[Number(req.params.id)]);
    });

    app.get("*", function (req, res) {
        res.sendFile(path.join(mainDir, "index.html"));
    });
//POST call to push new notes
    app.post("/api/notes", function (req, res) {
                                    //file type
        let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
        let newNote = req.body;
        let uniqueID = (savedNotes.length).toString();
            newNote.id = uniqueID;
            savedNotes.push(newNote);
//Write the file
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
        console.log("Note saved: ", newNote);
        res.json(savedNotes);
})
//DELETE note function using ID
    app.delete("/api/notes/:id", function (req, res) {
                                    //file type
        let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
        let noteID = req.params.id;
        let newID = 0;
            console.log(`Delete note ID: ${noteID}`);
            savedNotes = savedNotes.filter(currNote => {
                return currNote.id != noteID;
    })

        for (currNote of savedNotes) {
            currNote.id = newID.toString();
                newID++;
        }

        fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
        res.json(savedNotes);
    })

    
//console.log to check port and app functionality 
    app.listen(port, function () {
        console.log(`Now listening on port ${port}. `);
    })