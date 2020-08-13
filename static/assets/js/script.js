// auth
let tokenUrl = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/);



loggedStatus();
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
}else if(!tokenUrl && window.location.href === "https://vr-casting-agency.herokuapp.com/"){
  document.getElementById('LogOutbutton').remove();
  document.getElementById('getActors').remove();
  document.getElementById('getMovies').remove();
  document.getElementById('contactButton').remove();
}


function profilechange(permission){
  if(permission.includes("patch:movie") && permission.includes("patch:actor")){
    document.getElementById('aboutUsbutton').remove();
    document.getElementById("profileImage").src = "static/images/pic01-.jpg";
    customiseUser("Casting Director");
  }else if(permission.includes("post:movie") && permission.includes("post:actor") 
  && !permission.includes("patch:actor") && !permission.includes("patch:movie")){
    document.getElementById("profileImage").src = "static/images/pic01--.jpg";
  }
}

function customiseUser(user){
  let node = document.createElement("LI"), textnode = document.createTextNode(user);
  node.appendChild(textnode); 
  document.getElementById('nav').children[0].insertBefore(node,document.getElementById('nav').children[0].children[4]);
  document.getElementById('nav').children[0].children[4].style.fontFamily = 'Comic Sans MS';
  document.getElementById('nav').children[0].children[4].style.fontStyle = 'italic';
  document.getElementById('nav').children[0].children[4].style.fontSize = '18px';
}


function loggedStatus(){
  if(window.location.href === "https://vr-casting-agency.herokuapp.com/actors"){
    document.getElementById('profileImage').parentElement.remove();
    document.getElementById('c2').remove();
    document.getElementById("c1").remove();
    document.getElementById('LogInbutton').remove();
    document.getElementById('aboutUsbutton').remove();
      customiseUser("Casting Director");

  }else if(window.location.href === "https://vr-casting-agency.herokuapp.com/movies"){
    document.getElementById('profileImage').parentElement.remove();
    document.getElementById('c2').remove();
    document.getElementById("c1").remove();
    document.getElementById('LogInbutton').remove();
    document.getElementById('aboutUsbutton').remove();
      customiseUser("Casting Director");
  }
}

function logOutSession(){
  localStorage.clear()
  window.location.href = 'https://vr-casting-agency.herokuapp.com/logout'
  window.location.replace('/')
}


function openForm(id) {
  document.getElementById(id).style.display = "block";
}

function closeForm(id) {
  document.getElementById(id).style.display = "none";
}


document.getElementById('submit-movie-form').onclick = function(e) {
  e.preventDefault();
  const title = document.getElementById('movie-title').value;
  const movie_release = document.getElementById('movie-release').value;
  if (title == "" || movie_release == "") {
      alert("Please, ensure all the fields are filled out.");
  }
  else {
      fetch('/movies', {
          method: 'POST',
          body: JSON.stringify({
              'title': title,
              'release_date': movie_release
          }),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + tokenUrl[1]
          }
      })
      .then(function() {
        closeForm('MovieForm')
        window.location.reload();
      });
  }
};

document.getElementById('submit-actor-form').onclick = function(e) {
  e.preventDefault();
  const name = document.getElementById('actor-name').value;
  const actor_gender = document.getElementById('actor-gender').value;
  const actor_age = document.getElementById('actor-age').value;
  if (name == "" || actor_gender == "" || actor_age == "") {
      alert("Please, ensure all the fields are filled out.");
  }
  else {
      fetch('/actors', {
          method: 'POST',
          body: JSON.stringify({
              'name': name,
              'gender': actor_gender,
              'age': actor_age
          }),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + tokenUrl[1]
          }
      })
      .then(function() {
        closeForm('ActorForm');
        window.location.reload();
      });
  }
};
