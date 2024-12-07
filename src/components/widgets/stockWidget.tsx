import TradingViewWidget from "react-tradingview-widget";
import {
  fetchStockAsync,
  removeWidget,
  updateWidget,
} from "../../redux/widgetSlice";
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
import { WidgetMenuBar } from "./widgetMenuBar";

export const StockWidget = ({ props }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { stocks, stockLoading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const widget = props.widget;
  const { id } = useParams();
  const widgetId = widget.id;
  const [symbol, setSymbol] = useState(props.props.category ?? "AAPL");
  const [values, setValues] = useState("");
  const [widgetMenu, setWidgetMenu] = useState(false);

  useEffect(() => {
    dispatch(fetchStockAsync({ symbol, widgetId }));
  }, [dispatch, symbol, widgetId]);

  useEffect(() => {
    const updatedWidget = { ...widget, props: { category: symbol } };
    dispatch(
      updateWidget({ dashboardId: id, widgetId, updates: updatedWidget })
    );
  }, [symbol, widgetId]);

  const stackData = stocks[widgetId];

  // const { t, c } = stackData;

  const chartData = stackData
    ? [
        { name: "Open", price: stackData?.o },
        { name: "Low", price: stackData?.l },
        { name: "Current", price: stackData?.c },
        { name: "High", price: stackData?.h },
      ]
    : [];

  return (
    <>
      <div className="h-fit p-2">
        <h2 className="text-xl text-white font-bold mb-4 flex justify-between">
          {symbol} Stock Prices
          <WidgetMenuBar
            isOpen={widgetMenu}
            setIsOpen={setWidgetMenu}
            id={id}
            widgetId={widgetId}
          />
        </h2>
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (values.trim() !== "") {
                setSymbol(values);
              }
            }
          }}
          className="w-full flex gap-4 justify-between mt-2"
        >
          <input
            className="bg-[#0B0D0F] text-white w-[95%] hover:border-[#394f9f] hover:border focus:border-[#4E74F8] focus:outline-none p-2 border border-[#535c6f] rounded"
            type="text"
            value={values}
            onChange={(e) => setValues(e.target.value)}
            placeholder="Enter symbol"
          />
          <button
            onKeyUp={(e) => console.log("keyup", e)}
            onClick={() => {
              if (values.trim() !== "") {
                setSymbol(values);
              }
            }}
            className="p-3 bg-white text-black rounded"
          >
            <IoSearchSharp />
          </button>
        </div>
      </div>

      <div className="mt-auto flex justify-between px-4">
        <ResponsiveContainer width="100%" height={300}>
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
        <div className="mt-5 text-center grid grid-cols-2 grid-flow-row gap-2 text-gray-400 text-sm py-2">
          <span>
            <label className="">Current Price </label>
            <h2 className="text-lg text-white">${stackData?.c?.toFixed(2)}</h2>
          </span>
          <span>
            <label className="">Change</label>
            <h2
              className={`text-lg text-green-500 ${
                stackData?.d >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stackData?.d >= 0 ? "+" : "-"}${stackData?.d?.toFixed(2)} (
              {stackData?.dp?.toFixed(2)}%)
            </h2>
          </span>
          <span>
            <label className="">Open</label>
            <h2 className="text-lg text-white">${stackData?.o?.toFixed(2)}</h2>
          </span>
          <span>
            <label className="">Previous Close</label>
            <h2 className="text-lg text-white">
              $${stackData?.pc?.toFixed(2)}
            </h2>
          </span>
          <span>
            <label className="">Hight</label>
            <h2 className="text-lg text-white">${stackData?.h?.toFixed(2)}</h2>
          </span>
          <span>
            <label className="">Low</label>
            <h2 className="text-lg text-white">${stackData?.l?.toFixed(2)}</h2>
          </span>
        </div>
      </div>
    </>
  );
};
