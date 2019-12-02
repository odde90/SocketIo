const baseURLGify = "http://api.giphy.com/v1/gifs/trending";
const apiKeyGify = "9sP4qcJGp890dC9oKmNi7GqR5CEeyv3d";
const chuckBaseUrl = 'https://api.chucknorris.io/jokes/random';
var socket = io();
const messageForm = document.getElementById("send-container");
const messageContainer = document.getElementById("Messages-Container");
const messageInput = document.getElementById("message-input");
const handle = document.getElementById("Handle");
const feedback = document.getElementById("feedback");
const typing = document.getElementById("typing");

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

//isTyping event
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { user: "Someone", message: "is typing..." });
});

socket.on("notifyTyping", data => {
  typing.innerText = "";
  typing.innerText = data.user + "  " + data.message;
  console.log(data.user + data.message);
});
//stop typing
messageInput.addEventListener("change", evt => {
  socket.emit("stopTyping", "");
});

socket.on("notifyStopTyping", () => {
  console.log("Heeej");
  typing.innerText = "";
});

socket.on("image received", function(messageInput) {
  var object = JSON.parse(messageInput);
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
        appendMessage( imgUrl, true);
        socket.emit("send-chat-message", imgUrl);
      } catch (err) {
        console.error(err);
        messageInput.value = "";
      }
    }

    if( message == "/chuck"){
       let quat = await makeRequest(chuckBaseUrl);
       let quotes = await filterchuck(quat);
       appendMessage(`you: ${quotes}`, false);
       socket.emit("send-chat-message", quotes);
       messageInput.value = "";
    }
    else {
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
  if (isimg == true) {
    const messageElement = document.createElement("img");
    messageElement.src = message;
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
  console.log(gifarray)
  var gifList = [];

  gifarray.data.forEach(item => {
    gifList.push(item.images.preview_gif.url);
  });

  var rand = gifList[Math.floor(Math.random() * gifList.length)];
  console.log(rand)
  return rand;
}


async function filterchuck(data){
  return data.value
}



/* 
$( document ).ready(function() {
  
  $( "#message-input" ).change(function() {
    console.log($('#message-input').val())
   if($('#message-input').val == '/'){
     console.log('chuck')
   }else{
     console.log(false)
   }
  });
 
});
 */
