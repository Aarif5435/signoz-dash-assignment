import React, { ReactElement, useEffect, useRef, useState } from "react";
import { addDashboard } from "../redux/widgetSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { setCurrentDashId } from "../redux/widgetSlice";

export const DashboardModal = ({ setIsModal, isOpen }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { dashboard } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();
  const handleDashboard = (title, id) => {
    if (!title) return alert("please enter the title");
    dispatch(addDashboard({ title, id }));
    dispatch(setCurrentDashId(id));
    navigate(`/dashboard/${id}`, { state: { id: id } });
    setIsModal(false);
  };

  useEffect(() => {
    if (isOpen) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#3e3e3f] bg-opacity-50">
        <div className="w-1/2 h-fit bg-[#1a1c22] z-10 p-5 text-white border border-[#2b2f3a] rounded ">
          <h1 className="py-2 font-semibold">Add Dashboard</h1>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleDashboard(title, uuid4());
              }
            }}
            ref={inputRef}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="p-2 w-full flex items-center bg-[#121317] text-base border border-[#0B0D0F] rounded hover:border-[#394f9f] hover:border focus:border-[#4E74F8] focus:border focus:outline-none"
            placeholder="Enter title"
            type="text"
          />
          <div className="flex justify-end mt-5">
            <button
              onClick={() => setIsModal(false)}
              className="border w-20 p-2 mr-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDashboard(title, uuid4())}
              className="p-2 w-20 rounded hover:bg-[#2f4699] bg-[#4E74F8]"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
