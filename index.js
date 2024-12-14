const express = require("express");
const app = express();
const path = require("path")

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

io.on("connection", (socket) => {
    console.log("Socket connected ", socket.id);

    socket.on("user-message", (message) => {
        console.log("Server " + message);
        io.emit("broadcast", message);
    })
});

server.listen(9000, () => console.log("Listening to 9000"));
