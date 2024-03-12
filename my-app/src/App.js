import React, { useState, createContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './Screens/Landing';
import ViewTournaments from './Screens/ViewTournaments';
import Tournament from './Screens/Tournament';
import Leaderboard from './Screens/Leaderboard';
import Register from './Screens/Register'
import Login from './Screens/Login'
import Banner from './Components/Banner';

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}> 
        <Banner />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/tournaments" element={<ViewTournaments />} />
          <Route exact path="/tournaments/:tournamentId" element={<Tournament />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
