import React, { useState } from "react";
import moment from "moment";
moment().format();
const CurrentWeather = () => {
  let time = moment().toISOString(new Date());
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [bgColor, setBgColor] = useState("linear-gradient(180deg, rgba(180,180,180,1) 0%, rgba(21,21,21,1) 100%)");

  //portions of code from SheCodes Athena
  function handleLocationClick() {
    setLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }
  function success(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
      })
      .catch((error) => console.log(error));
  }
  function error() {
    console.log("Unable to retrieve your location");
  }

  if (parseInt(time.charAt(14)) >= 3) {
    time = time.slice(0, 12) + (parseInt(time.charAt(12)) + 1) + ":00";
  } else {
    time = time.slice(0, 13) + ":00";
  }
  if (time.substring(11,13)==="24")
  {
    time = time.substring(0,11)+"23"+time.substring(13,16);
  }
  function bgColorChanger(timeListVar, hourIndexVar) {
    let tempTemperature = timeListVar.temperature_2m[hourIndexVar];
    if (bgColor === ("linear-gradient(180deg, rgba(180,180,180,1) 0%, rgba(21,21,21,1) 100%)")){
      setBgColor("linear-gradient(0deg, rgba("+((255-(45-tempTemperature)/(45)*255))+",100,"+((45-tempTemperature)/(45)*255)+",1) 0%, rgba(21,21,21,1) 100%)");
      console.log(bgColor);
    }
  }
  if (location && weather) {
    let timeList = weather.hourly;
    let hourIndex = false;
    for (let i = 0; i < timeList.time.length; i++) {
      if (timeList.time[i] === time) 
      {
        hourIndex = i;
      }
    }
    bgColorChanger(timeList,hourIndex);
    console.log(timeList.time);
    console.log(time);
    return (
      <div className="Container" style={{background: bgColor}}>
      <div className="currentWeather">
        {timeList.temperature_2m[hourIndex]}°C {timeList.temperature_2m[hourIndex]*9/5+32}°F
      </div>
      </div>
    );
  } else {
    return (
      <div className="Container" style={{background: bgColor}}>
      <div className="currentWeather">
        <br />
        {!location ? (
          <button onClick={handleLocationClick} style={{height:"5em",width:"5em",fontSize:"1em",fontWeight:"bolder"}}>Get Location</button>
        ) : null}
        {location ? <p>Loading weather data...</p> : null}
      </div>
      </div>
    );
  }
};

export default CurrentWeather;
