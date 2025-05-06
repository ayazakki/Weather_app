let cityInput = document.querySelector("#cityInput")
let findBtn = document.querySelector("#findBtn")
findBtn.addEventListener("click",function(){
    let city = cityInput.value
    weatherAPI(city)
})
cityInput.addEventListener("input",function(){
  let city=cityInput.value
  weatherAPI(city)
})
async function weatherAPI(query){
    try {
      let res= await fetch(`http://api.weatherapi.com/v1/forecast.json?key=95b912a032664cb88ea132927252604&q=${query}&days=3`)
      let weatherData= await res.json()
      console.log(weatherData);
      display(weatherData)
    } catch (error) {
      console.log("Sorry, this city is not valid");
      
    }
}
weatherAPI("cairo")
function display(weatherData){
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d = new Date();
  const today = weekday[d.getDay()];
  const tomorow=weekday[new Date(weatherData.forecast.forecastday[1].date).getDay()]
  const inTwoDays=weekday[new Date(weatherData.forecast.forecastday[2].date).getDay()]
  const nameMonth=month[d.getMonth()]
  const dayInMonth=d.getDate()
  console.log(today,tomorow,inTwoDays,nameMonth,dayInMonth);
  const windDirMap = {
    "N": "North",
    "NNE": "North-Northeast",
    "NE": "Northeast",
    "ENE": "East-Northeast",
    "E": "East",
    "ESE": "East-Southeast",
    "SE": "Southeast",
    "SSE": "South-Southeast",
    "S": "South",
    "SSW": "South-Southwest",
    "SW": "Southwest",
    "WSW": "West-Southwest",
    "W": "West",
    "WNW": "West-Northwest",
    "NW": "Northwest",
    "NNW": "North-Northwest"
  };
  const windDirection = windDirMap[weatherData.current.wind_dir] || weatherData.current.wind_dir;
  let cartona=`
    <div class="col-lg-4 pe-lg-0">
          <div class="card mb-3 h-100 ">
            <div class="card-header d-flex justify-content-between">
              <span>${today}</span>
              <span>${dayInMonth}${nameMonth}</span>
            </div>
            <div class="card-body text-start px-3 py-4">
              <h5 class="card-title">${weatherData.location.name}</h5>
              <div class="d-block d-sm-flex align-items-center d-lg-block mb-4">
                <h1 class="card-text">${weatherData.current.temp_c}&deg;C</h1>
                <img src="${weatherData.current.condition.icon}" class="condition-icon ms-sm-5 ms-lg-0 " alt="weather condition icon" />
              </div>
              <span class="weather-states">${weatherData.current.condition.text}</span>
              <div class="mt-3">
                <span class="me-3">
                  <img src="./imgs/icon-umberella.png" alt="rainy">
                  <span>${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%</span>
                </span>
                <span class="me-3">
                  <img src="./imgs/icon-wind.png" alt="wind">
                  <span>${weatherData.current.wind_kph}km/h</span>
                </span>
                <span>
                  <img src="./imgs/icon-compass.png" alt="compass">
                  <span>${windDirection}</span>
                </span>
              </div>
            </div>
          </div>
    </div>
    <div class="col-lg-4 ps-lg-0 pe-lg-0">
          <div class="card mb-3 text-center h-100 ">
            <div class="card-header bg-dark">
              <span>${tomorow}</span>
            </div>
            <div class="card-body pt-5 second-card">
              <img src="${weatherData.forecast.forecastday[1].day.condition.icon}" class="mb-4" alt="weather condition icon for tomorow"/>
              <div class="mb-4">
                <h2 class="card-text">${weatherData.forecast.forecastday[1].day.maxtemp_c}&deg;C</h2>
                <span>${weatherData.forecast.forecastday[1].day.mintemp_c}&deg;</span>
              </div>
              <span class="weather-states">${weatherData.forecast.forecastday[1].day.condition.text}</span>
            </div>
          </div>
        </div>
        <div class="col-lg-4 ps-lg-0">
          <div class="card mb-3 text-center h-100">
            <div class="card-header">
              <span>${inTwoDays}</span>
            </div>
            <div class="card-body pt-5">
              <img src="${weatherData.forecast.forecastday[2].day.condition.icon}" class="mb-4" alt="weather condition icon intwodays" />
              <div class="mb-4">
                <h2 class="card-text">${weatherData.forecast.forecastday[2].day.maxtemp_c}&deg;C</h2>
                <span>${weatherData.forecast.forecastday[2].day.mintemp_c}&deg;</span>
              </div>
              <span class="weather-states">${weatherData.forecast.forecastday[2].day.condition.text}</span>
            </div>
          </div>
        </div>
  `
  document.querySelector(".row").innerHTML=cartona
}
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const query = `${latitude},${longitude}`;
        await weatherAPI(query);
        let res= await fetch(`http://api.weatherapi.com/v1/forecast.json?key=95b912a032664cb88ea132927252604&q=${query}&days=3`)
        let data = await res.json();
        if (data.location && data.location.name) {
          cityInput.value = data.location.name;
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        weatherAPI("Cairo");
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    weatherAPI("Cairo");
  }
}
document.addEventListener("DOMContentLoaded", getUserLocation);
