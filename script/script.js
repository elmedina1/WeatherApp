let apiKey = '860125333e4516777dadc25699e05462';
let urlApi = 'https://api.openweathermap.org/data/2.5/weather?';

function currentDate() {
  let now = new Date();
  let dayHeader = document.querySelector('#current_date');
  let timeHeader = document.querySelector('#current_time');

  let daysInWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  dayHeader.innerHTML = ` ${now.getDate()} ${
    months[now.getMonth() - 1]
  } ${now.getFullYear()}, ${
    daysInWeek[now.getDay()]
  } ${now.getHours()}:${now.getMinutes()}`;
}
// searches for the city, saves current metric , shows city and temperature for the searched city
function searchCity(event) {
  event.preventDefault();
  let searchCity = document.querySelector('#search-input');
  let tempValue = document.querySelector('#curr_temperature');
  let metric = document.querySelector('#measure');

  let unitsPar = '';
  let unitType = '';

  //check metrics that is used and save the metric for the api call
  if (metric.innerHTML === '℉') {
    unitsPar = 'metric';
    unitType = '℃';
  } else {
    unitsPar = 'imperial';
    unitType = '℉';
  }
  // trim seach input,  verity if imput is not empty
  let h1 = document.querySelector('#city-country');
  if (!searchCity.value || searchCity.value.trim() === '') {
    h1.innerHTML = 'Sorry, no city found.';
  } else {
    h1.innerHTML = searchCity.value.trim();
    axios
      .get(`${urlApi}q=${h1.innerText}&units=${unitsPar}&appid=${apiKey}`)
      .then((response) => {
        console.log(response.data);
        tempValue.innerText = `${Math.round(
          response.data.main.temp
        )}${unitType}`;
      })
      //when api returns error e.g. search city does not existi
      .catch(function (error) {
        if (error.response) {
          h1.innerHTML = 'Sorry, city does not exist.';
        }
      });
  }
}

// Convert from C to F on page, by clicking on unit
function temperatureConverter(event) {
  event.preventDefault();

  let tempValue = document.querySelector('#curr_temperature');

  let metric = document.querySelector('#measure');

  if (metric.innerHTML === '℉') {
    let temArray = tempValue.innerText.split('℃');
    let cel = temArray[0];
    let farenheit = Math.round((cel * 9) / 5 + 32);
    metric.innerHTML = '℃';
    tempValue.innerText = `${farenheit}℉`;
  } else {
    let temArray = tempValue.innerText.split('℉');
    let cel = temArray[0];
    let celsius = Math.round(((cel - 32) * 5) / 9);
    metric.innerHTML = '℉';
    tempValue.innerText = `${celsius}℃`;
  }
}

currentDate();

let searchForm = document.querySelector('#search-form');

// call Search City on the form submit
searchForm.addEventListener('submit', searchCity);

let metricValue = document.querySelector('#measure');
// call function to change C to F and vice verse
metricValue.addEventListener('click', temperatureConverter);

//get current city and temp

function getCurrentLocationTemp(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrTempAndCity);
}

function showCurrTempAndCity(position) {
  let lat = position.coords.latitude;
  let log = position.coords.longitude;

  let tempValue = document.querySelector('#curr_temperature');
  let metric = document.querySelector('#measure');

  let unitsPar = '';
  let unitType = '';

  //check metrics that is used
  if (metric.innerHTML === '℉') {
    unitsPar = 'metric';
    unitType = '℃';
  } else {
    unitsPar = 'imperial';
    unitType = '℉';
  }

  let h1 = document.querySelector('#city-country');

  axios
    .get(`${urlApi}lat=${lat}&lon=${log}&units=${unitsPar}&appid=${apiKey}`)
    .then((response) => {
      console.log(response.data);
      tempValue.innerText = `${Math.round(response.data.main.temp)}${unitType}`;
      h1.innerHTML = response.data.name;
    })
    .catch(function (error) {
      if (error.response) {
        h1.innerHTML = 'Sorry, city does not exist.';
      }
    });
}

let currentBtn = document.querySelector('#curr_btn');
// track click action on the form
currentBtn.addEventListener('click', getCurrentLocationTemp);
