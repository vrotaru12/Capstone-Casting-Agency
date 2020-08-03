// auth
let tokenUrl = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/);

if (tokenUrl) {
  localStorage.setItem('token', tokenUrl[1]);
  // get permissions from token
  let permissions;
  permissions = JSON.parse(atob(tokenUrl[1].split('.')[1])).permissions;
  if(permissions.includes("get:movie") && permissions.includes("get:actor-detail")){
    getMovies();
    getActors();
    document.getElementById('LogInbutton').remove();
  }
  if(permissions.includes("post:movie") && permissions.includes("post:actor")){
    //addMovie();
    //addActors();
  }
}else{
  document.getElementById('LogOutbutton').remove();
}

function getMovies(){
  $.ajax({
    url: '/movies',
    type: 'GET',
    contentType: 'application/json',
    headers: {
       'Authorization': 'Bearer '+tokenUrl[1]
    },
    success: function (result) {
        console.log(result)
    },
    error: function (error) {
      console.log(error)
    }
  });
  
}

function getActors(){
  $.ajax({
    url: '/actors-detail',
    type: 'GET',
    contentType: 'application/json',
    headers: {
       'Authorization': 'Bearer '+tokenUrl[1]
    },
    success: function (result) {
        console.log(result)
    },
    error: function (error) {
      console.log(error)
    }
  });
}

function logOutSession(){
  localStorage.clear()
  window.location.href = 'https://vrdev.eu.auth0.com/v2/logout'
  window.location.replace('/')
}

function addMovie(){
  let dataSend = {
    "title": "Vixic Test",
    "release_date": "03/08/2020"
  }
  $.ajax({
    url: '/movies',
    type: 'POST',
    contentType: 'application/json',
    headers: {
       'Authorization': 'Bearer '+tokenUrl[1]
    },
    dataType: 'json',
    data: JSON.stringify(dataSend),
    success: function (result) {
        console.log(result)
    },
    error: function (error) {
      console.log(error)
    }
  });
}

function addActors(){
  let dataSend = {
    "name": "Jhon Blade",
    "age": "45",
   "gender": "M" 
  }
  $.ajax({
    url: '/actors',
    type: 'POST',
    contentType: 'application/json',
    headers: {
       'Authorization': 'Bearer '+tokenUrl[1]
    },
    dataType: 'json',
    data: JSON.stringify(dataSend),
    success: function (result) {
        console.log(result)
    },
    error: function (error) {
      console.log(error)
    }
  });
}
