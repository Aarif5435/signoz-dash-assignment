import React, { useEffect, useMemo, useState } from "react";
import { WeatherWidget } from "./weatherWidget";
import { NewsWidget } from "./newsWidget";
import { CalendarWidget } from "./calendarWidget";
import { StockWidget } from "./stockWidget";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  updateWidgetPosition,
  updateWidgetSize,
} from "../../redux/widgetSlice";
import { Rnd } from "react-rnd";

export const Widget = ({ widget, widgets }) => {
  const { type, id, props, size } = widget;
  const dispatch = useDispatch<AppDispatch>();

  const [wsize, setWSize] = useState({
    width: widget.size.width,
    height: widget.size.height,
  });

 const WidgetComponents = useMemo(
  () => ({
    WEATHER: WeatherWidget,
    NEWS: NewsWidget,
    CALENDAR: CalendarWidget,
    STOCK: StockWidget,
  }),
  []
);

  const Component = WidgetComponents[type];

  if (!Component) return;

  const isColliding = (widgetA, widgetB) => {
    return (
      widgetA.position.x < widgetB.position.x + widgetB.size.width &&
      widgetA.position.x + widgetA.size.width > widgetB.position.x &&
      widgetA.position.y < widgetB.position.y + widgetB.size.height &&
      widgetA.position.y + widgetA.size.height > widgetB.position.y
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      let newWidth;
      let y;
      if (screenWidth > 900) {
        newWidth = widget.size.width; 
      } else if (screenWidth > 768) {
        newWidth = 600; 
        y = 0;
      } else {
        newWidth = 300; 
      }

      setWSize((prev) => ({
        ...prev,
        width: newWidth,
      }));
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Rnd
      key={widget.id}
      size={wsize}
      position={{
        x: widget?.position?.x,
        y: widget?.position?.y,
      }}
      onDragStop={(e, data) => {
        const currentWidget = {
          id: widget.id,
          position: { x: data.x, y: data.y },
          size: widget.size,
        };

        const isOverlap = widgets.some(
          (w) => w.id !== widget.id && isColliding(currentWidget, w)
        );
        if (!isOverlap) {
          dispatch(
            updateWidgetPosition({
              id: widget.id,
              position: { x: data.x, y: data.y },
            })
          );
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newSize = {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        };

        const currentWidget = {
          id: widget.id,
          position: { x: position.x, y: position.y },
          size: newSize,
        };

        const isOverlap = widgets.some(
          (w) => w.id !== widget.id && isColliding(currentWidget, w)
        );

        if (!isOverlap) {
          setWSize({
            width: ref.offsetWidth,
                height: ref.offsetHeight,
          })
          dispatch(
            updateWidgetSize({
              id: widget.id,
              size: newSize,
              position: {
                x: position.x,
                y: position.y,
              },
            })
          );
        } else {
          console.warn("Resize prevented due to collision");
        }
      }}
      bounds="parent"
      className="w-fit mt-5 min-w-[500px] h-96 min-h-96 p-4 hover:border-[#292f3f] fixed text-white rounded border-2 border-[#161922] scrollbar-hide"
      >
      <Component props={{ props, id, widget }} />
    </Rnd>
  );
};
