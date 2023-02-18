import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';

import {
  createHashRouter
  , RouterProvider
} from "react-router-dom";

const cat = () => console.log("Meow");

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    // loader: rootLoader,
    // children: [
    //   {
    //     path: "team",
    //     element: <Team />,
    //     loader: teamLoader,
    //   },
    // ],
  }
  , {
    path: "/setup"
    , element: <Setup foo={`${1 + 1}`} cat={cat} />
  }
  , {
    path: "/play"
    , element: <Play />
  }
]);


function App() {
  return (
    <div 
      className="App"
    >
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
