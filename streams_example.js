const express = require("express");
const fs = require("fs")

const app = express();

app.get("/", (req, res) => {
    fs.readFile("./streams.txt", (data) => {
        res.send(data);
    });
});