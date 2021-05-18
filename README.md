# space-x-insights
A small webUI that showcases different types of information about Space X using the Space X API

The main part of this application is found in the spacex.js file. It fetches the Information from the Space X API found here: https://github.com/r-spacex/SpaceX-API/tree/master/docs/v4 using the fetch() method. 
The different types of information are then being displayed on the DOM, either directly or after some further calculation (eg. How many Capsules have
been reused over time).

The styling of the page is done mainly using bootstrap, with a little bit of css. 
