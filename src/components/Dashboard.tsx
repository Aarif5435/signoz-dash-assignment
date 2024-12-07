import React, { useState } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { WidgetModal } from "./widgetModal";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { Widget } from "./widgets/widget";

export const Dashboard = () => {
  const [isModal, setIsModal] = useState(false);
  const { dashboard } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const dash = dashboard.find((dash) => dash.id === id);

  return (
    <>
      <div className="w-full resize h-[200vh] px-6 flex flex-col overflow-hidden">
        <div className="w-full flex justify-between pt-4 p-2">
          <h1 className="text-white text-lg capitalize">{dash?.title}</h1>
          <button
            onClick={() => setIsModal(true)}
            className="text-white text-sm flex items-center p-2 px-2 cursor-pointer hover:bg-[#2f4699] bg-[#4E74F8] rounded"
          >
            <HiPlusSmall size={20} />
            New Widget
          </button>
        </div>

      <div className="flex-grow gap-5 grid grid-cols-2 grid-flow-row w-full overflow-auto">
          {dash?.widgets?.map((widget, index) => (
            // <div className="border-2">
              <Widget key={index} widget={widget} widgets={dash?.widgets} />
            // </div>
          ))}
          </div>
        {isModal && <WidgetModal setIsModal={setIsModal} />}
      </div>

    </>
  );
};
