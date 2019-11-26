/* import { connect } from "net"; */

const baseURLGify = "http://api.giphy.com/v1/gifs/trending";
const apiKeyGify = "9sP4qcJGp890dC9oKmNi7GqR5CEeyv3d";
var socket = io();
const messageForm = document.getElementById("send-container");
const messageContainer = document.getElementById("Messages-Container");
const messageInput = document.getElementById("message-input");
const handle = document.getElementById("Handle");
const feedback = document.getElementById("feedback");

const name = prompt("What is your name?");
appendMessage("You joined");
socket.emit("new-user", name);

socket.on("chat-message", data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", name => {
  appendMessage(`${name} connected`);
});

socket.on("user-disconnected", name => {
  appendMessage(`${name} disconnected`);
});

$(function() {
  $("form").submit(async function(e) {
    e.preventDefault();
    var test = $("#m").val();
    if (test == "/gif") {
      try {
        let respons = await gifUrl();
        let imgUrl = await filterGifs(respons);
        console.log(imgUrl);
        socket.emit("chat message", imgUrl);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(false);
      socket.emit("chat message", $("#m").val());
    } /* :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
     else{
      var texteinput = $("#m").val();
      isImage = {
        isimg: false,
        text:  texteinput 
      }
      var message = JSON.stringify(isImage);
      socket.emit( "chat message", message);
  

      $("#m").val("");
      return false;
    } ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
  });
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`you: ${message}`);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

/*  här är Jesper kod:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 socket.on("chat message", function(msg) {
    var object = JSON.parse(msg);
    console.log(object);
    if(object.isimg == true ){
      var messageContainer = document.getElementById('messages');
      var image = document.createElement('img');
      image.src = object.text;
      console.log(image)
      messageContainer.append(image)
      
    }else{
      console.log(false)
      $("#messages").append(
        $("<li>").text(object.text)
      );
    }
  });
 */

/* messageForm.addEventListener("keypress", function() {
  socket.emit("typing", handle.value);
});

socket.on("typing", function(data) {
  feedback.innerHTML = "<p><em>" + data + "is typing...</em></p>";
}); ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

function gifUrl() {
  let url = new URL(baseURLGify);
  url.search = new URLSearchParams({
    api_key: apiKeyGify
  });
  return makeRequest(url);
}

async function makeRequest(url) {
  let respons = await fetch(url);
  if (respons.status != 200) {
  } else {
    return await respons.json();
  }
}

async function filterGifs(gifarray) {
  var gifList = [];

  gifarray.data.forEach(item => {
    gifList.push(item.embed_url);
  });

  var rand = gifList[Math.floor(Math.random() * gifList.length)];
  HEAD;
  return rand;
}
isImage = {
  isimg: true,
  text: rand
};
/* return JSON.stringify(isImage); */
