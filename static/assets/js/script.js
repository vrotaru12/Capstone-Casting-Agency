var tokenUrl = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/);
var editBtns = document.querySelectorAll('.button-edit');
var deleteBtns = document.querySelectorAll('.button-delete');

var permissions;
if(tokenUrl){
  localStorage.setItem('token', tokenUrl[1]);
  permissions = JSON.parse(atob(tokenUrl[1].split('.')[1])).permissions;
  localStorage.setItem('permissions', permissions);
}

function pageLoadStartup() {
attachEventHandlers();
maintainDisplayProperties();
}


/*
* --------------------------------------- Display Properties Declared Below ----------------------------------------
*/
function maintainDisplayProperties() {
  setInitialFormLoad(); //Only run on initial form load
}

/*
* --------------------------------------- Event Handler Functions Declared Below ----------------------------------------
*/
function attachEventHandlers() {
  
  document.getElementById('submit-movie-form').onclick = function(e) {
    e.preventDefault();
    const title = document.getElementById('movie-title').value;
    const movie_release = document.getElementById('movie-release').value;
    const movie_description = document.getElementById('movie-description').value;
    const movie_image = document.getElementById('movie-image').value;
    if (title == "" || movie_release == "" || movie_description == "" || movie_image == "") {
        alert("Please, ensure all the fields are filled out.");
    }
    else {
        fetch('/movies', {
            method: 'POST',
            body: JSON.stringify({
                'title': title,
                'release_date': movie_release,
                'description': movie_description,
                'image': movie_image
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
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
    const actor_description = document.getElementById('actor-description').value;
    const actor_picture = document.getElementById('actor-image').value;
    if (name == "" || actor_gender == "" || actor_age == "" || actor_description == "" || actor_picture == "") {
        alert("Please, ensure all the fields are filled out.");
    }
    else {
        fetch('/actors', {
            method: 'POST',
            body: JSON.stringify({
                'name': name,
                'gender': actor_gender,
                'age': actor_age,
                'description': actor_description,
                'image': actor_picture
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
        .then(function() {
          closeForm('ActorForm');
          window.location.reload();
        });
    }
  };

  document.getElementById('submit-movie-edit').onclick = function(e) {
    e.preventDefault();
    var movie_id = e.target.getAttribute("data-id");
    const newtitle = document.getElementById('new-movie-title').value;
    const newdate = document.getElementById('new-movie-release').value;
    const newdescription = document.getElementById('new-movie-description').value;
    const newimage = document.getElementById('new-movie-image').value;
    if (newtitle == "" || newdate == "" || newdescription == "" || newimage == "") {
        alert("Title and Release Date must be filled out");
    }
    else {
        fetch('/movies/' + movie_id, {
            method: 'PATCH',
            body: JSON.stringify({
                'title': newtitle,
                'release_date': newdate,
                'description': newdescription,
                'image': newimage
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
        .then(function() {
          closeForm('editMovieForm')
          window.location.reload();
        });
    }
  };

  document.getElementById('submit-actor-edit').onclick = function(e) {
    e.preventDefault();
    var actor_id = e.target.getAttribute("data-id");
    const newname = document.getElementById('new-actor-name').value;
    const newgender = document.getElementById('new-actor-gender').value;
    const newage = document.getElementById('new-actor-age').value;
    const newdescription = document.getElementById('new-actor-description').value;
    const newimage = document.getElementById('new-actor-image').value;
        fetch('/actors/' + actor_id, {
            method: 'PATCH',
            body: JSON.stringify({
                'name': newname,
                'gender': newgender,
                'age': newage,
                'description': newdescription,
                'image': newimage
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
        .then(function() {
          closeForm('editMovieForm')
          window.location.reload();
        });
  
  };


  // Edit buttons functionality 

  for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].onclick = function () {
      const el_id = editBtns[i].getAttribute("data-id");
      if(window.location.href === "https://vr-casting-agency.herokuapp.com/movies"){
        document.getElementById('submit-movie-edit').setAttribute('data-id', el_id);
        openForm('editMovieForm');
      } else if(window.location.href === "https://vr-casting-agency.herokuapp.com/actors-detail"){
        document.getElementById('submit-actor-edit').setAttribute('data-id', el_id);
        openForm('editActorForm');
      }
    
    }
  }
  // Edit buttons functionality 

  // delete buttons functionality 
  
  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].onclick = function () {
      const el_id = deleteBtns[i].getAttribute("data-id");
      if(window.location.href === "https://vr-casting-agency.herokuapp.com/movies"){
        fetch('/movies/' + el_id, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.token
          }
        })
        .then(function() {
          window.location.reload();
        });

      } else if(window.location.href === "https://vr-casting-agency.herokuapp.com/actors-detail"){
        fetch('/actors/' + el_id, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.token
          }
        })
        .then(function() {
          window.location.reload();
        });

      }
    
    }
  }
  // delete buttons functionality 

}


/*
* ------------------ Architecture Functions Declared Below -------------------------------------------------------
*/
function setInitialFormLoad() {
loggedStatus();
if (localStorage.token) {
  LogInSession();
  if(document.getElementById('aboutUsbutton') != null){
    document.getElementById('aboutUsbutton').remove();
  }
  if(!localStorage.permissions.includes("post:actor") && !localStorage.permissions.includes("post:movie") && document.getElementById('AddRecordButton') != null){
    document.getElementById('AddRecordButton').remove();
  }

  if(!localStorage.permissions.includes("patch:actor") && !localStorage.permissions.includes("patch:movie") &&  document.querySelectorAll('.button-edit').length != 0){
    for (let i = 0; i < editBtns.length; i++) {
      editBtns[i].remove();
    }
  }

  if(!localStorage.permissions.includes("delete:actor") && !localStorage.permissions.includes("delete:movie") &&  document.querySelectorAll('.button-delete').length != 0){
    for (let i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].remove();
    }
  }


  
  if(document.getElementById('LogInbutton') != null){
    document.getElementById('LogInbutton').remove();
  }
  
  
}else{
  document.getElementById('LogOutbutton').remove();
  document.getElementById('getActors').remove();
  document.getElementById('getMovies').remove();
  document.getElementById('AddRecordButton').remove();

}
}

/*
* --------------------------------------- Automation Functions Declared Below ---------------------------------------
*/

function populateEditForm(e) {
  const spot_id = e.getAttribute("data-id");
  const name = e.getAttribute("data-name");
  const location = e.getAttribute("data-location");
  document.getElementById("new-climbing-spot-name").setAttribute('value', name);
  document.getElementById("new-climbing-spot-location").setAttribute('value', location);
}


function LogInSession(){
  if(localStorage.permissions.includes("patch:actor") && localStorage.permissions.includes("patch:movie")){
    customiseUser("Casting Director");
    profilechange("static/images/pic05.jpg");
  }else{
    if(localStorage.permissions.includes("post:actor") && localStorage.permissions.includes("post:movie")){
      customiseUser("Executive Producer");
      profilechange("static/images/pic07.jpg");
    }else{
      customiseUser("Casting Assistant");
      profilechange("static/images/pic05.jpg");
    }

  }
}

function profilechange(path){
  if(document.getElementById("profileImage") != null){
    document.getElementById("profileImage").src = path;
  }
}

function customiseUser(user){
  let node = document.createElement("LI"), textnode = document.createTextNode(user);
  node.appendChild(textnode); 
  document.getElementById('nav').children[0].insertBefore(node,document.getElementById('nav').children[0].children[5]);
  document.getElementById('nav').children[0].children[5].style.fontFamily = 'Comic Sans MS';
  document.getElementById('nav').children[0].children[5].style.fontStyle = 'italic';
  document.getElementById('nav').children[0].children[5].style.fontSize = '18px';
}


function loggedStatus(){
  document.getElementById('two').remove();
  if(window.location.href === "https://vr-casting-agency.herokuapp.com/actors-detail"){
    document.getElementById('profileImage').parentElement.remove();
    document.getElementById('c2').remove();
    document.getElementById("c1").remove();
    document.getElementById('LogInbutton').remove();
    document.getElementById('aboutUsbutton').remove();
      

  }else if(window.location.href === "https://vr-casting-agency.herokuapp.com/movies"){
    document.getElementById('profileImage').parentElement.remove();
    document.getElementById('c2').remove();
    document.getElementById("c1").remove();
    document.getElementById('LogInbutton').remove();
    document.getElementById('aboutUsbutton').remove();
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



$(function () {
pageLoadStartup();
});
