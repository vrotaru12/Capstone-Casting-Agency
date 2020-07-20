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
}



function getTokenResponse(){
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer "+token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("/movies", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}