import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  Outlet, useLocation
} from "react-router-dom";

const cat = () => console.log("Meow");

function App() {

  const location = useLocation();
  console.log("location", location);

  const title = location.pathname == "/play"
    ? "Play" 
    : location.pathname == "/setup"
      ? "Setup"
      : "Roll for It"
  ;

  return (
    <div
      className="App"
    >
      <div className="navbar bg-base-200">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-sm">
            {title}
            {location.pathname == "/" && <span className="text-primary"> Companion App</span>}
          </h1>
          {/* {
            location.pathname == "/" && <h2 className="text-sm uppercase font-semi-bold -mt-1">Companion App</h2>
          } */}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
