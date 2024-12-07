import React from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegCalendarCheck } from "react-icons/fa";
import { PiNewspaperClippingBold } from "react-icons/pi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { AiOutlineStock } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addWidget, Widget } from "../redux/widgetSlice";
import { v4 as uuid4 } from "uuid";
import { useParams } from "react-router-dom";

interface WidgerModal {
  setIsModal: (val: boolean) => void;
}

export const WidgetModal = ({ setIsModal }: WidgerModal) => {

  const dispatch = useDispatch<AppDispatch>();
  const {id} = useParams()

  const widgets = useSelector((state:RootState)=> state.dashboard?.dashboard?.find((dash)=> dash.id === id)?.widgets)
  console.log('widget=-------',widgets)
  const handleAddWidget = (type, props) => {
    const newWidgetBase = {
      id: uuid4(),
      type,
      props,
      position: { x: 0, y: 0 }, 
      size: { width: 1500, height: 400 },
    };
  
    const existingWidgets = widgets; 
  
    const isColliding = (widgetA, widgetB) => {
      return (
        widgetA.position.x < widgetB.position.x + widgetB.size.width &&
        widgetA.position.x + widgetA.size.width > widgetB.position.x &&
        widgetA.position.y < widgetB.position.y + widgetB.size.height &&
        widgetA.position.y + widgetA.size.height > widgetB.position.y
      );
    };
  
    let adjustedPosition = newWidgetBase.position;
    const offset = 210;
  
    while (
      existingWidgets?.some((existingWidget) =>
        isColliding(
          { ...newWidgetBase, position: adjustedPosition },
          existingWidget
        )
      )
    ) {
      adjustedPosition = {
        x: adjustedPosition.x,
        y: adjustedPosition.y + offset,
      };
    }
  
    const newWidget = { ...newWidgetBase, position: adjustedPosition };
  
    dispatch(addWidget({ dashboardId: id, widget: newWidget }));
    setIsModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-opacity-50">
        <div className="min-w-96 max-w-fit border-4 bg-[#121418] rounded border-[#121418]">
          <div className="flex p-3 border-[#161922] text-white justify-between border-b items-center">
            <label>New Panel</label>
            <RxCross2
              onClick={() => setIsModal(false)}
              size={20}
              className="text-[#6E6F71] cursor-pointer"
            />
          </div>
          <div className="p-3 grid grid-cols-2 grid-flow-row gap-4">
            <button onClick={()=>{
              handleAddWidget('NEWS',{})
            }} className="border-[#1D212D] cursor-pointer text-white p-4 border rounded flex flex-col justify-center items-center">
              <PiNewspaperClippingBold className="text-[#7190F9]" />
              <label className="text-sm font-medium mt-1">News</label>
            </button>
            <button onClick={()=>{
              handleAddWidget('CALENDAR',{})
            }} className="border-[#1D212D] cursor-pointer text-white p-4 border rounded flex flex-col justify-center items-center">
              <FaRegCalendarCheck className="text-[#7190F9]" />
              <label className="text-sm font-medium mt-1">Calendar</label>
            </button>
            <button onClick={()=>{
              handleAddWidget('WEATHER',{location: 'Delhi'})
            }} className="border-[#1D212D] cursor-pointer text-white p-4 border rounded flex flex-col justify-center items-center">
              <TiWeatherPartlySunny className="text-[#7190F9]" />
              <label className="text-sm font-medium mt-1">Weather</label>
            </button>
            <button onClick={()=>{
              handleAddWidget('STOCK',{symbol: 'APPL'})
            }} className="border-[#1D212D] cursor-pointer text-white p-4 border rounded flex flex-col justify-center items-center">
              <AiOutlineStock className="text-[#7190F9]" />
              <label className="text-sm font-medium mt-1">Stock</label>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
