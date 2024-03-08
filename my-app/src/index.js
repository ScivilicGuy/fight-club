import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './Screens/Landing';
import ViewTournaments from './Screens/ViewTournaments';
import Tournament from './Screens/Tournament';
import Leaderboard from './Screens/Leaderboard';
import Banner from './Components/Banner';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Banner />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/tournaments" element={<ViewTournaments />} />
        <Route exact path="//tournaments/:tournamentId" element={<Tournament />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
