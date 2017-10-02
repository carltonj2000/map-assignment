"use strict";

var app = {
  // create at menu with the places
  createMenu: () => {
    let mnu = document.querySelector('.menu');
    mnu.removeAttribute('hidden');
    let s = mnu.querySelector('.show');
    let h = mnu.querySelector('.hide');
    let sm = mnu.querySelector('.submenu');
    s.addEventListener('click', (e) => app.hide(true, sm, s));
    h.addEventListener('click', (e) => app.hide(false, sm, s));
    mnu.index = 1;
    return mnu;
  },
  // hides/shows the items in the submenu
  hide: (hs, submenu, show) => {
    if (hs) {
      show.style.display = 'none'
      submenu.style.display = 'inline-block';
    } else {
      show.style.display = 'inline-block';
      submenu.style.display = 'none'
    }
  },
  mapOptions: {
    center: {lat: 36.130488, lng: -115.243281},
    zoom: 11,
    fullscreenControl: false,
    mapTypeControl: true,
  },
  initMap: () => {
    // map options that need google defined before using them
    app.mapOptions.mapTypeControlOptions = {
       position: google.maps.ControlPosition.LEFT_BOTTOM,
    }
    app.map = new google.maps.Map(document.getElementById('map'), app.mapOptions);
    app.map.controls[google.maps.ControlPosition.LEFT_TOP].push(app.createMenu());
    app.addMarkers(google, defaultMarkers);
  },
  addMarkers: (google, markers) => {
    app.koBind(markers);
    app.markers.forEach(marker => {
      let contentString = '<div id="content">';
      if (marker.website) contentString +=
        `<h3><a href="${marker.website}">Website</a></h3>`;
      contentString += `<p>${marker.description}"</p>`;
      contentString += '</div>';
      const infowindow = new google.maps.InfoWindow({content: contentString});
      const mm = new google.maps.Marker({ ...marker, map: app.map });
      mm.infowindow = infowindow;
      mm.infowindow.isClosed = true;
      mm.addListener('click', () => app.markerAnimate(mm));
      google.maps.event.addListener(infowindow, 'closeclick', () =>
        mm.infowindow.isClosed = true);
      app.markersMap.push(mm);
    });
  },
  markers: [],
  markersMap: [],
  markerAnimate: (marker) => {
    if (marker.infowindow.isClosed) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      window.setTimeout(() => {
        marker.setAnimation(null);
        marker.infowindow.open(app.map, marker);
        marker.infowindow.isClosed = false;
      }, 500);
    } else {
      marker.infowindow.close();
      marker.infowindow.isClosed = true;
    }
  },
  markerLinkClicked: (link) => {
    let marker = app.markersMap.filter(m => link.text === m.title)[0];
    if (!marker) {console.log("Did not find " + link.text); return;}
    app.map.setCenter(marker.position);
    app.markerAnimate(marker);
  },
  pvmInstance: null,
  PlacesViewModel: function () {
    self = this;
    self.filter = ko.observable("");
    self.places = ko.observableArray();
    self.filterPlaces = ko.computed(function () {
      if(!self.filter())
        return self.places().sort((l,r) => l.title > r.title ? 1 : -1)
      else {
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
  },
  koBind: (markers) => {
    app.markers = markers;
    app.pvmInstance = new app.PlacesViewModel();
    app.markers.map(marker => { app.pvmInstance.places.push(marker); });
    ko.applyBindings(app.pvmInstance);
  },
};
