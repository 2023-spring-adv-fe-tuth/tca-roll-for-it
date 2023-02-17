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
    , element: <Setup />
  }
  , {
    path: "/play"
    , element: <Play />
  }
]);

function App() {
  return (
    <div 
      className="App p-6"
    >
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
