import React, { useEffect } from "react";
import { fetchNewsAsync, fetchWeatherAsync, removeWidget } from "../../redux/widgetSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { WeatherData } from "./widget.modal";
import { IoSearchSharp } from "react-icons/io5";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { CiTempHigh } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";
import { WiStrongWind } from "react-icons/wi";
import { CiCloud } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useParams } from "react-router-dom";

const weather: WeatherData = {
  coord: { lon: 77.2167, lat: 28.6667 },
  weather: [{ id: 721, main: "Haze", description: "haze", icon: "50d" }],
  main: {
    temp: 19.05,
    feels_like: 18.45,
    temp_min: 19.05,
    temp_max: 19.05,
    pressure: 1016,
    humidity: 55,
    sea_level: 1016,
    grnd_level: 991,
  },
  visibility: 2200,
  wind: { speed: 3.09, deg: 260 },
  clouds: { all: 2 },
  dt: 1733288448,
  sys: {
    type: 1,
    id: 9165,
    country: "IN",
    sunrise: 1733275747,
    sunset: 1733313241,
  },
  timezone: 19800,
  id: 1273294,
  name: "Delhi",
  cod: 200,
};

export const WeatherWidget = (props) => {
  // const { weather, weatherLoading } = useSelector(
  //   (state: RootState) => state.dashboard
  // );
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(fetchWeatherAsync({ city: "Delhi" }));
  // }, [dispatch]);

  const {id} = useParams()
  if (!weather) return null;

  const date = new Date(weather?.dt * 1000);
  const sunriseTime = new Date(weather?.sys?.sunrise * 1000);
  const sunsetTime = new Date(weather?.sys?.sunset * 1000);
  console.log("weather------", weather);
  return (
    <>
      {/* <div className="w-fit min-w-96 h-96 min-h-80 text-white p-4 border rounded border-[#161922] hover:resize overflow-auto scrollbar-hide"> */}
        <div className="flex font-bold text-2xl justify-between">
          <h1>
            {weather?.name},{weather?.sys?.country}
          </h1>
          <span className="font-normal">{date.toLocaleDateString()}</span>
          <button
                onClick={() =>
                  dispatch(
                    removeWidget({ dashboardId: id, widgetId: props.props.id })
                  )
                }
                className="flex top-2 right-0 cursor-pointer ml-2 text-red-500"
              >
                <MdDelete size={30} />
              </button>
        </div>
        <div className="w-full flex gap-4 justify-between mt-2">
          <input
            className="bg-[#0B0D0F] w-[95%] hover:border-[#394f9f] hover:border focus:border-[#4E74F8] focus:outline-none p-2 border border-[#121418] rounded"
            type="text"
            placeholder="Enter city"
          />
          <button className="p-3 bg-white text-black rounded">
            <IoSearchSharp />
          </button>
        </div>
        <div className="flex justify-between p-4 border-b border-[#121418]">
          <TiWeatherWindyCloudy size={100} />
          <span className=" text-right">
            <h2 className="text-5xl">{Math.round(weather?.main?.temp)}°C</h2>
            <p className="text-xl capitalize">
              {weather?.weather[0]?.description}
            </p>
          </span>
        </div>
        <div className="p-4 border-b border-[#121418] grid grid-rows-2 grid-flow-col gap-4 justify-between px-10">
          <span className="flex items-center gap-2 text-lg">
            <CiTempHigh size={20} className="text-[#4E74F8]" />
            <p>Feels like: {weather?.main?.feels_like}°C</p>
          </span>
          <span className="flex items-center gap-2 text-lg">
            <WiHumidity size={20} className="text-[#4E74F8]" />
            <p>Feels like: {weather?.main?.humidity}%</p>
          </span>
          <span className="flex items-center gap-2 text-lg">
            <WiStrongWind size={20} className="text-[#4E74F8]" />
            <p>Feels like: {weather?.wind?.speed} m/s</p>
          </span>
          <span className="flex items-center gap-2 text-lg">
            <CiCloud size={20} className="text-[#4E74F8]" />
            <p>Feels like: {weather?.clouds?.all}%</p>
          </span>
        </div>
        <div className="flex justify-between p-4 px-10">
        <span>Sunrise: {sunriseTime.toLocaleTimeString()}</span>
        <span>Sunset: {sunsetTime.toLocaleTimeString()}</span>
        </div>
      {/* </div> */}
    </>
  );
};
