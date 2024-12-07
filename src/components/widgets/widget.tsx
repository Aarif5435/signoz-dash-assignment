import React from "react";
import { WeatherWidget } from "./weatherWidget";
import { NewsWidget } from "./newsWidget";
import { CalendarWidget } from "./calendarWidget";
import { StockWidget } from "./stockWidget";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  updateWidget,
  updateWidgetPosition,
  updateWidgetSize,
} from "../../redux/widgetSlice";
import { Rnd } from "react-rnd";

export const Widget = ({ widget, widgets }) => {
  const { type, id, props, size } = widget;
  const dispatch = useDispatch<AppDispatch>();
  const WidgetComponents = {
    WEATHER: WeatherWidget,
    NEWS: NewsWidget,
    CALENDAR: CalendarWidget,
    STOCK: StockWidget,
  };

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

  return (
    <Rnd
      size={{
        width: widget.size.width,
        height: widget.size.height,
      }}
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
        const currentWidget = {
          id: widget.id,
          position: { x: position.x, y: position.y },
          size: {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          },
        };

        const isOverlap = widgets.some(
          (w) => w.id !== widget.id && isColliding(currentWidget, w)
        );

        if (!isOverlap) {
          dispatch(
            updateWidgetSize({
              id: widget.id,
              size: {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              },
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
      className="w-fit mt-5 min-w-96 h-96 min-h-80 p-4 fixed text-white rounded border-2 border-[#161922] overflow-auto scrollbar-hide"
    >
      <Component props={{ props, id, widget }} />
    </Rnd>
  );
};
