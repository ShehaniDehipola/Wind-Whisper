import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import WeatherInfo from './Pages/WeatherInfo';
// import dotenv from 'dotenv';

// dotenv.config();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/weather-info" element={<WeatherInfo/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
