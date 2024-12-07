import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { HiPlusSmall } from "react-icons/hi2";
import { FaSortAlphaDownAlt, FaSortAmountDown } from "react-icons/fa";
import { DashboardModal } from "./DashboardModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { FaHospitalSymbol } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import {
  removeDashboard,
  searchDashboard,
  setCurrentDashId,
  sortByAZ,
  sortByZA,
} from "../redux/widgetSlice";
import { FaSortAlphaDown } from "react-icons/fa";

export const DashboardLists = () => {
  const [dashboardModal, setDashboardModal] = useState(false);
  const { dashboard, filterDashboard } = useSelector(
    (state: RootState) => state.dashboard
  );
  const [isDashModal, setIsDashModal] = useState<{ [index: number]: boolean }>({
    0: false,
  });
  const [isSortModal, setIsSortModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleDashClick = (id) => {
    dispatch(setCurrentDashId(id));
    navigate(`/dashboard/${id}`, { state: { id: id } });
  };
  console.log("isModal", isDashModal);
  return (
    <>
      <div className="text-white w-2/3 mt-40">
        <h2 className="text-xl font-semibold mb-6">Dashboards</h2>
          <div className="w-full relative flex gap-4">
            <input
              className="p-1 px-8 w-full flex items-center bg-[#121317] text-base border border-[#0B0D0F] rounded-sm hover:border-[#394f9f] hover:border focus:border-[#4E74F8] focus:border focus:outline-none"
              placeholder="search"
              type="text"
              onChange={(e) => {
                dispatch(searchDashboard(e.target.value));
              }}
            />
            <span className="absolute left-3 top-2">
              <IoIosSearch />
            </span>
            <button
              onClick={() => setDashboardModal(true)}
              className="text-sm w-52 flex items-center justify-center px-2 cursor-pointer hover:bg-[#2f4699] bg-[#4E74F8] rounded"
            >
              <HiPlusSmall size={20} />
              New Dashboard
            </button>
          </div>
        {/* dashboars lists */}
        <div className="w-full p-2 rounded-t-md bg-[#121418] mt-4 text-white">
          <div className="flex relative border-b border-[#22262f] p-2 justify-between px-3 items-center text-sm">
            {" "}
            <h3>All Dashboard </h3>{" "}
            <FaSortAmountDown
              onClick={() => setIsSortModal(!isSortModal)}
              className="cursor-pointer"
            />
            {isSortModal && (
              <div className="absolute flex flex-col gap-3 bg-[#131316] z-10 rounded right-4 top-8 border border-[#1D212D] text-center p-2 px-4">
                <p className="text-gray-400 p-2">SORT BY</p>
                <button
                  onClick={(e) => {
                    dispatch(sortByAZ());
                  }}
                  className="text-gray-200 flex items-center gap-2"
                >
                  <FaSortAlphaDown />A - Z
                </button>
                <button
                  onClick={(e) => {
                    dispatch(sortByZA());
                  }}
                  className="text-gray-200 flex items-center gap-2"
                >
                  <FaSortAlphaDownAlt />Z - A
                </button>
              </div>
            )}
          </div>
          {/* todo dashboard list */}
          <div className="">
            {filterDashboard.map((dash, ind) => (
              <div
                key={dash?.id}
                onClick={() => handleDashClick(dash?.id)}
                className="relative flex cursor-pointer flex-col gap-4 p-2 py-4 border-b border-[#22262f]"
              >
                <div className="flex justify-between">
                  <h2 className="text-base font-medium capitalize flex items-center gap-2">
                    <FaHospitalSymbol />
                    {dash.title}
                  </h2>
                  <BsThreeDotsVertical
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDashModal({ [ind]: !isDashModal[ind] });
                    }}
                  />
                  {isDashModal[ind] && (
                    <div className="absolute z-10 bg-[#131316] rounded right-4 top-10 border border-[#1D212D] text-center p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(removeDashboard(dash.id));
                          setIsDashModal({ [ind]: false });
                        }}
                        className="text-gray-200 flex items-center gap-2"
                      >
                        <MdDelete />
                        Delete Dashboard
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <FaCalendar />
                  {dash.createdAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {dashboardModal && <DashboardModal setIsModal={setDashboardModal} isOpen={isDashModal} />}
    </>
  );
};
