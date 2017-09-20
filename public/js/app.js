let map;
const menu = document.querySelector('.menu');

// hides/shows the items in the submenu
function hide(hs, submenu, show) {
  if (hs) {
    show.style.display = 'none'
    submenu.style.display = 'inline-block';
  } else {
    show.style.display = 'inline-block';
    submenu.style.display = 'none'
  }
};


function initMap() {
  let mapOptions = {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
    fullscreenControl: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM,
    },
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  let mnu = menu.cloneNode(true);
  mnu.removeAttribute('hidden');
  let s = mnu.querySelector('.show');
  let h = mnu.querySelector('.hide');
  let sm = mnu.querySelector('.submenu');
  s.addEventListener('click', (e) => hide(true, sm, s));
  h.addEventListener('click', (e) => hide(false, sm, s));
  mnu.index = 1;
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(mnu);
}
