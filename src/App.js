import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MangaList from './components/MangaList/MangaList';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Favorites from './components/Favorites/Favorites';
import MangaDetails from './components/MangaDetails/MangaDetails';
import axios from 'axios';

function App() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/favorites');
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/user');
      setUser(response.data.user);
      fetchFavorites();
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      if (error.response && error.response.status === 404) {
        console.error('Rota /auth/user não encontrada');
      }
    }
  }, [fetchFavorites]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleAddToFavorites = async (manga) => {
    if (!user) {
      console.error('Usuário não está logado');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/favorites', {
        mangaId: manga.id,
        title: manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp || 'Título Desconhecido',
      });
      setFavorites([...favorites, response.data.favorite]);
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
    }
  };

  const handleRemoveFromFavorites = async (mangaId) => {
    if (!user) {
      console.error('Usuário não está logado');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/auth/favorites/${mangaId}`);
      setFavorites(favorites.filter(fav => fav.mangaId !== mangaId));
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
    }
  };

  const isFavorite = (manga) => {
    return favorites.some(fav => fav.mangaId === manga.id);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Bem-vindo ao Manga/Anime Finder</h1>
        </header>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manga" element={
            user ? (
              <MangaList
                favorites={favorites}
                handleAddToFavorites={handleAddToFavorites}
                isFavorite={isFavorite}
                user={user}
              />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/favorites" element={
            user ? (
              <Favorites
                favorites={favorites}
                handleRemoveFromFavorites={handleRemoveFromFavorites}
                isFavorite={isFavorite}
              />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/manga/:id" element={<MangaDetails />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;