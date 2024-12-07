import React from "react";
import { Navbar } from "./navbar";
import { DashboardLists } from "./DashboardLists";
import { Dashboard } from "./Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      {/* <div className="bg-[#0B0D0F] w-full h-fit min-h-screen"> */}
      <Router>
  <Navbar />
  <div className="w-full h-screen">
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex justify-center w-full h-full">
            <DashboardLists />
           </div>
        }
      />
      <Route
        path="/dashboard/:id"
        element={
            <Dashboard />
        }
      />
    </Routes>
  </div>
</Router>

      {/* </div> */}
    </>
  );
};
