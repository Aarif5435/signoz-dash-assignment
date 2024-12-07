import TradingViewWidget from "react-tradingview-widget";
import { fetchStockAsync, removeWidget } from "../../redux/widgetSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { IoSearchSharp } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";

export const StockWidget = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { stocks, stockLoading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const [symbol, setSymbol] = useState("AAPL");
  const [values, setValues] = useState("");
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchStockAsync({ symbol }));
  }, [dispatch, symbol]);

  const { t, c } = stocks;

  const chartData = stocks
    ? [
        { name: "Open", price: stocks?.o },
        { name: "Low", price: stocks?.l },
        { name: "Current", price: stocks?.c },
        { name: "High", price: stocks?.h },
      ]
    : [];

  return (
    <>
      {/* <div className="w-fit min-w-96 h-96 min-h-80 p-4 border rounded border-[#161922] hover:resize overflow-auto scrollbar-hide"> */}
      <h2 className="text-xl text-white font-bold mb-4 flex justify-between">
        {symbol} Stock Prices
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
      </h2>
      <div className="w-full flex gap-4 justify-between mt-2">
        <input
          className="bg-[#0B0D0F] text-white w-[95%] hover:border-[#394f9f] hover:border focus:border-[#4E74F8] focus:outline-none p-2 border border-[#535c6f] rounded"
          type="text"
          value={values}
          onChange={(e) => setValues(e.target.value)}
          placeholder="Enter symbol"
        />
        <button
          onKeyUp={(e) => console.log("keyup", e)}
          onClick={() => setSymbol(values)}
          className="p-3 bg-white text-black rounded"
        >
          <IoSearchSharp />
        </button>
      </div>
      <div className="mt-5 text-center grid grid-cols-2 grid-flow-row gap-8 text-gray-400 text-sm border-b border-[#1c1f25] py-4">
        <span>
          <label className="">Current Price</label>
          <h2 className="text-3xl text-white">${stocks?.c?.toFixed(2)}</h2>
        </span>
        <span>
          <label className="">Change</label>
          <h2
            className={`text-3xl text-green-500 ${
              stocks?.d >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {stocks?.d >= 0 ? "+" : "-"}${stocks?.d?.toFixed(2)} (
            {stocks?.dp?.toFixed(2)}%)
          </h2>
        </span>
        <span>
          <label className="">Open</label>
          <h2 className="text-lg text-white">${stocks?.o?.toFixed(2)}</h2>
        </span>
        <span>
          <label className="">Previous Close</label>
          <h2 className="text-lg text-white">$${stocks?.pc?.toFixed(2)}</h2>
        </span>
        <span>
          <label className="">Hight</label>
          <h2 className="text-lg text-white">${stocks?.h?.toFixed(2)}</h2>
        </span>
        <span>
          <label className="">Low</label>
          <h2 className="text-lg text-white">${stocks?.l?.toFixed(2)}</h2>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4CAF50"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* </div> */}
    </>
  );
};
