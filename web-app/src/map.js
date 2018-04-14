var map;
var sherbrooke = { lat: 45.401566, lng: -71.876594 };
var man = 'https://www.shareicon.net/data/32x32/2015/09/24/106420_man_512x512.png';
var woman = 'https://www.shareicon.net/data/32x32/2016/08/18/810227_user_512x512.png';
var hospital = "./images/hospital.png";
var facebook = "http://www.pickle-tickle.in/wp-content/uploads/2016/08/facebook-logo-button.png";
var displayType = 'personal';

function changeDisplay(display) {
  displayType = display;
  initMap();
}
function loadMarkers() {

  if (displayType === 'personal') {
    var marker1 = new google.maps.Marker({
      position: sherbrooke,
      map: map,
      icon: man,
    });
    var infowindow1 = new google.maps.InfoWindow({
      content: "<blockquote><p>Grâce à tes dons, j'ai pu recevoir une tranfusion sanguine qui m'a sauvé la vie </p></blockquote>" +
        " <br/><span class='quoteName'>-Mario Pelchat</span>"
    });
    var marker2 = new google.maps.Marker({
      position: { lat: 45.411566, lng: -71.876594 },
      map: map,
      icon: woman,
    });
    var infowindow2 = new google.maps.InfoWindow({
      content: "<blockquote><p>Grâce aux dons, le CHUS est équipé de la mahcine qui a sauvé la vie de ma fille de 3 ans," +
        "je serai toujours reconnaissante</p></blockquote>" +
        " <br/><span class='quoteName'>-Ginette Reno</span>"
    });
    google.maps.event.addListener(marker1, 'click', function () { infowindow1.open(map, marker1); });
    google.maps.event.addListener(marker2, 'click', function () { infowindow2.open(map, marker2); });
  } else if (displayType === 'facebook') {
    var facebookMarker1 = new google.maps.Marker({
      position: { lat: 45.390594, lng: -71.858654 },
      map: map,
      icon: facebook,
    });
    var fbInfo1 = new google.maps.InfoWindow({
      content: "<h2>Adam Létourneau</h2><p>Temps alouer: 26h</p><p>personnes atteintes: 5</p>"
    });
    var facebookMarker2 = new google.maps.Marker({
      position: { lat: 45.409065, lng: -71.955171 },
      map: map,
      icon: facebook,
    });
    var fbInfo2 = new google.maps.InfoWindow({
      content: "<h2>Ismael Balafrej</h2><p>Temps alouer: 26h</p><p>personnes atteintes: 5</p>"
    });

    google.maps.event.addListener(facebookMarker1, 'click', function () { fbInfo1.open(map, facebookMarker1); });
    google.maps.event.addListener(facebookMarker2, 'click', function () { fbInfo2.open(map, facebookMarker2); });
  }

}
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: sherbrooke,
    zoom: 12
  });
  var markerFleurimont = new google.maps.Marker({
    position: { lat: 45.448176, lng: -71.869898 },
    map: map,
    icon: hospital,
  });
  var markerHotleDieu = new google.maps.Marker({
    position: { lat: 45.398463, lng: -71.879168 },
    map: map,
    icon: hospital,
  });
  google.maps.event.addListener(markerFleurimont, 'click', function () { window.location.hash = '#fleurimont'; });
  google.maps.event.addListener(markerHotleDieu, 'click', function () { window.location.hash = '#hotelDieu'; });
  loadMarkers();
}