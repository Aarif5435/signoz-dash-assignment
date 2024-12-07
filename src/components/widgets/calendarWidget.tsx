import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MdDelete } from "react-icons/md";
import { removeWidget } from "../../redux/widgetSlice";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

const localizer = momentLocalizer(moment);

export const CalendarWidget = (props) => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const { id } = useParams();
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
            new Date(2024, 11, 4),
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
      <button
        onClick={() =>
          dispatch(removeWidget({ dashboardId: id, widgetId: props.props.id }))
        }
        className=" flex absolute top-3 right-0 mr-1 cursor-pointer text-red-500"
      >
        <MdDelete size={30} />
      </button>

      {/* </div> */}
    </>
  );
};


const CustomToolbar = ({ localizer: { messages }, label, onNavigate }) => {
  const dispatch = useDispatch();

  const navigate = (action) => {
      onNavigate(action);
  };

  const onClickAllEvents = () => {
      // dispatch(fetchEvents());
  };

  const onClickPastEvents = () => {
      // dispatch(pastEvents());
  };

  const onClickUpcomingEvents = () => {
      // dispatch(upcomingEvents());
  };

  return (
      <div className="rbc-toolbar">
          <span className="rbc-btn-group">
              <button
                  type="button"
                  className="btn btn-control"
                  onClick={() => navigate('PREV')}
              >
                  <i className="fa fa-arrow-left"></i> Prev
              </button>
          </span>
          <span className="rbc-btn-group">
              <button
                  type="button"
                  className="btn btn-control"
                  onClick={() => navigate('NEXT')}
              >
                  Next <i className="fa fa-arrow-right"></i>
              </button>
          </span>
          <span className="rbc-toolbar-label">{label}</span>
          <span className="rbc-btn-group">
              <button
                  type="button"
                  className="btn btn-control"
                  onClick={onClickAllEvents}
              >
                  All
              </button>
          </span>
          <span className="rbc-btn-group">
              <button
                  type="button"
                  className="btn btn-past"
                  onClick={onClickPastEvents}
              >
                  Past
              </button>
          </span>
          <span className="rbc-btn-group">
              <button
                  type="button"
                  className="btn btn-upcoming"
                  onClick={onClickUpcomingEvents}
              >
                  Upcoming
              </button>
          </span>
      </div>
  );
};