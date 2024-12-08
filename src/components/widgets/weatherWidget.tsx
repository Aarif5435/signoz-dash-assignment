import React, { useEffect, useState } from "react";
import {
  fetchWeatherAsync,
  updateWidget,
} from "../../redux/widgetSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { IoSearchSharp } from "react-icons/io5";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { CiTempHigh } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";
import { WiStrongWind } from "react-icons/wi";
import { CiCloud } from "react-icons/ci";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../utils/loadingSpinner";
import { WidgetMenuBar } from "./widgetMenuBar";

export const WeatherWidget = ({ props }) => {
  const { weather, weatherLoading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const dispatch = useDispatch<AppDispatch>();
  const [city, setCity] = useState(props.props.location);
  const [inpVal, setInpVal] = useState("");
  const [widgetMenu, setWidgetMenu] = useState(false);

  const widget = props.widget;
  const { id } = useParams();
  const widgetId = widget.id;

  if (!weather) return null;

  useEffect(() => {
    dispatch(fetchWeatherAsync({ city: city, widgetId: widgetId }));
  }, [dispatch, city, widgetId]);

  const widgetWeather = weather[widgetId];

  useEffect(() => {
    let updatedWidget = { ...widget, props: { location: city } };
    dispatch(
      updateWidget({
        dashboardId: id,
        widgetId: widget.id,
        updates: updatedWidget,
      })
    );
  }, [city]);

  if (!widgetWeather || weatherLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  const date = new Date(widgetWeather?.dt * 1000);
  const sunriseTime = new Date(widgetWeather?.sys?.sunrise * 1000);
  const sunsetTime = new Date(widgetWeather?.sys?.sunset * 1000);
  return (
    <>
      <div className="flex font-bold text-2xl justify-between">
        <h1>
          {widgetWeather?.name},{widgetWeather?.sys?.country}
        </h1>
        <span className="font-normal">{date.toLocaleDateString()}</span>
        <WidgetMenuBar
          isOpen={widgetMenu}
          setIsOpen={setWidgetMenu}
          id={id}
          widgetId={widgetId}
        />
      </div>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (inpVal.trim() !== "") setCity(inpVal);
          }
        }}
        className="w-full flex gap-4 justify-between mt-2"
      >
        <input
          onChange={(e) => setInpVal(e.target.value)}
          className="bg-[#0B0D0F] w-[95%] hover:border-[#394f9f] hover:border focus:border-[#4E74F8] focus:outline-none p-2 border border-[#121418] rounded"
          type="text"
          placeholder="Enter city"
        />
        <button
          onClick={() => {
            if (inpVal.trim() !== "") setCity(inpVal);
          }}
          className="p-3 bg-white text-black rounded"
        >
          <IoSearchSharp />
        </button>
      </div>
      <div className="flex justify-between p-4 border-b border-[#121418]">
        <TiWeatherWindyCloudy size={100} />
        <span className=" text-right">
          <h2 className="text-5xl">
            {Math.round(widgetWeather?.main?.temp)}°C
          </h2>
          <p className="text-xl capitalize">
            {widgetWeather?.weather[0]?.description}
          </p>
        </span>
      </div>
      <div className="p-4 border-b border-[#121418] grid grid-rows-2 grid-flow-col gap-4 justify-between px-10">
        <span className="flex items-center gap-2 text-lg">
          <CiTempHigh size={20} className="text-[#4E74F8]" />
          <p>Feels like: {widgetWeather?.main?.feels_like}°C</p>
        </span>
        <span className="flex items-center gap-2 text-lg">
          <WiHumidity size={20} className="text-[#4E74F8]" />
          <p>Humidity: {widgetWeather?.main?.humidity}%</p>
        </span>
        <span className="flex items-center gap-2 text-lg">
          <WiStrongWind size={20} className="text-[#4E74F8]" />
          <p>Wind speed: {widgetWeather?.wind?.speed} m/s</p>
        </span>
        <span className="flex items-center gap-2 text-lg">
          <CiCloud size={20} className="text-[#4E74F8]" />
          <p>Clouds: {widgetWeather?.clouds?.all}%</p>
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
