// auth
let tokenUrl = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/);
let token = tokenUrl[1];
// if (tokenUrl) {
  
//   localStorage.setItem('token', token);

//   // get permissions from token
//   try {
//     let permissions;
//     permissions = JSON.parse(atob(token.split('.')[1])).permissions;
//     localStorage.setItem('permissions', permissions);
//     if (!localStorage.getItem('permissions')) {
//       permissions = ['delete:actor','delete:movie','get:actor','get:actor-detail','get:movie','patch:actor','patch:movie','post:actor','post:movie']; // default permissions
//       localStorage.setItem('permissions', permissions);
//     }
//   } catch (e) {
//     iziToast.error({
//       title: "Error",
//       message: e,
//     });
//   }
// }else{
//   document.getElementById('LogOutbutton').remove();
// }






// function getTokenResponse(){
// var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "http://127.0.0.1:5000/movies",
//   "method": "GET",
//   "headers": {
//     'content-type': 'application/json',
//     "authorization": "Bearer "+token
//   }
// }

// $.ajax(settings).done(function (response) {
//   console.log(response);
// });
// }

$.ajax({
  url: '/movies',
  type: 'GET',
  contentType: 'application/json',
  headers: {
     'Authorization': 'Bearer '+token
  },
  success: function (result) {
      console.log(result)
  },
  error: function (error) {
    console.log(error)
  }
});
