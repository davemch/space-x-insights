/* --- Recive Data from SpaceX API and calculate/display it--- */

// URLs to access the API
const allCrewURL = 'https://api.spacexdata.com/v4/crew';
const nextLaunch = 'https://api.spacexdata.com/v4/launches/next';
const allLaunches = 'https://api.spacexdata.com/v4/launches'
const allLaunchpads = 'https://api.spacexdata.com/v4/launchpads'
const allPayload = 'https://api.spacexdata.com/v4/payloads'
const allCapsules = 'https://api.spacexdata.com/v4/capsules'
const roadstarURL = 'https://api.spacexdata.com/v4/roadster'

//Call functions to retrive and display data
getNextLaunchInformation(fetchData(nextLaunch));
getAllLaunchData(fetchData(allLaunches));
calculateTotalPayload(fetchData(allPayload));
getCapsuleInformation(fetchData(allCapsules));
getRoadstarDistance(fetchData(roadstarURL));
getCrewMembers(fetchData(allCrewURL));
getLaunchpads(fetchData(allLaunchpads));

/**
 * Given an API URL this function fetches the data from the API
 * @param {string} url 
 * @returns fetched API data
 */
async function fetchData(url){
  let response = await fetch(url);
  // Check if response is ok, if not throw an error
  if(!response.ok) {
    throw Error(`Error fetching API, response:  ${response.statusText}`);
  }
  return await response.json();
}


/**
 * Extracts the date of an upcoming launch and sends it to the displayNextLaunchCountdown Function
 * @param {Promise} launchData 
 */
function getNextLaunchInformation(launchData) {
  launchData.then(data =>{
    displayNextLaunchCountdown(data.date_unix)
  });
}

/**
 * Recieves a unixdate timestamp, calculates the difference to the current time and displays it on the DOM
 * @param {int} launchDate 
 */
