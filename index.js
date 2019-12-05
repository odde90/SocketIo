const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const users = {};

io.on("connection", socket => {
  socket.on("send-image", image => {
    //users[socket.id] = image;
    socket.broadcast.emit("image-received", image);
  });
  socket.on("new-user", name => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message",(data) => {
    socket.broadcast.emit("chat-message", {
      message: data.message,
      name: data.name
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });

  //Someone is typing

  socket.on("typing", data => {
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing

  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });
});
/* skapa namn här */

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname + "/public")); // This will emit the event to all connected socket */

/* io.emit("some event", {
  someProperty: "some value",
  otherProperty: "other value"
}); */ http.listen(
  3000,
  function() {
    console.log("listenning on *:3000");
  }
);
