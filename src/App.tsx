import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  GameResult
  , getPreviousPlayers
  , calculateLeaderboard
  , SetupInfo,
  getShortestGame,
  getLongestGame,
  getAvgGameLengths
} from './front-end-model';

import {
  HashRouter
  , Routes
  , Route
} from "react-router-dom";

import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';

import { useState } from 'react';

const cat = () => console.log("Meow");

const hardCodedGameResults: GameResult[] = [
  {
    winner: "Tom"
    , players: [{ name: "Tom", order: 0 }, { name: "Taylor", order: 0 }]
    , start: "2023-03-07T09:18:00.000"
    , end: "2023-03-07T09:19:58.000"

  }
  , {
    winner: "Taylor"
    , players: [{ name: "Jack", order: 0 }, { name: "Taylor", order: 0 }]
    , start: "2023-03-07T09:20:00.000"
    , end: "2023-03-07T09:40:00.000"
  }
  , {
    winner: "Taylor"
    , players: [{ name: "Tom", order: 0 }, { name: "Taylor", order: 0 }, { name: "Jack", order: 0 }]
    , start: "2023-03-07T09:45:00.000"
    , end: "2023-03-07T09:51:00.000"
  }
  , {
    winner: "X"
    , players: [{ name: "X", order: 0 }, { name: "Joe", order: 0 }]
    , start: "2023-03-07T10:00:00.000"
    , end: "2023-03-07T10:05:00.000"
  }
  , {
    winner: "X"
    , players: [{ name: "X", order: 0 }, { name: "Joe", order: 0 }]
    , start: "2023-03-07T10:20:00.000"
    , end: "2023-03-07T10:50:00.000"
  }
  , {
    winner: "Joe"
    , players: [{ name: "X", order: 0 }, { name: "Joe", order: 0 }]
    , start: "2023-03-07T10:55:00.000"
    , end: "2023-03-07T10:57:00.000"
  }
  , {
    winner: "Jack"
    , players: [{ name: "X", order: 0 }, { name: "Joe", order: 0 }, { name: "Jack", order: 0 }]
    , start: "2023-03-07T11:00:00.000"
    , end: "2023-03-07T11:25:00.000"
  }
];

function App() {

  const [darkMode, setDarkMode] = useState(false);

  const [gameResults, setGameResults] = useState(hardCodedGameResults);

  const [setupInfo, setSetupInfo] = useState<SetupInfo>({
    start: ""
    , players: []
  });

  const [title, setTitle] = useState("Roll for It");

  const [diceValue, setDiceValue] = useState(Math.floor(Math.random() * (6 - 1 + 1) + 1));

  const addGameResult = (result: GameResult) => setGameResults(
    [
      ...gameResults
      , result
    ]
  );

  return (
    <div
      className="App"
      data-theme={darkMode ? "dark" : "light"}
    >
      <div className="navbar bg-base-200">
        <button 
          className='btn btn-ghost'
          onClick={() => setDiceValue(Math.floor(Math.random() * (6 - 1 + 1) + 1))}
        >
          <div className="flex-none">
            {
              diceValue == 1 &&
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="1.5" />
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z" />
              </svg>
            }
            {
              diceValue == 2 &&
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/>
                <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>              
            }
            {
              diceValue == 3 &&
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/>
                <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>              
            }
            {
              diceValue == 4 &&
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/>
                <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>              
              </svg>              
            }
            {
              diceValue == 5 &&
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/>
                <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>              
            }
            {
              diceValue == 6 &&
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/>
                <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>              
            }
          </div>
        </button>
        <div className="flex-1 ml-0">
          <span className="text-lg font-bold">
            {title}
          </span>
        </div>
        <div className="flex-none mr-3">
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
            <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
          </label>
        </div>
      </div>
      <HashRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                leaderBoardData={calculateLeaderboard(gameResults)}
                shortestGame={getShortestGame(gameResults)}
                longestGame={getLongestGame(gameResults)}
                avgGameLengths={getAvgGameLengths(gameResults)}
                setTitle={setTitle}
              />
            }
          />
          <Route
            path='/setup'
            element={
              <Setup
                availablePlayers={getPreviousPlayers(gameResults)}
                setSetupInfo={setSetupInfo}
                setTitle={setTitle}
                foo={`${1 + 1}`}
                cat={cat}
              />
            }
          />
          <Route
            path='/play'
            element={
              <Play
                setupInfo={setupInfo}
                addGameResult={addGameResult}
                setTitle={setTitle}
              />
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
