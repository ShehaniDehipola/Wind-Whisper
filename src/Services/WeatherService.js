import axios from 'axios';

class WeatherService {

    api_key = "3693e400eeed619c5516f1126ed0e659";

    base_url = `https://api.openweathermap.org/data/2.5`;

    constructor(){}

    async getCurrentWeather(searchQuery){

        try {
            const url = `${this.base_url}/weather?q=${searchQuery}&units=metric&appid=${this.api_key}`

            const response = await axios(url);

            return response;

        } catch (error) {
            return error;
        }
    }

    async getWeatherForecast(lat, lon, noOfForecasts = 40){

        try {
            const url = `${this.base_url}/forecast?lat=${lat}&lon=${lon}&cnt=${noOfForecasts}&appid=${this.api_key}`

            const response = await axios(url);

            return response;

        } catch (error) {
            return error;
        }

    }

    async getCurrentCityByCoords(lat, lon){

        const api_key = "AIzaSyDY_dhtMelGd0uQZhAHFyGz478P4LgBhpI";

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${api_key}`;

        const data = await axios(url);

        const city = data.data.results[0].address_components.find((component) =>
              component.types.includes("locality")
            ).long_name;
      
            return city;
    }
}

const weatherServiceInstance = new WeatherService();

export default weatherServiceInstance;