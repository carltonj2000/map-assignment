# Udacity Map Assignment

  - The
    [Udacity Front End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001)
    map assignment code is contained in this repository.
  - The final running assignment can be seen
    [hosted on firebase](https://maps-a59ca.firebaseapp.com/)
    for viewing and test should you not want to install this repository and
    configure your own
    [google maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key).
  - [Firebase](https://firebase.google.com/)
    is a third party library used in the assignment and allows the map locations
    to be retrieved from a Internet database server.
  - [Open Weather Map](https://openweathermap.org/)
    is the third party library used in the assignment to query and display the
    temperature of a selected location on the map.

## Usage

When the application is running the user can press on the &#9776; symbol
in the upper left corner to display a search entry box and a list of the
location that are filtered according to the search box value.
Clicking on a location description on the list or the icon on the map will
pop up an information window about the location.
Once the information window, for a location, is open clicking on the list
description or the icon on the map will close the information window.

## Setup And Run Locally

Run the application by following the steps below.

  - clone or download the repository,
  - change the directory into the repository directory,
  - run `npm install`,
  - update index.html with your own
    [google maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key),
  - run `npm run serve`.

This should open a browser window with the application running.
