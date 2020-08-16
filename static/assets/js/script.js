var tokenUrl = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/);

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

document.getElementById('submit-movie-edit').onclick = function(e) {
  e.preventDefault();
  var movie_id = e.target.getAttribute("data-id");
  const newtitle = document.getElementById('new-movie-title').value;
  const newdate = document.getElementById('new-movie-release').value;
  if (newtitle == "" || newdate == "") {
      alert("Title and Release Date must be filled out");
  }
  else {
      fetch('/movies/' + movie_id, {
          method: 'PATCH',
          body: JSON.stringify({
              'title': newtitle,
              'release_date': newdate
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
      fetch('/actors/' + actor_id, {
          method: 'PATCH',
          body: JSON.stringify({
              'name': newname,
              'gender': newgender,
              'age': newage
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
const editBtns = document.querySelectorAll('.button-edit');
for (let i = 0; i < editBtns.length; i++) {
  editBtns[i].onclick = function () {
    const el_id = editBtns[i].getAttribute("data-id");
    if(window.location.href === "https://vr-casting-agency.herokuapp.com/movies"){
      document.getElementById('submit-movie-edit').setAttribute('data-id', el_id);
      openForm('editMovieForm');
    } else if(window.location.href === "https://vr-casting-agency.herokuapp.com/actors"){
      document.getElementById('submit-actor-edit').setAttribute('data-id', el_id);
      openForm('editActorForm');
    }
   
  }
}
// Edit buttons functionality 

// delete buttons functionality 
const deleteBtns = document.querySelectorAll('.button-delete');
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

    } else if(window.location.href === "https://vr-casting-agency.herokuapp.com/actors"){
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
}

/*
* --------------------------------------- Automation Functions Declared Below ---------------------------------------
*/

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



$(function () {
pageLoadStartup();
});
