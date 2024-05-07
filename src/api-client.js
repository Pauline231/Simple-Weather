/*export var requestOptions = {
    method: 'GET',
  };
  
  fetch("https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey=c40e45af954c4f84a05c6e6c555986c1", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));*/

//This was used before but not in the latest commit
  
const apikey = 'c40e45af954c4f84a05c6e6c555986c1'
const url = "https://api.open-meteo.com/v1/forecast"
import {fetchWeatherApi} from 'openmeteo'


export const requestOptions = async(ReqParam)=>{
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(ReqParam)}&format=json&apiKey=${apikey}`,{
        method :"GET",
    })
    if(!response.ok){
        throw new Error ("Faiiled")
    }
    const body = await response.json()
    return await body.results[0]
}

export const weatherForcast = async(Params)=>{
    try {
       const responses = await fetchWeatherApi(url,Params);
        //const responses  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${Params.latitude}&longitude=${Params.longitude}&current=relative_humidity_2m,apparent_temperature,rain,cloud_cover,wind_gusts_10m&daily=temperature_2m_max&wind_speed_unit=mph&timezone=auto&forecast_days=3`,{method : "GET",})
        // Helper function to form time ranges

        const range = (start, stop, step) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    
    // Process first location. Add a for-loop for multiple locations or weather models
        
        const response =  responses[0]
    
    // Attributes for timezone and location
    const utcOffsetSeconds = response?.utcOffsetSeconds();
    const timezone = response?.timezone();
    const timezoneAbbreviation = response?.timezoneAbbreviation();
    const latitude = response?.latitude();
    const longitude = response?.longitude();
    
    const current = response?.current();
    const daily = response?.daily();
    
    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        current: {
            time: new Date((Number(current?.time()) + utcOffsetSeconds) * 1000),
            relativeHumidity2m: current?.variables(0).value(),
            apparentTemperature: current?.variables(1).value(),
            rain: current?.variables(2).value(),
            isDay: current?.variables(2).value(),
            windGusts10m: current?.variables(3).value(),
            cloudCover: current?.variables(3).value(),
        },
        daily: {
            time: range(Number(daily?.time()), Number(daily?.timeEnd()), daily?.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            weatherCode: daily?.variables(0).valuesArray(),
        },
    }
    let prediction = {}
    for (let i = 0; i < weatherData?.daily.time.length; i++) {
        prediction[weatherData?.daily.time[i].toDateString()] = weatherData.daily.weatherCode[i]
    }
    //console.log(prediction)
    return {weatherData, prediction}
    }
         catch (error) {
            console.log(error)
    }
}

