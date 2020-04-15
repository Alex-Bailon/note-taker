const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
let PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

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
        let dataArray = JSON.parse(data)
        dataArray.push(newNote)
        fs.writeFile('./db/db.json', JSON.stringify(dataArray), function (err) {
            if (err) throw err;
            return res.json(dataArray)
          });
      });
      
});

app.delete("/api/notes/:id",function(req, res) {
    var chosen = req.params.id;

    fs.readFile('./db/db.json', 'utf-8', function(error, data) {
        if (error) {
          return console.log(error);
        }
        let dataArray = JSON.parse(data)

        for(let i = 0; i < dataArray.length; i++){
            if(dataArray[i].title == chosen){
                dataArray.splice(i, 1)
            }
        }

        fs.writeFile('./db/db.json', JSON.stringify(dataArray), function (err) {
            if (err) throw err;
            return res.json(dataArray)
          });
      });
})

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});