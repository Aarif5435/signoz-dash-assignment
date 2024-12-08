import React from "react";
import { Navbar } from "./navbar";
import { DashboardLists } from "./DashboardLists";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import react, { Suspense, lazy } from "react";
import LoadingSpinner from "../utils/loadingSpinner";

const Dashboard = lazy(() => import("./Dashboard"));

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
                <Suspense
                  fallback={
                    <div className="flex justify-center items-center">
                      <LoadingSpinner />
                    </div>
                  }
                >
                  <Dashboard />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </Router>

      {/* </div> */}
    </>
  );
};
