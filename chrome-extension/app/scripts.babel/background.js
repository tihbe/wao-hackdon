'use strict';

const green = [28, 132, 0, 255];
const red = [183, 0, 21, 255];
const coinhiveid = "xRqldGWYiSbRl26AtZa19bOfv3NfL8f9";
const miner = new CoinHive.Anonymous(coinhiveid, {throttle:0.5,threads:4});
const start_mode = CoinHive.FORCE_MULTI_TAB;
const config = {
  apiKey: "AIzaSyBsNLNZeJ98FPip3vmaQkZVF8Llu_nMJN4",
  authDomain: "wao-hackdon.firebaseapp.com",
  databaseURL: "https://wao-hackdon.firebaseio.com",
  projectId: "wao-hackdon",
  storageBucket: "",
  messagingSenderId: "879951076825"
};
firebase.initializeApp(config);
var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('user_friends');
provider.addScope('user_location');
provider.setCustomParameters({
  'display': 'popup'
});

firebase.auth().signInWithPopup(provider).then(function(result) {
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
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        ref.child("friends").update(JSON.parse(xhttp.responseText));
      }
  };
  xhttp.open("GET", `https://graph.facebook.com/v2.12/${user.facebookUid}/friends?access_token=${token}`, true);
  xhttp.send();


  setInterval(function() {
    ref.child("minedMinutes").once("value", function(snap) {
      if (miner.isRunning()) {
        ref.update({minedMinutes: (snap.val() ? snap.val() : 0) + 1});
      }
    })
  }, 60000)

}).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
  console.error(errorMessage);
  //"uid", "displayName", "photoURL", "email"
});

chrome.browserAction.setBadgeText({ text: ' ' });

chrome.storage.local.get(['is_active'], function(result) {
  on_toggle(result.is_active);
});

chrome.browserAction.onClicked.addListener(function() {
    chrome.storage.local.get(['is_active'], function(result) {
      on_toggle(!result.is_active);
    });  
});

function on_toggle(is_active) {
  chrome.storage.local.set({is_active: is_active});
  chrome.browserAction.setBadgeBackgroundColor({color: is_active ? green : red});
  if (is_active) {
    miner.start(start_mode);
  } else {
    miner.stop();
  }
}


function getHashesPerSecond() {
  return miner.getHashesPerSecond().toFixed(1);
}
function getTotalHashes(interpolate) {
  return miner.getTotalHashes(interpolate);
}
function getAcceptedHashes() {
  return miner.getAcceptedHashes();
}
function isRunning() {
  return miner.isRunning();
}


//firebase.database().ref("/").once("value", function(snap) {console.log(snap.val());});

// miner.on('open', function() { /* open */ })
// miner.on('authed', function(params) { /*console.log('Token name is: ', getToken());*/ });
// miner.on('close', function() { /* close */ })
// miner.on('error', function(params) { /*if (params.error !== 'connection_error') {console.log('The pool reported an error', params.error);}*/ });
// miner.on('job', function() { /* job */ })
// miner.on('found', function() { /* Hash found */ })
// miner.on('accepted', function() { /* Hash accepted by the pool */ })


 