//required npm
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
let PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
//get request for when user going to /notes of the app will show them the notes.html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
//get request for when user going to /api/notes of the app will show the db.json
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"))
});  
//post request for when user saves a note. Reads db.json, pushes user input and then writes json file 
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
//delete request for when user clickes delete button
app.delete("/api/notes/:id",function(req, res) {
    var chosen = req.params.id;
    //fist read file and then go through array to look for matching title and remove the matching title
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
        //write file and return back the data
        fs.writeFile('./db/db.json', JSON.stringify(dataArray), function (err) {
            if (err) throw err;
            return res.json(dataArray)
          });
      });
})
//get request if user goes to any path other then the ones listed above will take user to index.html
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});