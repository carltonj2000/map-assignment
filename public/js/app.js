/*jshint esversion: 6 */
var app;
(function () {
  "use strict";

app = {
  // on failure to load the map notify the user
  failMap: () => {
    let map = document.querySelector('#map');
    map.insertAdjacentHTML('afterbegin',
      '<h1>Map Failed To Load</h1><p>Possible network error.</p>');
  },
  // setup a menu with open/close functionality to displaye the places/locations
  getMenu: () => {
    let mnu = document.querySelector('.menu');
    mnu.removeAttribute('hidden');
    let s = mnu.querySelector('.show');
    let h = mnu.querySelector('.hide');
    let sm = mnu.querySelector('.submenu');
    s.addEventListener('click', () => app.hide(true, sm, s));
    h.addEventListener('click', () => app.hide(false, sm, s));
    mnu.index = 1;
    return mnu;
  },
  // hides/shows places/locations submenu on map
  hide: (hs, submenu, show) => {
    if (hs) {
      show.style.display = 'none';
      submenu.style.display = 'inline-block';
    } else {
      show.style.display = 'inline-block';
      submenu.style.display = 'none';
    }
  },
  // map options: location, zoom, etc
  mapOptions: {
    center: {lat: 36.130488, lng: -115.243281},
    zoom: 11,
    fullscreenControl: false,
    mapTypeControl: true,
  },
  // once goole maps is initialized this function is called
  initMap: () => {
    // map options that need google to be defined before using them
    app.mapOptions.mapTypeControlOptions = {
       position: google.maps.ControlPosition.LEFT_BOTTOM,
    };
    app.map = new google.maps.Map(document.getElementById('map'), app.mapOptions);
    app.map.controls[google.maps.ControlPosition.LEFT_TOP].push(app.getMenu());
    app.infowindow = new google.maps.InfoWindow();
    app.koBind();
    app.firebaseGetData();
  },
  openMapApiKey: "eb105b9a1b48a3830f185d89f663bb81",
  infowindow: null,
  createInfoWindow: (marker) => {
    if (app.infowindow && app.infowindow.close) app.infowindow.close();
    let contentString = '<div id="content">';
    if (marker.website) contentString +=
      `<h3><a href="${marker.website}">Website</a></h3>`;
    contentString += `<h4>Temperature Unavailable</h4>`;
    contentString += `<p>${marker.description}"</p>`;
    contentString += '</div>';
    app.infowindow.setContent(contentString);
    app.infowindow.open(app.map, marker);
    const lat = marker.position.lat();
    const lng = marker.position.lng();
    const url = `http://api.openweathermap.org/data/2.5/weather?` +
      `lat=${lat}&lon=${lng}&appid=${app.openMapApiKey}`;
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        const f = Math.trunc((json.main.temp - 273) * 1.8 + 32);
        let tString = contentString.replace('Unavailable', `${f} degress F`)
        app.infowindow.setContent(tString);
      })
  },
  // add the markers to the selection menu and google maps
  // and setup the click event
  addMarkers: (google, markers) => {
    app.markers = markers;
    app.markers.map(marker => { app.pvmInstance.places.push(marker); });
    app.markers.forEach(marker => {
      let mkr = marker;
      mkr.map = app.map;
      const mm = new google.maps.Marker(mkr);
      // marker animation for map click
      mm.addListener('click', () => app.markerAnimate(mm));
      app.markersMap.push(mm);
    });
  },
  markers: [], // array for markers on the menu
  markersMap: [], // array for markers on the map
  // marker animation to bounce and open/close info window
  markerAnimate: (marker) => {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(() => {
      marker.setAnimation(null);
      app.createInfoWindow(marker);
    }, 500);
  },
  // knockout View model instance
  pvmInstance: null,
  // knockout View model
  PlacesViewModel: function () {
    self = this;
    self.filter = ko.observable("");
    self.places = ko.observableArray();
    self.filterPlaces = ko.computed(function () {
      if(!self.filter()) {
        app.markersMap.map(m => m.setMap(app.map));
        return self.places().sort((l,r) => l.title > r.title ? 1 : -1);
      } else {
        return ko.utils.arrayFilter(self.places(), function(place) {
          const match = place.title.toLowerCase().includes(
            self.filter().toLowerCase());
          const mm = app.markersMap.filter(m => m.title === place.title);
          if (!match) mm[0].setMap(null); else mm[0].setMap(app.map);
          return match;
        }).sort((l,r) => l.title > r.title ? 1 : -1);
      }
    });
    self.placesSelected = ko.computed(function () {
      return self.filterPlaces().length;
    });
  // marker animation for menu link click
    self.linkClicked = function (link) {
      let marker = app.markersMap.filter(m => link.title === m.title)[0];
      app.map.setCenter(marker.position);
      app.markerAnimate(marker);
      return false;
    };
  },
  // knockout view model initialize/bind
  koBind: () => {
    app.pvmInstance = new app.PlacesViewModel();
    ko.applyBindings(app.pvmInstance);
  },
  // firebase database access
  firebaseGetData: () => {
    let dberror = document.querySelector('.dberror');
    const firebaseRef = firebase.database().ref();
    const firebaseActivitiesRef = firebaseRef.child("activities");
    firebaseActivitiesRef.once('value')
    .then(snap => {
      dberror.setAttribute('visibility','hidden');
      app.addMarkers(google, Array.from(snap.val().filter(v => !v.inactiveDate)));
    })
    .catch(e => {
      dberror.removeAttribute('hidden');
      // restrict total marker to just a few to know firebase access failed
      app.addMarkers(google, defaultMarkers.slice(-15,-10));
    });
  },
};

})();
