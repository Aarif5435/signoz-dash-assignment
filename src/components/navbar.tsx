import React from "react";
import { PiSquaresFourThin } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";

export const Navbar = () => {
  const { dashboard, currentDashId } = useSelector(
    (state: RootState) => state.dashboard
  );
  const dash = dashboard.find((d) => d.id === currentDashId);
  const navigate = useNavigate();
  return (
    <>
      <nav className="text-[#C0C1C3] p-3 border-b border-[#171922]">
        <span className="flex items-center gap-2">
          <PiSquaresFourThin size={20} />
          <label onClick={() => navigate("/")} className="cursor-pointer">
            Dashboard
            {window.location.pathname !== '/' && (
              <span className="capitalize text-blue-400 hover:underline">
                {" "}
                <span className="text-white">/</span>{" "}
                {currentDashId && `${dash?.title}`}
              </span>
            )}
          </label>
        </span>
      </nav>
    </>
  );
};
