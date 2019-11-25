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
      console.log(false)
      socket.emit(
        "chat message",
        $("#m").val()
        );
  
      $("#m").val("");
      return false;
    }
  });

  socket.on(
    "chat message",
    function(msg) {
      $("#messages").append(
        $("<li>").text(msg)
      );
    }
  );


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
  return rand;
}