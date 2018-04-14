// Initialize Firebase
var config = {
  apiKey: "AIzaSyBsNLNZeJ98FPip3vmaQkZVF8Llu_nMJN4",
  authDomain: "wao-hackdon.firebaseapp.com",
  databaseURL: "https://wao-hackdon.firebaseio.com",
  projectId: "wao-hackdon",
  storageBucket: "",
  messagingSenderId: "879951076825"
};
firebase.initializeApp(config);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {

  var provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('user_friends');
  provider.addScope('user_location');
  provider.setCustomParameters({
    'display': 'popup'
  });

  firebase.auth().signInWithPopup(provider).then(function (result) {
    var token = result.credential.accessToken; //refreshToken ?
    var user = result.user;
    var ref = firebase.database().ref("/user").child(user.uid);

    user = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      facebookUid: user.providerData[0].uid
    };
    ref.update(user);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        ref.child("friends").update(JSON.parse(xhttp.responseText));
      }
    };
    xhttp.open("GET", `https://graph.facebook.com/v2.12/${user.facebookUid}/friends?access_token=${token}`, true);
    xhttp.send();

  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.error(errorMessage);
    //"uid", "displayName", "photoURL", "email"
  });
})


