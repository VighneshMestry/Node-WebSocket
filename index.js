const express = require("express");
const app = express();
const path = require("path")

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const fs = require("fs");
const io = new Server(server);
const zlib = require("zlib");

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.get("/fileRead", (req, res) => {
    fs.readFile("./streams.txt", (err, data) => {
        return res.end(data);
    });
});

function func() {
    fs.createReadStream("./stream.txt").pipe(zlib.createGzip().pipe(fs.createWriteStream("./streams.zip")));
}

app.get("/streams", (req, res) => {
    const stream = fs.createReadStream("./streams.txt");
    stream.on("data", (chunk) => res.write(chunk));
    stream.on("end", () => res.end());
});

io.on("connection", (socket) => {
    console.log("Socket connected ", socket.id);

    socket.on("user-message", (message) => {
        console.log("Server " + message);
        io.emit("broadcast", message);
    })

    //the 'socket' object can be used to broadcast messages to the particular clients using 'broadcast' flag
});

server.listen(9000, () => console.log("Listening to 9000"));
