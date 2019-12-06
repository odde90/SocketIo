const baseURLGify = "http://api.giphy.com/v1/gifs/search";
const apiKeyGify = "9sP4qcJGp890dC9oKmNi7GqR5CEeyv3d";
const chuckBaseUrl = 'https://api.chucknorris.io/jokes/random';
var socket = io();
const messageForm = document.getElementById("send-container");
const messageContainer = document.getElementById("Messages-Container");
const messageInput = document.getElementById("message-input");
const handle = document.getElementById("Handle");
const feedback = document.getElementById("feedback");
const typing = document.getElementById("typing");


socket.on("chat-message", data => {
  appendMessage(`${data.name}: ${data.message}`, false , 'notyou');
});

socket.on("image-received", image =>{
    appendMessage(image, true, 'notyou');
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
});


socket.on("notifyStopTyping", () => {
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
    var f = message.includes("/gif");
    
    if (f == true) {
      messageInput.value = "";
      
      var searchTerm = message.replace('/gif ', '');
      try {
        
        let respons = await gifUrl(searchTerm);
        let imgUrl = await filterGifs(respons);
        appendMessage( imgUrl, true, 'you');
        socket.emit("send-image", imgUrl);
        emptysugbox();
      } catch (err) {
        console.error(err);
      }
      
    }
    if( message == "/chuck" && f == false){
       let quat = await makeRequest(chuckBaseUrl);
       let quotes = await filterchuck(quat);
       appendMessage(`${quotes} :you`, false , 'you');
       data = {
        message: quotes,
        name: name
      }
       socket.emit("send-chat-message", data);
       emptysugbox();
       messageInput.value = "";
    }
    else {
      if(message != ''){
        appendMessage(`${message} :you`, false, 'you');
        data = {
          message: message,
          name: name
        }
        socket.emit("send-chat-message", data);
        messageInput.value = "";
        emptysugbox();
      }
    }
  }
  request();
});


function appendMessage(message, isimg, whereClass) {
  var g = message.includes("/gif");
  if (isimg == true) {
    const messageimage = document.createElement("img");
    const bugfix  = document.createElement("div");
    messageimage.classList.add('gif-wrapper')
    messageimage.src = message;
    if(whereClass != null ){
      messageimage.classList.add(whereClass);
      bugfix.classList.add('clearfix');
    }
    bugfix.append(messageimage)
    messageContainer.append(bugfix);
    scrolldown();
  }
  if(isimg == false && g == false ) {
    const messageElement = document.createElement("div");
    const messageText = document.createElement("p");
    messageText.innerText = message;
    if(whereClass != null ){
      messageText.classList.add(whereClass);
    }
    messageElement.classList.add('clearfix');
    messageElement.append(messageText);
    messageContainer.append(messageElement);
    scrolldown();
  }
}

function gifUrl(term) {
  let url = new URL(baseURLGify);
  url.search = new URLSearchParams({
    q: term,
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
          var sugests = ['gif [search]','chuck'];
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
       
        $('input').keydown( function(e) {
          var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
          if(key == 13) {
              if($('#message-input').val() == '/g' || $('#message-input').val() == '/gi'){
                e.preventDefault();
                messageInput.value = '/gif ';
              }
          }
        });

        gif.classList.add('stronger-sugest');
        chuck.classList.remove("stronger-sugest");
      }
      if($('#message-input').val() == '/c'){
        var gif = document.getElementById('1');
        var chuck = document.getElementById('2');
      
        $('input').keydown( function(e) {
          var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
          if(key == 13) {
              if($('#message-input').val() == '/c' || $('#message-input').val() == '/ch' || $('#message-input').val() == '/chu' ||  $('#message-input').val() == '/chuc'){
                e.preventDefault();
                messageInput.value = '/chuck';
              }
          }
        });
        gif.classList.remove("stronger-sugest");
        chuck.classList.add('stronger-sugest');
      }
      if($('#message-input').val() == ''){
        var sugsetholder = document.getElementById('sugest');
        sugsetholder.innerHTML = '';
        socket.emit("stopTyping", "");
      }
  });
});

function scrolldown() {
  var elem = document.getElementById('Messages-Container');
  elem.scrollTop = elem.scrollHeight;
}

function closeAlertBox() {
  var enter = document.getElementById('nicknamevalue').value;
  if(enter != ''){
    alertBox = document.getElementById("alertBox");
    alertClose = document.getElementById("alertClose");
    alertBox.parentNode.removeChild(alertBox);
    alertClose.parentNode.removeChild(alertClose);
  }
}

window.alert = function (msg) {
  var id = "alertBox", alertBox, closeId = "alertClose", alertClose;
  alertBox = document.createElement('div');
  alertBoxText = document.createElement("p");
  alertBoxInput = document.createElement("input");
  alertBoxButton = document.createElement("button");

  alertBox.id = id;
  alertBoxText.innerHTML = msg;
  alertBoxButton.innerHTML = 'Enter';

  alertBoxInput.id = 'nicknamevalue';
  alertBoxButton.id = 'enternickname';
  alertBox.addEventListener("keydown", function (e) {
        var enter = document.getElementById('nicknamevalue').value;

    if (e.keyCode === 13) { 
      if(enter != ''){
        name = enter;
        closeAlertBox();
        appendMessage("You joined", false);
        socket.emit("new-user", name);
      }
    }
});
  alertBoxButton.onclick = function() {
    var enter = document.getElementById('nicknamevalue').value;
    if(enter != ''){
      name = enter;
      closeAlertBox();
      appendMessage("You joined", false);
      socket.emit("new-user", name);
    }
  }

  alertBoxText.classList.add('init-box-text');
  alertBoxButton.classList.add('init-box-button');
  alertBoxInput.classList.add('init-box-input');
  alertBox.append(alertBoxText);
  alertBox.append(alertBoxInput);
  alertBox.append(alertBoxButton);
  document.body.appendChild(alertBox);

  alertClose = document.createElement("div");
  alertClose.id = closeId;
  document.body.appendChild(alertClose);
  alertClose.onclick = closeAlertBox;
};