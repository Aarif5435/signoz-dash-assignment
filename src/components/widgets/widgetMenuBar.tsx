import { BsThreeDotsVertical } from "react-icons/bs";
import { removeWidget } from "../../redux/widgetSlice";
import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

interface WidgetMenu {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  id: string | undefined;
  widgetId: string;
  className?: string
}

export const WidgetMenuBar = ({
  isOpen,
  setIsOpen,
  id,
  widgetId,
  className,
}: WidgetMenu) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className={` ${className ? className :  'flex top-2 right-0 cursor-pointer ml-2 relative'}`}>
        <BsThreeDotsVertical size={20} onClick={() => setIsOpen(!isOpen)} />
        {isOpen && (
          <div
            onClick={() => {
              dispatch(
                removeWidget({
                  dashboardId: id,
                  widgetId,
                })
              );
              setIsOpen(false);
            }}
            className="absolute w-36 h-10 flex gap-2 cursor-pointer font-normal text-sm right-2 z-10 rounded bg-[#14161d] top-6 border border-[#1f2330] p-2"
          >
            <MdDelete className="text-red-500" size={20} /> <p>Delete widget</p>
          </div>
        )}
      </div>
    </>
  );
};
