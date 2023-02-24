import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  HashRouter
  , Routes
  , Route
} from "react-router-dom";

import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';

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
        <div className="flex flex-col items-start">
          <h1 className="text-xl font-bold">
            Roll for It
          </h1>
        </div>
      </div>
      <HashRouter>
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
            <Route
              path='/setup'
              element={<Setup foo={`${1 + 1}`} cat={cat} />}
            />
            <Route
              path='/play'
              element={<Play />}
            />
          </Routes>
        </HashRouter>      
    </div>
  );
}

      export default App;
