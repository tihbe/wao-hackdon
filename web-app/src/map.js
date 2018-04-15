var map;
var sherbrooke = { lat: 45.401566, lng: -71.876594 };
var facebook = "http://www.pickle-tickle.in/wp-content/uploads/2016/08/facebook-logo-button.png";
var displayType = 'personal';
var users = []

function changeDisplay(display) {
  displayType = display;
  initMap();
}
function loadMarkers() {
  if (displayType === 'personal') {
    loadThankYou();
  } else if (displayType === 'facebook') {
    // var facebookMarker1 = new google.maps.Marker({
    //   position: { lat: 45.390594, lng: -71.858654 },
    //   map: map,
    //   icon: facebook,
    // });
    // var fbInfo1 = new google.maps.InfoWindow({
    //   content: "<h2>Adam Létourneau</h2><p>Temps alouer: 26h</p><p>personnes atteintes: 5</p>"
    // });
    // var facebookMarker2 = new google.maps.Marker({
    //   position: { lat: 45.409065, lng: -71.955171 },
    //   map: map,
    //   icon: facebook,
    // });
    // var fbInfo2 = new google.maps.InfoWindow({
    //   content: "<h2>Ismael Balafrej</h2><p>Temps alouer: 26h</p><p>personnes atteintes: 5</p>"
    // });

    // google.maps.event.addListener(facebookMarker1, 'click', function () { fbInfo1.open(map, facebookMarker1); });
    // google.maps.event.addListener(facebookMarker2, 'click', function () { fbInfo2.open(map, facebookMarker2); });
  }

}


function loadThankYou() {
  firebase.database().ref("/thankyou").on("child_added", function(child_snap) {
    var child = child_snap.val();
    var marker = new google.maps.Marker({
      position: child.location,
      map: map,
      icon: child.icon
    });
    
    var photo = "https://graph.facebook.com/" + users[child.author].facebookUid + "/picture?width=9999"; //users[child.author].photoURL
    var video = child.video ? "<a href='" + child.video + "' target=\"_blank\"><img src='images/logo-youtube.png' width=35 height=27></a>" : '';
    var infowindow = new google.maps.InfoWindow({
      content: "<div class=\"container\"><div class=\"row\"><div class=\"col-4\"><img src=\""+photo+"\" style='width:100%'></div><div class=\"col-8\" style='font-size:16px;'><span style='font-weight:bold;font-size:24px'>"+child.name + "&nbsp;&nbsp;</span>"+video+"<br><br>" + child.content+"</div></div></div>"
    });
    google.maps.event.addListener(marker, 'click', function (i, m) { i.open(map, m); }.bind(this, infowindow, marker));
  });
}

function loadCharities() {
  firebase.database().ref("/charity").on("child_added", function(charity_snap) {
    var child = charity_snap.val();
    var marker = new google.maps.Marker({
      position: child.location,
      map: map,
      icon: child.icon
    });
    var infowindow = new google.maps.InfoWindow({
      content: child.content
    });
    google.maps.event.addListener(marker, 'click', function (i, m) { i.open(map, m); }.bind(this, infowindow, marker));
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: sherbrooke,
    zoom: 12
  });
  firebase.database().ref("/user").once("value", function(users_snap) {
    users = users_snap.val();
    loadMarkers();
    loadCharities();
  });

}