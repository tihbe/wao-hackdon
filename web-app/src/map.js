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
    // loadFriends();
    var facebookMarker1 = new google.maps.Marker({
      position: { lat: 45.390594, lng: -71.858654 },
      map: map,
      icon: facebook,
    });
    var fbInfo1 = new google.maps.InfoWindow({
      content: "<h2>Adam Létourneau</h2><p>J'ai contriburer 48 heures à la fondation du CHUS dans les cause suivantes:</p>" +
      "<ul style=\"width: 60%; float:left;\"><li>Soins à l'enface</li><li>Recherche</li><li>Aide à la mobilité</li><li>Soins cranien</li></ul>" +
      "<img style=\"float:right;\" src=\"https://www.lyceedelamergujan.fr/images/Icon64/pie-chart.png\" >"
    });
    var facebookMarker2 = new google.maps.Marker({
      position: { lat: 45.409065, lng: -71.955171 },
      map: map,
      icon: facebook,
    });
    var fbInfo2 = new google.maps.InfoWindow({
      content: "<h2>Ismael Balafrej</h2><p>J'ai contriburer 26 heures à la fondation du CHUS dans les cause suivantes:</p>" +
      "<ul style=\"width: 60%; float:left;\"><li>Cancer</li><li>Recherche</li><li>Soins traumatologiques</li><li>Autres</li></ul>" +
      "<img style=\"float:right;\" src=\"https://www.lyceedelamergujan.fr/images/Icon64/pie-chart.png\" >"
    });

    google.maps.event.addListener(facebookMarker1, 'click', function () { fbInfo1.open(map, facebookMarker1); });
    google.maps.event.addListener(facebookMarker2, 'click', function () { fbInfo2.open(map, facebookMarker2); });
    loadProgress();
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
    removeProgress();
  });
}

function loadFriends() {
  firebase.database().ref("/friends").on("child_added", function(child_snap) {
    var child = child_snap.val();
    console.log(child);
    var content = '<h2>' + child.name + '</h2>';
    var marker = new google.maps.Marker({
      position: child.location,
      map: map,
      icon: child.icon
    });

    var infowindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', function (i, m) { i.open(map, m); }.bind(this, infowindow, marker));
  });
}

function removeProgress() {
  document.getElementById("progress").innerHTML = "";
}

function loadProgress() {
  var rand1 = Math.random()*50+10;
  var rand2 = Math.random()*20+5;
  var rand3 = Math.random()*10;
  let friend = function(color, width, name) {
    return '<div class="progress-bar '+color+'" role="progressbar" style="width: '+width+'%" aria-valuenow="'+width+'" aria-valuemin="0" aria-valuemax="100" data-toggle="popover" data-trigger="hover" title="Mes amis" data-content="'+name+' a contribué à '+width.toFixed(2)+'% du défis en cours !" data-placement="top" data-boundary="viewport"></div>';
  };
  var friendProgress = '<h3>You and your friends</h3><div class="progress" style="background-color: white">' +
    friend("", rand1, "Bob") +
    friend("bg-success", rand2, "Alice") +
    friend("bg-info", rand3, "Jean") +
  '</div>';

  document.getElementById("progress").innerHTML = friendProgress;
}

function loadCharities() {
  firebase.database().ref("/charity").on("child_added", function(charity_snap) {
    var child = charity_snap.val();
    var marker = new google.maps.Marker({
      position: child.location,
      map: map,
      icon: child.icon
    });

    //3 friends progress
    var rand1 = Math.random()*50+10;
    var rand2 = Math.random()*20+5;
    var rand3 = Math.random()*10;

    let friend = function(color, width, name) {
      return '<div class="progress-bar '+color+'" role="progressbar" style="width: '+width+'%" aria-valuenow="'+width+'" aria-valuemin="0" aria-valuemax="100" data-toggle="popover" data-trigger="hover" title="Mes amis" data-content="'+name+' a contribué à '+width.toFixed(2)+'% du défis en cours !" data-placement="top" data-boundary="viewport"></div>';
    };

    var friendProgress = '<div class="progress">' +
      friend("", rand1, "Bob") +
      friend("bg-success", rand2, "Alice") +
      friend("bg-info", rand3, "Jean") +
    '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: child.content + "<br><br>" + friendProgress
    });
    google.maps.event.addListener(marker, 'click', function (i, m) { i.open(map, m); $('[data-toggle="popover"]').popover({trigger: "hover"}); console.log("ayy"); }.bind(this, infowindow, marker));
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
