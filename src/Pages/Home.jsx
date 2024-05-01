import React, { useCallback, useEffect, useState } from 'react'
import { requestOptions, weatherForcast } from '../api-client'
import { imgSrcs } from './const'


const Home = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [location, setLocation] = useState('Kathmandu,Nepal')
    const [presentLocation, setPresentLocation] = useState(location)
    const [lat, setLat] = useState('27.708317')
    const [long, setLong] = useState('85.3205817')
    const [temp, setTemp]= useState('')
    const [rain, setRain] = useState('')
    const [humid, setHumid] = useState('')
    const [wind, setWind] = useState('')
    const [cloud, setCloud] = useState('')
    const [src, setSrc] = useState()
    const [condition, setCondition] = useState('')
    const [prediction, setPrediction] = useState()
    const [entries, setEntries] = useState()

    /*const [weather, setWeather] = useState({
        apparentTemperature : '',
        rain : '',
        relativeHumidity2m: '',
        time : '',
        windGusts10m : ''
    })*/

    const fetchData =async()=>{
        const data = await requestOptions(location)
        setLat(data.lat)
        setLong(data.lon)
    }

    const Params = {
        "latitude": lat,
        "longitude": long,
        "current": ["relative_humidity_2m", "apparent_temperature", "rain", "wind_gusts_10m"],
        "daily" : 'weather_code',
        "wind_speed_unit": "mph",
        "timezone": "auto",
        "forecast_days": 4
    }


   const fetchWeather =async()=>{
        const {weatherData: weather, prediction} = await weatherForcast(Params)     
        setRain(await weather.current.rain)
        setTemp(await weather.current.apparentTemperature)
        setWind(await weather.current.windGusts10m)
        setHumid(await weather.current.relativeHumidity2m)
        setCloud(await weather.current.cloudCover)   
        setPrediction(await prediction)
        setEntries(Object.entries(prediction))
    }
   // console.log(weather)
    
   

    const handleKeyDown = (event) =>{
        if(event.key === 'Enter'){
            setPresentLocation(location)
        }
    }
    
    useEffect(()=>{
        fetchData()
        image()
        fetchWeather()
    },[])
    useEffect(()=>{
        fetchData()
        image()
        fetchWeather()
    },[presentLocation])
    
   
    
    if(isLoading){
        return(
            <div>Loading</div>
        )
    }
    
    
    /*useEffect(()=>{
        fetchData()
        fetchWeather()
        image()
    },[presentLocation]);*/

    
   
   function image(cloud, rain){
    if(cloud > '15'|| rain<'20'||temp<0){
        setSrc(imgSrcs.cloudysrc)
        setCondition('cloudy')

    }else if(rain > '20'){
        setSrc(imgSrcs.rainysrc)
        setCondition('raining')
    }else {
        setSrc(imgSrcs.sunnysrc)
        setCondition('clear')
    }
   }
  

  return (
    <section className='lg:container place-content-center sm:h-screen'>
        <div className='text-2xl  md:text-4xl text-blue-500 rounded-xl shadow-md font-montserrat flex flex-col gap-10 justify-between md:py-20 px-10 items-center'>
            <h1 className='text-black'>Right now in  
                 <input type='text' size={20}
                 className=' border-none  text-center text-black text-2xl md:text-4xl font-bold focus:outline-none '
                 value={location} id='place' onChange={(e)=>setLocation(e.target.value)} onKeyDown={handleKeyDown} />,
                 it's {condition}. </h1>
            <div className='flex flex-col md:flex-row gap-10 m-10 justify-evenly items-center  w-full'>
            <img width="100" height="100" src={src} alt="partly-cloudy-day--v1"/>
                <span className='text-8xl text-blue-500 font-bold' >{Math.round(temp)}°C</span>
                <div className='flex flex-col text-4xl gap-10'>
                <div className='flex flex-row gap-3 items-center'><img width="50" height="50" src={imgSrcs.windsrc} alt="wind"/>{Math.round(wind)}</div>
                <div className='flex flex-row gap-3 items-center'> <img width="50" height="50" src={imgSrcs.watersrc} alt="humid"/>{Math.round(humid)}</div>
                <div className='flex flex-row gap-3 items-center'><img width="50" height="50" src={imgSrcs.umbresrc} alt="rain"/>{Math.round(rain)}</div>
                </div>
            </div>
            <div className='flex flex-wrap flex-row gap-10 justify-center items-center  font-palanquin'>
                {prediction&&entries?.map(([key, value])=>(
                    <div className='flex p-5 bg-blue-200 text-black text-2xl rounded-xl flex-col items-center justify-center'>
                        <span>{key}</span>
                        <span>{value}</span>
                     </div>   
                ))}

            </div>

        </div>
    </section>
    
  )
}

export default Home