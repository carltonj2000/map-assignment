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
    center: {lat: 36.114546, lng: -115.172919},
    zoom: 12,
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
    app.addMarkers(google);
  },
  addMarkers: (google) => {
    app.markers.forEach(marker => {
      const mm = new google.maps.Marker({ ...marker, map: app.map });
      app.markersMap.push(mm);
    });
  },
  markers: defaultMarkers,
  markersMap: [],
  PlacesViewModel: function () {
    self = this;
    self.filter = ko.observable("Paris");
    self.places = ko.observableArray();
    self.filterPlaces = ko.computed(function () {
      if(!self.filter()) { return self.places() }
      else {
        return ko.utils.arrayFilter(self.places(), function(place) {
          const match = place.title.toLowerCase().includes(
            self.filter().toLowerCase());
          if (!match) {
            const mm = app.markersMap.filter(m => m.title === place.title);
            if (mm.length > 0) mm[0].setMap(null);
          } else {
            const mm = app.markersMap.filter(m => m.title === place.title);
            if (mm.length > 0) mm[0].setMap(app.map);
          };
          return match;
        })
      }
    });
    self.placesSelected = ko.computed(function () {
      return self.filterPlaces().length;
    });
  },
  koBind: () => {
    const ap = new app.PlacesViewModel();
    app.markers.map(marker => { ap.places.push(marker); });
    ko.applyBindings(ap);
  },
};

app.koBind();
