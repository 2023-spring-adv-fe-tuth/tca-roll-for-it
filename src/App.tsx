import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  Outlet
} from "react-router-dom";

const cat = () => console.log("Meow");

function App() {
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
        <div className="flex flex-col items-start mx-3">
          <h1 className="text-2xl font-bold">Roll for It</h1>
          <h2 className="text-sm uppercase font-semi-bold -mt-1">Companion App</h2>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
