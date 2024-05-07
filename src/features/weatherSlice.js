import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../Pages/const";
import { fetchWeatherApi } from "openmeteo";

const apikey = 'c40e45af954c4f84a05c6e6c555986c1'
const url = "https://api.open-meteo.com/v1/forecast"

export const weatherSlice = createSlice({
    name : "weather",
    initialState : {
        data : [],
        weatherPoints : [],
        prediction: [],
        status : STATUS.LOADING,
        weatherStatus : STATUS.LOADING
    },
    reducers:{},
    extraReducers(builder){
        builder
        .addCase(fetchData.pending,(state)=>{
            state.status = STATUS.LOADING
        })
        .addCase(fetchData.rejected,(state)=>{
            state.status = STATUS.ERROR
        })
        .addCase(fetchData.fulfilled,(state,action)=>{
            state.status = STATUS.SUCCESS
            state.data = action.payload
        })
        .addCase(fetchWeather.pending,(state)=>{
            state.weatherStatus = STATUS.LOADING
        })
        .addCase(fetchWeather.rejected,(state)=>{
            state.weatherStatus = STATUS.ERROR
        })
        .addCase(fetchWeather.fulfilled,(state,action)=>{
            state.weatherPoints = action.payload.weatherData
            state.prediction = action.payload.prediction
            state.weatherStatus = STATUS.SUCCESS
        })
    }
})

export default weatherSlice.reducer
export const apiStatus = (state) => state.weather.status
export const locationData = (state) => state.weather.data
export const weatherData = (state) =>state.weather.weatherPoints
export const prediction  = (state) => state.weather.prediction
export const weatherStatus = (state) => state.weather.weatherStatus

export const fetchData = createAsyncThunk('fetch/data', async(ReqParam)=>{
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(ReqParam)}&format=json&apiKey=${apikey}`,{
        method :"GET",
    })
    if(!response.ok){
        throw new Error ("Failed")
    }
    const body = await response.json()
    const data = {
        lat : body.results[0].lat,
        lon : body.results[0].lon
    }
    return data
})

export const fetchWeather = createAsyncThunk('fetch/weatherData', async(Params)=>{
    const responses = await fetchWeatherApi(url,Params);
    const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    const response =  responses[0]
    const utcOffsetSeconds = response?.utcOffsetSeconds();
    const timezone = response?.timezone();
    const timezoneAbbreviation = response?.timezoneAbbreviation();
    const latitude = response?.latitude();
    const longitude = response?.longitude();
    
    const current = response?.current();
    const daily = response?.daily();

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
})


