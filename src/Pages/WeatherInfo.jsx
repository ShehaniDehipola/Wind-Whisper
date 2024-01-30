import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake, faWind, faEye, faThermometer1, faCalendar } from '@fortawesome/free-solid-svg-icons'; 
import { WiHumidity, WiSunset, WiSunrise, WiBarometer, WiStrongWind  } from 'react-icons/wi'
import { toast, ToastContainer } from 'react-toastify';
import "toastify-js/src/toastify.css";
import Toastify from 'toastify-js';
import 'react-toastify/dist/ReactToastify.css';
import weatherServiceInstance from '../Services/WeatherService';
import { Link } from 'react-router-dom';


const WeatherInfo = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [forecastArray, setForecastArray] = useState([]);
  const [currentHourIndex, setCurrentHourIndex] = useState(0);
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [error, setError] = useState(null);

  //get current live location
  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(async(position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

      console.log(position);

      try {
        const currentCity = await weatherServiceInstance.getCurrentCityByCoords(position.coords.latitude, position.coords.longitude);

        console.log("current city:", currentCity);

        handleSearch(currentCity);

        const currentWeatherResponse = await weatherServiceInstance.getCurrentWeather(currentCity);

        if (currentWeatherResponse.data) {
          setWeatherData(currentWeatherResponse.data);

          handleCurrentWeatherForecast(position.coords.latitude, position.coords.longitude);
        }

      } catch (error) {
        console.error("Error fetching live weather data:", error);
      }
    }, (error) => {
      console.error("Error getting geolocation:", error);
    });
  },[]);
  
  //function to search city
  const handleSearch = async (city) => {
    
    console.log("Search query city:", city);

    const response = await weatherServiceInstance.getCurrentWeather(searchQuery || city);

    if(response.data){

      setWeatherData(response.data);
    
      const lat = response.data.coord.lat;
      const lon = response.data.coord.lon;

      handleCurrentWeatherForecast(lat, lon);

    }
    else{
      if(response.response.data.cod !== 200){
        Toastify({
          text: "City not found",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right", 
          stopOnFocus: true, 
          style: {
            background: "linear-gradient(to right, #ec7063, #cb4335)",
          },
          onClick: function(){} 
        }).showToast();
      }
    }
  }

  //function to get five day weather forecast
  const handleCurrentWeatherForecast = async (lat, lon) => {

    const forecastResponse = await weatherServiceInstance.getWeatherForecast(lat, lon);

      if(forecastResponse.data){
        setWeatherForecast(forecastResponse.data.list);

        const setDayOneWeatherCollection = forecastResponse.data.list.slice(0, 8);
        const setDayTwoWeatherCollection = forecastResponse.data.list.slice(8, 16);
        const setDayThreeWeatherCollection = forecastResponse.data.list.slice(16, 24);
        const setDayFourWeatherCollection = forecastResponse.data.list.slice(24, 32);
        const setDayFiveWeatherCollection = forecastResponse.data.list.slice(32, 40);

        setForecastArray(() => ({
          d1: setDayOneWeatherCollection, 
          d2: setDayTwoWeatherCollection,
          d3: setDayThreeWeatherCollection,
          d4: setDayFourWeatherCollection,
          d5: setDayFiveWeatherCollection
        }))

        console.log(forecastArray);
        console.log(forecastResponse.data);
      }
  }
  
  //Enter key execution
  const enterKeyExecute = (e) => {
    if(e.key === "Enter") {handleSearch()}
  }

  //Temperature with round number
  const formatTemp = (temp) => {
    return temp ? Math.round(temp): 0;
  }

  //Sunset with time format
  const getSunsetTime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const options = { timeZone: 'Asia/Colombo', hour: 'numeric', minute: 'numeric'};
    const time = date.toLocaleTimeString('en-US', options);

    return time;
  }

  //Get temperature in Celsius
  const kelvinToCelsius = (tempInKelvin) => {
    return tempInKelvin - 273.15;
  }

  //Get visibility in km
  const visibilityInKm = (visibilityInMeters) => {
    return visibilityInMeters / 1000;
  }

  //Get 5 day forecast which changes every 3 hours
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHourIndex((prevIndex) => (prevIndex + 1) % 8); //each day has 8 data points
    }, 3 * 60 * 60 * 1000); //3 hours in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  //icons and styles for weather icons
  const getWeatherIcon = (weatherType) => {
    switch(weatherType){
      case 'Clear':
        return <FontAwesomeIcon icon={faSun} style={{color: '#F4D03F', width: '200px', height: '200px'}} />;

      case 'Clouds':
        return <FontAwesomeIcon icon={faCloud} style={{color: '#5DADE2', width: '200px', height: '200px'}} />;

      case 'Rain':
        return <FontAwesomeIcon icon={faCloudRain} style={{color: '#85929E', width: '200px', height: '200px'}} />;

      case 'Snow':
        return <FontAwesomeIcon icon={faSnowflake} style={{color: '#D4E6F1', width: '200px', height: '200px'}} />;

      case 'Wind':
        return <FontAwesomeIcon icon={faWind} style={{color: '#52BE80', width: '200px', height: '200px'}} />;

      case 'Mist':
        return <FontAwesomeIcon icon={faCloud} style={{color: '#D7DBDD', width: '200px', height: '200px'}} />;
    }
  }

  //icons and styles for the icons display in forecast
  const getWeatherForecastIcon = (weatherType) => {
    switch(weatherType){
      case 'Clear':
        return <FontAwesomeIcon icon={faSun} style={{color: '#F9E79F', width: '80px', height: '80px'}} />;

      case 'Clouds':
        return <FontAwesomeIcon icon={faCloud} style={{color: '#AED6F1', width: '80px', height: '80px'}} />;

      case 'Rain':
        return <FontAwesomeIcon icon={faCloudRain} style={{color: '#D5DBDB', width: '80px', height: '80px'}} />;

      case 'Snow':
        return <FontAwesomeIcon icon={faSnowflake} style={{color: '#AED6F1', width: '80px', height: '80px'}} />;

      case 'Wind':
        return <FontAwesomeIcon icon={faWind} style={{color: '#D5DBDB', width: '80px', height: '80px'}} />;

      case 'Mist':
        return <FontAwesomeIcon icon={faCloud} style={{color: '#D6EAF8', width: '80px', height: '80px'}} />;
    }
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='shadow-md p-1 w-full mb-4 flex justify-between items-center'>
       <Link to={"/"}>
        <h1 className='font-sans font-extrabold text-xl sm:text-2xl lg:text-4xl flex flex-wrap ml-2'>
        <span className='text-amber-500'>Wind</span>
        <span className='text-sky-500'>Whisper</span>
        </h1>
       </Link>
      <div className='m-1'>
        <input type='text' placeholder='Enter city name...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='p-2 border border-gray-300 rounded-md w-full sm:w-64'/>
        <button onClick={handleSearch} onKeyDown={enterKeyExecute} className='bg-blue-500 text-white px-4 py-2 rounded-md ml-2'>Search</button>
      </div>
      </div>
      <div className='flex flex-row flex-1 h-1/2'>
        <div className='flex flex-row gap-4 flex-1 p-4 bg-gray-50 rounded-md m-6 shadow-md justify-between' style={{height: '360px'}}>
          <div className='flex flex-col ml-5'>
          <span className='flex-grow font-semibold text-8xl text-slate-600 ml-2 mt-10' style={{fontSize: '2em'}}>{weatherData?.name}</span>
          <span className='flex-grow font-semibold text-8xl text-slate-500 font-sans' style={{fontSize: '8em'}}>{formatTemp(weatherData?.main?.temp)}&deg;C</span>
          </div>
          <div className='flex flex-col mr-10'>
          <span>{getWeatherIcon(weatherData?.weather?.[0]?.main)}</span>
          <span className='text-center text-xl mt-5 text-slate-500'>{weatherData?.weather?.[0]?.main}</span>
          </div>
        </div>
        <div className='flex flex-col gap-4 mt-6 ml-2 mr-6 w-1/2'>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-row flex-1 bg-gray-50 p-4 rounded-md shadow-md justify-between'>
              <div className='flex flex-col'>
              <WiStrongWind style={{color:'#BFC9CA', width:'50', height:'50'}}/>
              <span className='text-lg font-semibold text-slate-500'>Wind </span>
              </div>
            <span className='text-3xl mt-10 text-slate-600'>{weatherData?.wind?.speed} m/s</span>
            </div>

            <div className='flex flex-row flex-1 bg-gray-50 p-4 rounded-md shadow-md justify-between'>
            <div className='flex flex-col'>
            <WiHumidity style={{color:'#82E0AA',width:'50', height:'50'}}/>
              <span className='text-lg font-semibold text-slate-500'>Humidity</span>
            </div>
              <span className='text-3xl mt-10 text-slate-600'>{weatherData?.main?.humidity}%</span>
            </div>
          </div> 
          <div className='flex flex-row gap-4'>
            <div className='flex flex-row flex-1 bg-gray-50 p-4 rounded-md shadow-md justify-between'>
              <div className='flex flex-col'>
              <WiSunset style={{color:'#F4D03F', width:'50', height:'50'}}/>
              <span className='text-lg font-semibold text-slate-500'>Sunset </span>
              </div>
              <span className='text-3xl mt-10 text-slate-600'>{getSunsetTime(weatherData?.sys?.sunset)}</span>
              {/* <WiSunrise style={{color:'#F4D03F', width:'50', height:'50'}}/>
              <span>Sunrise: {getSunsetTime(weatherData?.sys?.sunrise)}</span> */}
            </div>
            <div className='flex flex-row flex-1 bg-gray-50 p-4 rounded-md shadow-md justify-between'>
            <div className='flex flex-col'>
            <WiBarometer style={{color:'#7F8C8D', width:'50', height:'50'}}/>
              <span className='text-lg font-semibold text-slate-500'>Pressure</span>
            </div>
              <span className='text-3xl mt-10 text-slate-600'>{weatherData?.main?.pressure} hPa</span>
            </div>
          </div>
          <div className='flex flex-row gap-4'>
          <div className='flex flex-row flex-1 bg-gray-50 p-4 rounded-md shadow-md justify-between'>
            <div className='flex flex-col'>
            <FontAwesomeIcon icon={faEye} style={{color:'#85C1E9', width:'40', height:'40'}}/>
              <span className='text-lg font-semibold text-slate-500'>Visibility</span>
            </div>
              <span className='text-3xl mt-10 text-slate-600'>{visibilityInKm(weatherData?.visibility)} km</span>
          </div>
            <div className='flex flex-row flex-1 bg-gray-50 p-4 rounded-md shadow-md justify-between'>
            <div className='flex flex-col'>
            <FontAwesomeIcon icon={faThermometer1} style={{color:'#F8C471', width:'40', height:'40'}}/>
            <span className='text-lg font-semibold text-slate-500'>Feels like</span>
            </div>
            <span className='text-3xl mt-10 text-slate-600'>{weatherData?.main?.feels_like}&deg;C</span>
            </div>
          </div> 
          <div>
          </div>
        </div>
      </div>
        <div className='flex-1 bg-gray-50 p-4 mt-1 m-6 shadow-md'>
          <div className='flex flex-row'>
             <FontAwesomeIcon icon={faCalendar} className='text-slate-500 mt-1 h-5 w-5'/>
             <h2 className='text-xl font-semibold text-slate-600 ml-2 sm:text-lg lg:text-xl'>5-Day Forecast</h2>
          </div>
          <div className='flex flex-row gap-8 m-2'>
          {Object.keys(forecastArray).map((dayKey, index) => (
            <div key={index} className='flex flex-col bg-white p-2 rounded-md h-22 w-96 shadow-sm'>
              {Array.isArray(forecastArray[dayKey]) &&
                forecastArray[dayKey].map((hourData, hourIndex) => (
                  <div key={hourIndex} className='flex flex-row' style={{ display: hourIndex === currentHourIndex ? '' : 'none' }}>
                    <div className='flex flex-col'>
                    <span className='text-lg font-semibold text-slate-500'>{new Date(hourData.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className='text-s text-slate-600'>
                      {`${formatTemp(kelvinToCelsius(hourData.main.temp_min))}°C - ${formatTemp(kelvinToCelsius(hourData.main.temp_max))}°C`}
                    </span>
                    <span className='text-slate-500'>{hourData.weather[0].main}</span>
                    
                    </div>
                    <div className='ml-14 mt-2 justify-center'>
                      <span className='font-semibold text-slate-500'>{getWeatherForecastIcon(hourData.weather[0].main)}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
        </div>
    </div>
  )
}

export default WeatherInfo;