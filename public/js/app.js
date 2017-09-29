"use strict";

var app = {
  menu: document.querySelector('.menu'),
  // create at menu with the places
  createMenu: () => {
    let mnu = app.menu.cloneNode(true);
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
      new google.maps.Marker({ ...marker, map: app.map });
    });
  },
  markers: defaultMarkers,
  PlacesViewModel: function () {
    self = this;
    self.fltr = ko.observable("Paris");
    self.places = ko.observableArray();
    self.filterPlaces = ko.computed(function () {
      if(!self.fltr()) { return self.places() }
      else {
        return ko.utils.arrayFilter(self.places(), function(place) {
          return place.title.includes(self.fltr());
        })
      }
    });
  },
  koBind: () => {
    const ap = new app.PlacesViewModel();
    app.markers.map(marker => { ap.places.push(marker); });
    ko.applyBindings(ap);
  },
};

app.koBind();
