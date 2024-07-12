const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

const server = http.createServer(app);

const io = socketio(server);

app.set('view engine', 'ejs');
staticpath = path.join(__dirname, "views");
app.use(express.static(staticpath));

io.on("connection", function(socket){

    const userId = uuidv4();
    console.log(`User connected: ${userId}`);
    socket.emit('user-id', userId);

    socket.on("send-location", function (data){
        console.log(`User ${userId} sent location: ${JSON.stringify(data)}`);
        io.emit('receive-location', { id: userId, ...data });
        // io.emit("receive-location", {id: socket.id, ...data});
    });
    // console.log("connected");
    socket.on("disconnect", function(){
        // io.emit("user-disconnected", socket.id);
        console.log(`User disconnected: ${userId}`);
        io.emit('user-disconnected', userId);
    })
})

app.get("/", function (req, res){
    res.render('index');
})

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));