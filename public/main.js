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
  appendMessage(`${data.name}: ${data.message}`, false);
});
socket.on("image-received", image =>{
    appendMessage(image, true);
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
      messageInput.value = "";
      try {
        let respons = await gifUrl();
        let imgUrl = await filterGifs(respons);
        appendMessage( imgUrl, true);
       socket.emit("send-image", imgUrl);
       emptysugbox();
      } catch (err) {
        console.error(err);
      }
      
    }
    if( message == "/chuck"){
       let quat = await makeRequest(chuckBaseUrl);
       let quotes = await filterchuck(quat);
       appendMessage(`you: ${quotes}`, false);
       data = {
        message: quotes,
        name: name
      }
       socket.emit("send-chat-message", data);
       emptysugbox();
       messageInput.value = "";
    }
    else {
      appendMessage(`you: ${message}`, false);
      data = {
        message: message,
        name: name
      }
      socket.emit("send-chat-message", data);
      messageInput.value = "";
      emptysugbox();
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
    const messageimage = document.createElement("img");
    messageimage.classList.add('gif-wrapper')
    messageimage.src = message;
    messageContainer.append(messageimage);
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
    gifList.push(item.images.preview_gif.url);
  });

  var rand = gifList[Math.floor(Math.random() * gifList.length)];
  return rand;
}


async function filterchuck(data){
  return data.value
}

function emptysugbox() {
  var sugsetholder = document.getElementById('sugest');
  sugsetholder.innerHTML = '';
} 

$( document ).ready(function() {
  $('#message-input').on('input',function(e){
      var tesk = 0
 
     if($('#message-input').val() == '/'){
          var sugests = ['gif','chuck'];
          var sugsetholder = document.getElementById('sugest');
          sugsetholder.innerHTML = '';
          sugests.forEach(element => {
            tesk++;
            var sugs = document.createElement('p');
            sugs.setAttribute("id", tesk);
            sugs.innerText = element;
            sugsetholder.append(sugs);
      });
      }  
      if($('#message-input').val() == '/g'){
        var gif = document.getElementById('1');
        var chuck = document.getElementById('2');
        gif.classList.add('stronger-sugest');
        chuck.classList.remove("stronger-sugest");
      }
      if($('#message-input').val() == '/c'){
        var gif = document.getElementById('1');
        var chuck = document.getElementById('2');
        gif.classList.remove("stronger-sugest");
        chuck.classList.add('stronger-sugest');
      }
      if($('#message-input').val() == ''){
        var sugsetholder = document.getElementById('sugest');
        sugsetholder.innerHTML = '';
      }
  });
});

