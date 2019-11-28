const baseURLGify = "http://api.giphy.com/v1/gifs/trending";
const apiKeyGify = "9sP4qcJGp890dC9oKmNi7GqR5CEeyv3d";
var socket = io();
const messageForm = document.getElementById("send-container");
const messageContainer = document.getElementById("Messages-Container");
const messageInput = document.getElementById("message-input");
const handle = document.getElementById("Handle");
const feedback = document.getElementById("feedback");

const name = prompt("What is your name?");
appendMessage("You joined", false);
socket.emit("new-user", name);

socket.on("chat-message", data => {
  appendMessage(`${name}: ${data.message}`, false);
});

socket.on("user-connected", name => {
  appendMessage(`${name} connected`, false);
});

socket.on("user-disconnected", name => {
  appendMessage(`${name} disconnected`, false);
});

socket.on("send image", function(msg) {
  var object = JSON.parse(msg);
  var messageContainer = document.getElementById("Messages-Container");
  var image = document.createElement("img");
  image.src = object.text;

  messageContainer.append(image);
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();

  async function request() {
    const message = messageInput.value;
    if (message == "/gif") {
      try {
        let respons = await gifUrl();
        let imgUrl = await filterGifs(respons);
        console.log(imgUrl);
        socket.emit("send image", imgUrl);
      } catch (err) {
        console.error(err);
      }
    } else {
      appendMessage(`you: ${message}`, false);
      socket.emit("send-chat-message", message);
      messageInput.value = "";
    }
  }
  request();
});

function appendMessage(message, isimg) {
  if (isimg == false) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageContainer.append(messageElement);
  }
}

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
  isImage = {
    text: rand
  };
  return JSON.stringify(isImage);
}
