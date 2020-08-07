// auth
let tokenUrl = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/);

if (tokenUrl) {
  localStorage.setItem('token', tokenUrl[1]);
  // get permissions from token
  let permissions;
  permissions = JSON.parse(atob(tokenUrl[1].split('.')[1])).permissions;
  profilechange(permissions);
  if(permissions.includes("get:movie") && permissions.includes("get:actor-detail")){
    document.getElementById('LogInbutton').remove();
  }
  if(permissions.includes("post:movie") && permissions.includes("post:actor")){
    // addMovie();
    // addActors();
  }
}else{
  document.getElementById('LogOutbutton').remove();
  document.getElementById('getActors').remove();
  document.getElementById('getMovies').remove();
}


function profilechange(permission){
  let node = document.createElement("LI"),textnode = document.createTextNode("Casting Director");
  if(permission.includes("patch:movie") && permission.includes("patch:actor")){
    document.getElementById('aboutUsbutton').remove();
    document.getElementById('contactButton').remove();
    document.getElementById("profileImage").src = "static/images/pic01-.jpg";
    
    node.appendChild(textnode); 
    document.getElementById('nav').children[0].insertBefore(node,document.getElementById('nav').children[0].children[3]);
    document.getElementById('nav').children[0].children[3].style.fontFamily = 'Comic Sans MS';
    document.getElementById('nav').children[0].children[3].style.fontStyle = 'italic';

  }else if(permission.includes("post:movie") && permission.includes("post:actor") 
  && !permission.includes("patch:actor") && !permission.includes("patch:movie")){
    document.getElementById("profileImage").src = "static/images/pic01--.jpg";
  }
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
    url: '/actors',
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
  let post_data = {
    'title': 'Test Movie',
    'release_date': '10-10-2018'
  };
  $.ajax({
    url: '/movies',
    type: 'POST',
    contentType: 'application/json',
    headers: {
       'Authorization': 'Bearer '+tokenUrl[1]
    },
    dataType: 'json',
    data: JSON.stringify(post_data),
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
