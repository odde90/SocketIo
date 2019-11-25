var app = require("express")();
var http = require("http").createServer(
  app
);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.sendFile(
    __dirname + "/index.html"
  );
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("chat message", function(
    msg
  ) {
    socket.broadcast.emit("hi");
    console.log("message:" + msg);
    io.emit("chat message", msg);
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

io.emit("some event", {
  someProperty: "some value",
  otherProperty: "other value"
}); // This will emit the event to all connected socket

http.listen(3000, function() {
  console.log("listenning on *:3000");
});
