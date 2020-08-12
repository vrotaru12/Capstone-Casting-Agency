// auth
let tokenUrl = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/);

if (tokenUrl) {
  localStorage.setItem('token', tokenUrl[1]);
  // get permissions from token
  let permissions;
  permissions = JSON.parse(atob(tokenUrl[1].split('.')[1])).permissions;
  localStorage.setItem('permissions', permissions);
  profilechange(permissions);
  if(permissions.includes("get:movie") && permissions.includes("get:actor-detail")){
    document.getElementById('LogInbutton').remove();
  }
}else{
  document.getElementById('LogOutbutton').remove();
  document.getElementById('getActors').remove();
  document.getElementById('getMovies').remove();
  document.getElementById('addMovie').remove();
  document.getElementById('addActor').remove();
}


function profilechange(permission){
  let node = document.createElement("LI"), textnode = document.createTextNode("Casting Director");
  if(permission.includes("patch:movie") && permission.includes("patch:actor")){
    document.getElementById('aboutUsbutton').remove();
    document.getElementById('contactButton').remove();
    document.getElementById("profileImage").src = "static/images/pic01-.jpg";
    
    node.appendChild(textnode); 
    document.getElementById('nav').children[0].insertBefore(node,document.getElementById('nav').children[0].children[5]);
    document.getElementById('nav').children[0].children[5].style.fontFamily = 'Comic Sans MS';
    document.getElementById('nav').children[0].children[5].style.fontStyle = 'italic';
    document.getElementById('nav').children[0].children[5].style.fontSize = '18px';

  }else if(permission.includes("post:movie") && permission.includes("post:actor") 
  && !permission.includes("patch:actor") && !permission.includes("patch:movie")){
    document.getElementById("profileImage").src = "static/images/pic01--.jpg";
  }
}

function getMovies(){
  document.getElementById("banner").children[0].children[0].remove();
  document.getElementById("banner").children[0].children[0].remove();
  
  $.ajax({
    url: '/movies',
    type: 'GET',
    contentType: 'application/json',
    headers: {
       'Authorization': 'Bearer '+tokenUrl[1]
    },
    success: function (result) {
        allMovies = result.movies;
        for(let i=0; i<allMovies.length; i++){
          displayData(allMovies[i].title, "This is description",  "static/images/pic01--.jpg");
        }
    },
    error: function (error) {
      console.log(error)
    }
  });
  
}


function displayData(MovieName,description, src){
  let header = document.createElement("header"),

  heading = document.createElement("h2"),
  hed = document.createTextNode(MovieName), 
  
  p = document.createElement("p"),
  p1 = document.createTextNode(description),

  s = document.createElement("span"),
  cl = document.createAttribute("class"),

  image = document.createElement("img"),
  att = document.createAttribute("src");
  att.value = src;

  cl.value="image";
  image.setAttributeNode(att);
  s.setAttributeNode(cl);
  s.appendChild(image);

  heading.appendChild(hed);
  p.appendChild(p1);

  header.appendChild(heading);
  header.appendChild(p);
  header.appendChild(s);
  // document.getElementById('banner').children[0].appendChild(s);
  document.getElementById('banner').children[0].appendChild(header);
  
}

function getActors(){
  
  document.getElementById("banner").children[0].children[0].remove();
  document.getElementById("banner").children[0].children[0].remove();
  window.location.assign('/actors')
  $.ajax({
    url: '/actors',
    type: 'GET',
    contentType: 'application/json',
    headers: {
       'Authorization': 'Bearer '+tokenUrl[1]
    },
    dataType: 'json',
    success: function (result) {
      allActors = result.actors;
      for(let i=0; i<allActors.length; i++){
        displayData(allActors[i].name, "This is description",  "static/images/pic01--.jpg");
      }
      console.log(result)
    },
    error: function (error) {
      console.log(error)
    }
  });
  
}

function logOutSession(){
  localStorage.clear()
  window.location.href = 'https://vr-casting-agency.herokuapp.com/logout'
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
