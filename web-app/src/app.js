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


function auth() {
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
      ref.on("value", function(user_snap) {
        var jref = $("#app-progress-bar");
        var user = user_snap.val();
        
        if (user.isMining) {
          jref.addClass("progress-bar-animated");
        } else {
          jref.removeClass("progress-bar-animated");
        }
        jref.attr("aria-valuemax", user.goal);
        jref.attr("aria-valuenow", user.minedMinutes);
        jref.text(user.minedMinutes  + " min")
        
        var p = user.minedMinutes/user.goal*100;
        jref.css('width', p+'%');
        jref.parent().show();
        
      })

    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.error(errorMessage);
      //"uid", "displayName", "photoURL", "email"
    });
  });
}

auth();

$("#app-btn-map").on("click", function () {
  $(".app-widget").hide();
  $("#app-container-map").show();
});

$("#app-btn-dons").on("click", function () {
  $(".app-widget").hide();
  $("#app-container-dons").show();
});

$("#app-btn-fondation").on("click", function () {
  $(".app-widget").hide();
  $("#app-container-fondation").show();
});

$("#app-btn-accueil").on("click", function () {
  $(".app-widget").hide();
  $("#app-container-accueil").show();
});

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
            var reg = /<script.*src="(.*?)" ?>/gi;
            var m;
            do {
              m = reg.exec(this.responseText);
              if (m) {
                $.getScript(m[1]);
              }
            } while (m);
          }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

includeHTML();
