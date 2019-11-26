const baseURLGify = 'http://api.giphy.com/v1/gifs/trending';
const apiKeyGify = '9sP4qcJGp890dC9oKmNi7GqR5CEeyv3d';
var socket = io();
  
$(function() {
  $("form").submit( async function(e) {
    e.preventDefault(); 
    var test = $("#m").val()
    if(test == '/gif'){
      try{
        let respons = await gifUrl();
        let imgUrl = await filterGifs(respons);
        console.log(imgUrl)
        socket.emit("chat message", imgUrl);
      }catch(err){
        console.error(err)
      }
    }else{
      var texteinput = $("#m").val();
      isImage = {
        isimg: false,
        text:  texteinput 
      }
      var message = JSON.stringify(isImage);
      socket.emit( "chat message", message);
  
      $("#m").val("");
      return false;
    }
  });

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

});


function gifUrl() {
  let url = new URL(baseURLGify)
  url.search = new URLSearchParams({
    api_key: apiKeyGify
  })
  return makeRequest(url)
}

async function makeRequest(url) {
    let respons = await fetch(url);
    if(respons.status != 200){

    }else{
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
      isimg: true,
      text: rand 
    }
  return JSON.stringify(isImage);
}