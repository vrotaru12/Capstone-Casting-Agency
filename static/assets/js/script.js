// auth
let tokenUrl = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/);
let token = tokenUrl[1];
if (tokenUrl) {
  
  localStorage.setItem('token', token);

  // get permissions from token
  try {
    let permissions;
    permissions = JSON.parse(atob(token.split('.')[1])).permissions;
    localStorage.setItem('permissions', permissions);
    if (!localStorage.getItem('permissions')) {
      permissions = ['delete:actor','delete:movie','get:actor','get:actor-detail','get:movie','patch:actor','patch:movie','post:actor','post:movie']; // default permissions
      localStorage.setItem('permissions', permissions);
    }
  } catch (e) {
    iziToast.error({
      title: "Error",
      message: e,
    });
  }
}else{
  document.getElementById('LogOutbutton').remove();
}



function getTokenResponse(){
  var settings = {
    "url": "/movies",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer "+token
    },
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}


const logOut = () => {
  localStorage.clear()
  window.location.href = 'https://vrdev.auth0.eu.com/v2/logout'
};
