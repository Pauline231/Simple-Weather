import React, { useCallback, useEffect, useState } from 'react'
import { imgSrcs } from './const'
import { useDispatch, useSelector } from 'react-redux'
import { apiStatus, fetchWeather, locationData, prediction, weatherData, weatherStatus } from '../features/weatherSlice'
import { fetchData } from '../features/weatherSlice'


const Home = () => {
    const dispatch = useDispatch()
    const locData = useSelector(locationData)
    const wStatus = useSelector(weatherStatus)
    const status = useSelector(apiStatus)
    const wData = useSelector(weatherData)
    const pData = useSelector(prediction)
    const [location, setLocation] = useState('Kathmandu,Nepal')
    const [presentLocation, setPresentLocation] = useState(location)
    const [src, setSrc] = useState()
    const [condition, setCondition] = useState('')
    //const [prediction, setPrediction] = useState()
    

    const Params = {
        "latitude": locData.lat,
        "longitude": locData.lon,
        "current": ["relative_humidity_2m", "apparent_temperature", "rain", "is_day", "wind_gusts_10m","cloud_cover"],
        "daily" : 'weather_code',
        "wind_speed_unit": "mph",
        "timezone": "auto",
        "forecast_days": 4
    }
   
    const handleKeyDown = (event) =>{
        if(event.key === 'Enter'){ 
            setPresentLocation(location)
        }
    }
    
    useEffect(()=>{
        dispatch(fetchData(presentLocation))
    },[])

    useEffect(()=>{
        dispatch(fetchData(presentLocation))
    },[presentLocation])

    useEffect(()=>{
        dispatch(fetchWeather(Params))
    },[status])

    useEffect(()=>{
        if(wStatus ==='success'){
        image()
        }
    },[wStatus])
  
   function image(){
    if(wData.current.cloudCover>'0'||wData.current.apparentTemperature<0){
        setSrc(imgSrcs.cloudysrc)
        setCondition('cloudy')
    }else if(wData.current.rain > '1'  && wData.current.cloudCover>='1'){
        setSrc(imgSrcs.rainysrc)
        setCondition('raining')
    }else {
        if(wData.current.isDay=='0'){
            setSrc(imgSrcs.nightsrc)
            setCondition('a clear night')
        }else{
            setSrc(imgSrcs.sunnysrc)
            setCondition('a clear day')
        }
    }
   }
  //console.log(cloud)
  if(wStatus!=='success' || status!=='success'){
    return (
        <>Loading</>
    )
  }
  else {
  return (
    <section className='lg:container place-content-center sm:h-screen'>
        <nav className='font-serif m-6 text-xl md:text-2xl text-pink-500 lg:text-4xl'>Weather Today!</nav>
        <div className='text-2xl bg-white md:text-4xl text-pink-500 rounded-xl font-serif flex flex-col gap-10 justify-between md:py-20 px-10 items-center'>
            <h1 className='font-serif text-black'>Right now in  
                 <input type='text' size={20}
                 className=' border-none  text-center text-black text-2xl md:text-4xl font-bold focus:outline-none '
                 value={location} id='place' onChange={(e)=>setLocation(e.target.value)} onKeyDown={handleKeyDown} />,
                 it's {condition}. </h1>
            <div className='flex flex-col md:flex-row gap-10 m-10 justify-evenly items-center  w-full'>
            <img width="100" height="100" src={src} alt="partly-cloudy-day--v1"/>
                <span className='text-8xl text-pink-500 font-bold' >{Math.round(wData.current.apparentTemperature)}°C</span>
                <div className='flex flex-col text-4xl gap-10'>
                <div className='flex flex-row gap-3 items-center'><img width="50" height="50" src={imgSrcs.windsrc} alt="wind"/>{Math.round(wData.current.windGusts10m)} mph</div>
                <div className='flex flex-row gap-3 items-center'> <img width="50" height="50" src={imgSrcs.watersrc} alt="humid"/>{Math.round(wData.current.relativeHumidity2m)}</div>
                <div className='flex flex-row gap-3 items-center'><img width="50" height="50" src={imgSrcs.umbresrc} alt="rain"/>{Math.round(wData.current.rain)}</div>
                </div>
            </div>
            <div className='flex flex-wrap flex-row gap-10 justify-center items-center  font-palanquin'>
                {Object.entries(pData).map(([key, value])=>(
                    <div className='flex p-5 bg-pink-500 shadow-md text-white text-2xl rounded-xl flex-col items-center justify-center'>
                        <span>{key}</span>
                        <span className='font-palanquin'>Wc : {value}</span>
                     </div>   
                ))}
            </div>
        </div>
        <footer className='mt-10'>
             I have used Redux Toolkit in the final commit/latest version. You can change the location name and hit "enter" to load the weather condition.
            The WC stands for "Weather-Code" which is fetched from the Open-meteo.
        </footer>
    </section>
    
  )
}
}

export default Home