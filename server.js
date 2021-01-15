const path = require("path");
const http = require("http");
const express = require("express");
const formatMessage = require("./utils/message");
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require("./utils/users");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// create static folder
app.use(express.static(path.join(__dirname, "public")));
const botName = "Wetalk";
// run when anyone connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // wellcome message
    socket.emit("message", formatMessage(botName, `welcome to chat ${user.username} `));

    // broadcast when user connect
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botName, `${user.username} has connect`));
  // send user annd room
  io.to(user.room).emit('roomUsers',{
      room:user.room,
      users: getRoomUsers(user.room)
  });
    });

  //listen for chatMessage

  socket.on("chatMessage", (msg) => {
   const user=getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));

    //runs when user disconnect

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message", 
            formatMessage(botName, `${user.username} has left the chat`));
  // send user annd room
  io.to(user.room).emit('roomUsers',{
    room:user.room,
    users: getRoomUsers(user.room)
});
        }
        });
  });
});
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
