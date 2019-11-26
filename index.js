const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const users = {};

io.on("connection", socket => {
  socket.on("send image", image => {
    users[socket.id] = image;
    socket.broadcast.emit("user-connected", image);
  });
  socket.on("new-user", name => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", message => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: [socket.id]
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });

   socket.on("typing", data => {
    socket.broadcast.emit("typing", data);
  }); 
});
/* skapa namn här */

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname + "/public")); // This will emit the event to all connected socket */

/* socket.on("disconnect", function() {
  console.log("user disconnected");
}); */

/* io.emit("some event", {
  someProperty: "some value",
  otherProperty: "other value"
}); */ http.listen(
  3000,
  function() {
    console.log("listenning on *:3000");
  }
);