function displayNextLaunchCountdown(launchDate){
  var div = $('<div/>');
  div.html(`
  <div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
    <div class="card-body text-dark">
      <h6 class="card-title">Time until next Launch 
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-alarm-fill" viewBox="0 0 16 16">
        <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5zm2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
      </svg>
      </h6>
      <h5 class="card-text" id="timer"></h5>
    </div>
  </div>`);
  $('#basic-information').append(div);

  //Calculation of the time difference every 1000ms = 1s
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

/**
 * Extracts the data from all launches and counts how many of them have been successfull. 
 * It then sends it to the display function. 
 * @param {Promise} allLaunchData 
 */
function getAllLaunchData(allLaunchData) {
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


/**
 * Displays the amount of successfull launches
 * @param {int} amount 
 */
function displaySuccessLaunches(amount) {
  var div = $('<div/>');
  div.html(`
  <div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
    <div class="card-body text-dark">
      <h6 class="card-title">Total Amount of successful Launches 
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
      </svg>
      </h6>
      <h5 class="card-text">${amount}</h5>
    </div>
  </div>`);
  $('#basic-information').append(div);
}

/**
 * Recivies payload information and sums up all the payloads. 
 * Afterwards the summed up payload gets sent to the display function
 * @param {Promise} allPayloads 
 */
function calculateTotalPayload(allPayloads) {
  let totalMass = 0;
  allPayloads.then(data =>{
    data.forEach(payload => {
      totalMass += payload.mass_kg;
    })
    displayPayload(totalMass);
  })
}

/**
 * Gets the total payload and displays it.
 * @param {float} totalMass 
 */
function displayPayload(totalMass) {
  var div = $('<div/>');
  div.html(`
  <div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
    <div class="card-body text-dark">
      <h6 class="card-title">Total Payload Carried 
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-minecart-loaded" viewBox="0 0 16 16">
        <path d="M4 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM.115 3.18A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 14 12H2a.5.5 0 0 1-.491-.408l-1.5-8a.5.5 0 0 1 .106-.411zm.987.82 1.313 7h11.17l1.313-7H1.102z"/>
        <path fill-rule="evenodd" d="M6 1a2.498 2.498 0 0 1 4 0c.818 0 1.545.394 2 1 .67 0 1.552.57 2 1h-2c-.314 0-.611-.15-.8-.4-.274-.365-.71-.6-1.2-.6-.314 0-.611-.15-.8-.4a1.497 1.497 0 0 0-2.4 0c-.189.25-.486.4-.8.4-.507 0-.955.251-1.228.638-.09.13-.194.25-.308.362H3c.13-.147.401-.432.562-.545a1.63 1.63 0 0 0 .393-.393A2.498 2.498 0 0 1 6 1z"/>
      </svg>
      </h6>
      <h5 class="card-text">${Math.floor(totalMass)} kg</h5>
    </div>
  </div>`);
  $('#basic-information').append(div);
}


/**
 * Recives Capsule Information and calculates the total amount of waterlandings and reused capsules. 
 * Afterwards it sends these sums to the display functions
 * @param {Promise} capsules 
 */
function getCapsuleInformation(capsules) {
  var waterLandings = 0;
  var reuse = 0;

  capsules.then(capsules => {
    capsules.forEach(capsule => {
      waterLandings += capsule.water_landings;
      if(capsule.reuse_count > 0) {
        reuse++;
      }
    })
    displayWaterLandings(waterLandings);
    displayTotalReuse(reuse);
  });
}

/**
 * Displays the amount of water landings.
 * @param {int} waterLandings 
 */
function displayWaterLandings(waterLandings) {
  var div = $('<div/>');
  div.html(`
  <div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
    <div class="card-body text-dark">
      <h6 class="card-title">Total Water Landings 
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-water" viewBox="0 0 16 16">
        <path d="M.036 3.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 3.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 6.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 9.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65z"/>
      </svg>
      </h6>
      <h5 class="card-text">${waterLandings}</h5>
    </div>
  </div>`);
  $('#basic-information').append(div);
}

/**
 * Displays the amount of reused capsules
 * @param {int} reuse 
 */
function displayTotalReuse(reuse) {
  var div = $('<div/>');
  div.html(`
  <div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
    <div class="card-body text-dark">
      <h6 class="card-title">Total reused Ships 
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-recycle" viewBox="0 0 16 16">
        <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z"/>
      </svg>
      </h6>
      <h5 class="card-text">${reuse}</h5>
    </div>
  </div>`);
  $('#basic-information').append(div);
}

/**
 * Recives Roadstar Information and extracts the current distance to mars, to then send it to the display function. 
 * @param {Promise} roadstarData 
 */
function getRoadstarDistance(roadstarData) {
  roadstarData.then(data =>
    displayRoadstarDistance(data.mars_distance_km)
  )
}

/**
 * Displays the Distance to Mars from the Tesla Roadstar.
 * @param {float} distance 
 */
function displayRoadstarDistance(distance) {
  var div = $('<div/>');
  div.html(`
  <div class="card border-dark mb-3 h-90" style="max-width: 18rem;">
    <div class="card-body text-dark">
      <h6 class="card-title">Tesla Roadstar Distance to Mars 
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-rulers" viewBox="0 0 16 16">
        <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1H1z"/>
      </svg>
      </h6>
      <h5 class="card-text">${Math.floor(distance)} km</h5>
    </div>
  </div>`);
  $('#basic-information').append(div);
}

/**
 * Recives the Crew Member Data and sends it to the display function one by one. 
 * @param {Promise} crewData 
 */
function getCrewMembers(crewData) {
  crewData.then(data =>{
    data.forEach(crewMember => {
      displayCrewMember(crewMember)
    });
  })
}
 
/**
 * Displays the Information from each Crew Member
 * @param {Array} crewMember 
 */
function displayCrewMember(crewMember){
    var div = $('<div/>');
    div.html(`
    <div class="card h-100" style="width: 18rem;">
      <div class="card-body">
        <a href="${crewMember.wikipedia}" class="card-link"><img class="img-thumbnail" src="${crewMember.image}"></a>
        <h5 class="card-title">${crewMember.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${crewMember.agency}</h6>
      </div>
    </div>`);
  $('#crew-member').append(div);
}

/**
 * Sends the Launchpad data to the display function one by one
 * @param {Promise} launchpadData 
 */
function getLaunchpads(launchpadData) {
  launchpadData.then(data => {
    data.forEach(launchpad => {
      displayPlattformLocations(launchpad);
    })
  })
}

/**
 * Calculates the percentage of successful Launches from a Launchpad
 * @param {int} success 
 * @param {int} attemps 
 * @returns Successrate
 */
function successRate(success, attemps) {
  if(attemps !== 0) {
    return Math.floor(success / attemps * 100) + "%"
  } else {
    return "No Attemps"
  }
}


/**
 * Displays the Information from every Launchpad
 * @param {Array} launchpad 
 */
function displayPlattformLocations(launchpad) {
  var div = $('<div/>');
  div.html(`
  <div class="card border-dark mb-5 h-99">
    <div class="card-body text-dark">
      <h5 class="card-title">${launchpad.name}</h5>
      <p class="card-text"><b>Details:</b> ${launchpad.details}</p>
      <p class="card-text"><b>Location:</b> ${launchpad.locality}</p>
      <p class="card-text"><b>Launch Attemps:</b> ${launchpad.launch_attempts}</p>
      <p class="card-text"><b>Successfull Launches:</b> ${launchpad.launch_successes}</p>
      <p class="card-text"><b>Success Rate:</b> ${successRate(launchpad.launch_successes, launchpad.launch_attempts)}</p>
      <p class="card-text"><b>Status:</b> ${launchpad.status}</p>
    </div>
  </div>`);
  $('#plattform-information').append(div);  
}


