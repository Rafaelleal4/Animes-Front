import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MangaList from './components/MangaList/MangaList';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Favorites from './components/Favorites/Favorites';

function App() {
  const [favorites, setFavorites] = useState([]);

  const handleAddToFavorites = (manga) => {
    if (favorites.some(fav => fav.id === manga.id)) {
      setFavorites(favorites.filter(fav => fav.id !== manga.id));
    } else {
      setFavorites([...favorites, manga]);
    }
  };

  const isFavorite = (manga) => {
    return favorites.some(fav => fav.id === manga.id);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Bem-vindo ao Manga/Anime Finder</h1>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manga" element={
            <MangaList
              favorites={favorites}
              handleAddToFavorites={handleAddToFavorites}
              isFavorite={isFavorite}
            />
          } />
          <Route path="/favorites" element={
            <Favorites
              favorites={favorites}
              handleAddToFavorites={handleAddToFavorites}
              isFavorite={isFavorite}
            />
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;