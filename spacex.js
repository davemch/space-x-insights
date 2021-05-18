/* --- Recive Data from SpaceX API and calculate/display it--- */

// URLs to access the API
const allCrewURL = 'https://api.spacexdata.com/v4/crew';
const nextLaunch = 'https://api.spacexdata.com/v4/launches/next';
const allLaunches = 'https://api.spacexdata.com/v4/launches'
const allLaunchpads = 'https://api.spacexdata.com/v4/launchpads'
const allPayload = 'https://api.spacexdata.com/v4/payloads'
const allCapsules = 'https://api.spacexdata.com/v4/capsules'
const roadstarURL = 'https://api.spacexdata.com/v4/roadster'

getCrewMembers(fetchData(allCrewURL));
getLaunchData(fetchData(allLaunches));
calculateTotalPayload(fetchData(allPayload));
getLaunchpads(fetchData(allLaunchpads))
getAllCapsules(fetchData(allCapsules))
getRoadstarDistance(fetchData(roadstarURL));
getNextLaunch(fetchData(nextLaunch));


async function fetchData(url){
  let response = await fetch(url);

  // Check if response is ok, if not throw an error
  if(!response.ok) {
    throw Error(`Error fetching API, response status:  ${response.statusText}`);
  }
  return await response.json();
}

function getNextLaunch(launchData) {
  launchData.then(data =>{
    displayNextLaunchCountdown(data.date_unix)
  });
}


function displayNextLaunchCountdown(launchDate){
  var div = $('<div/>');
  div.html(`
  <div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
    <div class="card-body text-dark">
      <h5 class="card-title">Time until next Launch</h5>
      <p class="card-text" id="timer"></p>
    </div>
  </div>`);
  $('#basic-information').append(div);

  setInterval(function() {
    var timeNow = Date.now();
    var distance = (launchDate * 1000) - timeNow;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    $('#timer').html(`${days}D ${hours}H ${minutes}M ${seconds}S`);
  },1000)
}




function getCrewMembers(crewData) {
var div = $('<div/>')
crewData.then(data =>{
  data.forEach(crewMember => {
    displayCrewMember(crewMember.name, crewMember.agency, crewMember.image, crewMember.wikipedia);
  });
})
}

function displayCrewMember(name, agency, image, wikipedia){
  var div = $('<div/>')
  div.html(`<div class="card h-100" style="width: 18rem;">
  <div class="card-body">
    
  <a href="${wikipedia}" class="card-link"><img class="img-thumbnail" src="${image}"></a>
    <h5 class="card-title">${name}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${agency}</h6>
    
  </div>
</div>`)
$('#crew-member').append(div);
}

function getLaunchData(allLaunchData) {
  var success = 0;
  allLaunchData.then(data => {
    data.forEach(launch => {
      if(launch.success === true) {
        success++;
      }
    })
    displaySuccessLaunches(success);
  })
}

function displaySuccessLaunches(amount) {
  var div = $('<div/>')
  div.html(`<div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
  <div class="card-body text-dark">
    <h5 class="card-title">Total Amount of successful Launches</h5>
    <p class="card-text">${amount}</p>
  </div>
</div>`)
$('#basic-information').append(div);
}

function calculateTotalPayload(allPayloads) {
  let totalMass = 0;
  allPayloads.then(data =>{
    data.forEach(payload => {
      totalMass += payload.mass_kg;
    })
    displayPayload(totalMass);
  })
}

function displayPayload(totalMass) {
  var div = $('<div/>')
  div.html(`<div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
  <div class="card-body text-dark">
    <h5 class="card-title">Total Payload Carried</h5>
    <p class="card-text">${totalMass} kg</p>
  </div>
</div>`)
$('#basic-information').append(div);
}


function getAllCapsules(capsules) {
  var waterLandings = 0;
  var reuse = 0;

  capsules.then(capsules => {
    capsules.forEach(capsule => {
      waterLandings += capsule.water_landings;

      if(capsule.reuse_count > 0) {
        reuse++;
      }

    })
    displayWaterLandings(waterLandings)
    displayTotalReuse(reuse)
  });

}

function displayWaterLandings(waterLandings) {
  var div = $('<div/>')
  div.html(`<div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
  <div class="card-body text-dark">
    <h5 class="card-title">Total Water Landings</h5>
    <p class="card-text">${waterLandings}</p>
  </div>
</div>`)
$('#basic-information').append(div);
}

function displayTotalReuse(reuse) {
  var div = $('<div/>')
  div.html(`<div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
  <div class="card-body text-dark">
    <h5 class="card-title">Total Amount of re-used Ships</h5>
    <p class="card-text">${reuse}</p>
  </div>
</div>`)
$('#basic-information').append(div);
}

function getRoadstarDistance(roadstarData) {
  roadstarData.then(data =>
    displayRoadstarDistance(data.mars_distance_km)
  )
}

function displayRoadstarDistance(distance) {
  var div = $('<div/>')
  div.html(`
  <div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
  <div class="card-body text-dark">
    <h5 class="card-title">Tesla Roadstar Distance to Mars</h5>
    <p class="card-text">${distance} km</p>
  </div>
</div>`)
$('#basic-information').append(div);
}


function getLaunchpads(launchpadData) {
  launchpadData.then(data => {
    data.forEach(launchpad => {
    })
  })
}


function displayPlattformLocations() {

}
