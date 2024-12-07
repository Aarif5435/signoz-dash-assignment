import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MdDelete } from "react-icons/md";
import { removeWidget } from "../../redux/widgetSlice";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { BsThreeDotsVertical } from "react-icons/bs";

const localizer = momentLocalizer(moment);

export const CalendarWidget = (props) => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const { id } = useParams();
  const [widgetMenu, setWidgetMenu] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("Enter event title:");
    if (title) {
      setEvents([...events, { title, start, end }]);
    }
  };

  const handleSelectEvent = (event) => {
    const confirmDelete = window.confirm(
      `Do you want to delete the event: "${event.title}"?`
    );
    if (confirmDelete) {
      setEvents(events.filter((e) => e !== event));
    }
  };
  return (
    <>
      {/* <div className="h-full w-fit flex"> */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{}}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        // components={{ toolbar: CustomToolbar }}
        className=" text-white mr-5"
        dayPropGetter={(date) => {
          const isSpecialDate = moment(date).isSame(
            new Date().toISOString(),
            "day"
          );
          return {
            style: {
              backgroundColor: isSpecialDate ? "#4E74F8" : undefined,
              color: isSpecialDate ? "#ffffff" : undefined,
            },
          };
        }}
      />
      <div className="cursor-pointer flex absolute top-3 right-0 mr-1">
        <BsThreeDotsVertical
          size={20}
          onClick={() => setWidgetMenu(!widgetMenu)}
        />
        {widgetMenu && (
          <div
            onClick={() => {
              dispatch(
                removeWidget({
                  dashboardId: id,
                  widgetId: props.props.id,
                })
              );
              setWidgetMenu(false);
            }}
            className="absolute w-36 h-10 flex gap-2 cursor-pointer font-normal text-sm right-2 z-10 rounded bg-[#14161d] top-6 border border-[#1f2330] p-2"
          >
            <MdDelete className="text-red-500" size={20} /> <p>Delete widget</p>
          </div>
        )}
      </div>

      {/* </div> */}
    </>
  );
};
