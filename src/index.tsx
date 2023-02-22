import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createHashRouter
  , RouterProvider
} from "react-router-dom";
import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/"
        , element: <Home />
      }
      , {
        path: "/setup"
        , element: <Setup foo={`${1 + 1}`} cat={() => console.log("Fuck")} />
      }
      , {
        path: "/play"
        , element: <Play />
      }
    ],
  }
]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
