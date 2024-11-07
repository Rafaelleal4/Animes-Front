import React, { useState, useEffect } from 'react';
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

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/user');
      setUser(response.data.user);
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      if (error.response && error.response.status === 404) {
        console.error('Rota /auth/user não encontrada');
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAddToFavorites = async (manga) => {
    if (!user) {
      console.error('Usuário não está logado');
      return;
    }

    console.log('Adicionando aos favoritos:', { mangaId: manga.id, userId: user.id });

    try {
      const response = await axios.post('http://localhost:5000/api/favorites', {
        mangaId: manga.id,
        userId: user.id,
        title: manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp || 'Título Desconhecido',
        // Adicione outros campos necessários aqui
      });
      console.log('Manga adicionado aos favoritos:', response.data);
      setFavorites([...favorites, response.data.favorite]); // Atualize a lista de favoritos
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
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
                handleAddToFavorites={handleAddToFavorites}
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