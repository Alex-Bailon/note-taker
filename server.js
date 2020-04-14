const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
let PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"))
});  

app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    fs.readFile('./db/db.json', 'utf-8', function(error, data) {
        if (error) {
          return console.log(error);
        }
        let dataRetun = JSON.parse(data)
        dataRetun.push(newNote)
        fs.writeFile('./db/db.json', JSON.stringify(dataRetun), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
      });
      
});

app.delete("/api/notes/:id",function(req, res) {
    var chosen = req.params.id;

})


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});