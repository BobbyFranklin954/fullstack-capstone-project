import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import MainPage from './components/MainPage/MainPage';
import Home from './components/Home/Home';
import RegisterPage from './components/RegisterPage/RegisterPage';
import LoginPage from './components/LoginPage/LoginPage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import SearchPage from './components/SearchPage/SearchPage';
import Profile from './components/Profile/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gifts" element={<MainPage />} />
        <Route path="/get-started" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gifts/:productId" element={<DetailsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
