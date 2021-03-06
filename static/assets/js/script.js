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
  setInterval(function () {
    moveSlider();
  }, 3000);
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

  if(document.getElementById('submit-cast-form') != null){
    document.getElementById('submit-cast-form').onclick = function(e) {
      e.preventDefault();
      var actor_id = document.getElementById('cast-actor-name').getAttribute("data-castid");
      var movie_id = document.getElementById('cast-movie-title').value;
  
      if (actor_id == "" || movie_id == "null") {
          alert("Please, ensure all the fields are filled out.");
      }
      else {
          fetch('/cast-actor', {
              method: 'POST',
              body: JSON.stringify({
                  'movie_id': movie_id,
                  'actor_id': actor_id
              }),
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.token
              }
          })
          .then(function(response) {
            if (!response.ok) {
              alert(Error(response.statusText));
            }
          })
          .catch(function(error) {
            console.log(error);
        });
      }
    };
  }

  if(document.getElementById('submit-cast-form1') != null){
    document.getElementById('submit-cast-form1').onclick = function(e) {
      e.preventDefault();
      var movie_id = document.getElementById('cast-movie-title').getAttribute("data-castid");
      var actor_id = document.getElementById('cast-actor-name').value;
  
      if (actor_id == "" || movie_id == "null") {
          alert("Please, ensure all the fields are filled out.");
      }
      else {
          fetch('/cast-actor', {
              method: 'POST',
              body: JSON.stringify({
                  'movie_id': movie_id,
                  'actor_id': actor_id
              }),
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.token
              }
          })
          .then(function(response) {
            if (!response.ok) {
              alert(Error(response.statusText));
            }
          })
          .catch(function(error) {
            console.log(error);
        });
      }
    };
  }
 

  document.getElementById('submit-movie-edit').onclick = function(e) {
    e.preventDefault();
    var movie_id = e.target.getAttribute("data-id");
    var newtitle = document.getElementById('new-movie-title').value,
     newdate = document.getElementById('new-movie-release').value,
     newdescription = document.getElementById('new-movie-description').value,
     newimage = document.getElementById('new-movie-image').value;
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
  if(document.getElementById('LogOutbutton') != null){
    document.getElementById('LogOutbutton').onclick = function(e) {
      logOutSession();
    }
    document.getElementById('LogOutbutton1').onclick = function(e) {
      logOutSession();
    }
  }






  // Edit buttons functionality 

  for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].onclick = function () {
      const el_id = editBtns[i].getAttribute("data-id");
      if(window.location.href === "https://vr-casting-agency.herokuapp.com/movies"){
        document.getElementById('submit-movie-edit').setAttribute('data-id', el_id);
        openForm('editMovieForm');
        const title = editBtns[i].getAttribute("data-title"),
        description = editBtns[i].getAttribute("data-description"), 
        release_date = editBtns[i].getAttribute("data-releaseDate"),
        image = editBtns[i].getAttribute("data-image");

        document.getElementById("new-movie-title").setAttribute('value', title);
        document.getElementById("new-movie-description").setAttribute('value', description);
        document.getElementById("new-movie-release").setAttribute('value', release_date);
        document.getElementById("new-movie-image").setAttribute('value', image);
      } else if(window.location.href === "https://vr-casting-agency.herokuapp.com/actors-detail"){
        document.getElementById('submit-actor-edit').setAttribute('data-id', el_id);
        openForm('editActorForm');
        const name = editBtns[i].getAttribute("data-name"),
        description = editBtns[i].getAttribute("data-description"), 
        age = editBtns[i].getAttribute("data-age"),
        gender = editBtns[i].getAttribute("data-gender"),
        image = editBtns[i].getAttribute("data-image");
        document.getElementById("new-actor-name").setAttribute('value', name);
        document.getElementById("new-actor-description").setAttribute('value', description);
        document.getElementById("new-actor-gender").setAttribute('value', gender);
        document.getElementById("new-actor-age").setAttribute('value', age);
        document.getElementById("new-actor-image").setAttribute('value', image);
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

  document.getElementById('cancel-edit').onclick = function() {
    document.getElementById('editMovieForm').style.display = "none";
  }


//   $('a.control_next').click(function () {
//     moveRight();
// });


}


/*
* ------------------ Architecture Functions Declared Below -------------------------------------------------------
*/
function setInitialFormLoad() {
  loggedStatus();
  if (localStorage.token && tokenHasExpired(parseJwt(localStorage.token,1).exp)) {
    if(window.location.href.indexOf("?") != -1){
      var newurl = window.location.href.replace(/[?]/g, '');
      window.location.replace(newurl);
    }
    LogInSession();
    document.getElementById('two').remove();
    if(document.getElementById('aboutUsbutton') != null){
      document.getElementById('aboutUsbutton').parentElement.remove();
      document.getElementById('aboutUsbutton1') != null ? document.getElementById('aboutUsbutton1').remove() : console.log('sth');
    }
    if(!localStorage.permissions.includes("post:actor") && !localStorage.permissions.includes("post:movie") && document.getElementById('AddRecordButton') != null){
      document.getElementById('AddRecordButton').remove();
      document.getElementById('addActor1').remove();
      document.getElementById('addMovie1').remove();
      document.getElementById('undefined1').remove();
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
      document.getElementById('LogInbutton').parentElement.remove();
      document.getElementById('LogInbutton1') != null ? document.getElementById('LogInbutton1').remove() : console.log('sth2');
    }
    
    
  }else{

    document.getElementById('LogOutbutton').parentElement.remove();
    document.getElementById('getActors').parentElement.remove();
    document.getElementById('getMovies').parentElement.remove();
    document.getElementById('AddRecordButton').remove();

    document.getElementById('getActors1').remove();
    document.getElementById('getMovies1').remove();
    document.getElementById('addActor1').remove();
    document.getElementById('addMovie1').remove();
    document.getElementById('undefined1').remove();
    document.getElementById('LogOutbutton1').remove();
    if(localStorage.token && tokenHasExpired(parseJwt(localStorage.token,1).exp) ===  false){
      localStorage.clear();
    }
  }
}

/*
* --------------------------------------- Automation Functions Declared Below ---------------------------------------
*/

function LogInSession(){
  var nr = document.getElementById('nav').children[0].children.length;
  if(localStorage.permissions.includes("patch:actor") && localStorage.permissions.includes("patch:movie")){
    customiseUser("Casting Director",nr-1);
    profilechange("static/images/pic02.jpg");
  }else{
    if(localStorage.permissions.includes("post:actor") && localStorage.permissions.includes("post:movie")){
      customiseUser("Executive Producer",nr-1);
      profilechange("static/images/pic07.jpg");
    }else{
      customiseUser("Casting Assistant",nr-1);
      profilechange("static/images/pic05.jpg");
    }

  }
}

function profilechange(path){
  if(document.getElementById("profileImage") != null){
    document.getElementById("profileImage").src = path;
  }
}

function customiseUser(user, n){
  let node = document.createElement("LI"), textnode = document.createTextNode(user);
  node.appendChild(textnode); 
  document.getElementById('nav').children[0].insertBefore(node,document.getElementById('nav').children[0].children[n]);
  document.getElementById('nav').children[0].children[n].style.fontFamily = 'Comic Sans MS';
  document.getElementById('nav').children[0].children[n].style.fontStyle = 'italic';
  document.getElementById('nav').children[0].children[n].style.fontSize = '18px';
}


function loggedStatus(){
  if(window.location.href != "https://vr-casting-agency.herokuapp.com/" && window.location.href.includes("https://vr-casting-agency.herokuapp.com/#access_token") == false){
    document.getElementById('profileImage').parentElement.remove();
    document.getElementById('c2').remove();
    document.getElementById("c1").remove();
    document.getElementById('LogInbutton').parentElement.remove();
    document.getElementById('aboutUsbutton').parentElement.remove();
    document.getElementById('LogInbutton1').remove();
    document.getElementById('aboutUsbutton1').remove();
  }
}

// Convert a Unix timestamp to date&time in JavaScript
function tokenHasExpired(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000),time, 
  // months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  b = new Date();
  if(parseInt(a.getFullYear()) >= parseInt(b.getFullYear())){
    if(parseInt(a.getMonth()) > parseInt(b.getMonth())){
      return true;
    }else if(parseInt(a.getMonth()) == parseInt(b.getMonth())){
      if(parseInt(a.getDate()) > parseInt(b.getDate())){
        return true;
      }else if(parseInt(a.getDate()) == parseInt(b.getDate())){
        if(parseInt(a.getHours()) > parseInt(b.getHours())){
          return true;
        }else if(parseInt(a.getHours()) == parseInt(b.getHours())){
          if(parseInt(a.getMinutes()) > parseInt(b.getMinutes())){
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }else{
    return false;
  }
}

// decode token to find expiration date

function parseJwt(token, n) {
  var result = "";
  if(token.includes(".")) {
      var base64Url = token.split('.')[n];
      
      var base64 = decodeURIComponent(atob(base64Url).split('').map((c)=>{
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      result = JSON.parse(base64)
  }
  
  return result;
}


function openForm(id) {
  if(document.getElementsByTagName('body')[0].classList.contains("navPanel-visible")){
    document.getElementsByTagName('body')[0].classList.remove("navPanel-visible");
  }
  document.getElementById(id).style.display = "block";
  // to check if any other container is showing. When add button is clicked but x button is not
  var containers = document.getElementsByClassName('form-div');
  for (var i=0; i<containers.length; i++){
    if(containers[i].getAttribute("style") == "display: block;" && containers[i].getAttribute("id") != id){
      closeForm(containers[i].getAttribute("id"));
    }
  }
 
}

function closeForm(id) {
  document.getElementById(id).style.display = "none";
}

function moveSlider() {
	var slideHeight = $('#slider li').height();

  $('#slider').animate({left: - slideHeight}, 200, function () {
      $('#slider li:last-child').prependTo('#slider');
  });
};

function logOutSession(){
  localStorage.clear()
  window.location.href = 'https://vr-casting-agency.herokuapp.com/logout'
  //https://vrdev.eu.auth0.com/v2/logout
  window.location.replace('/')
}

$(function () {
pageLoadStartup();
});
