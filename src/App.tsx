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

import { useState } from 'react';

const cat = () => console.log("Meow");

interface GameResult {
  winner: string;
  players: string[];
};


const hardCodedGameResults: GameResult[] = [
  {
      winner: "Tom"
      , players: ["Tom", "Taylor"]
      // , won: false

  }
  , {
      winner: "Taylor"
      , players: ["Jack", "Taylor"]
  }
  , {
      winner: "Taylor"
      , players: ["Tom", "Taylor", "Jack"]
  }
  , {
      winner: "X"
      , players: ["X", "Joe"]
  }
  , {
      winner: "X"
      , players: ["X", "Joe"]
  }
  , {
      winner: "Joe"
      , players: ["X", "Joe"]
  }
  , {
      winner: "Jack"
      , players: ["X", "Joe", "Jack"]
  }
];

const getPreviousPlayers = (grs: GameResult[]) => {
    
  // const allPreviousPlayers = grs.map(x => x.players);
  const allPreviousPlayers = grs.flatMap(x => x.players);
  
  return [
      ...new Set(allPreviousPlayers)
  ].sort();
};

const calculateLeaderboard = (results: GameResult[]) => {

  const gameResultsGroupedByPlayer = getPreviousPlayers(results).reduce(
      (acc, x) => acc.set(
          x
          , results.filter(y => y.players.includes(x))
      )
      , new Map<string, GameResult[]>() 
  );

  // return gameResultsGroupedByPlayer;

  // return [...gameResultsGroupedByPlayer]; // Array of tuples of [string, GameResult[]]

  return [...gameResultsGroupedByPlayer]
      // First object with names game counts and wins...
      .map(x => ({
          name: x[0]
          , totalGames: x[1].length
          , wins: x[1].filter(y => y.winner === x[0]).length
      }))
      /// Now use wins and total games to get avg and losses
      .map(x => ({
          name: x.name
          , wins: x.wins 
          , losses: x.totalGames - x.wins
          , avg: x.wins / x.totalGames
      }))
      .sort(
          (a, b) => (a.avg * 1000 + a.wins + a.losses) > (b.avg * 1000 + b.wins + b.losses) ? -1 : 1
      )
      .map(x => ({
          ...x
          , avg: x.avg.toFixed(3)
      }))
  ;
};

function App() {

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className="App"
      data-theme={darkMode ? "dark" : "light"}
    >
      <div className="navbar bg-base-200">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
        <div className="flex-1">
          <span className="text-lg font-bold">Roll for It</span>
        </div>
        <div className="flex-none">
          <label className="swap swap-rotate">
            <input 
              type="checkbox"
              onChange={(e) => setDarkMode(e.target.checked)} 
            />
            <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
            <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
          </label>
        </div>
      </div>
      <HashRouter>
          <Routes>
            <Route
              path='/'
              element={
                <Home 
                  leaderBoardData={calculateLeaderboard(hardCodedGameResults)}
                />
              }
            />
            <Route
              path='/setup'
              element={
                <Setup
                  availablePlayers={getPreviousPlayers(hardCodedGameResults)} 
                  foo={`${1 + 1}`} 
                  cat={cat} 
                />
              }
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
